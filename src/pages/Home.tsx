import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float } from "@react-three/drei";
import { motion } from "framer-motion";
import { useRef } from "react";
import type { Mesh } from "three";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

// Componente 3D (O Cubo)
function AnimatedCube() {
  const meshRef = useRef<Mesh>(null);

  useGSAP(
    () => {
      if (meshRef.current) {
        gsap.from(meshRef.current.scale, {
          x: 0,
          y: 0,
          z: 0,
          duration: 1.5,
          ease: "elastic.out(1, 0.3)",
          delay: 0.5,
        });
      }
    },
    { scope: meshRef }
  );

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.5;
      meshRef.current.rotation.y += delta * 0.2;
    }
  });

  const handlePointerOver = () => {
    if (!meshRef.current) return;
    gsap.to(meshRef.current.scale, {
      x: 1.5,
      y: 1.5,
      z: 1.5,
      duration: 0.5,
      ease: "power2.out",
    });
    const material = meshRef.current.material;
    if (material && !Array.isArray(material) && "color" in material) {
      // @ts-expect-error - GSAP anima props internas do THREE.Color
      gsap.to(material.color, { r: 1.0, g: 0.25, b: 0.25, duration: 0.3 });
    }
  };

  const handlePointerOut = () => {
    if (!meshRef.current) return;
    gsap.to(meshRef.current.scale, {
      x: 1,
      y: 1,
      z: 1,
      duration: 0.5,
      ease: "power2.out",
    });
    const material = meshRef.current.material;
    if (material && !Array.isArray(material) && "color" in material) {
      // @ts-expect-error - GSAP anima props internas do THREE.Color
      gsap.to(material.color, { r: 0.3, g: 0.8, b: 0.77, duration: 0.3 });
    }
  };

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={1}>
      <mesh
        ref={meshRef}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <boxGeometry args={[2.5, 2.5, 2.5]} />
        <meshStandardMaterial color="#4ecdc4" wireframe={true} />
      </mesh>
    </Float>
  );
}

export default function Home() {
  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      {/* CAMADA 1: O Canvas WebGL (Fundo) */}
      <div style={{ position: "absolute", inset: 0 }}>
        <Canvas camera={{ position: [0, 0, 8] }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <AnimatedCube />
          <OrbitControls enableZoom={false} />
        </Canvas>
      </div>

      {/* CAMADA 2: Interface HTML/CSS (Frente) */}
      <main
        style={{
          position: "relative",
          zIndex: 10,
          height: "100%",
          display: "flex",
          padding: "4rem",
          flexDirection: "column",
          justifyContent: "start",
          alignItems: "center",
          pointerEvents: "none",
        }}
      >
        <motion.h1
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          style={{
            fontFamily: "sans-serif",
            fontSize: "4rem",
            color: "white",
            textAlign: "center",
            mixBlendMode: "overlay",
            pointerEvents: "auto",
          }}
        >
          MOTION WEB
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          style={{ color: "#ccc", fontFamily: "sans-serif", marginTop: "1rem" }}
        >
          Passe o mouse sobre o cubo
        </motion.p>
      </main>
    </div>
  );
}
