import Spline from "@splinetool/react-spline";
import { motion } from "framer-motion";

export default function SplinePage() {
  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      {/* CAMADA 1: Spline (Fundo) */}
      <div style={{ position: "absolute", inset: 0 }}>
        <Spline scene="https://prod.spline.design/sSvEHDB1IeBsSn2P/scene.splinecode" />
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
          SPLINE SCENE
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          style={{ color: "#ccc", fontFamily: "sans-serif", marginTop: "1rem" }}
        >
          Interaja com a cena 3D
        </motion.p>
      </main>
    </div>
  );
}
