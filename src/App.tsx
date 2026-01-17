import { useRef } from "react";
import "./App.css";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SplinePage from "./pages/SplinePage";
import { Navigation } from "./components/Navigation";

gsap.registerPlugin(useGSAP);

function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const xTo = gsap.quickTo(cursorRef.current, "x", {
      duration: 0.1,
      ease: "power3",
    });
    const yTo = gsap.quickTo(cursorRef.current, "y", {
      duration: 0.1,
      ease: "power3",
    });
    const xToFollower = gsap.quickTo(followerRef.current, "x", {
      duration: 0.6,
      ease: "power3",
    });
    const yToFollower = gsap.quickTo(followerRef.current, "y", {
      duration: 0.6,
      ease: "power3",
    });

    const handleMouseMove = (e: MouseEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
      xToFollower(e.clientX);
      yToFollower(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <>
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
          transform: "translate(-50%, -50%)",
        }}
      />
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
          marginLeft: "-15px",
          marginTop: "-15px",
        }}
      />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div
        style={{
          width: "100vw",
          height: "100vh",
          background: "#1a1a1a",
          position: "relative",
          cursor: "none",
        }}
      >
        <CustomCursor />
        <Navigation />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/spline" element={<SplinePage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
