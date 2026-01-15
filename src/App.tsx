import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float } from "@react-three/drei";
import { motion } from "framer-motion";
import { useRef } from "react";
import "./App.css";
import type { Mesh } from "three";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

// REGISTRO DE PLUGINS
// É boa prática registrar plugins do GSAP para garantir que o tree-shaking não os remova.
gsap.registerPlugin(useGSAP);

// Componente 3D (O Cubo)
// Componente 3D (O Cubo) - Agora tunado com GSAP nas interações!
function AnimatedCube() {
  const meshRef = useRef<Mesh>(null);

  // NOTE: Removemos o useState!
  // O link direto do GSAP com as propriedades do Three.js é muito mais performático
  // porque não causa re-renders do React a cada frame de animação.

  // Hook do useGSAP para gerenciar o ciclo de vida das animações
  useGSAP(
    () => {
      // Animação inicial de entrada "pop-in"
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
  ); // Scoped referenciando o próprio mesh (não comum, mas possível) ou container

  // useFrame continua ótimo para rotação constante (loop infinito),
  // mas vamos deixar o GSAP cuidar das transições de estado (hover).
  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.5;
      meshRef.current.rotation.y += delta * 0.2;
    }
  });

  // Funções de interação separadas para usar o GSAP
  // Elas modificam diretamente as propriedades do objeto three.js (ref.current)
  const handlePointerOver = () => {
    if (!meshRef.current) return;

    // ANIMAÇÃO DE SCALE
    gsap.to(meshRef.current.scale, {
      x: 1.5,
      y: 1.5,
      z: 1.5,
      duration: 0.5,
      ease: "power2.out", // Suavização de saída
    });

    // ANIMAÇÃO DE COR (no material)
    // Usamos 'as MeshStandardMaterial' (ou check de propriedade) para o TS
    const material = meshRef.current.material;

    // Verifica se não é um array e se tem 'color' (MeshStandardMaterial tem)
    if (material && !Array.isArray(material) && "color" in material) {
      // @ts-expect-error - GSAP anima props internas do THREE.Color
      gsap.to(material.color, {
        r: 1.0,
        g: 0.25,
        b: 0.25, // Convertendo #ff4040 aproximado
        duration: 0.3,
      });
    }
  };

  const handlePointerOut = () => {
    if (!meshRef.current) return;

    // Volta ao tamanho original
    gsap.to(meshRef.current.scale, {
      x: 1,
      y: 1,
      z: 1,
      duration: 0.5,
      ease: "power2.out",
    });

    // Volta a cor original
    const material = meshRef.current.material;
    if (material && !Array.isArray(material) && "color" in material) {
      // @ts-expect-error - GSAP anima props internas do THREE.Color
      gsap.to(material.color, {
        r: 0.3,
        g: 0.8,
        b: 0.77, // Convertendo #4ecdc4 aproximado
        duration: 0.3,
      });
    }
  };

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={1}>
      <mesh
        ref={meshRef}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        // Removemos o 'scale' e 'material color' declarativos do render
        // Agora o GSAP controla isso imperativamente.
      >
        <boxGeometry args={[2.5, 2.5, 2.5]} />
        <meshStandardMaterial
          color="#4ecdc4" // Cor inicial estática
          wireframe={true}
        />
      </mesh>
    </Float>
  );
}

// --- COMPONENTE DE ESTUDO: CURSOR PERSONALIZADO ---
// Demonstra o uso de gsap.quickTo() para alta performance em eventos frequentes (mousemove).
function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // quickTo: A "bala de prata" do GSAP para movimentos de mouse!
    // Diferente de gsap.to(), o quickTo reaproveita a instância da animação,
    // sendo muito mais performático para updates contínuos.
    const xTo = gsap.quickTo(cursorRef.current, "x", {
      duration: 0.1,
      ease: "power3",
    });
    const yTo = gsap.quickTo(cursorRef.current, "y", {
      duration: 0.1,
      ease: "power3",
    });

    // Oseguidor tem uma duração maior, criando o efeito de "arrasto" (lag)
    const xToFollower = gsap.quickTo(followerRef.current, "x", {
      duration: 0.6,
      ease: "power3",
    });
    const yToFollower = gsap.quickTo(followerRef.current, "y", {
      duration: 0.6,
      ease: "power3",
    });

    const handleMouseMove = (e: MouseEvent) => {
      // Atualizamos a posição X e Y instantaneamente com a otimização do quickTo
      xTo(e.clientX);
      yTo(e.clientY);
      xToFollower(e.clientX);
      yToFollower(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []); // Sem dependências, roda uma vez no mount

  return (
    <>
      {/* Ponto central (Rápido) */}
      <div
        ref={cursorRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "10px",
          height: "10px",
          backgroundColor: "#ff6b6b",
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 9999,
          transform: "translate(-50%, -50%)", // Centraliza no mouse (precisa ajustar no CSS ou quickTo logic se for center-based, mas aqui o quickTo move o top-left, então translate ajuda)
          // Nota: quickTo usa 'transform: translate' por baixo dos panos se usarmos x/y
        }}
      />
      {/* Círculo Seguidor (Lento/Fluido) */}
      <div
        ref={followerRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "40px",
          height: "40px",
          border: "1px solid rgba(255, 255, 255, 0.5)",
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 9998,
          // Ajuste para centralizar o seguidor maior em relação ao ponto (compensando o tamanho)
          marginLeft: "-15px",
          marginTop: "-15px",
        }}
      />
    </>
  );
}

export default function App() {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: "#1a1a1a",
        position: "relative",
        cursor: "none", // Esconde o cursor padrão do sistema
      }}
    >
      <CustomCursor />

      {/* CAMADA 1: O Canvas WebGL (Fundo) */}
      <div style={{ position: "absolute", inset: 0 }}>
        <Canvas camera={{ position: [0, 0, 8] }}>
          {/* Luzes */}
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />

          {/* Nosso Objeto 3D */}
          <AnimatedCube />

          {/* Controles para girar a cena com o mouse (opcional) */}
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
          pointerEvents: "none", // Importante: deixa o clique passar para o Canvas 3D atrás
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
            mixBlendMode: "overlay", // Efeito interessante de mistura com o fundo
            pointerEvents: "auto", // Reativa o mouse apenas no texto
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
