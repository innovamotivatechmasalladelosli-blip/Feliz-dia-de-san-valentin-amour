import React, { useRef, useState, useEffect } from 'react';
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
    distance: 8,
    size: 0.5,
    color: '#8c7853',
    speed: 0.04,
    phrase: 'Eres mi velocidad, mi impulso, mi razón de volar cada día.'
  },
  {
    id: 2,
    name: 'Venus',
    distance: 13,
    size: 0.8,
    color: '#ffc649',
    speed: 0.015,
    phrase: 'Tan bella como la estrella de la tarde, iluminas mi cielo.'
  },
  {
    id: 3,
    name: 'Marte',
    distance: 18,
    size: 0.6,
    color: '#e27b58',
    speed: 0.008,
    phrase: 'Rojo como el fuego de mi corazón que arde por ti.'
  },
  {
    id: 4,
    name: 'Júpiter',
    distance: 26,
    size: 1.5,
    color: '#c88b3a',
    speed: 0.002,
    phrase: 'Grande como mi amor, infinito como tu belleza.'
  },
  {
    id: 5,
    name: 'Saturno',
    distance: 34,
    size: 1.2,
    color: '#fad5a5',
    speed: 0.0009,
    phrase: 'Con tus anillos de luz, eres la joya de mi universo.'
  },
  {
    id: 6,
    name: 'Urano',
    distance: 42,
    size: 1,
    color: '#4fd0e7',
    speed: 0.0004,
    phrase: 'Azul como el océano de emociones que despierta tu amor.'
  },
  {
    id: 7,
    name: 'Neptuno',
    distance: 50,
    size: 1,
    color: '#4166f5',
    speed: 0.0001,
    phrase: 'Profundo y misterioso, así es el amor que siento por ti.'
  }
];

interface PlanetMeshProps {
  planet: Planet;
  onPlanetClick: (planet: Planet) => void;
  collected: boolean;
}

const PlanetMesh: React.FC<PlanetMeshProps> = ({ planet, onPlanetClick, collected }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += planet.speed;
    }
    if (meshRef.current) {
      const targetScale = hovered ? planet.size * 1.4 : planet.size;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
  });

  return (
    <group ref={groupRef}>
      {/* Órbita */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={64}
            array={new Float32Array(
              Array.from({ length: 64 }, (_, i) => {
                const angle = (i / 64) * Math.PI * 2;
                return [
                  Math.cos(angle) * planet.distance,
                  0,
                  Math.sin(angle) * planet.distance
                ];
              }).flat()
            )}
            itemSize={3}
            args={[new Float32Array(
              Array.from({ length: 64 }, (_, i) => {
                const angle = (i / 64) * Math.PI * 2;
                return [
                  Math.cos(angle) * planet.distance,
                  0,
                  Math.sin(angle) * planet.distance
                ];
              }).flat()
            ), 3] as any}
          />
        </bufferGeometry>
        <lineBasicMaterial color={collected ? '#ff69b4' : '#ffffff'} transparent opacity={0.3} linewidth={2} />
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
          emissive={hovered ? planet.color : collected ? '#ff69b4' : '#000000'}
          emissiveIntensity={hovered ? 0.6 : collected ? 0.3 : 0}
          metalness={0.3}
          roughness={0.4}
        />
      </mesh>

      {/* Etiqueta y estado */}
      <Text
        position={[planet.distance, planet.size + 1.5, 0]}
        fontSize={0.6}
        color={collected ? '#ff69b4' : '#ffffff'}
        anchorX="center"
        anchorY="middle"
        fontWeight="bold"
      >
        {planet.name}
      </Text>

      {collected && (
        <Text
          position={[planet.distance, planet.size + 0.5, 0]}
          fontSize={1.2}
          color="#ff69b4"
          anchorX="center"
          anchorY="middle"
        >
          ✓
        </Text>
      )}
    </group>
  );
};

interface SolarSystemSceneProps {
  onPlanetSelect: (planet: Planet) => void;
  collectedPlanets: number[];
}

const SolarSystemScene: React.FC<SolarSystemSceneProps> = ({ onPlanetSelect, collectedPlanets }) => {
  const sunRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (sunRef.current) {
      sunRef.current.rotation.y += 0.001;
    }
  });

  return (
    <>
      <Stars radius={300} depth={100} count={8000} factor={6} />
      
      {/* Sol */}
      <mesh ref={sunRef}>
        <sphereGeometry args={[2, 32, 32]} />
        <meshBasicMaterial color="#fdb813" />
      </mesh>

      {/* Glow del sol */}
      <mesh>
        <sphereGeometry args={[2.5, 32, 32]} />
        <meshBasicMaterial color="#fdb813" transparent opacity={0.1} />
      </mesh>

      {/* Luz del sol */}
      <pointLight position={[0, 0, 0]} intensity={2.5} />

      {/* Planetas */}
      {planets.map((planet) => (
        <PlanetMesh
          key={planet.id}
          planet={planet}
          onPlanetClick={onPlanetSelect}
          collected={collectedPlanets.includes(planet.id)}
        />
      ))}

      {/* Controles */}
      <OrbitControls
        autoRotate
        autoRotateSpeed={0.3}
        enableZoom={true}
        enablePan={true}
        minDistance={15}
        maxDistance={200}
      />
    </>
  );
};

interface SolarSystemProps {
  onBack: () => void;
}

export const SolarSystem: React.FC<SolarSystemProps> = ({ onBack }) => {
  const [selectedPlanet, setSelectedPlanet] = useState<Planet | null>(null);
  const [collectedPlanets, setCollectedPlanets] = useState<number[]>([]);
  const [score, setScore] = useState(0);

  const handlePlanetClick = (planet: Planet) => {
    if (!collectedPlanets.includes(planet.id)) {
      setCollectedPlanets([...collectedPlanets, planet.id]);
      setScore(score + 10);
    }
    setSelectedPlanet(planet);
  };

  const allCollected = collectedPlanets.length === planets.length;

  return (
    <div className="relative w-full h-screen bg-gradient-to-b from-black via-blue-900 to-black overflow-hidden">
      <Canvas camera={{ position: [0, 30, 80], fov: 75 }}>
        <SolarSystemScene onPlanetSelect={handlePlanetClick} collectedPlanets={collectedPlanets} />
      </Canvas>

      {/* Botón volver */}
      <button
        onClick={onBack}
        className="absolute top-6 left-6 bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-all z-50 flex items-center gap-2"
      >
        ← Volver
      </button>

      {/* Panel de puntuación y progreso */}
      <div className="absolute top-6 right-6 bg-black/70 backdrop-blur-sm border border-pink-400 rounded-lg p-6 text-white z-50 max-w-sm">
        <h3 className="text-pink-400 font-bold text-lg mb-3">🎮 JUEGO CÓSMICO</h3>
        <div className="space-y-2 text-sm">
          <p>Puntos: <span className="text-pink-400 font-bold text-lg">{score}</span></p>
          <p>Planetas descubiertos: <span className="text-pink-400 font-bold">{collectedPlanets.length}/7</span></p>
          <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
            <div
              className="bg-gradient-to-r from-pink-400 to-pink-600 h-2 rounded-full transition-all"
              style={{ width: `${(collectedPlanets.length / 7) * 100}%` }}
            ></div>
          </div>
        </div>
        {allCollected && (
          <div className="mt-4 p-3 bg-pink-500/20 border border-pink-400 rounded text-center">
            <p className="text-pink-300 font-bold">¡Completaste el juego! 🎉</p>
          </div>
        )}
      </div>

      {/* Panel de información del planeta */}
      {selectedPlanet && (
        <div className="absolute bottom-6 left-6 right-6 bg-black/80 backdrop-blur-sm border border-pink-400 rounded-lg p-6 max-w-lg text-white z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-pink-400 mb-2">{selectedPlanet.name}</h2>
              <p className="text-lg italic text-pink-100 mb-4">"{selectedPlanet.phrase}"</p>
              {collectedPlanets.includes(selectedPlanet.id) && (
                <p className="text-sm text-pink-300">✓ Descubierto</p>
              )}
            </div>
            <button
              onClick={() => setSelectedPlanet(null)}
              className="text-pink-300 hover:text-pink-200 text-2xl font-bold"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Instrucciones */}
      <div className="absolute bottom-6 right-6 bg-black/60 backdrop-blur-sm border border-pink-300 rounded-lg p-4 text-white text-sm max-w-xs z-50">
        <p className="text-pink-300 font-bold mb-2">📖 CÓMO JUGAR</p>
        <ul className="text-xs space-y-1">
          <li>• Haz clic en los planetas para descubrirlos</li>
          <li>• Colecciona todos los 7 planetas</li>
          <li>• Usa el ratón para rotar y hacer zoom</li>
          <li>• Gana puntos por cada descubrimiento</li>
        </ul>
      </div>
    </div>
  );
};

export default SolarSystem;
