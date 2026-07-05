import { useEffect, useRef } from "react";

export default function GlacialOrb() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = canvas.width = canvas.offsetWidth;
    let height = canvas.height = canvas.offsetHeight;

    const mouse = { x: width / 2, y: height / 2, tx: width / 2, ty: height / 2 };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.tx = e.clientX - rect.left;
      mouse.ty = e.clientY - rect.top;
    };

    window.addEventListener("mousemove", handleMouseMove);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", handleResize);

    // Dynamic morphing parameters
    let time = 0;

    const render = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse interpolation
      mouse.x += (mouse.tx - mouse.x) * 0.08;
      mouse.y += (mouse.ty - mouse.y) * 0.08;

      time += 0.004;

      const centerX = width / 2;
      const centerY = height / 2;
      
      // We will draw 3 layers of translucent morphing blobs to create a rich glass/frost depth
      const drawBlob = (
        baseRadius: number,
        color1: string,
        color2: string,
        speedMultiplier: number,
        noiseAmplitude: number,
        layerOffset: number
      ) => {
        ctx.save();
        
        // Setup gradient
        const gradient = ctx.createRadialGradient(
          mouse.x,
          mouse.y,
          10,
          centerX,
          centerY,
          baseRadius * 1.5
        );
        gradient.addColorStop(0, color1);
        gradient.addColorStop(1, color2);
        
        ctx.fillStyle = gradient;
        ctx.beginPath();

        const numPoints = 8;
        const points: { x: number; y: number }[] = [];

        for (let i = 0; i < numPoints; i++) {
          const angle = (i / numPoints) * Math.PI * 2;
          
          // Use multiple sin/cos waves for organic procedural noise morphing
          const noise = 
            Math.sin(angle * 3 + time * speedMultiplier + layerOffset) * 20 +
            Math.cos(angle * 2 - time * 1.5 * speedMultiplier) * 15 +
            Math.sin(angle * 5 + time * 0.8) * 10;
            
          // Attract slightly towards mouse to give responsive interaction feel
          const mouseInfluence = 0.15;
          const dx = mouse.x - centerX;
          const dy = mouse.y - centerY;
          const r = baseRadius + noise * noiseAmplitude;
          
          const x = centerX + Math.cos(angle) * r + dx * mouseInfluence;
          const y = centerY + Math.sin(angle) * r + dy * mouseInfluence;
          
          points.push({ x, y });
        }

        // Connect points with smooth quadratic/cubic curves
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 0; i < numPoints; i++) {
          const p0 = points[i];
          const p1 = points[(i + 1) % numPoints];
          const xc = (p0.x + p1.x) / 2;
          const yc = (p0.y + p1.y) / 2;
          ctx.quadraticCurveTo(p0.x, p0.y, xc, yc);
        }
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      };

      // Outer ambient soft glow (Layer 1)
      drawBlob(
        Math.min(width, height) * 0.35,
        "rgba(240, 248, 255, 0.45)",
        "rgba(255, 255, 255, 0)",
        0.8,
        0.8,
        0.0
      );

      // Mid icy layer (Layer 2)
      drawBlob(
        Math.min(width, height) * 0.28,
        "rgba(225, 235, 255, 0.55)",
        "rgba(245, 248, 255, 0.05)",
        1.2,
        0.6,
        2.5
      );

      // Inner glass core (Layer 3)
      drawBlob(
        Math.min(width, height) * 0.20,
        "rgba(255, 255, 255, 0.85)",
        "rgba(235, 242, 255, 0.25)",
        1.5,
        0.4,
        4.0
      );

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none mix-blend-multiply opacity-85 z-0"
    />
  );
}
