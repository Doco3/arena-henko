import React, { useState, useEffect, useRef } from 'react';
import { 
  Menu as MenuIcon, X, Instagram, Mail, Phone, Calendar, Award, Users, Tv, Music, MapPin, 
  CheckCircle, ArrowRight, Lock, Edit2, Save, LogOut, Clock, CalendarDays, Shield, 
  ChevronDown, Info, Beer, Trophy, Star, Activity, MessageCircle, History, TrendingUp, MapPinned, Ticket, Zap, Timer, Quote, ChevronLeft, ChevronRight, Camera, Upload, Loader2, Hash, LockKeyhole, Image as ImageIcon, Trash2, ArrowLeft, KeyRound
} from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged, signInWithCustomToken } from 'firebase/auth';
import { getFirestore, collection, addDoc, onSnapshot, query, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';

// --- FIREBASE SETUP ---
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : null;
const appId = typeof __app_id !== 'undefined' ? __app_id : 'arena-henko-master-prod';

let auth, db;
if (firebaseConfig) {
  const app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
}

// --- CONSTANTS & SETTINGS ---
const ADMIN_HASH = "SGVua29AMjAyNiM="; // Senha ofuscada: Henko@2026#
const DEMO_MODE = true;

const TEAM_LOGOS = {
  SPFC: "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/2026.png",
  SAO_BERNARDO: "https://upload.wikimedia.org/wikipedia/pt/e/e7/S%C3%A3o_Bernardo_Futebol_Clube_Logo.PNG",
  SANTOS: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Santos_logo.svg/1045px-Santos_logo.svg.png",
  MIRASSOL: "https://upload.wikimedia.org/wikipedia/commons/5/5b/Mirassol_FC_logo.png",
  FLAMENGO: "https://upload.wikimedia.org/wikipedia/commons/9/93/Flamengo-RJ_%28BRA%29.png",
  PRIMAVERA: "https://upload.wikimedia.org/wikipedia/pt/0/0c/Esporte_Clube_Primavera_logo.png",
  GREMIO: "https://a.espncdn.com/i/teamlogos/soccer/500/6273.png",
  CHAPECOENSE: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Associa%C3%A7%C3%A3o_Chapecoense_de_Futebol_logo.svg/500px-Associa%C3%A7%C3%A3o_Chapecoense_de_Futebol_logo.svg.png",
  PORTUGUESA: "https://upload.wikimedia.org/wikipedia/commons/d/db/Portuguesa_de_Desportos.png"
};

const MENU_LINKS = [
  { name: 'Sobre', href: '#sobre', view: 'home' },
  { name: 'Serviços', href: '#servicos', view: 'home' },
  { name: 'Calendário 2026', href: '#calendario', view: 'home' },
  { name: 'Mídia & Parceiros', href: '#parceiros', view: 'home' },
  { name: 'Galeria', href: '#galeria', view: 'gallery' },
  { name: 'Contato', href: '#contato', view: 'home' },
];

const SERVICES_LIST = [
  { title: 'Lounge de Hospitalidade', icon: <Users className="w-8 h-8 text-red-400" />, desc: 'Ponto exclusivo para networking, briefings e relaxamento pré-evento.', imageUrl: 'https://i.imgur.com/Bw5Yw4K.png' },
  { title: 'Recepção Exclusiva', icon: <Award className="w-8 h-8 text-red-400" />, desc: 'Atendimento premium e acesso rápido e diferenciado desde a chegada.', imageUrl: 'https://i.imgur.com/pLUfmBf.png' },
  { title: 'Ambiente Premium', icon: <Music className="w-8 h-8 text-red-400" />, desc: 'Open bar, Open Food com culinária sofisticada e entretenimento ao vivo.', imageUrl: 'https://i.imgur.com/Za2zSyx.png' },
  { title: 'Networking', icon: <CheckCircle className="w-8 h-8 text-red-400" />, desc: 'O ambiente ideal para expandir a sua rede de contactos profissionais.', imageUrl: 'https://i.imgur.com/PrhiB8E.png' },
  { title: 'Vista Privilegiada', icon: <MapPin className="w-8 h-8 text-red-400" />, desc: 'Acesso exclusivo e visão privilegiada do campo/palco.', imageUrl: 'https://i.imgur.com/7R1hOwg.png' },
  { title: 'Branding & Mídia', icon: <Tv className="w-8 h-8 text-red-400" />, desc: 'Ativações de marca em Ring LED e relatórios de envolvimento.', imageUrl: 'https://i.imgur.com/Gy62moQ.png' },
];

const SPORT_EVENTS = [
  { 
    id: 2, name: 'Campeonato Paulista', subtitle: 'Paulistão Sicredi 2026', image: 'https://i.imgur.com/Kl9LPUl.png', 
    matches: [
      { id: 'm3', date: '31/01', home: 'SPFC', away: 'Santos', time: '20h30', homeLogo: TEAM_LOGOS.SPFC, awayLogo: TEAM_LOGOS.SANTOS, location: 'Morumbis', scarcity: 'Alta Procura' },
      { id: 'm4', date: '07/02', home: 'SPFC', away: 'Primavera', time: '20h30', homeLogo: TEAM_LOGOS.SPFC, awayLogo: TEAM_LOGOS.PRIMAVERA, location: 'Morumbis' },
    ]
  },
  { id: 4, name: 'Copa do Brasil', subtitle: 'Mata-Mata', image: 'https://upload.wikimedia.org/wikipedia/pt/9/96/CopaDoBrasil.png', matches: [] },
  { id: 3, name: 'Sudamericana', subtitle: 'CONMEBOL', image: 'https://upload.wikimedia.org/wikipedia/en/thumb/c/c2/CONMEBOL_Sudamericana_logo_%282017%29.svg/250px-CONMEBOL_Sudamericana_logo_%282017%29.svg.png', matches: [] },
  { 
    id: 1, name: 'Brasileirão', subtitle: 'Série A', image: 'https://a.espncdn.com/combiner/i?img=/i/leaguelogos/soccer/500/85.png', 
    matches: [
      { id: 'br1', date: '28/01', home: 'SPFC', away: 'Flamengo', time: '21h30', homeLogo: TEAM_LOGOS.SPFC, awayLogo: TEAM_LOGOS.FLAMENGO, location: 'Morumbis', scarcity: 'Alta Procura' },
      { id: 'br2', date: '11/02', home: 'SPFC', away: 'Grêmio', time: '21h30', homeLogo: TEAM_LOGOS.SPFC, awayLogo: TEAM_LOGOS.GREMIO, location: 'Morumbis' },
      { id: 'br3', date: '12/03', home: 'SPFC', away: 'Chapecoense', time: '20h00', homeLogo: TEAM_LOGOS.SPFC, awayLogo: TEAM_LOGOS.CHAPECOENSE, location: 'Morumbis' }
    ]
  },
];

const SHOWS_EVENTS = [
  { name: 'AC/DC', date: '2026', subtitle: 'PWR UP TOUR', image: 'https://i.imgur.com/XawIqwq.jpg', desc: 'O rock mundial invade o Morumbis.' },
  { name: 'The Weeknd', date: '2026', subtitle: 'After Hours Til Dawn', image: 'https://i.imgur.com/1zpCq3e.jpg', desc: 'Show visual imperdível.' },
  { name: 'Festa do Peão', date: 'Agosto 2026', subtitle: '70 Anos', image: 'https://i.imgur.com/GW8we0X.png', desc: 'Hospitalidade Arena Henko em Barretos.' },
];

const PARTNER_LOGOS = [
  { name: 'Mali Pizzaria', logoUrl: 'https://i.imgur.com/YxcN44a.png', extraSize: true },
  { name: 'Santa Helena', logoUrl: 'https://i.imgur.com/XjXzNik.png', extraSize: true },
  { name: 'Tirolez', logoUrl: 'https://i.imgur.com/4NmAzLu.png', extraSize: true },
  { name: 'Matsuya', logoUrl: 'https://i.imgur.com/EeCB2GL.png', extraSize: true },
  { name: 'Cap-Lab', logoUrl: 'https://i.imgur.com/LDGTXoZ.png' },
  { name: 'Oster', logoUrl: 'https://i.imgur.com/Kqwt8YH.png' },
  { name: 'Kicaldo', logoUrl: 'https://i.imgur.com/6ZVogLo.png' },
  { name: 'Estado Luso', logoUrl: 'https://i.imgur.com/rS7PHb3.png' },
  { name: 'Churrasboat', logoUrl: 'https://i.imgur.com/CZ9lYO8.png', extraSize: true },
  { name: 'Esfiha Imigrantes', logoUrl: 'https://i.imgur.com/VEjZgiI.png', extraSize: true },
  { name: 'Colonial Padaria', logoUrl: 'https://i.imgur.com/cexxcrW.png' },
  { name: 'Henko Produções', logoUrl: 'https://i.imgur.com/qVnwNYs.png' },
  { name: 'Weach', logoUrl: 'https://i.imgur.com/jz15iRQ.png' },
];

const TESTIMONIALS = [
  { name: "Ricardo Silva", role: "Torcedor SPFC", text: "A melhor vista do Morumbis! O serviço de open food é impecável.", initial: "R" },
  { name: "Fernanda M.", role: "Camarote Premium", text: "Experiência única. A comodidade de chegar e ter tudo pronto.", initial: "F" },
  { name: "Pedro Almeida", role: "Empresário", text: "Simplesmente fantástico. O ambiente para networking é ótimo.", initial: "P" }
];

// --- UTILITY COMPONENTS ---

const ImageWithFallback = ({ src, alt, className, fallback }) => {
  const [error, setError] = useState(false);
  useEffect(() => { setError(false); }, [src]);
  if (error) return fallback || <div className={`${className} bg-neutral-800 flex items-center justify-center rounded-full`}><Shield className="w-1/2 h-1/2 text-gray-600" /></div>;
  return <img src={src} alt={alt} className={className} onError={() => setError(true)} referrerPolicy="no-referrer" />;
};

const compressImage = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const scaleSize = MAX_WIDTH / img.width;
        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scaleSize;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.7)); 
      };
    };
  });
};

// --- MAIN APP COMPONENT ---

const App = () => {
  // Navigation
  const [currentView, setCurrentView] = useState('home'); 
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminInputPass, setAdminInputPass] = useState('');
  const [loginError, setLoginError] = useState(''); 
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Content
  const [activeSportId, setActiveSportId] = useState(2); 
  const [expandedMatchKey, setExpandedMatchKey] = useState(null);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [toast, setToast] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Data
  const [user, setUser] = useState(null);
  const [galleryPhotos, setGalleryPhotos] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  // UI Handlers
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleNavClick = (view, href) => {
    setCurrentView(view);
    setIsMenuOpen(false); 
    if (view === 'home' && href && href !== '#') {
      setTimeout(() => {
        const element = document.querySelector(href);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const parseMatchDate = (dateStr, timeStr) => {
    const [day, month] = dateStr.split('/').map(Number);
    const [hours, minutes] = timeStr.replace('h', ':').split(':').map(Number);
    return new Date(2026, month - 1, day, hours, minutes);
  };

  const getNextUpcomingMatch = () => {
    const allMatches = SPORT_EVENTS.flatMap(sport => sport.matches.map(m => ({ ...m, parsedDate: parseMatchDate(m.date, m.time) })));
    return allMatches.filter(m => m.parsedDate > new Date()).sort((a, b) => a.parsedDate - b.parsedDate)[0];
  };

  const nextMatch = getNextUpcomingMatch();

  const getMatchTitle = (matchId) => {
    let foundMatch = null;
    SPORT_EVENTS.forEach(s => s.matches.forEach(m => { if(m.id === matchId) foundMatch = m }));
    return foundMatch ? `${foundMatch.home} x ${foundMatch.away}` : "Evento Arena";
  };

  const isUploadAllowed = (dateStr, timeStr) => {
    if (DEMO_MODE) return true; 
    const matchDate = parseMatchDate(dateStr, timeStr);
    const now = new Date();
    const diffHours = (now - matchDate) / (1000 * 60 * 60);
    return diffHours >= -2 && diffHours <= 4;
  };

  const generateMatchHashtag = (home, away) => `#ArenaHenko${home.replace(/\s+/g, '')}x${away.replace(/\s+/g, '')}`;

  const handleAdminLogin = (e) => {
    e.preventDefault(); 
    if (btoa(adminInputPass) === ADMIN_HASH) { setIsAdminLoggedIn(true); setLoginError(''); } 
    else { setLoginError("Senha incorreta"); }
  };

  const handleDeletePhoto = async (photoId) => {
    if (!db || !user) return;
    try {
      const photoDoc = doc(db, 'artifacts', appId, 'public', 'data', 'fan_gallery', photoId);
      await deleteDoc(photoDoc);
      setDeleteConfirmId(null);
      showToast("Foto removida com sucesso!");
    } catch (err) {
      showToast("Erro ao remover foto.");
    }
  };

  // Firebase Effects
  useEffect(() => {
    if (!auth) return;
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) await signInWithCustomToken(auth, __initial_auth_token);
        else await signInAnonymously(auth);
      } catch (e) {}
    };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user || !db) return;
    const photosCollection = collection(db, 'artifacts', appId, 'public', 'data', 'fan_gallery');
    const unsubscribe = onSnapshot(photosCollection, (snapshot) => {
      const photos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      photos.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
      setGalleryPhotos(photos);
    }, (err) => {
      console.error("Firebase Sync Error:", err);
    });
    return () => unsubscribe();
  }, [user]);

  const handleFileUpload = async (event, matchId) => {
    const file = event.target.files?.[0];
    if (!file || !user || !db) return;
    setIsUploading(true);
    try {
      const compressedBase64 = await compressImage(file);
      const photosCollection = collection(db, 'artifacts', appId, 'public', 'data', 'fan_gallery');
      await addDoc(photosCollection, {
        matchId, 
        image: compressedBase64, 
        userId: user.uid, 
        userName: "Torcedor VIP", 
        timestamp: Date.now()
      });
      showToast("Sua foto foi enviada!");
    } catch (err) { 
      console.error(err); 
      showToast("Erro ao enviar foto.");
    } finally { 
      setIsUploading(false); 
      if (fileInputRef.current) fileInputRef.current.value = ''; 
    }
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!nextMatch) return;
    const interval = setInterval(() => {
      const diff = nextMatch.parsedDate - new Date();
      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / 1000 / 60) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [nextMatch]);

  const getWaLink = (msg) => `https://wa.me/5511940741355?text=${encodeURIComponent(msg)}`;

  // --- RENDER PARTS ---

  const renderHome = () => (
    <div className="animate-fadeIn">
      {/* Hero */}
      <section className="relative h-[95vh] flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-30"><img src="https://i.imgur.com/lKKQfgK.png" className="w-full h-full object-cover" alt="Hero Arena" /></div>
        <div className="relative z-10 px-4 text-center max-w-4xl mx-auto text-white">
          <h1 className="text-6xl md:text-9xl font-black mb-6 uppercase leading-none tracking-tighter">ARENA <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-800">HENKO</span></h1>
          <p className="text-lg md:text-xl text-gray-400 font-light mb-12 uppercase tracking-[0.3em]">Hospitalidade Premium & Experiências</p>
          <button onClick={() => handleNavClick('home', '#calendario')} className="inline-flex px-12 py-5 bg-red-600 text-white rounded-full font-black text-sm hover:bg-red-700 transition-all items-center gap-3 uppercase tracking-widest shadow-2xl">Explorar Agenda <ArrowRight className="w-5 h-5"/></button>

          <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-3xl mx-auto">
            {nextMatch && (
              <button onClick={() => handleNavClick('home', '#calendario')} className="bg-neutral-900/80 backdrop-blur-md border border-neutral-800 p-5 rounded-3xl flex items-center gap-4 hover:border-red-600 transition-all text-left group relative">
                <div className="absolute -top-3 -right-2 bg-red-600 text-white text-[8px] font-black px-3 py-1 rounded-full animate-bounce shadow-lg shadow-red-900/50">ÚLTIMAS VAGAS</div>
                <div className="bg-neutral-800 p-3 rounded-2xl group-hover:bg-red-600 transition-colors shrink-0"><ImageWithFallback src={nextMatch.homeLogo} className="w-8 h-8 object-contain" /></div>
                <div className="flex-1 min-w-0">
                   <p className="text-[9px] text-red-500 font-black uppercase tracking-widest mb-1 flex items-center gap-1"><Ticket className="w-3 h-3"/> Próximo Jogo</p>
                   <p className="text-sm font-black truncate uppercase text-white">{nextMatch.home} x {nextMatch.away}</p>
                   <div className="bg-black/40 px-2 py-1 rounded-lg text-[9px] font-mono text-gray-300 border border-neutral-800 w-fit mt-1 uppercase">
                      {timeLeft.days}D : {timeLeft.hours}H : {timeLeft.minutes}M
                   </div>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-700 group-hover:text-white" />
              </button>
            )}
            <button onClick={() => window.open(getWaLink(`Tenho interesse nos shows da Arena Henko`))} className="bg-neutral-900/80 backdrop-blur-md border border-neutral-800 p-5 rounded-3xl flex items-center gap-4 hover:border-red-600 transition-all text-left group">
                <div className="bg-neutral-800 p-3 rounded-2xl group-hover:bg-red-600 transition-colors shrink-0 text-white"><Music className="w-8 h-8" /></div>
                <div className="flex-1 min-w-0 text-white">
                   <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest mb-1 text-gray-400">Próximo Show</p>
                   <p className="text-sm font-black truncate uppercase">{SHOWS_EVENTS[0].name}</p>
                   <p className="text-[10px] text-red-500 font-bold mt-1 uppercase">{SHOWS_EVENTS[0].date}</p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-700 group-hover:text-white" />
            </button>
          </div>
        </div>
      </section>

      {/* Sobre */}
      <section id="sobre" className="py-32 px-4 border-y border-neutral-900 bg-neutral-950 text-white">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-20 items-center text-left">
          <div>
            <span className="text-red-600 font-black text-[10px] uppercase tracking-[0.5em] mb-4 block text-red-600">EXCLUSIVIDADE</span>
            <h2 className="text-5xl md:text-7xl font-black uppercase mb-8 leading-tight">O Palco da sua <br/>Próxima História</h2>
            <p className="text-gray-400 text-lg leading-relaxed mb-10 font-light text-white">No coração do Morumbis, a Arena Henko redefine hospitalidade. Gastronomia de alto padrão, conforto absoluto e a energia vibrante do estádio.</p>
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-neutral-800 text-white font-bold">
              <div><h4 className="text-3xl font-black">5+</h4><p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Anos</p></div>
              <div><h4 className="text-3xl font-black">100+</h4><p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Eventos</p></div>
              <div><h4 className="text-3xl font-black">SP</h4><p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Sede</p></div>
            </div>
          </div>
          <div className="grid gap-4">
             <div className="bg-neutral-900/50 p-8 rounded-[48px] border border-neutral-800 hover:border-red-900/50 transition-all group text-white">
                <Star className="text-red-600 w-8 h-8 mb-4 group-hover:scale-110 transition-transform" />
                <h4 className="text-xl font-black uppercase mb-2">Hospitalidade Elite</h4>
                <p className="text-gray-500 text-sm font-light">Serviço de catering premium assinado por chefs e atendimento especializado.</p>
             </div>
             <div className="bg-neutral-900/50 p-8 rounded-[48px] border border-neutral-800 hover:border-red-900/50 transition-all group text-white">
                <Shield className="text-red-600 w-8 h-8 mb-4 group-hover:scale-110 transition-transform" />
                <h4 className="text-xl font-black uppercase mb-2">Privacidade Total</h4>
                <p className="text-gray-500 text-sm font-light">Ambiente climatizado, seguro e reservado para networking de alto valor.</p>
             </div>
          </div>
        </div>
      </section>

      {/* Serviços */}
      <section id="servicos" className="py-32 px-4 bg-neutral-900/20 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-black uppercase mb-20 tracking-tighter">A Experiência Completa</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {SERVICES_LIST.map((s, i) => (
              <div key={i} className="group relative h-[480px] rounded-[56px] overflow-hidden border border-neutral-800 hover:border-red-600/50 transition-all duration-700 shadow-2xl">
                <div className="absolute inset-0 z-0"><img src={s.imageUrl} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100" alt={s.title} /></div>
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/70 to-transparent z-10"></div>
                <div className="relative z-20 h-full p-10 flex flex-col justify-end text-left text-white">
                  <div className="bg-red-900/40 p-4 rounded-3xl w-fit mb-6 text-red-500 backdrop-blur-md">{s.icon}</div>
                  <h3 className="text-2xl font-black uppercase mb-3 leading-none">{s.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed font-light">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Calendário */}
      <section id="calendario" className="py-32 px-4 bg-neutral-950 text-white text-center">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl font-black uppercase tracking-tighter mb-16">Temporada <span className="text-red-600">2026</span></h2>
          
          <div className="flex flex-wrap gap-2 mb-12 justify-center">
            {SPORT_EVENTS.map(s => (
              <button key={s.id} onClick={() => setActiveSportId(s.id)} className={`px-8 py-4 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeSportId === s.id ? 'bg-red-600 text-white shadow-xl scale-105' : 'bg-neutral-900 text-gray-500 hover:text-gray-300'}`}>
                {s.name}
              </button>
            ))}
          </div>

          <div className="bg-neutral-900/30 backdrop-blur-sm rounded-[60px] p-8 border border-neutral-800 shadow-3xl text-white">
             <div className="grid lg:grid-cols-5 gap-12 items-center text-center">
                <div className="lg:col-span-2 flex flex-col items-center">
                   <div className="w-48 h-48 mb-8 bg-neutral-950 rounded-[48px] p-10 flex items-center justify-center border border-neutral-800 overflow-hidden relative shadow-inner">
                      <ImageWithFallback key={activeSportId} src={SPORT_EVENTS.find(s => s.id === activeSportId).image} className={`max-w-full max-h-full object-contain transition-transform duration-700 group-hover:scale-110 p-2 ${activeSportId === 3 ? 'brightness-0 invert' : ''}`} fallback={<Trophy className="w-20 h-20 text-red-600" />} />
                   </div>
                   <h3 className="text-3xl font-black uppercase tracking-tight leading-none text-white">{SPORT_EVENTS.find(s => s.id === activeSportId).name}</h3>
                   <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.5em] mt-4">{SPORT_EVENTS.find(s => s.id === activeSportId).subtitle}</p>
                </div>
                <div className="lg:col-span-3 w-full space-y-4 text-left">
                  <h4 className="text-red-500 text-[11px] font-black uppercase tracking-[0.5em] mb-8 flex items-center gap-3 justify-center lg:justify-start text-red-500 uppercase tracking-widest"><Clock className="w-4 h-4"/> Agenda Morumbis</h4>
                  {SPORT_EVENTS.find(s => s.id === activeSportId).matches.length > 0 ? SPORT_EVENTS.find(s => s.id === activeSportId).matches.map((m, i) => (
                    <div key={i} className="bg-neutral-950/80 border border-neutral-800 rounded-[32px] overflow-hidden hover:border-red-600/30 transition-all text-white">
                        <button onClick={() => setExpandedMatchKey(expandedMatchKey === i ? null : i)} className="w-full p-6 flex items-center justify-between">
                           <div className="flex items-center gap-6">
                              <span className="text-lg font-black text-red-600 w-16">{m.date}</span>
                              <div className="flex items-center gap-4">
                                <img src={m.homeLogo} className="w-10 h-10 object-contain" alt="H" />
                                <span className="text-xs font-black opacity-30 text-white">VS</span>
                                <img src={m.awayLogo} className="w-10 h-10 object-contain" alt="A" />
                              </div>
                              <div className="hidden sm:block text-left text-white">
                                <p className="text-sm font-black uppercase">{m.home} x {m.away}</p>
                                <p className="text-[10px] text-gray-500 font-bold uppercase">{m.time}</p>
                              </div>
                           </div>
                           <ChevronDown className={`w-5 h-5 text-gray-600 transition-transform ${expandedMatchKey === i ? 'rotate-180 text-red-500' : ''}`} />
                        </button>
                        {expandedMatchKey === i && (
                          <div className="p-8 border-t border-neutral-900 bg-neutral-900/20 text-center animate-fadeInUp">
                             <div className="grid md:grid-cols-2 gap-8 mb-4">
                                <div className="p-6 bg-black/40 rounded-[32px] border border-neutral-800 flex flex-col justify-between h-full min-h-[200px]">
                                   <div><p className="text-[10px] text-gray-500 font-black uppercase mb-2">Hospitalidade Arena</p><p className="text-2xl font-black text-white uppercase tracking-tight">2H ANTES DO JOGO</p></div>
                                   <button onClick={() => window.open(getWaLink(`Quero reservar para ${m.home} x ${m.away} dia ${m.date}`))} className="w-full mt-6 bg-red-600 py-4 rounded-2xl font-black uppercase text-xs shadow-xl hover:bg-red-700 transition-colors text-white">Garantir Lugar</button>
                                </div>
                                <div className="p-6 bg-black/40 rounded-[32px] border border-neutral-800 flex flex-col items-center justify-center h-full min-h-[200px]">
                                   <Camera className="w-8 h-8 text-red-600 mb-3" />
                                   <h5 className="text-sm font-black text-white uppercase mb-2 text-white text-center font-bold">Fan Cam Arena</h5>
                                   <div className="w-full">
                                      <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={(e) => handleFileUpload(e, m.id)} />
                                      <button onClick={() => fileInputRef.current.click()} disabled={!isUploadAllowed(m.date, m.time) || isUploading} className={`w-full py-4 rounded-2xl font-bold text-[10px] uppercase flex items-center justify-center gap-2 border transition-all ${isUploadAllowed(m.date, m.time) ? 'bg-neutral-800 text-gray-200' : 'bg-neutral-900/50 text-gray-600 cursor-not-allowed'}`}>{isUploading ? <Loader2 className="w-4 h-4 animate-spin"/> : <Upload className="w-4 h-4"/>} {isUploading ? "Enviando..." : "Subir Foto"}</button>
                                   </div>
                                </div>
                             </div>
                          </div>
                        )}
                    </div>
                  )) : <div className="p-20 border border-dashed border-neutral-800 rounded-[40px] text-center opacity-30 text-white font-black uppercase tracking-widest text-white">Agenda em definição</div>}
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Shows */}
      <section className="py-32 px-4 bg-neutral-900/30 text-center text-white">
         <div className="max-w-7xl mx-auto">
            <h3 className="text-3xl font-black text-red-500 mb-16 uppercase tracking-[0.2em]">Shows & Entretenimento</h3>
            <div className="grid md:grid-cols-3 gap-8">
               {SHOWS_EVENTS.map((e, i) => (
                  <div key={i} className="flex flex-col items-center group cursor-pointer text-white" onClick={() => window.open(getWaLink(`Interesse no show do ${e.name} na Arena Henko`))}>
                     <div className="relative rounded-[48px] overflow-hidden aspect-[4/5] border border-neutral-800 shadow-2xl w-full mb-8 transition-all duration-700 group-hover:scale-[1.03] group-hover:border-red-600/50">
                        <img src={e.image} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 group-hover:brightness-110" alt={e.name} />
                     </div>
                     <span className="bg-red-600 text-white text-[10px] font-black px-5 py-1.5 rounded-full mb-4 uppercase tracking-widest">{e.date}</span>
                     <h4 className="text-3xl font-black uppercase mb-2 tracking-tighter text-white uppercase">{e.name}</h4>
                     <p className="text-gray-500 text-sm font-light mb-6 uppercase tracking-widest">{e.desc}</p>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* Parceiros */}
      <section id="parceiros" className="py-32 px-8 bg-neutral-950 border-y border-neutral-900 text-white">
         <div className="max-w-7xl mx-auto text-center">
            <h3 className="text-[10px] text-gray-600 font-black uppercase tracking-[0.6em] mb-16">Marcas de Elite Connosco</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-12 items-center text-white">
               {PARTNER_LOGOS.map((p, i) => (
                  <div key={i} className={`bg-neutral-900/50 border border-neutral-800 rounded-[32px] h-32 flex items-center justify-center transition-all group hover:border-red-600/30 ${p.extraSize ? 'p-4' : 'p-8'}`}>
                    <img src={p.logoUrl} className={`h-full w-full object-contain transition-all duration-500 group-hover:scale-110 ${p.extraSize ? 'scale-110' : ''}`} alt={p.name} />
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* Reviews */}
      <section className="py-32 px-4 bg-neutral-900/10 text-center text-white">
         <div className="max-w-7xl mx-auto text-center">
            <h3 className="text-4xl font-black uppercase mb-20 tracking-tighter text-white uppercase">A Melhor Avaliação</h3>
            <div className="grid md:grid-cols-3 gap-8 text-left text-white">
               {TESTIMONIALS.map((r, i) => (
                  <div key={i} className="bg-neutral-900/50 p-10 rounded-[56px] border border-neutral-800 relative group hover:border-red-600/30 transition-all text-white">
                     <Quote className="w-12 h-12 text-red-600/10 absolute top-8 right-8 group-hover:text-red-600/20 transition-colors" />
                     <p className="text-gray-300 text-sm italic mb-10 leading-relaxed font-light">"{r.text}"</p>
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-red-600/20 border border-red-600/30 rounded-full flex items-center justify-center font-black text-red-500 uppercase">{r.initial}</div>
                        <div><p className="text-white text-xs font-black uppercase tracking-wider">{r.name}</p><p className="text-gray-600 text-[10px] font-bold uppercase">{r.role}</p></div>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* Contato */}
      <section id="contato" className="py-40 bg-neutral-950 px-6 text-center text-white border-t border-neutral-900">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-5xl md:text-8xl font-black mb-12 uppercase tracking-tighter font-black">Reserve sua <br/><span className="text-red-600 underline decoration-red-600/30 underline-offset-[12px]">Experiência.</span></h2>
          <div className="grid md:grid-cols-3 gap-6 text-white">
             <a href="https://instagram.com/arenahenko" target="_blank" className="flex flex-col items-center p-12 bg-neutral-900/30 rounded-[56px] border border-neutral-800 hover:border-red-600 transition-all group shadow-xl"><Instagram className="w-12 h-12 text-red-600 mb-6 group-hover:scale-110 transition-transform text-red-600" /><span className="font-black text-xs uppercase tracking-widest text-white font-bold">Instagram</span></a>
             <a href="https://wa.me/5511940741355" target="_blank" className="flex flex-col items-center p-12 bg-neutral-900/30 rounded-[56px] border border-neutral-800 hover:border-green-600 transition-all group shadow-xl text-white"><Phone className="w-12 h-12 text-green-600 mb-6 group-hover:scale-110 transition-transform text-green-600" /><span className="font-black text-xs uppercase tracking-widest text-white font-bold">WhatsApp</span></a>
             <a href="mailto:sergio@henkoproducoes.com.br" className="flex flex-col items-center p-12 bg-neutral-900/30 rounded-[56px] border border-neutral-800 hover:border-red-600 transition-all group shadow-xl"><Mail className="w-12 h-12 text-red-600 mb-6 group-hover:scale-110 transition-transform text-red-600" /><span className="font-black text-xs uppercase tracking-widest text-white font-bold">E-mail</span></a>
          </div>
        </div>
      </section>
    </div>
  );

  const renderGallery = () => (
    <div className="pt-32 pb-20 px-4 min-h-screen bg-neutral-950 animate-fadeIn text-center text-white">
      <div className="max-w-7xl mx-auto">
        <button onClick={() => handleNavClick('home', '#')} className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors uppercase text-[10px] font-black tracking-widest mb-10 mx-auto border border-neutral-800 px-10 py-5 rounded-full bg-neutral-900/50 shadow-xl hover:bg-neutral-800"><ArrowLeft className="w-4 h-4" /> Voltar para o Site</button>
        <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter mb-20 text-white text-center">Galeria da <span className="text-red-600 underline decoration-red-600/20 underline-offset-8 text-red-600 font-black">Torcida</span></h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {galleryPhotos.map((photo) => (
            <div key={photo.id} className="aspect-[4/5] relative group overflow-hidden rounded-[56px] border border-neutral-800 bg-neutral-900 shadow-2xl transition-all hover:border-red-600/50 hover:-translate-y-3">
              <img src={photo.image} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt="Moment" />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 opacity-80"></div>
              <div className="absolute bottom-0 left-0 right-0 p-10 text-left">
                <span className="bg-red-600 text-white text-[8px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest mb-3 inline-block border border-red-500/30 backdrop-blur-sm">{getMatchTitle(photo.matchId)}</span>
                <p className="text-white text-lg font-black uppercase tracking-tight text-white">{photo.userName}</p>
                <p className="text-gray-500 text-[10px] font-bold mt-1 uppercase tracking-widest">{new Date(photo.timestamp).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAdmin = () => (
    <div className="pt-32 pb-20 px-4 min-h-screen flex flex-col items-center bg-neutral-950 animate-fadeIn text-white text-center">
       {!isAdminLoggedIn ? (
         <div className="bg-neutral-900 p-16 rounded-[60px] border border-neutral-800 max-w-md w-full text-center mt-20 shadow-3xl text-white">
            <LockKeyhole className="w-20 h-20 text-red-600 mx-auto mb-10 animate-pulse text-red-600" />
            <h2 className="text-3xl font-black uppercase mb-4 tracking-tighter text-white">Área Admin</h2>
            <form onSubmit={handleAdminLogin} className="flex flex-col gap-6 text-white">
               <input type="password" placeholder="SENHA" className="bg-neutral-950 border border-neutral-800 rounded-2xl px-6 py-6 text-white text-center font-bold outline-none focus:border-red-600 text-2xl tracking-widest transition-all placeholder:text-gray-800 text-white" value={adminInputPass} onChange={(e) => setAdminInputPass(e.target.value)} />
               <button type="submit" className="bg-red-600 text-white py-5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl hover:bg-red-700">Entrar</button>
               {loginError && <p className="text-red-500 text-xs font-bold mt-2 text-red-500 animate-pulse">{loginError}</p>}
            </form>
         </div>
       ) : (
         <div className="w-full max-w-7xl px-4 text-white">
            <div className="flex justify-between items-center mb-20 text-white">
                <button onClick={() => setIsAdminLoggedIn(false)} className="bg-neutral-800 text-gray-400 px-10 py-4 rounded-full font-black uppercase text-[10px] hover:text-white transition-all shadow-xl">Sair</button>
                <h2 className="text-4xl font-black uppercase tracking-tighter text-white uppercase tracking-widest">Moderação Fan Cam</h2>
                <div className="w-24"></div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 text-white">
              {galleryPhotos.map((photo) => (
                <div key={photo.id} className="relative aspect-square rounded-[48px] overflow-hidden group border border-neutral-800 bg-neutral-900 shadow-xl transition-all hover:border-red-600/50 text-white">
                   <img src={photo.image} className="w-full h-full object-cover opacity-50" />
                   <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity">
                      {deleteConfirmId === photo.id ? (
                        <div className="flex gap-2 text-white">
                           <button onClick={() => handleDeletePhoto(photo.id)} className="bg-red-600 text-white p-4 rounded-full border-2 border-white hover:scale-110 transition-all shadow-2xl"><Trash2 className="w-6 h-6" /></button>
                           <button onClick={() => setDeleteConfirmId(null)} className="bg-neutral-800 text-white p-4 rounded-full border-2 border-white hover:scale-110 transition-all shadow-2xl text-white"><X className="w-6 h-6" /></button>
                        </div>
                      ) : (
                        <button onClick={() => setDeleteConfirmId(photo.id)} className="bg-red-600 text-white p-6 rounded-full border-4 border-neutral-950 shadow-2xl hover:scale-110 text-white"><Trash2 className="w-6 h-6 text-white" /></button>
                      )}
                   </div>
                </div>
              ))}
            </div>
         </div>
       )}
    </div>
  );

  return (
    <div className="font-sans text-gray-100 bg-neutral-950 min-h-screen selection:bg-red-600 selection:text-white overflow-x-hidden">
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 1s ease-out forwards; }
        .animate-fadeInUp { animation: fadeInUp 0.6s ease-out forwards; }
      `}</style>

      {/* TOAST VISUAL */}
      {toast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[2000] animate-fadeInUp">
           <div className="bg-red-600 text-white px-8 py-4 rounded-full font-black uppercase text-xs shadow-2xl flex items-center gap-3 shadow-[0_0_40px_rgba(220,38,38,0.5)]">
              <CheckCircle className="w-4 h-4" /> {toast}
           </div>
        </div>
      )}

      {/* MENU STICKY E VISÍVEL */}
      <nav className={`sticky top-0 w-full z-[999] h-20 flex justify-between items-center px-8 border-b border-neutral-800 bg-neutral-950/95 backdrop-blur-md transition-all duration-500 text-white`}>
        <button onClick={() => handleNavClick('home', '#')} className="hover:scale-105 transition-transform flex items-center">
          <img src="https://i.imgur.com/cSYIvq6.png" className="h-8 w-auto" alt="Logo" />
        </button>

        <div className="hidden sm:flex space-x-10 items-center text-white">
          {ARENA_MENU_LINKS.map(n => (
            <button 
              key={n.name} 
              onClick={() => handleNavClick(n.view, n.href)} 
              className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors hover:text-red-500 ${currentView === n.view ? 'text-red-600 font-black' : 'text-gray-400'}`}
            >
              {n.name}
            </button>
          ))}
          <button onClick={() => handleNavClick('home', '#contato')} className="bg-red-600 text-white px-10 py-3 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-red-700 transition-all shadow-xl shadow-red-900/40">Reservar</button>
        </div>

        <button onClick={() => setIsMenuOpen(true)} className="sm:hidden text-white p-3 bg-neutral-900 rounded-xl border border-neutral-800 shadow-lg text-white">
          <MenuIcon className="w-6 h-6 text-white" />
        </button>
      </nav>

      {/* Menu Mobile Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[1000] bg-neutral-950/98 backdrop-blur-3xl flex flex-col items-center justify-center space-y-10 md:hidden animate-fadeIn text-white text-center">
          <button onClick={() => setIsMenuOpen(false)} className="absolute top-8 right-8 text-white p-3 border border-neutral-800 rounded-full text-white"><X className="w-10 h-10 text-white" /></button>
          {ARENA_MENU_LINKS.map(n => (
            <button key={n.name} onClick={() => handleNavClick(n.view, n.href)} className="text-4xl font-black uppercase hover:text-red-500 tracking-tighter text-white">{n.name}</button>
          ))}
          <button onClick={() => handleNavClick('home', '#contato')} className="bg-red-600 text-white px-16 py-6 rounded-full font-black text-sm uppercase tracking-widest shadow-2xl">Reservar Agora</button>
        </div>
      )}

      <main>
        {currentView === 'home' && renderHome()}
        {currentView === 'gallery' && renderGallery()}
        {currentView === 'admin' && renderAdmin()}
      </main>

      <footer className="py-24 bg-neutral-950 border-t border-neutral-900 relative text-center text-white text-center">
        <div className="absolute bottom-6 right-6 opacity-20 hover:opacity-100 transition-opacity cursor-pointer p-4 group" onClick={() => handleNavClick('admin')}>
           <LockKeyhole className="w-6 h-6 text-gray-500 group-hover:text-red-600 text-white" />
        </div>
        <img src="https://i.imgur.com/cSYIvq6.png" className="h-12 mx-auto mb-10 grayscale opacity-30" alt="Footer Logo" />
        <p className="text-[11px] font-bold uppercase tracking-[0.5em] text-gray-400 mb-2">Hospitalidade Arena Henko © 2026</p>
        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-500">Morumbis • São Paulo • Brasil</p>
      </footer>
    </div>
  );
};

export default App;
