"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Globe, Users, Zap, Leaf } from "lucide-react";
import { mockGlobalUsage, type CountryUsage, type UsageScore } from "@/data/mockGlobalUsage";

interface Globe3DProps {
  className?: string;
}

// Convert lat/lng to Cartesian coordinates on a sphere
function latLngToXYZ(lat: number, lng: number, radius: number) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -radius * Math.sin(phi) * Math.cos(theta);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

function scoreToColor(score: UsageScore) {
  switch (score) {
    case 5:return new THREE.Color("#22c55e"); // green
    case 4:return new THREE.Color("#84cc16"); // yellow-green
    case 3:return new THREE.Color("#f59e0b"); // orange
    case 2:return new THREE.Color("#fb923c"); // orange-red
    case 1:default:return new THREE.Color("#ef4444"); // red
  }
}

function Dots({ data, pulseIndex }: {data: CountryUsage[];pulseIndex: number | null;}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.01; // match Earth's rotation speed
    }
  });

  return (
    <group ref={groupRef}>
      {data.map((pt, i) => {
        const pos = latLngToXYZ(pt.lat, pt.lng, 1.25);
        const baseColor = scoreToColor(pt.score);
        const isPulsing = pulseIndex === i;
        const scale = isPulsing ? 1.8 : 1;
        const emissive = baseColor.clone();
        const intensity = isPulsing ? 1.2 : 0.3;
        emissive.multiplyScalar(intensity);
        const size = THREE.MathUtils.clamp(0.02 + Math.log10(1 + pt.people) * 0.01, 0.02, 0.08);
        return (
          <mesh key={pt.id} position={pos} scale={[size * scale, size * scale, size * scale]}>
            <sphereGeometry args={[1, 16, 16]} />
            <meshStandardMaterial color={baseColor} emissive={emissive} emissiveIntensity={1.4} toneMapped={true} />
          </mesh>);

      })}
    </group>);

}

// Replace wireframe with textured Earth + cloud layer
function Earth() {
  const EARTH_DAY = process.env.NEXT_PUBLIC_EARTH_DAY_URL ||
  "https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg";
  const EARTH_NORMAL = process.env.NEXT_PUBLIC_EARTH_NORMAL_URL ||
  "https://threejs.org/examples/textures/planets/earth_normal_2048.jpg";
  const EARTH_CLOUDS = process.env.NEXT_PUBLIC_EARTH_CLOUDS_URL ||
  "https://threejs.org/examples/textures/planets/earth_clouds_1024.png";

  // If no day texture provided, fall back to wireframe without attempting to load any textures (prevents runtime errors)
  if (!EARTH_DAY) {
    const wireMat = useMemo(
      () => new THREE.MeshBasicMaterial({ color: "#00ffff", wireframe: true, transparent: true, opacity: 0.15 }),
      []
    );
    return (
      <mesh>
        <sphereGeometry args={[1.2, 48, 48]} />
        <primitive object={wireMat} attach="material" />
      </mesh>);

  }

  // Safe placeholders (1x1 transparent PNG) so hooks are stable even if clouds URL is missing
  const TRANSPARENT_PNG =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+Xf9cAAAAASUVORK5CYII=";

  // Always call hooks with valid URLs
  const mapTex = useTexture(EARTH_DAY);
  const normalTex = useTexture(EARTH_NORMAL);
  const cloudsTex = useTexture(EARTH_CLOUDS || TRANSPARENT_PNG);

  const earthRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (earthRef.current) earthRef.current.rotation.y += delta * 0.01;
    if (cloudsRef.current) cloudsRef.current.rotation.y += delta * 0.012;
  });

  return (
    <group>
      <mesh ref={earthRef}>
        <sphereGeometry args={[1.2, 96, 96]} />
        <meshStandardMaterial map={mapTex} normalMap={normalTex} metalness={0.2} roughness={0.7} />
      </mesh>

      <mesh ref={cloudsRef}>
        <sphereGeometry args={[1.22, 96, 96]} />
        <meshStandardMaterial map={cloudsTex as THREE.Texture} transparent opacity={0.45} depthWrite={false} />
      </mesh>

      {/* Soft atmosphere glow */}
      <mesh>
        <sphereGeometry args={[1.24, 64, 64]} />
        <meshBasicMaterial color="#00ffff" transparent opacity={0.08} />
      </mesh>
    </group>);

}

export default function Globe3D({ className = "" }: Globe3DProps) {
  const [pulseIndex, setPulseIndex] = useState<number | null>(null);
  const data = mockGlobalUsage;

  // Live pulse animation every 3 seconds
  useEffect(() => {
    const tick = () => {
      const i = Math.floor(Math.random() * data.length);
      setPulseIndex(i);
    };
    tick();
    const id = setInterval(tick, 3000);
    return () => clearInterval(id);
  }, [data.length]);

  // Stats derived from data
  const stats = useMemo(() => {
    const totalUsers = data.reduce((sum, d) => sum + d.people, 0);
    const efficient = data.filter((d) => d.score >= 4).length;
    const poor = data.filter((d) => d.score <= 2).length;
    const activeNow = pulseIndex != null ? data[pulseIndex].people : 0; // representative activity
    const energySaved = Math.round((efficient * 2.5 + totalUsers / 1000) * 10) / 10; // mock formula
    return { totalUsers, efficient, poor, activeNow, energySaved };
  }, [data, pulseIndex]);

  return (
    <Card className={`glass-strong rounded-2xl p-6 ${className}`}>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-full glass neon-glow-aqua">
          <Globe className="w-6 h-6 neon-text-aqua" />
        </div>
        <div>
          <h3 className="text-xl font-bold neon-text-aqua">Global Activity</h3>
          <p className="text-muted-foreground text-sm">Live prompt efficiency across countries</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 3D Globe */}
        <div className="relative w-full aspect-square max-w-[520px] mx-auto glass rounded-xl">
          <Canvas camera={{ position: [0, 0, 3.2], fov: 50 }} className="!w-[444px] !h-[439px]">
            <ambientLight intensity={1.0} />
            <directionalLight position={[3, 3, 5]} intensity={1.3} />
            <directionalLight position={[-3, -2, -4]} intensity={0.6} />
            <Earth />
            <Dots data={data} pulseIndex={pulseIndex} />
            <OrbitControls enablePan={false} enableZoom={true} zoomSpeed={0.4} rotateSpeed={0.5} />
          </Canvas>

          {/* Legend */}
          <div className="absolute bottom-4 left-4 space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#ef4444]" />
              <span className="text-red-400">Bad</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#fb923c]" />
              <span className="text-orange-300">Poor</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#f59e0b]" />
              <span className="text-amber-300">Average</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#84cc16]" />
              <span className="text-lime-300">Good</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#22c55e] pulse-slow" />
              <span className="text-green-400">Great</span>
            </div>
          </div>
        </div>

        {/* Stats Panel */}
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass rounded-lg p-4">

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 neon-text-aqua" />
                <span className="font-medium">Total People</span>
              </div>
              <Badge variant="outline" className="neon-text-aqua border-primary/30">
                {stats.totalUsers.toLocaleString()}
              </Badge>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="glass rounded-lg p-4">

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                <span className="font-medium">Active Now (pulse)</span>
              </div>
              <Badge variant="outline" className="text-yellow-400 border-yellow-400/30">
                {stats.activeNow.toLocaleString()}
              </Badge>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="glass rounded-lg p-4">

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Leaf className="w-5 h-5 neon-text-green" />
                <span className="font-medium">High Quality Spots</span>
              </div>
              <Badge variant="outline" className="neon-text-green border-green-400/30">
                {stats.efficient}
              </Badge>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="glass rounded-lg p-4 neon-glow-green">

            <div>
              <div className="text-sm text-muted-foreground mb-1">Energy Saved (mock)</div>
              <div className="text-2xl font-bold neon-text-green">{stats.energySaved} kWh</div>
              <div className="text-xs text-green-400 mt-1">≈ {Math.round(stats.energySaved * 0.5 * 10) / 10}kg CO₂ prevented</div>
            </div>
          </motion.div>

          {/* Live Activity Feed */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="glass rounded-lg p-4">

            <h4 className="font-medium mb-3 text-sm">Live Activity</h4>
            <div className="space-y-2 text-xs">
              {[...(pulseIndex != null ? [mockGlobalUsage[pulseIndex]] : []), ...mockGlobalUsage].
              slice(0, 3).
              map((pt, idx) =>
              <motion.div
                key={`${pt.id}-${idx}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + idx * 0.1 }}
                className="flex items-center gap-2">

                    <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: scoreToColor(pt.score).getStyle() as string }} />

                    <span className="text-muted-foreground">
                      {pt.country} • {pt.people.toLocaleString()} people • score {pt.score}
                    </span>
                  </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </Card>);

}