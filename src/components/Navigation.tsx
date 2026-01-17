import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

export function Navigation() {
  const location = useLocation();

  return (
    <nav
      style={{
        position: "fixed",
        bottom: "2rem",
        right: "2rem",
        zIndex: 100,
        display: "flex",
        gap: "1rem",
        background: "rgba(0,0,0,0.5)",
        padding: "1rem",
        borderRadius: "1rem",
        backdropFilter: "blur(10px)",
      }}
    >
      <Link to="/" style={{ textDecoration: "none" }}>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            background: location.pathname === "/" ? "#4ecdc4" : "transparent",
            border: "1px solid #4ecdc4",
            color: "white",
            padding: "0.5rem 1rem",
            borderRadius: "0.5rem",
            cursor: "pointer",
            fontFamily: "sans-serif",
          }}
        >
          Three.js Cube
        </motion.button>
      </Link>
      <Link to="/spline" style={{ textDecoration: "none" }}>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            background:
              location.pathname === "/spline" ? "#ff4040" : "transparent",
            border: "1px solid #ff4040",
            color: "white",
            padding: "0.5rem 1rem",
            borderRadius: "0.5rem",
            cursor: "pointer",
            fontFamily: "sans-serif",
          }}
        >
          Spline Scene
        </motion.button>
      </Link>
    </nav>
  );
}
