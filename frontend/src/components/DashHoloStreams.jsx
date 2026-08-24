import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function DashHoloStreams() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;

    // Scene and camera
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

    // Floating nodes
    const nodeCount = 30;
    const nodes = [];
    for (let i = 0; i < nodeCount; i++) {
      const geometry = new THREE.SphereGeometry(0.1, 8, 8);
      const material = new THREE.MeshBasicMaterial({ color: 0xf44227, transparent: true, opacity: 0.7 });
      const node = new THREE.Mesh(geometry, material);
      node.position.set(
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 40
      );
      // Give each node a velocity vector
      node.userData.velocity = new THREE.Vector3(
        (Math.random() - 0.5) * 0.02,
        (Math.random() - 0.5) * 0.02,
        (Math.random() - 0.5) * 0.02
      );
      scene.add(node);
      nodes.push(node);
    }

    // Lightning lines container
    const lightningLines = [];

    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0xff0000,
      transparent: true,
      opacity: 0.3,
    });

    camera.position.z = 30;

    const animate = () => {
      requestAnimationFrame(animate);

      // Move nodes
      nodes.forEach((node) => {
        node.position.add(node.userData.velocity);

        // Bounce off bounds
        ["x", "y", "z"].forEach((axis) => {
          if (Math.abs(node.position[axis]) > (axis === "y" ? 10 : 20)) {
            node.userData.velocity[axis] *= -1;
          }
        });
      });

      // Remove previous lightning lines
      lightningLines.forEach((line) => scene.remove(line));
      lightningLines.length = 0;

      // Check for nearby nodes and draw subtle lightning
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const n1 = nodes[i];
          const n2 = nodes[j];
          const dist = n1.position.distanceTo(n2.position);
          if (dist < 3) { // threshold for "close"
            const points = [n1.position.clone(), n2.position.clone()];
            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            const line = new THREE.Line(geometry, lineMaterial.clone());
            // Flicker effect
            line.material.opacity = 0.1 + Math.random() * 0.3;
            scene.add(line);
            lightningLines.push(line);
          }
        }
      }

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
  }, []);

  return <div className="absolute inset-0" ref={mountRef}></div>;
}
