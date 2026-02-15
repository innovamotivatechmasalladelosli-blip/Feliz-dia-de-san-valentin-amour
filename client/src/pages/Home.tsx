import React, { useState, useEffect, useRef } from 'react';
import { Heart, Sparkles, Send, Rocket } from 'lucide-react';
import confetti from 'canvas-confetti';
import { SolarSystem } from '@/components/SolarSystem';

const MUSIC_URL = 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663208866167/JdRYuXKIzpRqoCZn.mp3';

const Home = () => {
  const [frase, setFrase] = useState('');
  const [showNote, setShowNote] = useState(false);
  const [isHugging, setIsHugging] = useState(false);
  const [showHugEmoji, setShowHugEmoji] = useState(false);
  const [inSpace, setInSpace] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const frases = [
    "Eres el pensamiento más bonito de mi día. ❤️",
    "No importa la distancia, siempre estás conmigo. 🌹",
    "Eres mi lugar favorito en el mundo. ✨",
    "Cada pétalo de esta flor es una razón para amarte. 🌷",
    "Gracias por ser mi alegría diaria. 😊",
    "Eres el 'te extraño' más dulce que he sentido. ☁️",
    "Mi corazón late un poquito más fuerte por ti. 💓",
    "Eres la casualidad más hermosa de mi vida. 🌈"
  ];

  useEffect(() => {
    const randomFrase = frases[Math.floor(Math.random() * frases.length)];
    setFrase(randomFrase);
  }, []);

  useEffect(() => {
    // Reproducir música de fondo cuando se muestra la página de inicio
    if (!inSpace && audioRef.current) {
      audioRef.current.volume = 0.5;
      audioRef.current.play().catch(err => console.log('Audio autoplay blocked:', err));
    }
  }, [inSpace]);

  const handleAbrazo = () => {
    setIsHugging(true);
    setShowHugEmoji(true);
    
    setTimeout(() => {
      setIsHugging(false);
      setShowHugEmoji(false);
    }, 1200);

    const duration = 3 * 1000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 12,
        angle: 60,
        spread: 70,
        origin: { x: 0, y: 0.6 },
        colors: ['#ff4d6d', '#ff758f', '#ffb3c1'],
        zIndex: 9999,
        shapes: ['circle']
      });
      confetti({
        particleCount: 12,
        angle: 120,
        spread: 70,
        origin: { x: 1, y: 0.6 },
        colors: ['#ff4d6d', '#ff758f', '#ffb3c1'],
        zIndex: 9999,
        shapes: ['circle']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  };

  if (inSpace) {
    // Pausar música cuando entras al juego espacial
    if (audioRef.current) {
      audioRef.current.pause();
    }
    return <SolarSystem onBack={() => setInSpace(false)} />;
  }

  return (
    <div className="min-h-screen bg-[#fff5f7] flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Audio de fondo */}
      <audio 
        ref={audioRef}
        src={MUSIC_URL}
        loop
        autoPlay
        style={{ display: 'none' }}
      />
      
      {showHugEmoji && (
        <div className="fixed inset-0 flex items-center justify-center z-[100] pointer-events-none animate-in zoom-in fade-in duration-300">
            <div className="text-9xl animate-bounce drop-shadow-2xl">
                🤗
            </div>
        </div>
      )}

      {/* Fondo Decorativo */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[10%] left-[10%] animate-pulse opacity-30"><Heart size={30} fill="#ffb3c1" color="#ffb3c1" /></div>
        <div className="absolute top-[20%] right-[15%] animate-bounce opacity-20"><Heart size={20} fill="#ff4d6d" color="#ff4d6d" /></div>
        <div className="absolute bottom-[20%] left-[15%] animate-bounce opacity-20"><Sparkles size={25} color="#ff758f" /></div>
        
        {/* Flores decorativas en el fondo */}
        <div className="absolute bottom-0 left-0 right-0 h-40 flex items-end justify-around px-4 pb-4">
          <div className="text-5xl animate-bounce opacity-70" style={{animationDelay: '0s'}}>🌹</div>
          <div className="text-4xl animate-bounce opacity-60" style={{animationDelay: '0.2s'}}>🌷</div>
          <div className="text-6xl animate-bounce opacity-75" style={{animationDelay: '0.4s'}}>🌸</div>
          <div className="text-4xl animate-bounce opacity-65" style={{animationDelay: '0.1s'}}>🌺</div>
          <div className="text-5xl animate-bounce opacity-70" style={{animationDelay: '0.3s'}}>🌻</div>
          <div className="text-4xl animate-bounce opacity-60" style={{animationDelay: '0.5s'}}>🌹</div>
          <div className="text-6xl animate-bounce opacity-75" style={{animationDelay: '0.2s'}}>🌼</div>
          <div className="text-4xl animate-bounce opacity-65" style={{animationDelay: '0.4s'}}>🌷</div>
          <div className="text-5xl animate-bounce opacity-70" style={{animationDelay: '0.1s'}}>🌸</div>
        </div>
      </div>

      <div 
        className={`bg-white p-8 rounded-[2.5rem] shadow-[0_30px_70px_rgba(255,182,193,0.45)] border border-pink-50 max-w-sm w-full text-center z-10 transition-all duration-500 ease-out ${isHugging ? 'scale-105 rotate-1' : 'scale-100 rotate-0'}`}
      >
        <h1 className="text-3xl font-bold text-[#c9184a] mb-2 font-serif leading-tight">Jardín de flores para mi amour</h1>
        <p className="text-pink-300 text-[10px] font-bold tracking-[0.25em] uppercase mb-12">Un detalle que nunca se marchita</p>

        {/* Flor Animada */}
        <div className="relative h-44 flex items-center justify-center mb-16">
          <div className="flower-wrap">
            <div className="stem"></div>
            <div className="leaf-left"></div>
            <div className="leaf-right"></div>
            <div className="flower-head">
              <div className="center-circle"></div>
              {[...Array(8)].map((_, i) => (
                <div key={i} className={`petal p${i+1}`}></div>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-10 min-h-[60px] flex items-center justify-center px-2">
          <p className="text-[#594157] text-xl font-medium italic leading-snug">
            "{frase}"
          </p>
        </div>

        <div className="space-y-4">
          <button 
            onClick={handleAbrazo}
            className="group relative w-full bg-gradient-to-r from-[#ff4d6d] to-[#ff758f] hover:from-[#ff758f] hover:to-[#ff4d6d] text-white font-bold py-5 rounded-2xl shadow-lg transition-all active:scale-90 flex items-center justify-center gap-3"
          >
            <Heart size={22} fill="white" className={isHugging ? 'animate-ping' : ''} /> 
            <span className="text-lg">¡Recibir mi Abrazo!</span>
          </button>
          
          <button 
            onClick={() => setShowNote(!showNote)}
            className="w-full text-pink-400 font-semibold py-2 hover:text-pink-600 transition-colors flex items-center justify-center gap-2 text-sm"
          >
            <Send size={14} /> {showNote ? "Cerrar cartita" : "Tengo una nota para ti..."}
          </button>

          <button
            onClick={() => setInSpace(true)}
            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-bold py-4 rounded-2xl shadow-lg transition-all active:scale-90 flex items-center justify-center gap-3 mt-6"
          >
            <Rocket size={22} />
            <span className="text-lg">¡Salir de la Tierra!</span>
          </button>
        </div>

        {showNote && (
          <div className="mt-6 p-6 bg-pink-50/80 rounded-2xl text-left border-l-4 border-[#ff4d6d] animate-in slide-in-from-bottom-2 fade-in duration-500">
            <p className="text-[#8c5e6d] text-sm leading-relaxed italic">
              "Aunque no nos veamos ahora, <strong>amour</strong>, quiero que sepas que te llevo siempre en mi corazoncito, en mi mente y en todo de mí, porque eres mi mundo entero y súper especial para mí. Eres mi flor favorita y quería que tuvieras algo que no se marchitara. Bueno, espero que te guste, <strong>amour</strong>, y que tengas un gran día, mi vida. ¡Feliz Día de San Valentín! Te amo muchísimo, <strong>amour</strong>." 💖
            </p>
          </div>
        )}
      </div>

      <footer className="mt-12 text-pink-300 text-[9px] font-bold uppercase tracking-[0.4em] opacity-80">
        Contigo a cada instante
      </footer>

      <style>{`
        .flower-wrap {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 80px;
          height: 80px;
        }

        .stem {
          position: absolute;
          bottom: -90px;
          width: 6px;
          height: 140px;
          background: linear-gradient(to top, #1b4332, #40916c);
          border-radius: 10px;
          animation: grow 2.2s ease-out forwards;
        }

        .leaf-left {
          position: absolute;
          bottom: -40px;
          left: -20px;
          width: 25px;
          height: 14px;
          background: #2d6a4f;
          border-radius: 20px 0 20px 0;
          transform: rotate(-35deg);
          animation: leaf-pop 2.5s ease-out;
        }

        .leaf-right {
          position: absolute;
          bottom: -70px;
          right: -20px;
          width: 25px;
          height: 14px;
          background: #2d6a4f;
          border-radius: 0 20px 0 20px;
          transform: rotate(35deg);
          animation: leaf-pop 2.8s ease-out;
        }

        .flower-head {
          position: relative;
          width: 35px;
          height: 35px;
          z-index: 2;
          animation: bloom 2.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .center-circle {
          position: absolute;
          width: 32px;
          height: 32px;
          background: radial-gradient(circle, #ffca3a, #ffb703);
          border-radius: 50%;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 10;
          border: 2px solid rgba(255,255,255,0.4);
          box-shadow: 0 0 10px rgba(255, 183, 3, 0.4);
        }

        .petal {
          position: absolute;
          background: #ff4d6d;
          width: 40px;
          height: 65px;
          border-radius: 50% 50% 50% 50% / 80% 80% 20% 20%;
          left: 50%;
          bottom: 50%;
          transform-origin: bottom center;
          opacity: 0.95;
          box-shadow: inset 0 -8px 15px rgba(0,0,0,0.08);
        }

        .p1 { transform: translateX(-50%) rotate(0deg); }
        .p2 { transform: translateX(-50%) rotate(45deg); }
        .p3 { transform: translateX(-50%) rotate(90deg); }
        .p4 { transform: translateX(-50%) rotate(135deg); }
        .p5 { transform: translateX(-50%) rotate(180deg); }
        .p6 { transform: translateX(-50%) rotate(225deg); }
        .p7 { transform: translateX(-50%) rotate(270deg); }
        .p8 { transform: translateX(-50%) rotate(315deg); }

        @keyframes grow {
          0% { height: 0; bottom: 0; }
          100% { height: 140px; bottom: -90px; }
        }

        @keyframes leaf-pop {
          0%, 65% { opacity: 0; transform: scale(0); }
          100% { opacity: 1; transform: scale(1); }
        }

        @keyframes bloom {
          0% { transform: scale(0) rotate(-45deg); opacity: 0; }
          60% { transform: scale(1.1) rotate(10deg); }
          100% { transform: scale(1) rotate(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default Home;
