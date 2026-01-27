import React, { useState, useEffect, useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { UAParser } from 'ua-parser-js';

// Procedural Dot Globe (Halftone ish)
const HalftoneSphere = ({ theme }) => {
  const points = useMemo(() => {
    const p = [];
    const phiSpan = Math.PI;
    const thetaSpan = Math.PI * 2;
    const radius = 2.5;
    const stepsString = 100; // density
    
    for (let i = 0; i < stepsString; i++) {
        for (let j = 0; j < stepsString; j++) {
            const phi = (i / stepsString) * phiSpan;
            const theta = (j / stepsString) * thetaSpan;
            
            // Simple logic to distribute points on a sphere
            const x = radius * Math.sin(phi) * Math.cos(theta);
            const y = radius * Math.cos(phi);
            const z = radius * Math.sin(phi) * Math.sin(theta);
            
            p.push(x, y, z);
        }
    }
    return new Float32Array(p);
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={points.length / 3}
          array={points}
          itemSize={3}
        />
      </bufferGeometry>
      <PointMaterial
        transparent
        color={theme === 'dark' ? "#444" : "#ccc"}
        size={0.03}
        sizeAttenuation={true}
        depthWrite={false}
      />
    </points>
  );
};

const Globe = ({ markers, theme }) => {
  const meshRef = useRef();

  useFrame(() => {
    if (meshRef.current) {
        meshRef.current.rotation.y += 0.002;
    }
  });

  return (
    <group ref={meshRef}>
        {/* Main Sphere Body - Wireframe for "tech" look, safer than texture */}
        <Sphere args={[2.5, 48, 48]}>
            <meshBasicMaterial 
                color={theme === 'dark' ? "#222" : "#eee"} 
                wireframe 
                transparent 
                opacity={0.3} 
            />
        </Sphere>
        {/* Inner blocking sphere */}
        <Sphere args={[2.45, 48, 48]}>
             <meshBasicMaterial color={theme === 'dark' ? "#000" : "#fff"} />
        </Sphere>

      {/* Markers for Countries */}
      {markers.map((marker, idx) => {
        if (!marker.lat || !marker.lon) return null;
        
        // Convert lat/lon to 3D position
        const phi = (90 - marker.lat) * (Math.PI / 180);
        const theta = (marker.lon + 180) * (Math.PI / 180);
        const r = 2.55; 
        const x = -(r * Math.sin(phi) * Math.cos(theta));
        const z = (r * Math.sin(phi) * Math.sin(theta));
        const y = (r * Math.cos(phi));
        
        return (
          <group key={idx} position={[x, y, z]}>
            {/* Stick */}
            <mesh position={[0, 0, 0]} lookAt={new THREE.Vector3(0,0,0)}>
                 <cylinderGeometry args={[0.02, 0.02, 0.8, 8]} />
                 <meshBasicMaterial color="#ef4444" />
            </mesh>
            {/* Dot */}
            <mesh position={[0, 0, 0]}>
                <sphereGeometry args={[0.08, 16, 16]} />
                <meshBasicMaterial color="#ef4444" />
            </mesh>
          </group>
        );
      })}
    </group>
  );
};

const HalftoneGlobe = ({ theme, userLocation }) => {
    // Determine markers based on actual data if available
    const markers = useMemo(() => {
        const m = [];
        if (userLocation && userLocation.latitude) {
            m.push({
                lat: userLocation.latitude,
                lon: userLocation.longitude,
                country: "You (" + userLocation.city + ")"
            });
        }
        return m;
    }, [userLocation]);

    return (
        <div className={`w-full h-full relative border-none bg-transparent`}>
            <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
                <ambientLight intensity={1.5} />
                <pointLight position={[10, 10, 10]} intensity={2} />
                <Suspense fallback={null}>
                  <Globe markers={markers} theme={theme} />
                </Suspense>
                <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1.0} />
            </Canvas>
        </div>
    )
}

const HUD_GREEN = "#00ff6a";
const HUD_BG = "rgba(0, 20, 0, 0.95)";
const HUD_DARK = "#001100";
const HUD_BORDER = "#005522";

export default function Admin({ theme = 'dark' }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);
    
    // Real Data States
    const [userLocation, setUserLocation] = useState(null);
    const [ipData, setIpData] = useState(null);
    const [deviceInfo, setDeviceInfo] = useState(null);
    const [trafficStats, setTrafficStats] = useState({ count: 0, updated_at: null });

    // Session Logic (Persistent via LocalStorage)
    const [sessionTimer, setSessionTimer] = useState("00:00:00");
    const [sortMode, setSortMode] = useState('time'); // 'time' | 'country'

    useEffect(() => {
        if (!isAuthenticated) return;
        
        // Check for existing session start time
        let start = localStorage.getItem('admin_session_start');
        if (!start) {
            start = Date.now();
            localStorage.setItem('admin_session_start', start);
        }
        
        const timer = setInterval(() => {
            const now = Date.now();
            const diff = now - parseInt(start);
            const hrs = Math.floor(diff / (1000 * 60 * 60));
            const mins = Math.floor((diff / (1000 * 60)) % 60);
            const secs = Math.floor((diff / 1000) % 60);
            setSessionTimer(
                `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
            );
        }, 1000);

        return () => clearInterval(timer);
    }, [isAuthenticated]);

    // Fetch IP Data & TRAFFIC STATS
    useEffect(() => {
        if (!isAuthenticated) return;
        
        // 1. Get GLOBAL Traffic Stats (COUNTER)
        fetch('https://api.counterapi.dev/v1/energygregory_portfolio/visits/')
            .then(res => res.json())
            .then(data => {
                setTrafficStats({
                    count: data.count,
                    updated_at: data.updated_at
                });
            })
            .catch(err => console.error("Stats Error", err));

        // 2. Get Device Info
        const parser = new UAParser();
        setDeviceInfo(parser.getResult());

        // 3. Get IP Info with fallback
        const fetchIP = async () => {
            try {
                const res = await fetch('https://ipapi.co/json/');
                if (!res.ok) throw new Error('Blocked or Limit Reached');
                const data = await res.json();
                setIpData(data);
                setUserLocation(data);
            } catch (err) {
                console.warn("Primary IP API failed, trying fallback...", err);
                try {
                    const res2 = await fetch('https://ipwhois.app/json/');
                    const data2 = await res2.json();
                     setIpData({
                        ip: data2.ip,
                        city: data2.city,
                        region: data2.region,
                        country_name: data2.country,
                        org: data2.isp,
                        timezone: data2.timezone?.id || 'UTC',
                        latitude: data2.latitude,
                        longitude: data2.longitude
                    });
                    setUserLocation({
                        lat: data2.latitude,
                        lon: data2.longitude
                    });
                } catch (err2) {
                     console.error("All IP APIs failed", err2);
                }
            }
        };

        fetchIP();
    }, [isAuthenticated]);

    useEffect(() => {
        const auth = sessionStorage.getItem('admin_auth');
        if (auth === 'true') setIsAuthenticated(true);
    }, []);

    const handleLogin = (e) => {
        e.preventDefault();
        if (password === 'putmeonHIGHPREMIUM') {
            sessionStorage.setItem('admin_auth', 'true');
            setIsAuthenticated(true);
        } else {
            setError(true);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className={`min-h-screen flex items-center justify-center p-4 bg-black`}>
                <form onSubmit={handleLogin} className={`w-full max-w-sm p-8 border border-[${HUD_BORDER}] bg-[${HUD_DARK}] shadow-[0_0_20px_rgba(0,255,106,0.1)]`}>
                    <h2 className={`text-xl font-mono mb-6 text-center text-[${HUD_GREEN}] uppercase tracking-widest`}>GLOBAL OPS CENTER</h2>
                    <input 
                        type="password"
                        value={password}
                        onChange={(e) => { setPassword(e.target.value); setError(false); }}
                        placeholder="ACCESS CODE"
                        className={`w-full border border-[${HUD_BORDER}] bg-black p-3 font-mono outline-none text-center tracking-widest text-[${HUD_GREEN}] focus:border-[${HUD_GREEN}] mb-4`}
                        autoFocus
                    />
                    {error && <div className="text-red-500 text-xs font-mono text-center mb-4">ACCESS DENIED</div>}
                    <button type="submit" className={`w-full font-mono py-3 border border-[${HUD_GREEN}] bg-[${HUD_DARK}] text-[${HUD_GREEN}] hover:bg-[${HUD_GREEN}] hover:text-black transition-colors`}>
                        INITIALIZE
                    </button>
                </form>
            </div>
        );
    }

    return (
        <div className="h-screen w-screen bg-black text-[#00ff6a] font-mono overflow-hidden flex flex-col md:flex-row fixed top-0 left-0 z-[9999]">
            {/* HUD SIDEBAR */}
            <div className="w-full md:w-[350px] h-full flex flex-col border-r border-[#005522] bg-[rgba(0,20,0,0.95)] z-50 p-5 shrink-0">
                <div className="border-b border-[#00ff6a] pb-2 mb-4 flex justify-between items-end">
                    <h1 className="text-xl uppercase font-bold tracking-tighter">HARDCORE<br/>ANALYTICS</h1>
                    <button 
                        onClick={() => {
                            sessionStorage.removeItem('admin_auth');
                            setIsAuthenticated(false);
                            localStorage.removeItem('admin_session_start');
                        }}
                        className="text-[10px] text-red-500 hover:text-red-400 uppercase tracking-widest"
                    >
                        [LOGOUT]
                    </button>
                </div>

                <div className="bg-[#003311] border border-[#005522] p-3 mb-4">
                    <div className="text-[10px] opacity-70 mb-1">TOTAL VISITS (LIFETIME)</div>
                    <div className="text-3xl font-bold">{trafficStats.count > 0 ? trafficStats.count.toLocaleString() : "---"}</div>
                </div>

                <div className="bg-[#003311] border border-[#005522] p-3 mb-4">
                    <div className="text-[10px] opacity-70 mb-1">CURRENT SESSION</div>
                    <div className="text-2xl font-bold font-mono tracking-widest">{sessionTimer}</div>
                </div>

                {/* CONTROLS */}
                <div className="flex gap-2 mb-2">
                    <button 
                         onClick={() => setSortMode('time')}
                         className={`flex-1 text-[10px] border px-2 py-1 uppercase transition-colors ${sortMode === 'time' ? 'bg-[#00ff6a] text-black border-[#00ff6a]' : 'bg-[#003311] text-[#00ff6a] border-[#00ff6a] hover:bg-[#004411]'}`}
                    >
                        SORT: TIME
                    </button>
                     <button 
                         onClick={() => setSortMode('country')}
                         className={`flex-1 text-[10px] border px-2 py-1 uppercase transition-colors ${sortMode === 'country' ? 'bg-[#00ff6a] text-black border-[#00ff6a]' : 'bg-[#003311] text-[#00ff6a] border-[#00ff6a] hover:bg-[#004411]'}`}
                    >
                        SORT: CTRY
                    </button>
                </div>

                <div className="text-[10px] opacity-70 mb-1 mt-2">LIVE FEED LOG:</div>
                <div className="flex-1 overflow-y-auto border border-[#005522] bg-black/50 p-0 text-[11px] font-mono scrollbar-hide">
                    {/* Header Row */}
                     <div className="flex border-b border-[#003311] bg-[#002200] p-1 sticky top-0 font-bold">
                        <div className="w-[60px] opacity-70">TIME</div>
                        <div className="flex-1">LOC</div>
                        <div className="w-[80px] text-right opacity-70">IP</div>
                    </div>
                    {/* Since we don't have a backend pushing other users, we show the ADMIN and Simulated Previous Hits if desired, or just Current State */}
                    {ipData ? (
                        <div className="flex p-1 border-b border-[#003311] hover:bg-[#002200]">
                            <div className="w-[60px] opacity-70">{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                            <div className="flex-1 truncate">{ipData.city || 'Unknown'}, {ipData.country_code || '??'}</div>
                            <div className="w-[80px] text-right opacity-70">{ipData.ip}</div>
                        </div>
                    ) : (
                        <div className="p-2 text-center italic opacity-50">awaiting signal...</div>
                    )}
                </div>
            </div>

            {/* MAIN VIEWPORT (GLOBE) */}
            <div className="flex-1 bg-black relative flex flex-col">
                <div className="absolute top-4 left-4 z-10 pointer-events-none">
                     <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#00ff6a] shadow-[0_0_10px_#00ff6a] animate-pulse"></div>
                        <span className="text-xs tracking-[0.2em] text-[#00ff6a]">SYSTEM ONLINE</span>
                     </div>
                </div>

                <div className="flex-1 relative">
                    <HalftoneGlobe theme="dark" userLocation={userLocation} />
                </div>
                
                 {/* FOOTER INFO */}
                <div className="h-[200px] border-t border-[#003311] bg-[#001100] grid grid-cols-2 p-4 gap-4">
                     <div className="border border-[#005522] p-3 bg-black/40">
                        <h3 className="text-[10px] opacity-50 uppercase tracking-[0.2em] mb-2">Network Telemetry</h3>
                        <div className="space-y-1 text-xs">
                             <div className="flex justify-between"><span className="opacity-50">ISP</span> <span>{ipData?.org || '---'}</span></div>
                             <div className="flex justify-between"><span className="opacity-50">ASN</span> <span>{ipData?.asn || '---'}</span></div>
                             <div className="flex justify-between"><span className="opacity-50">ZONE</span> <span>{ipData?.timezone || '---'}</span></div>
                        </div>
                     </div>
                     <div className="border border-[#005522] p-3 bg-black/40">
                         <h3 className="text-[10px] opacity-50 uppercase tracking-[0.2em] mb-2">Device Fingerprint</h3>
                         <div className="space-y-1 text-xs">
                             <div className="flex justify-between"><span className="opacity-50">OS</span> <span>{deviceInfo?.os?.name || '---'} {deviceInfo?.os?.version}</span></div>
                             <div className="flex justify-between"><span className="opacity-50">BRAVO</span> <span>{deviceInfo?.browser?.name || '---'}</span></div>
                             <div className="flex justify-between"><span className="opacity-50">CPU</span> <span>{navigator.hardwareConcurrency} CORES</span></div>
                        </div>
                     </div>
                </div>
            </div>
        </div>
    );
}
