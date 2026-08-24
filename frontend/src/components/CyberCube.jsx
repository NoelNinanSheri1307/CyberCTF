import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function CyberCube({ color = "#39ff14" }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;

    // Scene
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

    // Rubik's Cube (3x3x3 small cubes)
    const cubeGroup = new THREE.Group();
    const cubeSize = 1.2;

    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
          const geometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
          const material = new THREE.MeshBasicMaterial({
            color,
            wireframe: true,
            transparent: true,
            opacity: 0.85,
          });
          const smallCube = new THREE.Mesh(geometry, material);
          smallCube.position.set(x, y, z);
          cubeGroup.add(smallCube);
        }
      }
    }

    scene.add(cubeGroup);
    camera.position.z = 5;

    // Animate: rotate whole cube + spin random layers
    let frame = 0;
    const animate = () => {
      requestAnimationFrame(animate);

      cubeGroup.rotation.x += 0.002;
      cubeGroup.rotation.y += 0.003;

      frame++;
      if (frame % 200 === 0) {
        const axis = Math.random() > 0.5 ? "x" : "y";
        const layer = Math.floor(Math.random() * 3) - 1;
        cubeGroup.children.forEach((cube) => {
          if (Math.round(cube.position[axis]) === layer) {
            cube.rotation[axis] += Math.PI / 2;
          }
        });
      }

      renderer.render(scene, camera);
    };
    animate();

    // Resize
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
    <div className="absolute left-[-80px] md:left-[-160px] top-1/2 -translate-y-1/2 w-full h-full" ref={mountRef} />
  );
}
