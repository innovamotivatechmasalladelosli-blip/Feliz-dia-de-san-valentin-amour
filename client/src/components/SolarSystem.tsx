import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Stars } from '@react-three/drei';
import * as THREE from 'three';
import confetti from 'canvas-confetti';

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
        onClick={(e) => {
          e.stopPropagation();
          onPlanetClick(planet);
        }}
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
  onSunClick: () => void;
}

const SolarSystemScene: React.FC<SolarSystemSceneProps> = ({ onPlanetSelect, collectedPlanets, onSunClick }) => {
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
      <mesh ref={sunRef} onClick={(e) => {
        e.stopPropagation();
        onSunClick();
      }}>
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
  const [showInstructions, setShowInstructions] = useState(true);
  const [sunClicked, setSunClicked] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handlePlanetClick = (planet: Planet) => {
    if (!collectedPlanets.includes(planet.id)) {
      setCollectedPlanets([...collectedPlanets, planet.id]);
      setScore(score + 10);
    }
    setSelectedPlanet(planet);
  };

  const allCollected = collectedPlanets.length === planets.length;
  const missionCompleted = sunClicked;

  const handleSunClick = () => {
    // Solo permitir clic en el sol si ya se completaron todos los planetas
    if (!allCollected) {
      return;
    }
    setSunClicked(true);
    
    // Crear explosión de "te amo" alrededor del sol
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    (function frame() {
      for (let i = 0; i < 8; i++) {
        confetti({
          particleCount: 15,
          angle: (i / 8) * 360,
          spread: 45,
          origin: { x: 0.5, y: 0.5 },
          colors: ['#ff69b4', '#ff1493', '#ff69b4', '#ff1493'],
          zIndex: 9999,
          shapes: ['circle'],
          scalar: 1.5
        });
      }

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  };

  return (
    <div className="relative w-full h-screen bg-gradient-to-b from-black via-blue-900 to-black overflow-hidden">
      <Canvas camera={{ position: [0, 30, 80], fov: 75 }} onClick={(e) => e.stopPropagation()}>
        <SolarSystemScene onPlanetSelect={handlePlanetClick} collectedPlanets={collectedPlanets} onSunClick={handleSunClick} />
      </Canvas>

      {/* Botón volver */}
      <button
        onClick={onBack}
        className="absolute top-4 left-4 md:top-6 md:left-6 bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 md:py-3 md:px-6 rounded-lg shadow-lg transition-all z-50 text-sm md:text-base"
      >
        ← Volver
      </button>

      {/* Panel de puntuación y progreso - Responsive */}
      <div className="absolute top-16 md:top-6 left-4 right-4 md:left-6 md:right-6 bg-black/70 backdrop-blur-sm border border-pink-400 rounded-lg p-3 md:p-4 text-white z-50">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 md:gap-6">
          <div className="flex items-center gap-3 md:gap-4 w-full md:w-auto">
            <div>
              <p className="text-pink-400 font-bold text-xs md:text-sm">🎮 JUEGO CÓSMICO</p>
              <p className="text-xs text-gray-300 mt-1">Puntos: <span className="text-pink-400 font-bold">{score}</span></p>
            </div>
            <div className="hidden md:block h-12 w-px bg-pink-400/30"></div>
            <div>
              <p className="text-xs text-gray-300">Planetas</p>
              <p className="text-pink-400 font-bold text-lg">{collectedPlanets.length}/7</p>
            </div>
            <div className="hidden md:block h-12 w-px bg-pink-400/30"></div>
            <div>
              <p className="text-xs text-gray-300">Encuentrate</p>
              <p className="text-pink-400 font-bold text-lg" style={{opacity: allCollected ? 1 : 0.5}}>{missionCompleted ? '1' : '0'}/1</p>
            </div>
          </div>
          <div className="flex-1 w-full md:flex-1 md:max-w-xs">
            <div className="w-full bg-gray-700 rounded-full h-2 md:h-3">
              <div
                className="bg-gradient-to-r from-pink-400 to-pink-600 h-2 md:h-3 rounded-full transition-all"
                style={{ width: `${((collectedPlanets.length + (missionCompleted ? 1 : 0)) / 8) * 100}%` }}
              ></div>
            </div>
          </div>
          {allCollected && missionCompleted && (
            <div className="text-pink-400 font-bold text-xs md:text-sm">¡Todo completado! 🎉</div>
          )}
        </div>
      </div>

      {/* Panel de información del planeta */}
      {selectedPlanet && (
        <div className="absolute bottom-4 left-4 right-4 md:bottom-6 md:left-6 md:right-6 bg-black/80 backdrop-blur-sm border border-pink-400 rounded-lg p-4 md:p-6 text-white z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h2 className="text-xl md:text-2xl font-bold text-pink-400 mb-2">{selectedPlanet.name}</h2>
              <p className="text-base md:text-lg italic text-pink-100 mb-4 break-words">"{selectedPlanet.phrase}"</p>
              {collectedPlanets.includes(selectedPlanet.id) && (
                <p className="text-xs md:text-sm text-pink-300">✓ Descubierto</p>
              )}
            </div>
            <button
              onClick={() => setSelectedPlanet(null)}
              className="text-pink-300 hover:text-pink-200 text-2xl font-bold flex-shrink-0"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Instrucciones - Mejorado y con botón de cerrar */}
      {showInstructions && (
        <div className="absolute top-40 md:top-24 right-4 left-4 md:left-auto md:right-6 bg-black/80 backdrop-blur-sm border border-pink-400 rounded-lg p-3 md:p-4 text-white text-xs md:text-xs max-w-xs z-50 shadow-lg">
          <div className="flex items-start justify-between mb-3">
            <p className="text-pink-300 font-bold text-sm">📖 CÓMO JUGAR</p>
            <button
              onClick={() => setShowInstructions(false)}
              className="text-pink-300 hover:text-pink-100 font-bold text-lg leading-none flex-shrink-0"
            >
              ✕
            </button>
          </div>
          <ul className="space-y-2 text-xs">
            {isMobile ? (
              <>
                <li className="flex items-start gap-2">
                  <span className="text-pink-400 mt-0.5">•</span>
                  <span>Toca los planetas para descubrirlos</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pink-400 mt-0.5">•</span>
                  <span>Desliza para rotar la vista</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pink-400 mt-0.5">•</span>
                  <span>Pellizca para hacer zoom</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pink-400 mt-0.5">•</span>
                  <span>Colecciona los 7 planetas</span>
                </li>
              </>
            ) : (
              <>
                <li className="flex items-start gap-2">
                  <span className="text-pink-400 mt-0.5">•</span>
                  <span>Haz clic en los planetas para descubrirlos</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pink-400 mt-0.5">•</span>
                  <span>Colecciona todos los 7 planetas</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pink-400 mt-0.5">•</span>
                  <span>Usa el ratón para rotar y hacer zoom</span>
                </li>
              </>
            )}
          </ul>
        </div>
      )}

      {/* Mensaje de misión secreta completada */}
      {sunClicked && (
        <div className="fixed inset-0 flex items-center justify-center z-[200] pointer-events-none">
          <div className="text-center animate-in zoom-in fade-in duration-300 px-4">
            <p className="text-2xl md:text-4xl font-bold text-pink-400 mb-4">¡DESCUBRISTE LA MISIÓN SECRETA! 🎉</p>
            <p className="text-xl md:text-3xl text-pink-300 font-bold">¡TE AMO! 💕</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SolarSystem;
