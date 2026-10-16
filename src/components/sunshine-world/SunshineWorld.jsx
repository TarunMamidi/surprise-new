
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Cloud,
  ContactShadows,
  Environment,
  Float,
  Html,
  Sparkles,
} from "@react-three/drei";
import * as THREE from "three";
import "./SunshineWorld.css";

const ISLANDS = [
  { id: "home", emoji: "☀️", label: "Home" },
  { id: "food", emoji: "🥟", label: "Food" },
  { id: "memories", emoji: "📸", label: "Memories" },
  { id: "hideaway", emoji: "🌻", label: "Hideaway" },
  { id: "secret", emoji: "💌", label: "Secret" },
];

const DESTINATIONS = {
  home: { camera: [0, 8, 14], look: [0, 0.5, 0] },
  food: { camera: [-7, 5, 7], look: [-5, 0.5, 2] },
  memories: { camera: [7, 5, 7], look: [5, 0.5, 2] },
  hideaway: { camera: [-7, 5, -6], look: [-5, 0.5, -3.5] },
  secret: { camera: [7, 5, -6], look: [5, 0.5, -3.5] },
};

function Material({ color, roughness = 0.85, ...props }) {
  return (
    <meshStandardMaterial
      color={color}
      roughness={roughness}
      {...props}
    />
  );
}

function Terrain({ radius = 2.1, seed = 1 }) {
  const geometry = useMemo(() => {
    const geo = new THREE.CylinderGeometry(
      radius * 0.95,
      radius * 0.7,
      0.5,
      40,
      5
    );

    const p = geo.attributes.position;

    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i);
      const y = p.getY(i);
      const z = p.getZ(i);
      const angle = Math.atan2(z, x);

      const wave =
        Math.sin(angle * 3 + seed) * 0.055 +
        Math.sin(angle * 5 + seed * 2) * 0.025;

      if (Math.abs(y) > 0.12) {
        p.setX(i, x * (1 + wave));
        p.setZ(i, z * (1 + wave));
      }
    }

    geo.computeVertexNormals();
    return geo;
  }, [radius, seed]);

  useEffect(() => () => geometry.dispose(), [geometry]);

  const grass = useMemo(() => {
    return Array.from({ length: 38 }, (_, i) => {
      const random = (n) => {
        const x = Math.sin(n * 127.1 + seed * 311.7) * 43758.5453;
        return x - Math.floor(x);
      };

      const angle = random(i + 1) * Math.PI * 2;
      const r = Math.sqrt(random(i + 50)) * radius * 0.83;

      return {
        x: Math.cos(angle) * r,
        z: Math.sin(angle) * r,
        size: 0.09 + random(i + 80) * 0.17,
        color: ["#92bd7c", "#a4ca8a", "#7eac6e"][i % 3],
      };
    });
  }, [radius, seed]);

  return (
    <group>
      <mesh position={[0, -0.24, 0]} castShadow receiveShadow>
        <cylinderGeometry
          args={[radius * 0.9, radius * 0.67, 0.48, 40, 3]}
        />
        <Material color="#76503c" roughness={1} flatShading />
      </mesh>

      <mesh position={[0, 0.02, 0]} castShadow receiveShadow>
        <cylinderGeometry
          args={[radius * 0.97, radius * 0.82, 0.2, 40]}
        />
        <Material color="#9b7650" roughness={1} />
      </mesh>

      <mesh
        geometry={geometry}
        position={[0, 0.15, 0]}
        castShadow
        receiveShadow
      >
        <Material color="#8ebd79" roughness={1} />
      </mesh>

      {grass.map((patch, i) => (
        <mesh
          key={i}
          position={[patch.x, 0.405, patch.z]}
          rotation={[-Math.PI / 2, 0, i * 0.7]}
          scale={[patch.size * 1.7, patch.size, 1]}
        >
          <circleGeometry args={[1, 12]} />
          <Material
            color={patch.color}
            transparent
            opacity={0.7}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}

function Island({ position, radius = 2.1, seed = 1, children, onClick }) {
  return (
    <group position={position} onClick={onClick}>
      <Terrain radius={radius} seed={seed} />
      {children}
    </group>
  );
}

function Tree({ position = [0, 0.4, 0], scale = 0.7, golden = false }) {
  const canopy = useRef();

  const leaves = useMemo(
    () =>
      Array.from({ length: 27 }, (_, i) => {
        const a = i * 2.399;
        const r = 0.28 + (i % 5) * 0.11;

        return {
          position: [
            Math.cos(a) * r,
            1.6 + (i % 6) * 0.12,
            Math.sin(a) * r,
          ],
          size: 0.34 + (i % 4) * 0.045,
          color: golden
            ? ["#c1b96c", "#d5c878", "#a8b96b", "#e1d58b"][i % 4]
            : ["#628d58", "#7ea563", "#91ad6b", "#6b965e"][i % 4],
        };
      }),
    [golden]
  );

  useFrame(({ clock }) => {
    if (canopy.current) {
      canopy.current.rotation.z =
        Math.sin(clock.elapsedTime * 0.35) * 0.018;
    }
  });

  return (
    <group position={position} scale={scale}>
      {Array.from({ length: 5 }, (_, i) => {
        const a = (i / 5) * Math.PI * 2;
        return (
          <mesh
            key={i}
            position={[Math.cos(a) * 0.18, 0.1, Math.sin(a) * 0.18]}
            rotation={[0, 0, Math.cos(a) * 0.35]}
            castShadow
          >
            <cylinderGeometry args={[0.035, 0.1, 0.55, 8]} />
            <Material color="#805438" />
          </mesh>
        );
      })}

      <mesh position={[0, 0.9, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.21, 1.7, 12]} />
        <Material color="#895b3d" />
      </mesh>

      {[
        [-0.3, 1.4, -0.5],
        [0.3, 1.5, 0.5],
        [-0.12, 1.75, -0.2],
        [0.15, 1.6, 0.3],
      ].map((b, i) => (
        <mesh
          key={i}
          position={[b[0] / 2, b[1], b[2] / 2]}
          rotation={[0, 0, b[0]]}
          castShadow
        >
          <cylinderGeometry args={[0.04, 0.08, 0.75, 8]} />
          <Material color="#895b3d" />
        </mesh>
      ))}

      <group ref={canopy}>
        {leaves.map((leaf, i) => (
          <mesh
            key={i}
            position={leaf.position}
            scale={[leaf.size * 1.1, leaf.size, leaf.size * 0.9]}
            castShadow
          >
            <icosahedronGeometry args={[1, 2]} />
            <Material color={leaf.color} roughness={0.95} flatShading />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function Sunflower({ position, scale = 1 }) {
  const bloom = useRef();

  useFrame(({ clock }) => {
    if (bloom.current) {
      bloom.current.rotation.z =
        Math.sin(clock.elapsedTime * 0.65 + position[0]) * 0.04;
    }
  });

  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.018, 0.03, 0.58, 8]} />
        <Material color="#47764a" />
      </mesh>

      {[-1, 1].map((side) => (
        <mesh
          key={side}
          position={[side * 0.075, 0.32, 0]}
          rotation={[0, 0, side * 0.55]}
          scale={[0.12, 0.05, 1]}
        >
          <circleGeometry args={[1, 16]} />
          <Material color="#659956" side={THREE.DoubleSide} />
        </mesh>
      ))}

      <group ref={bloom} position={[0, 0.61, 0]}>
        {Array.from({ length: 14 }, (_, i) => {
          const a = (i / 14) * Math.PI * 2;
          return (
            <mesh
              key={i}
              position={[Math.cos(a) * 0.12, Math.sin(a) * 0.12, 0]}
              rotation={[0, 0, a]}
              scale={[0.055, 0.11, 1]}
            >
              <circleGeometry args={[1, 14]} />
              <Material
                color={i % 2 ? "#ffce48" : "#f5b92f"}
                side={THREE.DoubleSide}
              />
            </mesh>
          );
        })}

        <mesh position={[0, 0, 0.035]} scale={0.09}>
          <circleGeometry args={[1, 20]} />
          <Material color="#624024" />
        </mesh>
      </group>
    </group>
  );
}

function Butterfly({ position, color = "#edb5ce" }) {
  const wings = useRef();

  useFrame(({ clock }) => {
    if (wings.current) {
      wings.current.rotation.y = Math.sin(clock.elapsedTime * 8) * 0.5;
    }
  });

  return (
    <group position={position}>
      <group ref={wings}>
        {[-1, 1].map((side) => (
          <mesh
            key={side}
            position={[side * 0.08, 0, 0]}
            rotation={[0, side * 0.2, side * 0.2]}
            scale={[0.09, 0.13, 0.025]}
          >
            <sphereGeometry args={[1, 12, 12]} />
            <meshStandardMaterial
              color={color}
              roughness={0.55}
              side={THREE.DoubleSide}
            />
          </mesh>
        ))}
      </group>
      <mesh scale={[0.018, 0.12, 0.018]}>
        <sphereGeometry args={[1, 8, 8]} />
        <Material color="#514439" />
      </mesh>
    </group>
  );
}




/* FOOD ISLAND: dumplings, pho, takeaway coffee and café seating */

function DumplingPlate({ position }) {
  return (
    <group position={position}>
      <mesh>
        <cylinderGeometry args={[0.47, 0.42, 0.065, 32]} />
        <Material color="#fff7e8" roughness={0.3} />
      </mesh>

      {[
        [-0.25, 0, -0.08],
        [-0.1, 0, -0.2],
        [0.1, 0, -0.17],
        [0.27, 0, -0.02],
        [-0.08, 0, 0.1],
        [0.13, 0, 0.12],
      ].map((p, i) => (
        <group key={i} position={[p[0], 0.09, p[2]]}>
          <mesh scale={[0.15, 0.1, 0.105]} castShadow>
            <sphereGeometry args={[1, 20, 14]} />
            <Material color={i % 2 ? "#e5c698" : "#f0d8ad"} />
          </mesh>
          {Array.from({ length: 4 }, (_, j) => (
            <mesh
              key={j}
              position={[(j - 1.5) * 0.035, 0.07, 0]}
              rotation={[0, 0, (j - 1.5) * 0.12]}
            >
              <cylinderGeometry args={[0.006, 0.01, 0.04, 5]} />
              <Material color="#c9a77a" />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

function PhoBowl({ position }) {
  return (
    <group position={position}>
      <mesh castShadow>
        <cylinderGeometry args={[0.34, 0.24, 0.25, 32]} />
        <Material color="#f6efdd" roughness={0.24} />
      </mesh>

      <mesh position={[0, 0.13, 0]}>
        <torusGeometry args={[0.31, 0.022, 8, 32]} />
        <Material color="#d2b78a" />
      </mesh>

      <mesh position={[0, 0.09, 0]}>
        <cylinderGeometry args={[0.29, 0.29, 0.02, 32]} />
        <Material color="#a56737" roughness={0.35} />
      </mesh>

      {Array.from({ length: 7 }, (_, i) => {
        const a = i * 2.4;
        const r = 0.13 + (i % 3) * 0.035;
        return (
          <mesh
            key={i}
            position={[Math.cos(a) * r, 0.12, Math.sin(a) * r]}
            rotation={[0, a, 0]}
          >
            <torusGeometry args={[0.04, 0.007, 5, 12]} />
            <Material color="#efd69c" />
          </mesh>
        );
      })}

      {Array.from({ length: 8 }, (_, i) => {
        const a = i * 2.4;
        return (
          <mesh
            key={i}
            position={[Math.cos(a) * 0.16, 0.13, Math.sin(a) * 0.16]}
            scale={[0.03, 0.012, 0.022]}
          >
            <sphereGeometry args={[1, 8, 8]} />
            <Material color={i % 2 ? "#5c8e4c" : "#a4b96a"} />
          </mesh>
        );
      })}

      <Sparkles
        count={8}
        position={[0, 0.38, 0]}
        scale={[0.35, 0.3, 0.35]}
        size={1.2}
        speed={0.12}
        color="#fff0d0"
      />
    </group>
  );
}

function PretCup({ position }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.14, 0]} castShadow>
        <cylinderGeometry args={[0.105, 0.08, 0.25, 20]} />
        <Material color="#fff8eb" roughness={0.3} />
      </mesh>

      <mesh position={[0, 0.13, 0]}>
        <cylinderGeometry args={[0.099, 0.085, 0.105, 20]} />
        <Material color="#b72f37" />
      </mesh>

      <mesh position={[0, 0.27, 0]}>
        <cylinderGeometry args={[0.11, 0.105, 0.035, 20]} />
        <Material color="#fffdf7" />
      </mesh>

      <mesh position={[0, 0.29, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.006, 12]} />
        <Material color="#a38d72" />
      </mesh>
    </group>
  );
}

function FoodIsland() {
  return (
    <group>
      {/* Tiny café */}
      <group position={[0, 0.38, -0.5]}>
        <mesh position={[0, 0.38, 0]} castShadow>
          <boxGeometry args={[1.35, 0.72, 0.95]} />
          <Material color="#f0dfbd" />
        </mesh>

        <mesh position={[0, 0.83, 0]} castShadow>
          <boxGeometry args={[1.52, 0.14, 1.08]} />
          <Material color="#c98266" />
        </mesh>

        {Array.from({ length: 6 }, (_, i) => (
          <mesh key={i} position={[-0.59 + i * 0.235, 0.74, 0.55]}>
            <boxGeometry args={[0.13, 0.17, 0.03]} />
            <Material color={i % 2 ? "#fff0d8" : "#d58d70"} />
          </mesh>
        ))}

        <mesh position={[0, 0.27, 0.49]}>
          <boxGeometry args={[1.12, 0.18, 0.13]} />
          <Material color="#916346" />
        </mesh>

        <mesh position={[0, 0.27, 0.59]}>
          <boxGeometry args={[1.16, 0.045, 0.17]} />
          <Material color="#dfbd8c" />
        </mesh>
      </group>

      {/* Shared favourite foods on a picnic table */}
      <group position={[0, 0.43, 0.72]}>
        <mesh position={[0, 0.08, 0]}>
          <cylinderGeometry args={[0.95, 0.87, 0.1, 32]} />
          <Material color="#b98a59" />
        </mesh>

        {[-0.5, 0.5].map((x) =>
          [-0.32, 0.32].map((z) => (
            <mesh key={`${x}-${z}`} position={[x, -0.14, z]}>
              <cylinderGeometry args={[0.035, 0.045, 0.42, 8]} />
              <Material color="#79533a" />
            </mesh>
          ))
        )}

        <DumplingPlate position={[-0.42, 0.14, 0]} />
        <PhoBowl position={[0.42, 0.16, -0.08]} />
        <PretCup position={[-0.08, 0.14, 0.48]} />
      </group>

      <Tree position={[1.25, 0.38, -0.95]} scale={0.5} />
      <Sunflower position={[-1.35, 0.4, -0.6]} scale={0.7} />
      <Sunflower position={[1.2, 0.4, 0.85]} scale={0.65} />
    </group>
  );
}

/* MEMORY ISLAND: Canary Wharf, Liverpool Street and Greenwich */

function Skyscraper({ position, height, width, color }) {
  return (
    <group position={position}>
      <mesh position={[0, height / 2, 0]} castShadow>
        <boxGeometry args={[width, height, width * 0.75]} />
        <Material color={color} roughness={0.38} metalness={0.16} />
      </mesh>

      {/* Rows of illuminated windows */}
      {Array.from(
        { length: Math.max(2, Math.floor(height / 0.16)) },
        (_, row) =>
          [-1, 0, 1].map((col) => (
            <mesh
              key={`${row}-${col}`}
              position={[
                col * width * 0.24,
                0.09 + row * 0.16,
                width * 0.381,
              ]}
            >
              <planeGeometry args={[width * 0.12, 0.07]} />
              <meshStandardMaterial
                color="#f7e8b1"
                emissive="#e7bd64"
                emissiveIntensity={0.25}
              />
            </mesh>
          ))
      )}
    </group>
  );
}

function MemoryIsland() {
  return (
    <group>
      {/* Canary Wharf skyline */}
      <group position={[-0.55, 0.4, -0.55]}>
        <Skyscraper
          position={[-0.65, 0, 0]}
          height={1.4}
          width={0.3}
          color="#91b6bd"
        />
        <Skyscraper
          position={[-0.2, 0, -0.1]}
          height={1.95}
          width={0.34}
          color="#a2c2c6"
        />
        <Skyscraper
          position={[0.28, 0, 0]}
          height={1.2}
          width={0.32}
          color="#7fa7b3"
        />
        <Skyscraper
          position={[0.65, 0, -0.08]}
          height={1.55}
          width={0.29}
          color="#b0c8c5"
        />
      </group>

      {/* Greenwich riverside */}
      <mesh
        position={[0.35, 0.41, 0.8]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <circleGeometry args={[0.8, 32]} />
        <Material color="#b4d6d8" roughness={0.25} />
      </mesh>

      {/* Riverbank path */}
      <mesh position={[0.2, 0.43, 0.85]} rotation={[0, 0.2, 0]}>
        <boxGeometry args={[1.4, 0.035, 0.16]} />
        <Material color="#e0c9a0" />
      </mesh>

      {/* Liverpool Street-inspired station entrance */}
      <group position={[0.65, 0.42, -0.05]}>
        <mesh position={[0, 0.3, 0]} castShadow>
          <boxGeometry args={[0.82, 0.5, 0.42]} />
          <Material color="#d9b78b" />
        </mesh>

        <mesh position={[0, 0.59, 0]}>
          <boxGeometry args={[0.92, 0.1, 0.5]} />
          <Material color="#72574a" />
        </mesh>

        {[-0.25, 0, 0.25].map((x) => (
          <mesh key={x} position={[x, 0.28, 0.22]}>
            <boxGeometry args={[0.12, 0.3, 0.025]} />
            <Material color="#7d5c49" />
          </mesh>
        ))}

        <mesh position={[0, 0.5, 0.22]}>
          <boxGeometry args={[0.45, 0.06, 0.02]} />
          <Material color="#f5e6c4" />
        </mesh>
      </group>

      {/* Riverside trees */}
      <Tree position={[-1.25, 0.4, 0.85]} scale={0.42} />
      <Tree position={[1.3, 0.4, 0.8]} scale={0.42} />

      <Butterfly position={[-0.65, 1.3, 0.8]} color="#dca4d8" />
      <Butterfly position={[1.15, 1.6, -0.7]} color="#f3c16e" />
    </group>
  );
}

/* HIDEAWAY ISLAND: cottage, sunflowers, butterflies and a bench */

function Cottage() {
  return (
    <group position={[0, 0.4, -0.2]}>
      <mesh position={[0, 0.1, 0]} castShadow>
        <boxGeometry args={[1.45, 0.2, 1.2]} />
        <Material color="#c9ad80" />
      </mesh>

      <mesh position={[0, 0.53, 0]} castShadow>
        <boxGeometry args={[1.25, 0.72, 1]} />
        <Material color="#ead5ad" />
      </mesh>

      <mesh
        position={[-0.22, 0.98, 0]}
        rotation={[0, 0, Math.PI / 4.2]}
        castShadow
      >
        <boxGeometry args={[0.88, 0.12, 1.3]} />
        <Material color="#a75f48" />
      </mesh>

      <mesh
        position={[0.22, 0.98, 0]}
        rotation={[0, 0, -Math.PI / 4.2]}
        castShadow
      >
        <boxGeometry args={[0.88, 0.12, 1.3]} />
        <Material color="#bc7656" />
      </mesh>

      <mesh position={[0, 0.41, 0.51]}>
        <boxGeometry args={[0.23, 0.46, 0.03]} />
        <Material color="#78503a" />
      </mesh>

      {[-0.37, 0.37].map((x) => (
        <group key={x} position={[x, 0.63, 0.51]}>
          <mesh>
            <boxGeometry args={[0.2, 0.22, 0.025]} />
            <Material color="#9a6b4b" />
          </mesh>
          <mesh position={[0, 0, 0.02]}>
            <boxGeometry args={[0.15, 0.17, 0.015]} />
            <meshStandardMaterial
              color="#ffe6a0"
              emissive="#f4b84d"
              emissiveIntensity={0.65}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function GardenBench({ position }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.22, 0]}>
        <boxGeometry args={[0.65, 0.08, 0.2]} />
        <Material color="#ad8051" />
      </mesh>

      <mesh position={[0, 0.4, -0.08]}>
        <boxGeometry args={[0.65, 0.3, 0.06]} />
        <Material color="#b98c5d" />
      </mesh>

      {[-0.24, 0.24].map((x) => (
        <mesh key={x} position={[x, 0.1, 0]}>
          <boxGeometry args={[0.05, 0.25, 0.08]} />
          <Material color="#79553a" />
        </mesh>
      ))}
    </group>
  );
}

function HideawayIsland() {
  return (
    <group>
      <Cottage />

      <Tree position={[-1.3, 0.4, -0.85]} scale={0.58} />
      <Tree position={[1.3, 0.4, -0.75]} scale={0.52} />

      <GardenBench position={[0.7, 0.4, 0.8]} />

      {[
        [-1.15, 0.4, 0.55],
        [-0.8, 0.4, 0.85],
        [0.85, 0.4, -0.7],
        [1.35, 0.4, 0.35],
      ].map((p, i) => (
        <Sunflower key={i} position={p} scale={0.65 + (i % 2) * 0.12} />
      ))}

      <Butterfly position={[-0.8, 1.2, 0.2]} color="#f2b5d1" />
      <Butterfly position={[0.95, 1.45, -0.2]} color="#f2cc72" />

      {/* Quiet pond */}
      <mesh
        position={[-0.55, 0.415, -0.65]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <circleGeometry args={[0.36, 32]} />
        <meshStandardMaterial
          color="#a6d5d5"
          roughness={0.18}
          metalness={0.05}
        />
      </mesh>
    </group>
  );
}

/* SECRET ISLAND: glowing portal and a golden envelope */

function Envelope() {
  const envelope = useRef();

  useFrame(({ clock }) => {
    if (envelope.current) {
      envelope.current.rotation.y =
        Math.sin(clock.elapsedTime * 0.5) * 0.08;
    }
  });

  return (
    <Float speed={0.8} rotationIntensity={0.04} floatIntensity={0.2}>
      <group ref={envelope} position={[0, 1.25, 0.45]} rotation={[-0.2, 0, 0]}>
        {/* Envelope body */}
        <mesh castShadow>
          <boxGeometry args={[0.85, 0.56, 0.08]} />
          <meshStandardMaterial
            color="#e5c46d"
            roughness={0.65}
            metalness={0.08}
          />
        </mesh>

        {/* Envelope flap */}
        <mesh
          position={[0, 0.12, 0.05]}
          rotation={[0, 0, Math.PI]}
        >
          <coneGeometry args={[0.55, 0.43, 4, 1]} />
          <meshStandardMaterial color="#f3d98e" roughness={0.7} />
        </mesh>

        {/* Heart-shaped-looking wax seal */}
        <mesh position={[0, -0.04, 0.055]} scale={[0.13, 0.13, 0.04]}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshStandardMaterial
            color="#bd6b59"
            roughness={0.4}
            emissive="#7c382d"
            emissiveIntensity={0.12}
          />
        </mesh>

        <Sparkles
          count={18}
          position={[0, 0, 0.2]}
          scale={[1.5, 1.2, 0.5]}
          size={2}
          speed={0.2}
          color="#ffe6a0"
        />
      </group>
    </Float>
  );
}

function SecretPortal() {
  const ring = useRef();

  useFrame(({ clock }) => {
    if (ring.current) {
      ring.current.rotation.z =
        Math.sin(clock.elapsedTime * 0.35) * 0.025;
    }
  });

  return (
    <group position={[0, 0.85, -0.65]} ref={ring}>
      <mesh>
        <torusGeometry args={[0.68, 0.075, 16, 64]} />
        <meshStandardMaterial
          color="#ffe2a1"
          emissive="#e5b2ff"
          emissiveIntensity={1.25}
          metalness={0.18}
          roughness={0.3}
        />
      </mesh>

      <mesh position={[0, 0, -0.03]}>
        <circleGeometry args={[0.61, 48]} />
        <meshBasicMaterial
          color="#a99cdb"
          transparent
          opacity={0.78}
          side={THREE.DoubleSide}
        />
      </mesh>

      <Sparkles
        count={45}
        scale={[2, 2, 0.5]}
        size={2}
        speed={0.2}
        color="#fff1bf"
      />
    </group>
  );
}

function SecretIsland() {
  return (
    <group>
      <SecretPortal />
      <Envelope />

      <Sunflower position={[-1.15, 0.4, 0.45]} scale={0.7} />
      <Sunflower position={[1.2, 0.4, 0.55]} scale={0.7} />

      <Butterfly position={[-1.1, 1.55, -0.6]} color="#e7a8d1" />
      <Butterfly position={[1.1, 1.7, -0.7]} color="#f2cb70" />
    </group>
  );
}

function Bridge({ start, end }) {
  const dx = end[0] - start[0];
  const dz = end[2] - start[2];
  const length = Math.sqrt(dx * dx + dz * dz);
  const angle = Math.atan2(dz, dx);
  const midpoint = [
    (start[0] + end[0]) / 2,
    (start[1] + end[1]) / 2,
    (start[2] + end[2]) / 2,
  ];
  const count = Math.max(5, Math.floor(length / 0.24));

  return (
    <group position={midpoint} rotation={[0, -angle, 0]}>
      {[-0.14, 0.14].map((z) => (
        <mesh key={z} position={[0, -0.07, z]}>
          <boxGeometry args={[length, 0.12, 0.07]} />
          <Material color="#79563c" />
        </mesh>
      ))}

      {Array.from({ length: count }, (_, i) => (
        <mesh
          key={i}
          position={[-length / 2 + ((i + 0.5) * length) / count, 0, 0]}
          castShadow
        >
          <boxGeometry args={[length / count - 0.025, 0.08, 0.42]} />
          <Material color={i % 2 ? "#d4b487" : "#e7cca0"} />
        </mesh>
      ))}

      {[-0.21, 0.21].map((z) => (
        <group key={z}>
          <mesh position={[0, 0.24, z]}>
            <boxGeometry args={[length, 0.045, 0.05]} />
            <Material color="#b18a5b" />
          </mesh>

          {Array.from({ length: count }, (_, i) => (
            <mesh
              key={i}
              position={[
                -length / 2 + ((i + 0.5) * length) / count,
                0.13,
                z,
              ]}
            >
              <boxGeometry args={[0.045, 0.22, 0.045]} />
              <Material color="#8b6847" />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

function IslandLabel({ title, subtitle, onClick }) {
  return (
    <Html position={[0, 2.7, 0]} center distanceFactor={11}>
      <button
        className="sunshine-island-label"
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
      >
        <span className="sunshine-label-title">{title}</span>
        <span className="sunshine-label-subtitle">{subtitle}</span>
      </button>
    </Html>
  );
}

function OuterIsland({ id, position, title, subtitle, onSelect }) {
  const contents = {
    food: <FoodIsland />,
    memories: <MemoryIsland />,
    hideaway: <HideawayIsland />,
    secret: <SecretIsland />,
  };

  return (
    <Float speed={0.3} rotationIntensity={0.008} floatIntensity={0.09}>
      <Island
        position={position}
        radius={2.1}
        seed={id.length + 4}
        onClick={onSelect}
      >
        {contents[id]}
        <IslandLabel
          title={title}
          subtitle={subtitle}
          onClick={onSelect}
        />
      </Island>
    </Float>
  );
}

function CentralIsland({ onSelect }) {
  return (
    <Float speed={0.24} rotationIntensity={0.005} floatIntensity={0.055}>
      <Island position={[0, 0, 0]} radius={2.75} seed={11} onClick={onSelect}>
        <Tree position={[0, 0.38, -0.2]} scale={1.35} golden />

        <mesh position={[0, 0.4, 1.35]} receiveShadow>
          <cylinderGeometry args={[0.65, 0.69, 0.07, 40]} />
          <Material color="#ded4b8" />
        </mesh>

        {Array.from({ length: 6 }, (_, i) => (
          <mesh
            key={i}
            position={[Math.sin(i * 0.18) * 0.12, 0.41, 1.95 + i * 0.12]}
          >
            <boxGeometry args={[0.23, 0.045, 0.15]} />
            <Material color="#d7c7a4" />
          </mesh>
        ))}

        <Sunflower position={[-1.65, 0.4, 0.45]} scale={0.82} />
        <Sunflower position={[1.65, 0.4, 0.5]} scale={0.82} />

        <IslandLabel
          title="Little Sunshine"
          subtitle="A world made for you"
          onClick={onSelect}
        />
      </Island>
    </Float>
  );
}

function World({ selected, setSelected }) {
  const cameraTarget = useRef(new THREE.Vector3(0, 0.7, 0));
  const lookTarget = useRef(new THREE.Vector3(0, 0.7, 0));
  const desiredPosition = useRef(new THREE.Vector3(0, 8, 14));

  useEffect(() => {
    const destination = DESTINATIONS[selected] || DESTINATIONS.home;
    desiredPosition.current.set(...destination.camera);
    lookTarget.current.set(...destination.look);
  }, [selected]);

  useFrame(({ camera }, delta) => {
    const amount = 1 - Math.exp(-delta * 1.5);
    camera.position.lerp(desiredPosition.current, amount);
    cameraTarget.current.lerp(lookTarget.current, amount);
    camera.lookAt(cameraTarget.current);
  });

  return (
    <>
      <color attach="background" args={["#b9d7e5"]} />
      <fog attach="fog" args={["#c7dce5", 18, 42]} />

      <ambientLight intensity={0.75} color="#fff5df" />
      <hemisphereLight args={["#dceafa", "#657653", 1.2]} />

      <directionalLight
        position={[-7, 12, 6]}
        intensity={2.3}
        color="#ffe5b2"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />

      <Environment preset="sunset" background={false} />

      <CentralIsland onSelect={() => setSelected("home")} />

      <Bridge start={[-2.8, -0.02, 0.25]} end={[-4.05, -0.12, 1.3]} />
      <Bridge start={[2.8, -0.02, 0.25]} end={[4.05, -0.12, 1.3]} />
      <Bridge start={[-2, -0.02, -1.8]} end={[-4.1, -0.12, -3.2]} />
      <Bridge start={[2, -0.02, -1.8]} end={[4.1, -0.12, -3.2]} />

      <OuterIsland
        id="food"
        position={[-5.4, -0.15, 2]}
        title="Food Adventures"
        subtitle="Dumplings · Pho · Pret coffee"
        onSelect={() => setSelected("food")}
      />

      <OuterIsland
        id="memories"
        position={[5.4, -0.15, 2]}
        title="Our Memories"
        subtitle="Canary Wharf · Liverpool Street · Greenwich"
        onSelect={() => setSelected("memories")}
      />

      <OuterIsland
        id="hideaway"
        position={[-5.4, -0.15, -3.6]}
        title="Little Hideaway"
        subtitle="Flowers, butterflies & quiet moments"
        onSelect={() => setSelected("hideaway")}
      />

      <OuterIsland
        id="secret"
        position={[5.4, -0.15, -3.6]}
        title="The Secret Island"
        subtitle="A little letter from my heart"
        onSelect={() => setSelected("secret")}
      />

      <Cloud position={[-10, 4, -8]} scale={2.5} opacity={0.45} speed={0.1} />
      <Cloud position={[10, 5, -10]} scale={3} opacity={0.38} speed={0.08} />

      <Sparkles
        count={55}
        scale={[18, 9, 18]}
        position={[0, 2, 0]}
        size={1.1}
        speed={0.12}
        color="#fff0c6"
        opacity={0.6}
      />

      <ContactShadows
        position={[0, -1.4, 0]}
        opacity={0.22}
        scale={24}
        blur={3}
        far={8}
      />
    </>
  );
}

export default function SunshineWorld() {
  const [selected, setSelected] = useState("home");
  const [showWelcome, setShowWelcome] = useState(true);
  const [letterOpen, setLetterOpen] = useState(false);

  return (
    <main className="sunshine-world">
      <Canvas
        shadows
        dpr={[1, 1.5]}
        camera={{ position: [0, 8, 14], fov: 39 }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
        }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.12;
          gl.shadowMap.enabled = true;
          gl.shadowMap.type = THREE.PCFSoftShadowMap;
        }}
      >
        <World selected={selected} setSelected={setSelected} />
      </Canvas>

      <header className="sunshine-world-header">
        <div className="sunshine-world-brand">
          <span className="sunshine-world-sun">☀</span>
          <div>
            <span className="sunshine-world-name">Little Sunshine</span>
            <span className="sunshine-world-tagline">
              A little world, made for you
            </span>
          </div>
        </div>
        <span className="sunshine-world-date">HARRY'S BIRTHDAY WORLD</span>
      </header>

      {showWelcome && (
        <section className="sunshine-welcome-card">
          <button
            className="sunshine-dismiss"
            onClick={() => setShowWelcome(false)}
            aria-label="Close welcome"
          >
            ×
          </button>
          <span className="sunshine-welcome-kicker">
            A tiny universe for you
          </span>
          <h1>Follow the sunshine.</h1>
          <p>
            Explore at your own pace. Every little island holds a piece
            of our story.
          </p>
          <button
            className="sunshine-explore-button"
            onClick={() => setShowWelcome(false)}
          >
            Let's explore <span>↗</span>
          </button>
        </section>
      )}

      <nav className="sunshine-island-nav" aria-label="Explore islands">
        {ISLANDS.map((island) => (
          <button
            key={island.id}
            className={selected === island.id ? "active" : ""}
            onClick={() => {
              setSelected(island.id);
              setLetterOpen(false);
            }}
          >
            <span>{island.emoji}</span>
            {island.label}
          </button>
        ))}
      </nav>

      {selected === "secret" && (
        <div className="sunshine-secret-card">
          <span className="sunshine-secret-star">✦</span>
          <p>Your birthday letter is waiting.</p>
          <button onClick={() => setLetterOpen(true)}>
            Open your secret <span>♡</span>
          </button>
        </div>
      )}

      {letterOpen && (
        <div
          className="sunshine-letter-backdrop"
          onClick={() => setLetterOpen(false)}
        >
          <section
            className="sunshine-letter"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Birthday letter"
          >
            <button
              className="sunshine-letter-close"
              onClick={() => setLetterOpen(false)}
              aria-label="Close letter"
            >
              ×
            </button>

            <span className="sunshine-letter-flower">🌻</span>
            <p className="sunshine-letter-eyebrow">A letter, just for you</p>
            <h2>To my little sunshine, Harry</h2>

            <p>
              If this world could hold every laugh, every food adventure,
              every silly moment and every memory we've made, it would still
              need more room.
            </p>

            <p>
              From our food adventures to the little places we explored,
              every memory has become a tiny piece of this world. I hope
              life always gives you reasons to smile, peaceful moments
              to breathe, and beautiful adventures to look forward to.
            </p>

            <p>
              Thank you for being part of so many memories I want to keep.
              Wherever life takes us, I hope you never forget how special
              you are and how much happiness you bring into ordinary days.
            </p>

            <p className="sunshine-letter-signoff">
              You’ll always be my little sunshine. <span>♡</span>
            </p>
          </section>
        </div>
      )}

      <div className="sunshine-world-footer">
        <span>✦</span> Made with love, just for Harry <span> ✦</span>
      </div>
    </main>
  );
}
