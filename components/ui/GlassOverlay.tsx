"use client";

import { useRef, useEffect } from "react";
import { Renderer, Program, Triangle, Mesh } from "ogl";
import { getCardElements, subscribeCards } from "./glassStore";

const vert = `#version 300 es
in vec2 position;
out vec2 vUv;
void main() {
  vUv = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}`;

const frag = `#version 300 es
precision highp float;

uniform float uTime;
uniform vec2  uResolution;
uniform vec4  uCards[8];
uniform float uDpr;

in vec2 vUv;
out vec4 outColor;

float hash(vec2 p) {
  p = fract(p * vec2(234.34, 435.345));
  p += dot(p, p + 34.23);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
    f.y
  );
}

// card: (left, top, width, height) in device pixels, top-left origin
float sdRoundedRect(vec2 p, vec4 card, float r) {
  vec2 center = card.xy + card.zw * 0.5;
  vec2 q = abs(p - center) - card.zw * 0.5 + r;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}

void main() {
  // Flip Y: gl_FragCoord is bottom-left origin, we want top-left (matches CSS rects)
  vec2 fc = vec2(gl_FragCoord.x, uResolution.y - gl_FragCoord.y);

  float borderR   = 12.0 * uDpr;
  float edgeFeath = 22.0 * uDpr;

  vec3  col    = vec3(0.0);
  float alpha  = 0.0;
  bool  inside = false;

  for (int i = 0; i < 8; i++) {
    vec4 card = uCards[i];
    if (card.z < 0.0) continue;

    float sdf  = sdRoundedRect(fc, card, borderR);
    float inF  = 1.0 - smoothstep(-1.0, 1.0, sdf);
    if (inF < 0.01) continue;
    inside = true;

    // Edge weight: 1 at the border, 0 in the center
    float edgeF = 1.0 - smoothstep(0.0, edgeFeath, max(-sdf, 0.0));

    // --- Chromatic aberration tint at edges ---
    vec3 caColor = vec3(0.08, 0.02, 0.14) * edgeF * inF;
    caColor      = mix(caColor, vec3(0.553, 0.639, 0.725) * 0.14, edgeF * 0.45);

    // --- Animated grain (very subtle — iOS 26 glass is clean) ---
    float grain = noise(fc / 1.8 + vec2(uTime * 7.3, uTime * 5.7));
    grain = (grain - 0.5) * 0.032 * inF;

    vec3 contrib = caColor + grain;
    float a      = clamp(edgeF * inF * 0.12 + abs(grain) * 0.4, 0.0, 1.0);

    col   += contrib;
    alpha  = max(alpha, a);
  }

  if (!inside) discard;

  outColor = vec4(col, alpha);
}`;

export default function GlassOverlay() {
  const containerRef = useRef<HTMLDivElement>(null);
  const uniformsRef  = useRef<Record<string, { value: unknown }> | null>(null);
  const rendererRef  = useRef<Renderer | null>(null);
  const rafRef       = useRef<number | null>(null);
  const cleanupRef   = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let cancelled = false;

    const init = async () => {
      await new Promise((r) => setTimeout(r, 10));
      if (cancelled || !containerRef.current) return;

      let renderer: Renderer;
      try {
        renderer = new Renderer({ webgl: 2, alpha: true, dpr: Math.min(window.devicePixelRatio, 2) });
      } catch {
        return;
      }
      rendererRef.current = renderer;

      const gl = renderer.gl;
      const canvas = gl.canvas as HTMLCanvasElement;
      canvas.style.width  = "100%";
      canvas.style.height = "100%";
      containerRef.current.appendChild(canvas);

      const cardData = new Float32Array(32);
      cardData.fill(-1);

      const uniforms: Record<string, { value: unknown }> = {
        uTime:       { value: 0 },
        uResolution: { value: [window.innerWidth, window.innerHeight] },
        uCards:      { value: cardData },
        uDpr:        { value: renderer.dpr },
      };
      uniformsRef.current = uniforms;

      const geometry = new Triangle(gl);
      const program  = new Program(gl, { vertex: vert, fragment: frag, uniforms, transparent: true });
      const mesh     = new Mesh(gl, { geometry, program });

      const resize = () => {
        renderer.dpr = Math.min(window.devicePixelRatio, 2);
        renderer.setSize(window.innerWidth, window.innerHeight);
        uniforms.uResolution.value = [window.innerWidth * renderer.dpr, window.innerHeight * renderer.dpr];
        uniforms.uDpr.value = renderer.dpr;
      };
      resize();
      window.addEventListener("resize", resize);

      const updateCards = () => {
        const els = getCardElements();
        const dpr = renderer.dpr;
        cardData.fill(-1);
        els.slice(0, 8).forEach((el, i) => {
          const r = el.getBoundingClientRect();
          const base = i * 4;
          cardData[base]     = r.left   * dpr;
          cardData[base + 1] = r.top    * dpr;
          cardData[base + 2] = r.width  * dpr;
          cardData[base + 3] = r.height * dpr;
        });
      };

      const unsubCards = subscribeCards(updateCards);
      updateCards();

      let firstFrame = true;
      const loop = (t: number) => {
        if (!uniformsRef.current || !rendererRef.current) return;
        uniforms.uTime.value = t * 0.001;
        updateCards();
        try {
          renderer.render({ scene: mesh });
          if (firstFrame && containerRef.current) {
            firstFrame = false;
            containerRef.current.style.opacity = "1";
          }
        } catch {
          return;
        }
        rafRef.current = requestAnimationFrame(loop);
      };
      rafRef.current = requestAnimationFrame(loop);

      cleanupRef.current = () => {
        if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
        window.removeEventListener("resize", resize);
        unsubCards();
        try {
          const ext = gl.getExtension("WEBGL_lose_context");
          ext?.loseContext();
          canvas.parentNode?.removeChild(canvas);
        } catch { /* ignore */ }
        rendererRef.current = null;
        uniformsRef.current = null;
      };
    };

    init();
    return () => {
      cancelled = true;
      cleanupRef.current?.();
      cleanupRef.current = null;
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 -z-10 pointer-events-none"
      style={{ opacity: 0, transition: "opacity 1s ease-out" }}
    />
  );
}
