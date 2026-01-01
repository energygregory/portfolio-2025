import { useEffect, useMemo, useRef } from "react";

import "./Dither.css";

const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
};

const BAYER_MATRIX = [
  0 / 64,
  48 / 64,
  12 / 64,
  60 / 64,
  3 / 64,
  51 / 64,
  15 / 64,
  63 / 64,
  32 / 64,
  16 / 64,
  44 / 64,
  28 / 64,
  35 / 64,
  19 / 64,
  47 / 64,
  31 / 64,
  8 / 64,
  56 / 64,
  4 / 64,
  52 / 64,
  11 / 64,
  59 / 64,
  7 / 64,
  55 / 64,
  40 / 64,
  24 / 64,
  36 / 64,
  20 / 64,
  43 / 64,
  27 / 64,
  39 / 64,
  23 / 64,
  2 / 64,
  50 / 64,
  14 / 64,
  62 / 64,
  1 / 64,
  49 / 64,
  13 / 64,
  61 / 64,
  34 / 64,
  18 / 64,
  46 / 64,
  30 / 64,
  33 / 64,
  17 / 64,
  45 / 64,
  29 / 64,
  10 / 64,
  58 / 64,
  6 / 64,
  54 / 64,
  9 / 64,
  57 / 64,
  5 / 64,
  53 / 64,
  42 / 64,
  26 / 64,
  38 / 64,
  22 / 64,
  41 / 64,
  25 / 64,
  37 / 64,
  21 / 64,
];

const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));

export default function Dither({
  waveSpeed = 0.05,
  waveFrequency = 3,
  waveAmplitude = 0.3,
  waveColor = [0.5, 0.5, 0.5],
  colorNum = 4,
  pixelSize = 2,
  disableAnimation = false,
  enableMouseInteraction = true,
  mouseRadius = 1,
  bias = 0.2,
}) {
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0, active: false });

  const colorKey = useMemo(
    () => waveColor.map((value) => Number(value) || 0).join(","),
    [waveColor]
  );

  const normalizedColor = useMemo(() => {
    const [r = 0.5, g = 0.5, b = 0.5] = waveColor;
    return [clamp(r), clamp(g), clamp(b)];
  }, [colorKey]);

  const safePixelSize = Math.max(1, Number(pixelSize) || 1);
  const safeColorSteps = Math.max(2, Math.floor(Number(colorNum) || 2));
  const safeMouseRadius = Math.max(0.001, Number(mouseRadius) || 0.001);
  const safeBias = typeof bias === "number" ? bias : 0;
  const safeFrequency = Math.max(0.5, Number(waveFrequency) || 1);
  const safeSpeed = Math.max(0, Number(waveSpeed) || 0);
  const safeAmplitude = Math.max(0, Number(waveAmplitude) || 0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const container = canvas.parentElement ?? canvas;
    const offscreen = document.createElement("canvas");
    const offCtx = offscreen.getContext("2d", { willReadFrequently: true });
    if (!offCtx) return;

    let width = 0;
    let height = 0;
    let sampleWidth = 0;
    let sampleHeight = 0;
    let buffer = null;

    const updateSize = () => {
      const rect = container.getBoundingClientRect();
      width = Math.max(1, Math.floor(rect.width) || 1);
      height = Math.max(1, Math.floor(rect.height) || 1);
      canvas.width = width;
      canvas.height = height;
      ctx.imageSmoothingEnabled = false;

      sampleWidth = Math.max(1, Math.round(width / safePixelSize));
      sampleHeight = Math.max(1, Math.round(height / safePixelSize));
      offscreen.width = sampleWidth;
      offscreen.height = sampleHeight;
      buffer = offCtx.createImageData(sampleWidth, sampleHeight);
    };

    const pointer = mouseRef.current;

    const sampleWave = (ux, uy, timeFactor) => {
      let freq = safeFrequency;
      let amp = 0.6 + safeAmplitude;
      let sum = 0;
      for (let octave = 0; octave < 4; octave++) {
        const phase = timeFactor * (octave + 1);
        sum += amp * Math.sin(ux * freq + phase);
        sum += amp * 0.5 * Math.cos(uy * freq * 0.85 - phase * 1.3);
        sum += amp * 0.25 * Math.sin((ux + uy) * freq * 0.65 - phase * 0.7);
        freq *= 1.45;
        amp *= 0.55 + safeAmplitude * 0.35;
      }
      return sum;
    };

    const drawFrame = (time = performance.now()) => {
      if (!buffer) return;
      const data = buffer.data;
      const aspect = width / height || 1;
      const pointerActive = enableMouseInteraction && pointer.active;
      const colorStep = 1 / (safeColorSteps - 1);
      const timeFactor = time * 0.001 * safeSpeed;

      let ptr = 0;
      for (let y = 0; y < sampleHeight; y++) {
        for (let x = 0; x < sampleWidth; x++) {
          const pixelIndex = ptr;
          ptr += 4;

          const pixelX = ((x + 0.5) / sampleWidth) * width;
          const pixelY = ((y + 0.5) / sampleHeight) * height;
          const normX = pixelX / width - 0.5;
          const normY = pixelY / height - 0.5;
          const uvx = normX * aspect;
          const uvy = normY;

          let value = sampleWave(uvx + uvy * 0.5, uvy - uvx * 0.35, timeFactor);
          value = 0.5 + value * 0.35;
          value = clamp(value, 0, 1);

          if (pointerActive) {
            const mouseX = pointer.x / width - 0.5;
            const mouseY = pointer.y / height - 0.5;
            const mouseAspectX = mouseX * aspect;
            const mouseAspectY = -mouseY;
            const dist = Math.hypot(uvx - mouseAspectX, uvy - mouseAspectY);
            const influence = Math.max(0, 1 - dist / safeMouseRadius);
            value -= 0.35 * influence;
          }

          const threshold = BAYER_MATRIX[(y & 7) * 8 + (x & 7)] - 0.25;
          let quantized = clamp(value - safeBias + threshold * colorStep, 0, 1);
          quantized = Math.round(quantized * (safeColorSteps - 1)) / (safeColorSteps - 1);

          data[pixelIndex] = Math.round(clamp(normalizedColor[0] * quantized) * 255);
          data[pixelIndex + 1] = Math.round(clamp(normalizedColor[1] * quantized) * 255);
          data[pixelIndex + 2] = Math.round(clamp(normalizedColor[2] * quantized) * 255);
          data[pixelIndex + 3] = 255;
        }
      }

      offCtx.putImageData(buffer, 0, 0);
      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(offscreen, 0, 0, width, height);
    };

    updateSize();
    if (disableAnimation) {
      drawFrame();
    } else {
      const targetFPS = isMobile() ? 30 : 60;
      const frameInterval = 1000 / targetFPS;
      let lastFrameTime = 0;
      const loop = (time) => {
        const elapsed = time - lastFrameTime;
        if (elapsed >= frameInterval) {
          drawFrame(time);
          lastFrameTime = time - (elapsed % frameInterval);
        }
        animationFrameRef.current = requestAnimationFrame(loop);
      };
      animationFrameRef.current = requestAnimationFrame(loop);
    }

    const handleResize = () => {
      updateSize();
      if (disableAnimation) {
        drawFrame();
      }
    };

    const handlePointerMove = (event) => {
      if (!enableMouseInteraction) return;
      const rect = canvas.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
      pointer.active = true;
      if (disableAnimation) {
        drawFrame();
      }
    };

    const handlePointerLeave = () => {
      pointer.active = false;
      if (disableAnimation) {
        drawFrame();
      }
    };

    const resizeObserver =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(handleResize)
        : null;

    resizeObserver?.observe(container);
    window.addEventListener("resize", handleResize);
    if (enableMouseInteraction) {
      canvas.addEventListener("pointermove", handlePointerMove);
      canvas.addEventListener("pointerdown", handlePointerMove);
      canvas.addEventListener("pointerleave", handlePointerLeave);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      resizeObserver?.disconnect();
      window.removeEventListener("resize", handleResize);
      if (enableMouseInteraction) {
        canvas.removeEventListener("pointermove", handlePointerMove);
        canvas.removeEventListener("pointerdown", handlePointerMove);
        canvas.removeEventListener("pointerleave", handlePointerLeave);
      }
    };
  }, [
    safeBias,
    disableAnimation,
    enableMouseInteraction,
    normalizedColor,
    safeAmplitude,
    safeColorSteps,
    safeFrequency,
    safeMouseRadius,
    safePixelSize,
    safeSpeed,
  ]);

  return <canvas ref={canvasRef} className="dither-container" />;
}
