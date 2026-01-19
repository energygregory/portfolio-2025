import React, { useEffect, useRef } from 'react';

const vertexShader = `
  attribute vec2 position;
  varying vec2 vUv;
  void main() {
    vUv = position * 0.5 + 0.5;
    vUv.y = 1.0 - vUv.y;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const fragmentShader = `
  precision highp float;
  
  varying vec2 vUv;
  uniform sampler2D uTexture;
  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec2 uImageSize;
  
  // Simplex noise functions
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
  
  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    
    vec3 i  = floor(v + dot(v, C.yyy));
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
    
    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
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
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;
    
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }
  
  // Enhanced chrome gradient with sharper reflections
  vec3 chromeGradient(float angle, float intensity, float emboss) {
    // Create sharp metallic bands
    float band1 = pow(max(0.0, sin(angle * 3.14159 * 3.0 + uTime * 0.4)), 0.5);
    float band2 = pow(max(0.0, sin(angle * 3.14159 * 5.0 - uTime * 0.3 + 1.5)), 0.3);
    float band3 = pow(max(0.0, sin(angle * 3.14159 * 8.0 + uTime * 0.2 + 3.0)), 0.4);
    float band4 = pow(max(0.0, sin(angle * 3.14159 * 12.0 - uTime * 0.5)), 0.6);
    
    // Deep metallic colors
    vec3 darkMetal = vec3(0.02, 0.02, 0.03);
    vec3 midDark = vec3(0.12, 0.13, 0.15);
    vec3 midMetal = vec3(0.35, 0.37, 0.42);
    vec3 brightMetal = vec3(0.75, 0.78, 0.85);
    vec3 highlight = vec3(1.0, 1.0, 1.0);
    
    // Build up the chrome color with multiple bands
    vec3 color = darkMetal;
    color = mix(color, midDark, band1 * intensity);
    color = mix(color, midMetal, band2 * intensity * 0.9);
    color = mix(color, brightMetal, band3 * intensity * 0.7);
    color = mix(color, highlight, band4 * intensity * 0.4);
    
    // Add emboss lighting contribution
    color += vec3(emboss * 0.6);
    
    // Add sharp specular highlights
    float spec1 = pow(max(0.0, sin(angle * 20.0 + uTime * 1.5)), 16.0);
    float spec2 = pow(max(0.0, sin(angle * 14.0 - uTime * 2.0 + 2.0)), 12.0);
    color += vec3(spec1 * 0.5 + spec2 * 0.3) * intensity;
    
    return color;
  }
  
  // Calculate emboss/bevel effect
  float getEmboss(vec2 uv, vec2 pixelSize) {
    // Sample surrounding pixels for height map
    float tl = texture2D(uTexture, uv + vec2(-pixelSize.x, -pixelSize.y)).a;
    float t  = texture2D(uTexture, uv + vec2(0.0, -pixelSize.y)).a;
    float tr = texture2D(uTexture, uv + vec2(pixelSize.x, -pixelSize.y)).a;
    float l  = texture2D(uTexture, uv + vec2(-pixelSize.x, 0.0)).a;
    float r  = texture2D(uTexture, uv + vec2(pixelSize.x, 0.0)).a;
    float bl = texture2D(uTexture, uv + vec2(-pixelSize.x, pixelSize.y)).a;
    float b  = texture2D(uTexture, uv + vec2(0.0, pixelSize.y)).a;
    float br = texture2D(uTexture, uv + vec2(pixelSize.x, pixelSize.y)).a;
    
    // Sobel operator for emboss
    float gx = (tr + 2.0 * r + br) - (tl + 2.0 * l + bl);
    float gy = (bl + 2.0 * b + br) - (tl + 2.0 * t + tr);
    
    // Light direction (top-left)
    vec2 lightDir = normalize(vec2(-1.0, -1.0));
    float emboss = dot(vec2(gx, gy), lightDir);
    
    return emboss;
  }
  
  // Calculate inner bevel/depth
  float getInnerBevel(vec2 uv, vec2 pixelSize, float mask) {
    float depth = 0.0;
    float samples = 0.0;
    
    // Sample in multiple directions to find distance to edge
    for (float angle = 0.0; angle < 6.28; angle += 0.5) {
      vec2 dir = vec2(cos(angle), sin(angle));
      for (float dist = 1.0; dist <= 6.0; dist += 1.0) {
        vec2 sampleUv = uv + dir * pixelSize * dist;
        float sampleMask = texture2D(uTexture, sampleUv).a;
        if (sampleMask < 0.5) {
          depth += dist / 6.0;
          samples += 1.0;
          break;
        }
        if (dist >= 6.0) {
          depth += 1.0;
          samples += 1.0;
        }
      }
    }
    
    return samples > 0.0 ? depth / samples : 1.0;
  }
  
  void main() {
    vec2 uv = vUv;
    float canvasAspect = uResolution.x / uResolution.y;
    float imageAspect = uImageSize.x / uImageSize.y;
    
    vec2 scale = vec2(1.0);
    if (canvasAspect > imageAspect) {
      scale.x = imageAspect / canvasAspect;
    } else {
      scale.y = canvasAspect / imageAspect;
    }
    
    vec2 centeredUv = (uv - 0.5) / scale + 0.5;
    
    if (centeredUv.x < 0.0 || centeredUv.x > 1.0 || centeredUv.y < 0.0 || centeredUv.y > 1.0) {
      gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
      return;
    }
    
    vec4 texColor = texture2D(uTexture, centeredUv);
    
    float logoMask = texColor.a;
    if (logoMask > 0.99) {
      float brightness = dot(texColor.rgb, vec3(0.299, 0.587, 0.114));
      logoMask = 1.0 - brightness;
    }
    
    if (logoMask < 0.1) {
      gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
      return;
    }
    
    vec2 pixelSize = 1.0 / uResolution;
    vec2 imagePixelSize = pixelSize / scale;
    
    // Calculate emboss effect
    float emboss = getEmboss(centeredUv, imagePixelSize * 2.0);
    
    // Calculate inner bevel for 3D depth
    float bevel = getInnerBevel(centeredUv, imagePixelSize * 1.5, logoMask);
    bevel = pow(bevel, 0.5); // Soften the bevel curve
    
    // Animated liquid distortion
    float time = uTime * 0.4;
    vec2 pos = centeredUv * 4.0;
    
    float noise1 = snoise(vec3(pos.x, pos.y, time * 0.25));
    float noise2 = snoise(vec3(pos.x * 2.5, pos.y * 2.5, time * 0.4 + 100.0));
    float noise3 = snoise(vec3(pos.x * 0.7, pos.y * 0.7, time * 0.15 + 200.0));
    
    float distortion = noise1 * 0.4 + noise2 * 0.35 + noise3 * 0.25;
    
    // Reflection angle with emboss influence
    vec2 reflectDir = centeredUv - 0.5;
    reflectDir += vec2(noise1, noise2) * 0.12;
    reflectDir += vec2(emboss) * 0.1; // Emboss affects reflection
    
    float angle = atan(reflectDir.y, reflectDir.x) / (3.14159 * 2.0) + 0.5;
    angle += distortion * 0.15;
    angle += bevel * 0.2; // Bevel affects reflection angle
    
    // Intensity based on position, bevel, and noise
    float dist = length(reflectDir);
    float intensity = 0.7 + 0.3 * (1.0 - dist);
    intensity *= 0.7 + 0.3 * bevel; // Inner areas brighter
    intensity += noise3 * 0.15;
    intensity = clamp(intensity, 0.0, 1.0);
    
    // Get chrome color with emboss
    vec3 chrome = chromeGradient(angle, intensity, emboss * 0.5);
    
    // Enhanced edge detection for rim lighting
    float edgeL = texture2D(uTexture, centeredUv + vec2(-imagePixelSize.x * 3.0, 0.0)).a;
    float edgeR = texture2D(uTexture, centeredUv + vec2(imagePixelSize.x * 3.0, 0.0)).a;
    float edgeT = texture2D(uTexture, centeredUv + vec2(0.0, -imagePixelSize.y * 3.0)).a;
    float edgeB = texture2D(uTexture, centeredUv + vec2(0.0, imagePixelSize.y * 3.0)).a;
    
    float edge = abs(edgeL - edgeR) + abs(edgeT - edgeB);
    edge = smoothstep(0.0, 0.3, edge);
    
    // Strong rim highlight on edges
    chrome += vec3(edge * 0.8);
    
    // Add bevel shadow/highlight
    float bevelLight = 1.0 - bevel;
    chrome *= 0.6 + 0.4 * bevel; // Darken edges
    chrome += vec3(bevelLight * emboss * 0.3); // Emboss shading
    
    // Fresnel-like edge brightening
    float fresnel = pow(1.0 - bevel, 3.0);
    chrome += vec3(fresnel * 0.4) * intensity;
    
    // Subtle color temperature shift
    float tempShift = sin(angle * 6.28 + time * 0.5) * 0.03;
    chrome.r += tempShift;
    chrome.b -= tempShift * 0.5;
    
    // Final contrast boost for more metallic look
    chrome = pow(chrome, vec3(0.9));
    chrome = chrome * 1.1 - 0.05;
    chrome = clamp(chrome, 0.0, 1.0);
    
    gl_FragColor = vec4(chrome, logoMask);
  }
`;

export default function ChromeLogo({ logoUrl, className = '' }) {
  const canvasRef = useRef(null);
  const glRef = useRef(null);
  const programRef = useRef(null);
  const textureRef = useRef(null);
  const uniformsRef = useRef({});
  const animationRef = useRef(null);
  const imageSizeRef = useRef({ width: 1, height: 1 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', { 
      alpha: true, 
      premultipliedAlpha: false,
      antialias: true 
    });
    if (!gl) {
      console.error('WebGL not supported');
      return;
    }
    glRef.current = gl;

    // Create shaders
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

    // Create program
    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(program));
      return;
    }
    programRef.current = program;

    // Create geometry (full screen quad)
    const positions = new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
       1,  1,
    ]);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const positionLoc = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

    // Get uniform locations
    gl.useProgram(program);
    uniformsRef.current = {
      uTexture: gl.getUniformLocation(program, 'uTexture'),
      uTime: gl.getUniformLocation(program, 'uTime'),
      uResolution: gl.getUniformLocation(program, 'uResolution'),
      uImageSize: gl.getUniformLocation(program, 'uImageSize'),
    };

    // Create texture
    const texture = gl.createTexture();
    textureRef.current = texture;
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    // Load logo image
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      imageSizeRef.current = { width: img.width, height: img.height };
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
    };
    img.src = logoUrl;

    // Enable blending for transparency
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    // Handle resize
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Animation loop
    const startTime = performance.now();
    const render = () => {
      const time = (performance.now() - startTime) / 1000;
      
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      
      gl.useProgram(program);
      gl.uniform1i(uniformsRef.current.uTexture, 0);
      gl.uniform1f(uniformsRef.current.uTime, time);
      gl.uniform2f(uniformsRef.current.uResolution, canvas.width, canvas.height);
      gl.uniform2f(uniformsRef.current.uImageSize, imageSizeRef.current.width, imageSizeRef.current.height);
      
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      
      animationRef.current = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [logoUrl]);

  return (
    <canvas 
      ref={canvasRef} 
      className={className}
      style={{ 
        display: 'block',
        width: '100%',
        height: '100%',
        imageRendering: 'crisp-edges',
      }} 
    />
  );
}
