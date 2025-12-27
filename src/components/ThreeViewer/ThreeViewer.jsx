import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export default function ThreeViewer() {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#050505");

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.2, 3);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);
    mountRef.current.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 0.6));

    const keyLight = new THREE.DirectionalLight(0xff88ff, 1.2);
    keyLight.position.set(2, 4, 2);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x66ccff, 0.8);
    rimLight.position.set(-2, 2, -2);
    scene.add(rimLight);

    const loader = new GLTFLoader();
    let model = null;

    loader.load("/models/jellyfish.glb", (gltf) => {
      model = gltf.scene;
      model.scale.set(1.6, 1.6, 1.6);
      model.position.y = -0.5;
      scene.add(model);
    });

    const onViewerCommand = (e) => {
        if (!model) return;

        const { type, value } = e.detail;

        if (type === "rotateY") {
            model.rotation.y += value;
        }

        if (type === "scale") {
            model.scale.multiplyScalar(value);
        }
    };
    window.addEventListener("viewer-command", onViewerCommand);


    const clock = new THREE.Clock();
    const animate = () => {
      requestAnimationFrame(animate);
      if (model) {
        const t = clock.getElapsedTime();
        model.rotation.y += 0.002;
        model.position.y = -0.5 + Math.sin(t) * 0.05;
      }
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("viewer-command", onViewerCommand);
      renderer.dispose();
      mountRef.current.innerHTML = "";
    };
  }, []);

  return <div ref={mountRef} style={{ width: "100%", height: "100%" }} />;
}