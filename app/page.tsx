"use client";

import { useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { EffectComposer, Bloom, Vignette, Noise, Scanline } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function Scene({ index, doorXs }: { index: number; doorXs: number[] }) {
  const { camera } = useThree();

  const camY = 1.6;
  const camZ = 5.2;

  const prevIndexRef = useRef(index);
  const fromXRef = useRef(doorXs[index]);
  const toXRef = useRef(doorXs[index]);
  const tRef = useRef(1);
  const durationRef = useRef(0.85);

  const lookAt = useMemo(() => new THREE.Vector3(), []);

  if (prevIndexRef.current !== index) {
    prevIndexRef.current = index;
    fromXRef.current = camera.position.x;
    toXRef.current = doorXs[index];
    tRef.current = 0;
  }

  useFrame((_, delta) => {
    if (tRef.current < 1) {
      tRef.current = Math.min(1, tRef.current + delta / durationRef.current);
      const eased = easeInOutCubic(tRef.current);
      const x = fromXRef.current + (toXRef.current - fromXRef.current) * eased;
      camera.position.set(x, camY, camZ);
    } else {
      camera.position.set(toXRef.current, camY, camZ);
    }

    lookAt.set(camera.position.x, 1.2, 0);
    camera.lookAt(lookAt);
  });

  return (
    <>
      <ambientLight intensity={0.2} />
      <directionalLight position={[5, 8, 5]} intensity={0.8} />

      {/* Zemin */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[4, 0, 0]}>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial color="#000000ff" />
      </mesh>

      {/* Kapılar */}
      {doorXs.map((x, i) => {
        const selected = i === index;
        return (
          <group key={i} position={[x, 0, 0]}>
            {/* Çerçeve */}
            <mesh position={[0, 1.1, 0]}>
              <boxGeometry args={[1.35, 2.35, 0.12]} />
              <meshStandardMaterial color="#efefef" />
            </mesh>

            {/* İç panel (seçili olan glow atar) */}
            <mesh position={[0, 1.1, 0.07]}>
              <boxGeometry args={[1.15, 2.1, 0.05]} />
              <meshStandardMaterial
                color={selected ? "#ffffff" : "#f1f1f1"}
                emissive={selected ? "#ffffff" : "#000000"}
                emissiveIntensity={selected ? 0.8 : 0}
              />
            </mesh>

            {/* Etiket */}
            <mesh position={[0, 2.45, 0.07]}>
              <boxGeometry args={[0.8, 0.18, 0.05]} />
              <meshStandardMaterial color="#ffffff" />
            </mesh>
          </group>
        );
      })}
    </>
  );
}

export default function Home() {
  const doorXs = useMemo(() => [0, 4, 8], []);
  const [index, setIndex] = useState(0);

  const canLeft = index > 0;
  const canRight = index < doorXs.length - 1;

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      <Canvas camera={{ position: [doorXs[0], 1.6, 5.2], fov: 50 }} gl={{ antialias: true }}>
        <color attach="background" args={["#000000ff"]} />

        <Scene index={index} doorXs={doorXs} />

        <EffectComposer multisampling={0}>
        <Bloom intensity={0.1} luminanceThreshold={0.85} luminanceSmoothing={0.6} />
        <Vignette eskil offset={0.2} darkness={0.45} />
        <Noise opacity={0.01} />
        <Scanline
          blendFunction={BlendFunction.LUMINOSITY}
          opacity={0.05}
          density={0.9}
        />

        </EffectComposer>
      </Canvas>

      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <button
          onClick={() => canLeft && setIndex((v) => v - 1)}
          disabled={!canLeft}
          style={{
            position: "absolute",
            left: 18,
            top: "50%",
            transform: "translateY(-50%)",
            pointerEvents: "auto",
            width: 56,
            height: 56,
            borderRadius: 999,
            border: "1px solid rgba(255,255,255,0.6)",
            background: "rgba(0,0,0,0.25)",
            color: "white",
            fontSize: 22,
            cursor: canLeft ? "pointer" : "default",
            opacity: canLeft ? 1 : 0.35,
            backdropFilter: "blur(6px)",
          }}
          aria-label="Sola git"
        >
          ←
        </button>

        <button
          onClick={() => canRight && setIndex((v) => v + 1)}
          disabled={!canRight}
          style={{
            position: "absolute",
            right: 18,
            top: "50%",
            transform: "translateY(-50%)",
            pointerEvents: "auto",
            width: 56,
            height: 56,
            borderRadius: 999,
            border: "1px solid rgba(255,255,255,0.6)",
            background: "rgba(0,0,0,0.25)",
            color: "white",
            fontSize: 22,
            cursor: canRight ? "pointer" : "default",
            opacity: canRight ? 1 : 0.35,
            backdropFilter: "blur(6px)",
          }}
          aria-label="Sağa git"
        >
          →
        </button>
      </div>
    </div>
  );
}
