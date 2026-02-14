import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Stars } from '@react-three/drei';
import * as THREE from 'three';

interface Planet {
  id: number;
  name: string;
  distance: number;
  size: number;
  color: string;
  speed: number;
  phrase: string;
}

const planets: Planet[] = [
  {
    id: 1,
    name: 'Mercurio',
    distance: 5,
    size: 0.4,
    color: '#8c7853',
    speed: 0.04,
    phrase: 'Eres mi velocidad, mi impulso, mi razón de volar cada día.'
  },
  {
    id: 2,
    name: 'Venus',
    distance: 8,
    size: 0.7,
    color: '#ffc649',
    speed: 0.015,
    phrase: 'Tan bella como la estrella de la tarde, iluminas mi cielo.'
  },
  {
    id: 3,
    name: 'Marte',
    distance: 12,
    size: 0.5,
    color: '#e27b58',
    speed: 0.008,
    phrase: 'Rojo como el fuego de mi corazón que arde por ti.'
  },
  {
    id: 4,
    name: 'Júpiter',
    distance: 18,
    size: 1.2,
    color: '#c88b3a',
    speed: 0.002,
    phrase: 'Grande como mi amor, infinito como tu belleza.'
  },
  {
    id: 5,
    name: 'Saturno',
    distance: 24,
    size: 1,
    color: '#fad5a5',
    speed: 0.0009,
    phrase: 'Con tus anillos de luz, eres la joya de mi universo.'
  },
  {
    id: 6,
    name: 'Urano',
    distance: 30,
    size: 0.8,
    color: '#4fd0e7',
    speed: 0.0004,
    phrase: 'Azul como el océano de emociones que despierta tu amor.'
  },
  {
    id: 7,
    name: 'Neptuno',
    distance: 36,
    size: 0.8,
    color: '#4166f5',
    speed: 0.0001,
    phrase: 'Profundo y misterioso, así es el amor que siento por ti.'
  }
];

interface PlanetProps {
  planet: Planet;
  onPlanetClick: (planet: Planet) => void;
}

const PlanetMesh: React.FC<PlanetProps> = ({ planet, onPlanetClick }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += planet.speed;
    }
    if (meshRef.current && hovered) {
      meshRef.current.scale.lerp(new THREE.Vector3(planet.size * 1.3, planet.size * 1.3, planet.size * 1.3), 0.1);
    } else if (meshRef.current) {
      meshRef.current.scale.lerp(new THREE.Vector3(planet.size, planet.size, planet.size), 0.1);
    }
  });

  // Crear puntos para la órbita
  const orbitPoints = Array.from({ length: 64 }, (_, i) => {
    const angle = (i / 64) * Math.PI * 2;
    return new THREE.Vector3(
      Math.cos(angle) * planet.distance,
      0,
      Math.sin(angle) * planet.distance
    );
  });

  return (
    <group ref={groupRef}>
      {/* Órbita */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={orbitPoints.length}
            array={new Float32Array(orbitPoints.flatMap(p => [p.x, p.y, p.z]))}
            itemSize={3}
            args={[new Float32Array(orbitPoints.flatMap(p => [p.x, p.y, p.z])), 3] as any}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#ffffff" transparent opacity={0.2} />
      </line>

      {/* Planeta */}
      <mesh
        ref={meshRef}
        position={[planet.distance, 0, 0]}
        onClick={() => onPlanetClick(planet)}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        scale={[planet.size, planet.size, planet.size]}
      >
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial
          color={planet.color}
          emissive={hovered ? planet.color : '#000000'}
          emissiveIntensity={hovered ? 0.5 : 0}
        />
      </mesh>

      {/* Etiqueta del planeta */}
      <Text
        position={[planet.distance, planet.size + 1, 0]}
        fontSize={0.5}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        {planet.name}
      </Text>
    </group>
  );
};

interface SolarSystemSceneProps {
  onPlanetSelect: (planet: Planet) => void;
}

const SolarSystemScene: React.FC<SolarSystemSceneProps> = ({ onPlanetSelect }) => {
  const sunRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (sunRef.current) {
      sunRef.current.rotation.y += 0.001;
    }
  });

  return (
    <>
      <Stars radius={200} depth={50} count={5000} factor={4} />
      
      {/* Sol */}
      <mesh ref={sunRef}>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshBasicMaterial color="#fdb813" />
      </mesh>

      {/* Luz del sol */}
      <pointLight position={[0, 0, 0]} intensity={2} />

      {/* Planetas */}
      {planets.map((planet) => (
        <PlanetMesh key={planet.id} planet={planet} onPlanetClick={onPlanetSelect} />
      ))}

      {/* Controles */}
      <OrbitControls
        autoRotate
        autoRotateSpeed={0.5}
        enableZoom={true}
        enablePan={true}
        minDistance={10}
        maxDistance={150}
      />
    </>
  );
};

interface SolarSystemProps {
  onBack: () => void;
}

export const SolarSystem: React.FC<SolarSystemProps> = ({ onBack }) => {
  const [selectedPlanet, setSelectedPlanet] = useState<Planet | null>(null);

  return (
    <div className="relative w-full h-screen bg-black">
      <Canvas camera={{ position: [0, 20, 50], fov: 75 }}>
        <SolarSystemScene onPlanetSelect={setSelectedPlanet} />
      </Canvas>

      {/* Botón volver */}
      <button
        onClick={onBack}
        className="absolute top-6 left-6 bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-all z-50"
      >
        ← Volver a la Tierra
      </button>

      {/* Panel de información del planeta */}
      {selectedPlanet && (
        <div className="absolute bottom-6 left-6 right-6 bg-black/80 backdrop-blur-sm border border-pink-400 rounded-lg p-6 max-w-md text-white z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <h2 className="text-2xl font-bold text-pink-400 mb-2">{selectedPlanet.name}</h2>
          <p className="text-lg italic text-pink-100">"{selectedPlanet.phrase}"</p>
          <button
            onClick={() => setSelectedPlanet(null)}
            className="mt-4 text-sm text-pink-300 hover:text-pink-200 underline"
          >
            Cerrar
          </button>
        </div>
      )}

      {/* Instrucciones */}
      <div className="absolute top-6 right-6 bg-black/60 backdrop-blur-sm border border-pink-300 rounded-lg p-4 text-white text-sm max-w-xs z-50">
        <p className="text-pink-300 font-bold mb-2">🌍 Sistema Solar</p>
        <p>Haz clic en los planetas para descubrir mensajes especiales.</p>
        <p className="text-xs mt-2 text-gray-300">Usa el ratón para rotar y zoom</p>
      </div>
    </div>
  );
};

export default SolarSystem;
