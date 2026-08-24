import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function WireframeSphere({ color = "F44227" }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mount.appendChild(renderer.domElement);

    // Main sphere
    const geometry = new THREE.SphereGeometry(6, 32, 32);
    const material = new THREE.MeshBasicMaterial({
      color,
      wireframe: true,
      transparent: true,
      opacity: 0.8,
    });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    // Orbiting rings
    const ringMaterial = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.6 });
    const rings = [];
    for (let i = 0; i < 3; i++) {
      const ringGeometry = new THREE.RingGeometry(7 + i, 7.2 + i, 64);
      const ring = new THREE.LineLoop(ringGeometry, ringMaterial);
      ring.rotation.x = Math.random() * Math.PI;
      ring.rotation.y = Math.random() * Math.PI;
      scene.add(ring);
      rings.push(ring);
    }

    // Spark particles
    const particles = new THREE.BufferGeometry();
    const particleCount = 200;
    const positions = [];
    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.random() * Math.PI;
      const radius = 9;
      positions.push(
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.sin(phi) * Math.sin(theta),
        radius * Math.cos(phi)
      );
    }
    particles.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    const particleMaterial = new THREE.PointsMaterial({ color, size: 0.15, transparent: true, opacity: 0.7 });
    const particleSystem = new THREE.Points(particles, particleMaterial);
    scene.add(particleSystem);

    camera.position.z = 20;

    let glowPulse = 0;

    const animate = () => {
      requestAnimationFrame(animate);

      sphere.rotation.y += 0.002;
      sphere.rotation.x += 0.001;

      rings.forEach((ring, i) => {
        ring.rotation.z += 0.002 * (i + 1);
      });

      particleSystem.rotation.y += 0.0015;

      glowPulse += 0.02;
      material.opacity = 0.6 + Math.sin(glowPulse) * 0.2;

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      mount.removeChild(renderer.domElement);
    };
  }, [color]);

  return (
    <div className="absolute inset-0">
      <div ref={mountRef} className="w-full h-full" />
    </div>
  );
}
