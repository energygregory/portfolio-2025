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
        <div className={`w-full h-[500px] rounded-xl overflow-hidden relative border ${theme === 'light' ? 'bg-white border-neutral-100' : 'bg-black border-neutral-800'}`}>
            <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
                <ambientLight intensity={1.5} />
                <pointLight position={[10, 10, 10]} intensity={2} />
                <Suspense fallback={null}>
                  <Globe markers={markers} theme={theme} />
                </Suspense>
                <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1.0} />
            </Canvas>
            <div className="absolute bottom-4 left-4 pointer-events-none">
                 <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                    <span className={`text-[10px] font-mono tracking-widest ${theme === 'light' ? 'text-neutral-500' : 'text-neutral-400'}`}>
                        {userLocation ? `LIVE: ${userLocation.city}, ${userLocation.country_code}` : 'LOCATING...'}
                    </span>
                 </div>
            </div>
        </div>
    )
}

const StatCard = ({ title, value, sub, theme }) => (
    <div className={`p-6 border rounded-none transition-colors ${theme === 'light' ? 'bg-white border-neutral-100 text-black' : 'bg-neutral-900/50 border-neutral-800 text-white'}`}>
        <h3 className={`text-[10px] font-mono uppercase tracking-[0.2em] mb-3 ${theme === 'light' ? 'text-neutral-400' : 'text-neutral-500'}`}>{title}</h3>
        <div className="text-2xl font-bold mb-2 font-mono">{value}</div>
        <div className={`text-[10px] flex items-center gap-2 text-neutral-400 font-mono`}>
           {sub}
        </div>
    </div>
);

export default function Admin({ theme = 'dark' }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);
    
    // Real Data States
    const [userLocation, setUserLocation] = useState(null);
    const [ipData, setIpData] = useState(null);
    const [sessionTime, setSessionTime] = useState(0);
    const [deviceInfo, setDeviceInfo] = useState(null);
    const [trafficStats, setTrafficStats] = useState({ count: 0, updated_at: null });

    // Timer for session duration
    useEffect(() => {
        if (!isAuthenticated) return;
        const timer = setInterval(() => {
            setSessionTime(prev => prev + 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [isAuthenticated]);

    // Fetch IP Data & TRAFFIC STATS
    useEffect(() => {
        if (!isAuthenticated) return;
        
        // 1. Get GLOBAL Traffic Stats
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

        // 2. Get IP Info (Try ipapi.co, fallback to others if needed)
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

    // Formatter for time
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}m ${secs}s`;
    };

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
            <div className={`min-h-screen flex items-center justify-center p-4 ${theme === 'light' ? 'bg-white' : 'bg-black'}`}>
                <form onSubmit={handleLogin} className={`w-full max-w-sm p-8 rounded-none border ${theme === 'light' ? 'bg-white border-neutral-200' : 'bg-neutral-900 border-neutral-800'}`}>
                    <h2 className={`text-xl font-mono mb-6 text-center ${theme === 'light' ? 'text-black' : 'text-white'}`}>RESTRICTED</h2>
                    <input 
                        type="password"
                        value={password}
                        onChange={(e) => { setPassword(e.target.value); setError(false); }}
                        placeholder="PASSCODE"
                        className={`w-full border rounded-none p-3 font-mono outline-none transition-colors mb-4 text-center tracking-widest ${
                            theme === 'light' 
                            ? 'bg-white border-neutral-200 text-black placeholder:text-neutral-300 focus:border-black' 
                            : 'bg-black border-neutral-700 text-white placeholder:text-neutral-700 focus:border-white'
                        }`}
                        autoFocus
                    />
                    {error && <div className="text-red-500 text-xs font-mono text-center mb-4">ACCESS DENIED</div>}
                    <button type="submit" className={`w-full font-mono py-3 rounded-none transition-colors ${theme === 'light' ? 'bg-black text-white hover:bg-neutral-800' : 'bg-white text-black hover:bg-neutral-200'}`}>
                        UNLOCK
                    </button>
                </form>
            </div>
        );
    }

    return (
        <div className={`min-h-screen p-6 md:p-12 font-mono ${theme === 'light' ? 'bg-white text-black' : 'bg-black text-white'}`}>
            {/* Header */}
            <div className={`flex justify-between items-end mb-12 border-b pb-6 ${theme === 'light' ? 'border-neutral-100' : 'border-neutral-800'}`}>
                <div>
                    <h1 className="text-xl md:text-2xl font-bold mb-2 tracking-tight">TRAFFIC CONTROLLER</h1>
                    <p className="text-neutral-400 text-xs tracking-widest uppercase">Admin: Greg</p>
                </div>
                <button 
                    onClick={() => {
                        sessionStorage.removeItem('admin_auth');
                        setIsAuthenticated(false);
                    }}
                    className="text-[10px] tracking-widest text-red-500 hover:text-red-400 transition-colors uppercase"
                >
                    Logout
                </button>
            </div>

            {/* Grid Layout - Real Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
                <StatCard 
                    title="Total Visits" 
                    value={trafficStats.count > 0 ? trafficStats.count.toLocaleString() : "Loading..."} 
                    sub={trafficStats.updated_at ? `Last: ${new Date(trafficStats.updated_at).toLocaleTimeString()}` : "Fetching..."} 
                    theme={theme} 
                />
                <StatCard 
                    title="Admin IP" 
                    value={ipData ? ipData.ip : "---.---.---.---"} 
                    sub={ipData ? (ipData.org || ipData.asn) : "Identifying..."} 
                    theme={theme} 
                />
                <StatCard 
                    title="Session" 
                    value={formatTime(sessionTime)} 
                    sub="Current Login Duration" 
                    theme={theme} 
                />
                <StatCard 
                    title="System Status" 
                    value="Active" 
                    sub="Tracking via Vercel" 
                    theme={theme} 
                />
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Globe Section - Spans 2 cols */}
                <div className="lg:col-span-2">
                    <div className="mb-4 flex items-center justify-between">
                         <h3 className="text-[10px] text-neutral-400 uppercase tracking-[0.2em]">Real-Time GeoLocation (You)</h3>
                    </div>
                    <HalftoneGlobe theme={theme} userLocation={userLocation} />
                </div>

                {/* Sidebar Stats - Real Data */}
                <div className="space-y-4">
                    {/* Location Info */}
                     <div className={`p-6 border rounded-none ${theme === 'light' ? 'bg-white border-neutral-100' : 'bg-neutral-900/30 border-neutral-800'}`}>
                        <h3 className="text-[10px] text-neutral-400 uppercase tracking-[0.2em] mb-6">Network Info</h3>
                        <div className="space-y-4 text-xs font-mono">
                            <div className="flex justify-between">
                                <span className="text-neutral-500">City</span>
                                <span>{ipData ? ipData.city : '---'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-neutral-500">Region</span>
                                <span>{ipData ? ipData.region : '---'}</span>
                            </div>
                             <div className="flex justify-between">
                                <span className="text-neutral-500">Country</span>
                                <span>{ipData ? ipData.country_name : '---'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-neutral-500">Timezone</span>
                                <span>{ipData ? ipData.timezone : '---'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Device Parameters */}
                    <div className={`p-6 border rounded-none ${theme === 'light' ? 'bg-white border-neutral-100' : 'bg-neutral-900/30 border-neutral-800'}`}>
                         <h3 className="text-[10px] text-neutral-400 uppercase tracking-[0.2em] mb-6">Client Info</h3>
                         <div className="space-y-4 text-xs font-mono">
                             <div className="flex justify-between">
                                <span className="text-neutral-500">Browser</span>
                                <span>{deviceInfo?.browser?.name} {deviceInfo?.browser?.version}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-neutral-500">OS</span>
                                <span>{deviceInfo?.os?.name} {deviceInfo?.os?.version}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-neutral-500">Device</span>
                                <span>{deviceInfo?.device?.vendor || 'Desktop'} {deviceInfo?.device?.model || 'Workstation'}</span>
                            </div>
                             <div className="flex justify-between">
                                <span className="text-neutral-500">Engine</span>
                                <span className="text-green-500">{deviceInfo?.engine?.name || 'V8'}</span>
                            </div>
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
}