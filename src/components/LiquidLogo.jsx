import React, { useEffect, useRef, useState } from 'react';

const vertexShader = `
attribute vec2 aVertexPosition;
void main() {
    gl_Position = vec4(aVertexPosition, 0.0, 1.0);
}
`;

const fragmentShader = `
precision highp float;

uniform vec2 u_resolution;
uniform float u_time;
uniform float u_speed;
uniform float u_iterations;
uniform float u_scale;
uniform float u_dotFactor;
uniform float u_vOffset;
uniform float u_intensityFactor;
uniform float u_expFactor;
uniform vec3 u_colorFactors;
uniform float u_colorShift;
uniform float u_dotMultiplier;
uniform float u_noiseIntensity;
uniform sampler2D u_logoTexture;
uniform float u_logoScale;
uniform float u_logoInteractStrength;
uniform float u_logoAspect;
uniform vec2 u_mouse;

float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    
    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    
    i = mod289(i);
    vec4 p = permute(permute(permute(
        i.z + vec4(0.0, i1.z, i2.z, 1.0))
        + i.y + vec4(0.0, i1.y, i2.y, 1.0))
        + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}

float detectEdges(vec2 uv, float threshold) {
    float dx = 1.0 / u_resolution.x;
    float dy = 1.0 / u_resolution.y;
    
    vec4 center = texture2D(u_logoTexture, uv);
    vec4 left = texture2D(u_logoTexture, uv - vec2(dx, 0.0));
    vec4 right = texture2D(u_logoTexture, uv + vec2(dx, 0.0));
    vec4 top = texture2D(u_logoTexture, uv - vec2(0.0, dy));
    vec4 bottom = texture2D(u_logoTexture, uv + vec2(0.0, dy));
    
    float diff = length(center - left) + length(center - right) + 
                length(center - top) + length(center - bottom);
    
    return smoothstep(0.0, threshold, diff);
}

// Calculate height field from liquid pattern for 3D normals
float getHeight(vec2 p, float time) {
    float h = 0.0;
    vec2 v = p / u_scale;
    
    for(float i = 0.0; i < 8.0; i++) {
        float idx = i + 1.0;
        vec2 offset = cos(v.yx * idx + vec2(0.0, idx) + time) / idx;
        v += offset;
        h += sin(v.x + v.y) * (1.0 / idx);
    }
    
    h += snoise(vec3(p * 3.0, time * 0.2)) * 0.3;
    return h * 0.15;
}

// Calculate normals from height field for 3D lighting
vec3 calculateNormal(vec2 p, float time) {
    float eps = 0.01;
    float h = getHeight(p, time);
    float hx = getHeight(p + vec2(eps, 0.0), time);
    float hy = getHeight(p + vec2(0.0, eps), time);
    
    vec3 normal = normalize(vec3(
        (h - hx) / eps,
        (h - hy) / eps,
        1.0
    ));
    return normal;
}

// Environment map simulation for chrome reflections
vec3 envMap(vec3 reflectDir, float time) {
    // Gradient sky
    float y = reflectDir.y * 0.5 + 0.5;
    vec3 sky = mix(vec3(0.1, 0.1, 0.15), vec3(0.4, 0.5, 0.7), y);
    
    // Add moving cloud-like patterns
    float clouds = snoise(vec3(reflectDir.xz * 2.0, time * 0.1)) * 0.5 + 0.5;
    sky += clouds * 0.2 * vec3(1.0, 0.95, 0.9);
    
    // Bright highlights for light sources
    float sun1 = pow(max(0.0, dot(reflectDir, normalize(vec3(1.0, 1.0, 0.5)))), 64.0);
    float sun2 = pow(max(0.0, dot(reflectDir, normalize(vec3(-0.5, 0.8, -0.3)))), 32.0);
    sky += sun1 * vec3(1.0, 0.95, 0.8) * 2.0;
    sky += sun2 * vec3(0.8, 0.85, 1.0) * 1.0;
    
    return sky;
}

void main() {
    vec2 r = u_resolution;
    vec2 FC = gl_FragCoord.xy;
    float time = u_time * u_speed;
    
    vec2 uv = FC.xy / r;
    
    // Correct aspect ratio handling for logo
    float canvasAspect = r.x / r.y;
    float logoAspect = u_logoAspect;
    
    vec2 logoUV = uv;
    if (canvasAspect > logoAspect) {
        float scale = logoAspect / canvasAspect;
        logoUV.x = (uv.x - 0.5) / scale + 0.5;
    } else {
        float scale = canvasAspect / logoAspect;
        logoUV.y = (uv.y - 0.5) / scale + 0.5;
    }
    
    logoUV = (logoUV - 0.5) / u_logoScale + 0.5;
    logoUV.y = 1.0 - logoUV.y;
    
    vec4 logoColor = texture2D(u_logoTexture, logoUV);
    float logoAlpha = logoColor.a;
    
    // For shoulder symbols, apply effect to entire fill
    bool insideLogo = logoAlpha > 0.01;
    
    float edgeMask = detectEdges(logoUV, 0.1);

    if (!insideLogo && logoUV.x >= 0.0 && logoUV.x <= 1.0 && logoUV.y >= 0.0 && logoUV.y <= 1.0) {
        discard;
    }
    
    float edge = detectEdges(logoUV, 0.2) * u_logoInteractStrength;
    
    vec2 p = (FC.xy * 2.0 - r) / r.y;
    vec2 l = vec2(0.0);
    
    float dotP = dot(p, p);
    l.x += abs(u_dotFactor - dotP) * u_dotMultiplier;
    
    // 3D: Calculate surface normal
    vec3 normal = calculateNormal(p, time);
    
    // Add edge influence to normal for logo interaction
    normal.xy += edge * 2.0;
    normal = normalize(normal);
    
    // 3D: View and light setup
    vec3 viewDir = normalize(vec3(0.0, 0.0, 1.0));
    vec3 lightPos1 = normalize(vec3(sin(time * 0.3) * 0.5 + u_mouse.x * 0.5, cos(time * 0.2) * 0.3 + u_mouse.y * 0.5, 1.0));
    vec3 lightPos2 = normalize(vec3(-0.5, 0.5, 0.8));
    
    // 3D: Calculate reflection
    vec3 reflectDir = reflect(-viewDir, normal);
    
    // Get base liquid pattern
    vec2 v = p * (1.0 - l.x) / u_scale;
    v += vec2(sin(edge * 10.0), cos(edge * 8.0)) * edge * 20.0;
    
    float noiseIntensity = insideLogo ? u_noiseIntensity : 0.1;
    float flowNoise = snoise(vec3(p * 2.0, time * 0.15)) * noiseIntensity;
    v += vec2(flowNoise, flowNoise * 0.7);
    
    vec4 o = vec4(0.0);
    
    for(float i = 0.0; i < 16.0; i++) {
        if (i >= u_iterations) break;
        float idx = i + 1.0;
        
        vec2 offset = cos(v.yx * idx + vec2(0.0, idx) + time) / idx + u_vOffset;
        if (logoAlpha > 0.1 && edge > 0.1) {
            offset *= 1.0 + edge * 4.0;
        }
        
        v += offset;
        o += (sin(vec4(v.x, v.y, v.y, v.x)) + 1.0) * abs(v.x - v.y) * u_intensityFactor;
    }
    
    if (u_colorShift > 0.0) {
        o = o.wxyz * u_colorShift + o * (1.0 - u_colorShift);
    }
    
    vec4 expPy = exp(p.y * vec4(u_colorFactors.x, u_colorFactors.y, u_colorFactors.z, 0.0));
    float expLx = exp(-u_expFactor * l.x);
    vec4 ratio = expPy * expLx / o;
    
    vec4 exp2x = exp(2.0 * ratio);
    o = (exp2x - 1.0) / (exp2x + 1.0);
    
    // 3D: Apply lighting
    float diffuse1 = max(0.0, dot(normal, lightPos1));
    float diffuse2 = max(0.0, dot(normal, lightPos2));
    
    // Specular highlights (Blinn-Phong)
    vec3 halfDir1 = normalize(lightPos1 + viewDir);
    vec3 halfDir2 = normalize(lightPos2 + viewDir);
    float spec1 = pow(max(0.0, dot(normal, halfDir1)), 128.0);
    float spec2 = pow(max(0.0, dot(normal, halfDir2)), 64.0);
    
    // Fresnel effect for edge brightness
    float fresnel = pow(1.0 - max(0.0, dot(normal, viewDir)), 3.0);
    
    // Environment reflection
    vec3 envColor = envMap(reflectDir, time);
    
    // Combine 3D lighting with liquid metal
    vec3 baseColor = o.rgb;
    
    // Chrome material: high reflectivity
    vec3 ambient = baseColor * 0.15;
    vec3 diffuseLight = baseColor * (diffuse1 * 0.4 + diffuse2 * 0.2);
    vec3 specularLight = vec3(1.0, 0.98, 0.95) * (spec1 * 1.5 + spec2 * 0.8);
    vec3 reflection = envColor * (0.5 + fresnel * 0.5);
    
    vec3 finalColor3D = ambient + diffuseLight + specularLight + reflection * baseColor;
    
    // Exaggerate 3D look: much stronger rim, edge, specular, fresnel, and bump
    finalColor3D += fresnel * vec3(1.2, 1.3, 1.5) * 1.7; // Rim light

    float edgeHighlight = pow(edge * 2.2, 2.0);
    finalColor3D += edgeHighlight * vec3(1.0, 1.0, 1.0) * 1.2;

    // Stronger specular and fresnel
    finalColor3D += (spec1 + spec2) * vec3(1.2, 1.1, 1.0) * 1.2;
    finalColor3D += fresnel * vec3(1.1, 1.2, 1.3) * 0.7;

    // Film grain
    vec2 noiseCoord = FC / 1.5;
    float noise = random(noiseCoord + time * 0.0004) * 0.08 - 0.04;
    finalColor3D += noise;

    finalColor3D = clamp(finalColor3D, 0.0, 1.0);

    if (logoUV.x >= 0.0 && logoUV.x <= 1.0 && logoUV.y >= 0.0 && logoUV.y <= 1.0) {
      if (logoAlpha > 0.01) {
        gl_FragColor = vec4(finalColor3D, min(logoAlpha + 0.4, 1.0));
      } else {
        discard;
      }
    } else {
        discard;
    }
}
`;

// Chrome preset from the liquid-logo repo (matching your screenshot settings)
const chromePreset = {
  speed: 0.6,
  iterations: 24,
  scale: 2.4,
  dotFactor: 1.2,
  dotMultiplier: 2.0,
  vOffset: 5.1,
  intensityFactor: 0.23,
  expFactor: 0.47,
  redFactor: -3.0,
  greenFactor: -3.0,
  blueFactor: -3.0,
  colorShift: 0.3,
  noiseIntensity: 10.0,
  logoScale: 0.9,
  logoInteractStrength: 0.03,
};

// Mobile-optimized preset (better quality)
const mobilePreset = {
  speed: 0.45,
  iterations: 16,
  scale: 2.4,
  dotFactor: 1.2,
  dotMultiplier: 2.0,
  vOffset: 5.1,
  intensityFactor: 0.23,
  expFactor: 0.47,
  redFactor: -3.0,
  greenFactor: -3.0,
  blueFactor: -3.0,
  colorShift: 0.3,
  noiseIntensity: 6.0,
  logoScale: 0.9,
  logoInteractStrength: 0.02,
};

const isMobile = () => typeof window !== 'undefined' && window.innerWidth < 768;

export default function LiquidLogo({ 
  logoUrl, 
  className = '', 
  opacity = 1, 
  logoScale: propLogoScale, 
  effectScale: propEffectScale
}) {
  const canvasRef = useRef(null);
  const glRef = useRef(null);
  const programRef = useRef(null);
  const textureRef = useRef(null);
  const frameRef = useRef(null);
  const startTimeRef = useRef(Date.now());
  const mouseRef = useRef({ x: 0, y: 0 });
  const isScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Track scroll state to pause animation on mobile
  useEffect(() => {
    if (!isMobile()) return;
    
    const handleScroll = () => {
      isScrollingRef.current = true;
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      scrollTimeoutRef.current = setTimeout(() => {
        isScrollingRef.current = false;
      }, 150);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Track mouse position
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const gl = canvas.getContext('webgl', {
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true,
      premultipliedAlpha: false,
    });

    if (!gl) {
      console.error('WebGL not supported');
      return;
    }
    glRef.current = gl;

    // Compile shaders
    const vs = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vs, vertexShader);
    gl.compileShader(vs);
    if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) {
      console.error('Vertex shader error:', gl.getShaderInfoLog(vs));
      return;
    }

    const fs = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fs, fragmentShader);
    gl.compileShader(fs);
    if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
      console.error('Fragment shader error:', gl.getShaderInfoLog(fs));
      return;
    }

    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(program));
      return;
    }
    programRef.current = program;

    // Create position buffer
    const positions = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const posLoc = gl.getAttribLocation(program, 'aVertexPosition');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    // Get uniform locations
    gl.useProgram(program);
    const uniforms = {
      resolution: gl.getUniformLocation(program, 'u_resolution'),
      time: gl.getUniformLocation(program, 'u_time'),
      speed: gl.getUniformLocation(program, 'u_speed'),
      iterations: gl.getUniformLocation(program, 'u_iterations'),
      scale: gl.getUniformLocation(program, 'u_scale'),
      dotFactor: gl.getUniformLocation(program, 'u_dotFactor'),
      vOffset: gl.getUniformLocation(program, 'u_vOffset'),
      intensityFactor: gl.getUniformLocation(program, 'u_intensityFactor'),
      expFactor: gl.getUniformLocation(program, 'u_expFactor'),
      colorFactors: gl.getUniformLocation(program, 'u_colorFactors'),
      colorShift: gl.getUniformLocation(program, 'u_colorShift'),
      dotMultiplier: gl.getUniformLocation(program, 'u_dotMultiplier'),
      noiseIntensity: gl.getUniformLocation(program, 'u_noiseIntensity'),
      logoTexture: gl.getUniformLocation(program, 'u_logoTexture'),
      logoScale: gl.getUniformLocation(program, 'u_logoScale'),
      logoInteractStrength: gl.getUniformLocation(program, 'u_logoInteractStrength'),
      logoAspect: gl.getUniformLocation(program, 'u_logoAspect'),
      mouse: gl.getUniformLocation(program, 'u_mouse'),
    };

    // Track logo aspect ratio
    let logoAspectRatio = 1.0;

    // Create and load texture
    const texture = gl.createTexture();
    textureRef.current = texture;
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      logoAspectRatio = img.width / img.height;
    };
    img.src = logoUrl;

    // Enable blending
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    // Resize handler
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener('resize', resize);

    // Get preset based on device
    const preset = isMobile() ? mobilePreset : chromePreset;
    const targetFPS = isMobile() ? 24 : 60;
    const frameInterval = 1000 / targetFPS;
    let lastFrameTime = 0;

    // Animation loop
    const render = (currentTime) => {
      // Skip rendering while scrolling on mobile for smoother scroll
      if (isMobile() && isScrollingRef.current) {
        frameRef.current = requestAnimationFrame(render);
        return;
      }
      
      // Throttle frame rate on mobile
      if (isMobile()) {
        const elapsed = currentTime - lastFrameTime;
        if (elapsed < frameInterval) {
          frameRef.current = requestAnimationFrame(render);
          return;
        }
        lastFrameTime = currentTime - (elapsed % frameInterval);
      }
      
      const time = Date.now() - startTimeRef.current;

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.useProgram(program);

      // Set uniforms
      gl.uniform2f(uniforms.resolution, canvas.width, canvas.height);
      gl.uniform1f(uniforms.time, time / 1000);
      gl.uniform1f(uniforms.speed, preset.speed);
      gl.uniform1f(uniforms.iterations, preset.iterations);
      gl.uniform1f(uniforms.scale, propEffectScale !== undefined ? propEffectScale : preset.scale);
      gl.uniform1f(uniforms.dotFactor, preset.dotFactor);
      gl.uniform1f(uniforms.vOffset, preset.vOffset);
      gl.uniform1f(uniforms.intensityFactor, preset.intensityFactor);
      gl.uniform1f(uniforms.expFactor, preset.expFactor);
      gl.uniform3f(uniforms.colorFactors, preset.redFactor, preset.greenFactor, preset.blueFactor);
      gl.uniform1f(uniforms.colorShift, preset.colorShift);
      gl.uniform1f(uniforms.dotMultiplier, preset.dotMultiplier);
      gl.uniform1f(uniforms.noiseIntensity, preset.noiseIntensity);
      gl.uniform1f(uniforms.logoScale, propLogoScale !== undefined ? propLogoScale : preset.logoScale);
      gl.uniform1f(uniforms.logoInteractStrength, preset.logoInteractStrength);
      gl.uniform1f(uniforms.logoAspect, logoAspectRatio);
      gl.uniform2f(uniforms.mouse, mouseRef.current.x, mouseRef.current.y);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.uniform1i(uniforms.logoTexture, 0);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      frameRef.current = requestAnimationFrame(render);
    };
    frameRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [logoUrl]);

  // Remove outer glow, keep all other 3D effects
  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ 
        width: '100%', 
        height: '100%', 
        display: 'block', 
        opacity: opacity,
        backgroundColor: 'transparent',
      }}
    />
  );
}
