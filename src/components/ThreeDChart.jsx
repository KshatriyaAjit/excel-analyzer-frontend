import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default function ThreeDChart({ data }) {
  const mountRef = useRef(null);
  const tooltipRef = useRef(null);

  useEffect(() => {
    if (!data || data.length === 0 || !mountRef.current) return;

    // Clean previous chart
    while (mountRef.current.firstChild) {
      mountRef.current.removeChild(mountRef.current.firstChild);
    }

    const width = mountRef.current.clientWidth;
    const height = 500;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf9fafb);

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(10, 10, 20);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = true;
    controls.enableRotate = true;
    controls.enablePan = true;
    controls.minDistance = 5;
    controls.maxDistance = 100;
    controls.target.set(5, 5, 0);
    controls.update();

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(10, 10, 10);
    scene.add(light, new THREE.AmbientLight(0xffffff, 0.4));

    scene.add(new THREE.AxesHelper(5), new THREE.GridHelper(20, 20));

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const cubes = [];

    data.forEach((d, i) => {
      const barHeight = d.y;
      const geometry = new THREE.BoxGeometry(0.8, barHeight, 0.8);
      const material = new THREE.MeshStandardMaterial({ color: "#6366f1" });
      const cube = new THREE.Mesh(geometry, material);
      cube.position.set(i * 1.2, barHeight / 2, 0);
      cube.userData = { ...d }; // attach data
      scene.add(cube);
      cubes.push(cube);
    });

    const tooltip = document.createElement("div");
    tooltip.style.position = "absolute";
    tooltip.style.padding = "6px 10px";
    tooltip.style.background = "#000000cc";
    tooltip.style.color = "#fff";
    tooltip.style.fontSize = "12px";
    tooltip.style.borderRadius = "4px";
    tooltip.style.pointerEvents = "none";
    tooltip.style.display = "none";
    tooltip.style.zIndex = "10";
    tooltipRef.current = tooltip;
    mountRef.current.appendChild(tooltip);

    const onMouseMove = (event) => {
      const rect = mountRef.current.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(cubes);

      if (intersects.length > 0) {
        const { x, y } = intersects[0].object.userData;
        tooltip.style.display = "block";
        tooltip.style.left = `${event.clientX + 10}px`;
        tooltip.style.top = `${event.clientY}px`;
        tooltip.innerHTML = `<strong>X:</strong> ${x}<br/><strong>Y:</strong> ${y}`;
      } else {
        tooltip.style.display = "none";
      }
    };

    mountRef.current.addEventListener("mousemove", onMouseMove);

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      controls.dispose();
      if (mountRef.current) {
        mountRef.current.removeEventListener("mousemove", onMouseMove);
        if (tooltipRef.current && tooltipRef.current.parentNode) {
          tooltipRef.current.parentNode.removeChild(tooltipRef.current);
        }
        if (
          renderer.domElement &&
          renderer.domElement.parentNode === mountRef.current
        ) {
          mountRef.current.removeChild(renderer.domElement);
        }
      }
    };
  }, [data]);

  return (
    <div
      ref={mountRef}
      className="w-full"
      style={{ height: "500px", cursor: "grab", position: "relative" }} // ⬅️ Position required for tooltip
    />
  );
}
