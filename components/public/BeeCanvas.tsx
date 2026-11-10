"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

const BEE_GLB_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20261017_132918_e8364d8f-7df2-4788-a725-dec28ec19af8.glb";
const WING_TEX_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20261017_132814_3a56ac14-47d8-4e49-a163-94234dea5639.png";

const KEYFRAMES_DESKTOP = [
  { x: -0.03, y: -0.12, s: 1.0, yaw: 150, pitch: 6, roll: -4 },
  { x: -0.3, y: -0.04, s: 1.0, yaw: 125, pitch: 10, roll: 6 },
  { x: 0.22, y: -0.3, s: 1.0, yaw: 40, pitch: -6, roll: -8 },
  { x: -0.22, y: 0.02, s: 0.96, yaw: 160, pitch: 8, roll: 4 },
  { x: 0.02, y: -0.08, s: 0.92, yaw: 105, pitch: 4, roll: 0 },
];

const KEYFRAMES_MOBILE = [
  { x: 0.05, y: -0.02, s: 0.75, yaw: 150, pitch: 6, roll: -4 },
  { x: 0.1, y: 0.12, s: 0.8, yaw: 125, pitch: 10, roll: 6 },
  { x: 0.15, y: -0.2, s: 0.75, yaw: 40, pitch: -6, roll: -8 },
  { x: 0.25, y: 0.2, s: 0.72, yaw: 160, pitch: 8, roll: 4 },
  { x: 0, y: 0.1, s: 0.7, yaw: 105, pitch: 4, roll: 0 },
];

function ease(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function lerpAngle(a: number, b: number, t: number) {
  const d = ((b - a + 540) % 360) - 180;
  return a + d * t;
}

function targetAt(p: number) {
  if (!isFinite(p)) p = 0;
  const K = typeof window !== "undefined" && window.innerWidth < 760 ? KEYFRAMES_MOBILE : KEYFRAMES_DESKTOP;
  p = Math.max(0, Math.min(K.length - 1, p));
  const i = Math.min(K.length - 2, Math.floor(p));
  const f = p - i;
  const t = ease(Math.min(Math.max((f - 0.12) / 0.76, 0), 1));
  const dive = Math.sin(t * Math.PI) * -0.22;
  const k1 = K[i]!;
  const k2 = K[i + 1]!;

  return {
    x: THREE.MathUtils.lerp(k1.x, k2.x, t),
    y: THREE.MathUtils.lerp(k1.y, k2.y, t) + dive,
    s: THREE.MathUtils.lerp(k1.s, k2.s, t) * (1 + Math.sin(t * Math.PI) * 0.12),
    yaw: lerpAngle(k1.yaw, k2.yaw, t),
    pitch: THREE.MathUtils.lerp(k1.pitch, k2.pitch, t),
    roll: THREE.MathUtils.lerp(k1.roll, k2.roll, t),
    moving: Math.sin(t * Math.PI),
  };
}

export default function BeeCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let animId: number;
    let isDisposed = false;

    // 1. Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight, false);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    // 2. Scene & Environment
    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    pmrem.compileEquirectangularShader();
    const roomEnv = new RoomEnvironment();
    scene.environment = pmrem.fromScene(roomEnv, 0.04).texture;
    roomEnv.dispose();
    pmrem.dispose();

    // 3. Camera & Lights
    const camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 10);

    const hemiLight = new THREE.HemisphereLight(0xfff8e7, 0x5b3bd1, 1.4);
    scene.add(hemiLight);

    const dirLight1 = new THREE.DirectionalLight(0xfff1d6, 2.6);
    dirLight1.position.set(3, 5, 6);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xffd54f, 2.0);
    dirLight2.position.set(-5, 2, -4);
    scene.add(dirLight2);

    // 4. Bee hierarchy
    const flight = new THREE.Group();
    scene.add(flight);

    const beeRoot = new THREE.Group();
    flight.add(beeRoot);

    const holder = new THREE.Group();
    beeRoot.add(holder);

    // 5. Wings setup
    const wingCanvas = document.createElement("canvas");
    wingCanvas.width = 1024;
    wingCanvas.height = 576;
    const wingCtx = wingCanvas.getContext("2d");
    const wingTexture = new THREE.CanvasTexture(wingCanvas);
    wingTexture.colorSpace = THREE.SRGBColorSpace;

    const wingImg = new Image();
    wingImg.crossOrigin = "anonymous";
    wingImg.onload = () => {
      if (!wingCtx) return;
      wingCtx.drawImage(wingImg, 0, 0, 1024, 576);
      const imgData = wingCtx.getImageData(0, 0, 1024, 576);
      const data = imgData.data;
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i]!;
        const g = data[i + 1]!;
        const b = data[i + 2]!;
        const l = (r * 0.3 + g * 0.59 + b * 0.11) / 255;
        const alpha = Math.min(Math.max((l - 0.035) * 4.2, 0), 1) * 255;
        data[i] = Math.min(255, r * 1.5 + 40);
        data[i + 1] = Math.min(255, g * 1.5 + 40);
        data[i + 2] = Math.min(255, b * 1.5 + 30);
        data[i + 3] = alpha;
      }
      wingCtx.putImageData(imgData, 0, 0);
      wingTexture.needsUpdate = true;
    };
    wingImg.src = WING_TEX_URL;

    function createWingGeometry(span: number) {
      const geom = new THREE.PlaneGeometry(span, (span * 9) / 16);
      geom.translate(span / 2 - span * 0.03, 0, 0);
      geom.rotateX(-Math.PI / 2);
      geom.rotateY(-Math.PI / 2);
      return geom;
    }

    const forewingGeom = createWingGeometry(0.72);
    const hindwingGeom = createWingGeometry(0.52);

    const matMain = new THREE.MeshBasicMaterial({
      map: wingTexture,
      transparent: true,
      opacity: 0.95,
      side: THREE.DoubleSide,
      depthWrite: false,
      color: 0xffffff,
    });

    const matBlur = new THREE.MeshBasicMaterial({
      map: wingTexture,
      transparent: true,
      opacity: 0.3,
      side: THREE.DoubleSide,
      depthWrite: false,
      color: 0xffffff,
    });

    const flapWings: Array<{ group: THREE.Group; phase: number }> = [];

    // 6. Load Bee GLB
    let isGlbLoaded = false;
    const loader = new GLTFLoader();
    loader.load(
      BEE_GLB_URL,
      (gltf) => {
        if (isDisposed) return;
        const model = gltf.scene;
        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            child.frustumCulled = false;
          }
        });

        holder.add(model);
        model.rotation.set(0, Math.PI / 2, 0);

        const box = new THREE.Box3().setFromObject(holder);
        const size = new THREE.Vector3();
        box.getSize(size);
        const maxDim = Math.max(size.x, size.y, size.z);
        model.scale.multiplyScalar(1 / maxDim);

        box.setFromObject(holder);
        const center = new THREE.Vector3();
        box.getCenter(center);
        model.position.sub(center);

        box.setFromObject(holder);
        const anchorX = box.min.x + (box.max.x - box.min.x) * 0.66;
        const anchorY = box.max.y * 0.86;
        const anchorZ = (box.max.z - box.min.z) * 0.05;

        const rightSide = new THREE.Group();
        rightSide.position.set(anchorX, anchorY, anchorZ);
        beeRoot.add(rightSide);

        const leftSide = new THREE.Group();
        leftSide.position.set(anchorX, anchorY, -anchorZ);
        leftSide.scale.set(1, 1, -1);
        beeRoot.add(leftSide);

        const wingDefs = [
          { geom: forewingGeom, span: 0.72, sweep: -0.42, phase: 0, lift: 0.02 },
          { geom: hindwingGeom, span: 0.52, sweep: -0.95, phase: -0.5, lift: -0.01 },
        ];

        const copies = [
          { phaseOffset: 0, mat: matMain },
          { phaseOffset: 0.55, mat: matBlur },
          { phaseOffset: -0.55, mat: matBlur },
        ];

        [rightSide, leftSide].forEach((sideGroup) => {
          wingDefs.forEach((wDef) => {
            const sweepGroup = new THREE.Group();
            sweepGroup.rotation.y = wDef.sweep;
            sweepGroup.position.y = wDef.lift;
            sideGroup.add(sweepGroup);

            copies.forEach((copy) => {
              const flapGroup = new THREE.Group();
              const mesh = new THREE.Mesh(wDef.geom, copy.mat);
              mesh.frustumCulled = false;
              flapGroup.add(mesh);
              sweepGroup.add(flapGroup);

              flapWings.push({
                group: flapGroup,
                phase: wDef.phase + copy.phaseOffset,
              });
            });
          });
        });

        isGlbLoaded = true;
        canvas.style.opacity = "1";
      },
      undefined,
      (err) => {
        console.error("Bee GLB load error:", err);
      }
    );

    // 7. Mouse & Scroll interaction
    const cur = { ...targetAt(window.scrollY / window.innerHeight || 0) };
    const mouse = { x: 0, y: 0, sx: 0, sy: 0 };

    const handlePointerMove = (e: PointerEvent) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("resize", handleResize);

    const clock = new THREE.Clock();

    const tick = () => {
      if (isDisposed) return;
      animId = requestAnimationFrame(tick);

      const dt = Math.min(clock.getDelta(), 0.05);
      const t = clock.getElapsedTime();

      const scrollP = window.scrollY / window.innerHeight;
      const target = targetAt(scrollP);

      const k = 1 - Math.exp(-dt * 3.2);
      const kYaw = 1 - Math.exp(-dt * 2.6);

      const oldX = cur.x;
      const oldY = cur.y;

      cur.x += (target.x - cur.x) * k;
      cur.y += (target.y - cur.y) * k;
      cur.s += (target.s - cur.s) * k;
      cur.pitch += (target.pitch - cur.pitch) * k;
      cur.roll += (target.roll - cur.roll) * k;
      cur.yaw = lerpAngle(cur.yaw, target.yaw, kYaw);
      cur.moving += (target.moving - cur.moving) * k;

      const vx = (cur.x - oldX) / dt;
      const vy = (cur.y - oldY) / dt;

      const kMouse = 1 - Math.exp(-dt * 2);
      mouse.sx += (mouse.x - mouse.sx) * kMouse;
      mouse.sy += (mouse.y - mouse.sy) * kMouse;

      const fovRad = THREE.MathUtils.degToRad(camera.fov);
      const halfH = Math.tan(fovRad / 2) * camera.position.z;
      const halfW = halfH * camera.aspect;
      const hover = Math.sin(t * 2.1) * 0.045 + Math.sin(t * 3.7) * 0.015;

      flight.position.set(
        cur.x * halfW + Math.sin(t * 1.3) * 0.04 + mouse.sx * 0.12,
        cur.y * halfH + hover * halfH * 0.5 + mouse.sy * 0.08,
        Math.sin(t * 0.9) * 0.15
      );

      const scale = halfH * 2 * 0.3 * cur.s;
      flight.scale.set(scale, scale, scale);

      flight.rotation.set(0, THREE.MathUtils.degToRad(-(cur.yaw + mouse.sx * 12)), 0);

      const pitchDeg =
        cur.pitch - Math.min(Math.max(vy * 22, -28), 28) + Math.sin(t * 2.1 + 1) * 3 + mouse.sy * 6;
      const rollDeg = cur.roll + Math.min(Math.max(vx * 18, -30), 30) + Math.sin(t * 1.7) * 4;

      beeRoot.rotation.set(
        THREE.MathUtils.degToRad(rollDeg),
        0,
        THREE.MathUtils.degToRad(pitchDeg),
        "YZX"
      );

      // Wing flap
      const freq = 2 * Math.PI * (17 + cur.moving * 5);
      for (let i = 0; i < flapWings.length; i++) {
        const fw = flapWings[i]!;
        const a = Math.sin(t * freq + fw.phase);
        fw.group.rotation.x = -0.25 + a * 0.95;
        fw.group.rotation.y = a * 0.18;
      }

      if (isGlbLoaded) {
        renderer.render(scene, camera);
      }
    };

    animId = requestAnimationFrame(tick);

    return () => {
      isDisposed = true;
      cancelAnimationFrame(animId);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      wingTexture.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-20 w-full h-full pointer-events-none opacity-0 transition-opacity duration-1000"
      style={{ willChange: "transform, opacity" }}
    />
  );
}

