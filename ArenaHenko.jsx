import React, { useState, useEffect, useRef } from 'react';
import { 
  Menu as MenuIcon, X, Instagram, Mail, Phone, Calendar, Award, Users, Tv, Music, MapPin, 
  CheckCircle, ArrowRight, Lock, Edit2, Save, LogOut, Clock, CalendarDays, Shield, 
  ChevronDown, Info, Beer, Trophy, Star, Activity, MessageCircle, History, TrendingUp, MapPinned, Ticket, Zap, Timer, Quote, ChevronLeft, ChevronRight, Download, Trash2, Camera, Upload, Loader2, LockKeyhole, ArrowLeft, Filter
} from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged, signInWithCustomToken } from 'firebase/auth';
import { getFirestore, collection, addDoc, onSnapshot, query, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';

// --- CONFIGURAÇÃO DO FIREBASE (RULE 1 & 3) ---
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {
  apiKey: "", 
  authDomain: "arena-henko-official.firebaseapp.com",
  projectId: "arena-henko-official",
  storageBucket: "arena-henko-official.appspot.com",
  messagingSenderId: "000000000000",
  appId: "1:000000000000:web:000000000000"
};

const appId = typeof __app_id !== 'undefined' ? __app_id : 'arena-henko-master-prod';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// --- CONFIGURAÇÕES DO APP ---
const ADMIN_HASH = "SGVua29AMjAyNiM="; // Senha: Henko@2026#
const LOGO_WM_URL = 'https://i.imgur.com/cSYIvq6.png';

// --- DADOS ESTÁTICOS ---
const TEAM_LOGOS = {
  SPFC: "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/2026.png",
  SAO_BERNARDO: "https://upload.wikimedia.org/wikipedia/pt/e/e7/S%C3%A3o_Bernardo_Futebol_Clube_Logo.PNG",
  SANTOS: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Santos_logo.svg/1045px-Santos_logo.svg.png",
  PORTUGUESA: "https://upload.wikimedia.org/wikipedia/commons/d/db/Portuguesa_de_Desportos.png",
  PRIMAVERA: "https://upload.wikimedia.org/wikipedia/pt/0/0c/Esporte_Clube_Primavera_logo.png",
  MIRASSOL: "https://upload.wikimedia.org/wikipedia/commons/5/5b/Mirassol_FC_logo.png",
  CORINTHIANS: "https://i.imgur.com/Y7x93X4.png",
  PALMEIRAS: "https://i.imgur.com/6XvS8wM.png",
  FLAMENGO: "https://upload.wikimedia.org/wikipedia/commons/9/93/Flamengo-RJ_%28BRA%29.png",
  BRAGANTINO: "https://i.imgur.com/YwN9Tsh.png",
  GREMIO: "https://a.espncdn.com/i/teamlogos/soccer/500/6273.png",
  CHAPECOENSE: "https://upload.wikimedia.org/wikipedia/commons/f/ff/Chapecoense_Logo.png"
};

const NAV_LINKS = [
  { name: 'Sobre', href: '#sobre', view: 'home' },
  { name: 'Serviços', href: '#servicos', view: 'home' },
  { name: 'Calendário 2026', href: '#calendario', view: 'home' },
  { name: 'Mídia & Parceiros', href: '#parceiros', view: 'home' },
  { name: 'Galeria', href: '#galeria', view: 'gallery' },
  { name: 'Contato', href: '#contato', view: 'home' },
];

const SERVICES_DATA = [
  { title: 'Lounge de Hospitalidade', icon: <Users className="w-8 h-8" />, desc: 'Ponto exclusivo para networking, briefings e relaxamento pré-evento.', imageUrl: 'https://i.imgur.com/Bw5Yw4K.png' },
  { title: 'Recepção Exclusiva', icon: <Award className="w-8 h-8" />, desc: 'Atendimento premium e acesso rápido e diferenciado desde a chegada.', imageUrl: 'https://i.imgur.com/pLUfmBf.png' },
  { title: 'Ambiente Premium', icon: <Music className="w-8 h-8" />, desc: 'Open bar, Open Food com culinária sofisticada e entretenimento ao vivo.', imageUrl: 'https://i.imgur.com/Za2zSyx.png' },
  { title: 'Networking', icon: <CheckCircle className="w-8 h-8" />, desc: 'O ambiente ideal para expandir a sua rede de contactos profissionais.', imageUrl: 'https://i.imgur.com/PrhiB8E.png' },
  { title: 'Vista Privilegiada', icon: <MapPin className="w-8 h-8" />, desc: 'Acesso exclusivo e visão privilegiada do campo/palco.', imageUrl: 'https://i.imgur.com/7R1hOwg.png' },
  { title: 'Branding & Mídia', icon: <Tv className="w-8 h-8" />, desc: 'Ativações de marca em Ring LED e relatórios de envolvimento.', imageUrl: 'https://i.imgur.com/Gy62moQ.png' },
];

const SPORT_DATA = [
  { 
    id: 2, name: 'Campeonato Paulista', subtitle: 'Paulistão Sicredi 2026', image: 'https://i.imgur.com/Kl9LPUl.png', 
    matches: [
      { id: 'm3', date: '31/01', home: 'SPFC', away: 'Santos', time: '20h30', homeLogo: TEAM_LOGOS.SPFC, awayLogo: TEAM_LOGOS.SANTOS, location: 'Morumbis', scarcity: 'Alta Procura' },
      { id: 'm4', date: '07/02', home: 'SPFC', away: 'Primavera', time: '20h30', homeLogo: TEAM_LOGOS.SPFC, awayLogo: TEAM_LOGOS.PRIMAVERA, location: 'Morumbis' },
    ],
  },
  { 
    id: 1, name: 'Brasileirão', subtitle: 'Série A', image: "https://a.espncdn.com/combiner/i?img=/i/leaguelogos/soccer/500/85.png", 
    matches: [
      { id: 'br1', date: '28/01', home: 'SPFC', away: 'Flamengo', time: '21h30', homeLogo: TEAM_LOGOS.SPFC, awayLogo: TEAM_LOGOS.FLAMENGO, location: 'Morumbis', scarcity: 'Alta Procura' },
      { id: 'br2', date: '11/02', home: 'SPFC', away: 'Grêmio', time: '21h30', homeLogo: TEAM_LOGOS.SPFC, awayLogo: TEAM_LOGOS.GREMIO, location: 'Morumbis' },
      { id: 'br3', date: '12/03', home: 'SPFC', away: 'Chapecoense', time: '20h00', homeLogo: TEAM_LOGOS.SPFC, awayLogo: TEAM_LOGOS.CHAPECOENSE, location: 'Morumbis' }
    ],
  },
];

const SHOWS_DATA = [
  { name: 'AC/DC', date: '2026', subtitle: 'PWR UP TOUR', image: 'https://i.imgur.com/XawIqwq.jpg', desc: 'O rock mundial invade o Morumbis.' },
  { name: 'The Weeknd', date: '2026', subtitle: 'After Hours Til Dawn', image: 'https://i.imgur.com/1zpCq3e.jpg', desc: 'Show visual imperdível.' },
  { name: 'Festa do Peão', date: 'Agosto 2026', subtitle: '70 Anos', image: 'https://i.imgur.com/GW8we0X.png', desc: 'Hospitalidade Arena Henko em Barretos.' },
];

const PARTNERS_DATA = [
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

const REVIEWS_DATA = [
  { name: "Ricardo Silva", role: "Torcedor SPFC", text: "A melhor vista do Morumbis! O serviço de open food é impecável do início ao fim e a equipe super atenciosa.", initial: "R" },
  { name: "Fernanda M.", role: "Camarote Premium", text: "Experiência única. A comodidade de chegar e ter tudo pronto, bebida gelada e comida quente.", initial: "F" },
  { name: "Pedro Almeida", role: "Empresário", text: "Simplesmente fantástico. O ambiente para networking é ótimo e os shows pós-jogo são um diferencial.", initial: "P" },
];

// --- UTILITÁRIOS ---

const ImageWithFallback = ({ src, alt, className }) => {
  const [error, setError] = useState(false);
  useEffect(() => { setError(false); }, [src]);
  if (error) return <div className={`${className} bg-neutral-800 flex items-center justify-center rounded-lg`}><Shield className="w-8 h-8 text-gray-600" /></div>;
  return <img src={src} alt={alt} className={className} onError={() => setError(true)} referrerPolicy="no-referrer" />;
};

const processImageWithWatermark = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const MAX_WIDTH = 1200;
        const scaleSize = MAX_WIDTH / img.width;
        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scaleSize;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        const logo = new Image();
        logo.crossOrigin = "anonymous";
        logo.src = LOGO_WM_URL;
        logo.onload = () => {
          const wmWidth = canvas.width * 0.15;
          const wmHeight = (logo.height * wmWidth) / logo.width;
          const margin = canvas.width * 0.03;
          ctx.globalAlpha = 0.8;
          ctx.drawImage(logo, canvas.width - wmWidth - margin, canvas.height - wmHeight - margin, wmWidth, wmHeight);
          ctx.globalAlpha = 1.0;
          resolve(canvas.toDataURL('image/jpeg', 0.8));
        };
        logo.onerror = () => resolve(canvas.toDataURL('image/jpeg', 0.8));
      };
    };
  });
};

const App = () => {
  // Navigation
  const [currentView, setCurrentView] = useState('home'); 
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminInputPass, setAdminInputPass] = useState('');
  const [loginError, setLoginError] = useState(''); 
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Content State
  const [activeSportId, setActiveSportId] = useState(2); 
  const [expandedMatchKey, setExpandedMatchKey] = useState(null);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [visibleItems, setVisibleItems] = useState({});
  const [toast, setToast] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [galleryFilter, setGalleryFilter] = useState('Todos');

  // Firebase State
  const [user, setUser] = useState(null);
  const [galleryPhotos, setGalleryPhotos] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState('Geral');
  const fileInputRef = useRef(null);

  const availableAlbums = [
    'Geral',
    ...SPORT_DATA.flatMap(s => s.matches.map(m => `${m.home} x ${m.away}`)),
    ...SHOWS_DATA.map(e => e.name)
  ];

  // Helper de Data - Robustez contra tela branca
  const parseMatchDate = (dateStr, timeStr) => {
    if (!dateStr || !timeStr) return new Date(2099, 0, 1);
    try {
      const [day, month] = dateStr.split('/').map(Number);
      const [hours, minutes] = timeStr.replace('h', ':').split(':').map(Number);
      return new Date(2026, month - 1, day, hours, minutes);
    } catch (e) {
      return new Date(2099, 0, 1);
    }
  };

  const nextMatch = (SPORT_DATA || []).flatMap(sport => sport.matches.map(m => ({ ...m, pD: parseMatchDate(m.date, m.time) })))
    .filter(m => m.pD > new Date()).sort((a, b) => a.pD - b.pD)[0];

  const selectedSport = (SPORT_DATA || []).find(s => s.id === activeSportId);
  const visibleMatches = selectedSport ? selectedSport.matches : [];

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

  const handleAdminLogin = (e) => {
    e.preventDefault(); 
    if (btoa(adminInputPass) === ADMIN_HASH) {
      setIsAdminLoggedIn(true);
      setLoginError('');
      showToast("Acesso Master Liberado");
    } else {
      setLoginError("Senha incorreta");
    }
  };

  const handleDownload = (base64, filename) => {
    const link = document.createElement('a');
    link.href = base64;
    link.download = filename || 'arena-henko.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Baixando imagem...");
  };

  const handleDeletePhoto = async (photoId) => {
    if (!db || !user) return;
    try {
      await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'fan_gallery', photoId));
      setDeleteConfirmId(null);
      showToast("Foto removida");
    } catch (err) { showToast("Erro ao excluir"); }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file || !user || !db) return;
    setIsUploading(true);
    try {
      const processed = await processImageWithWatermark(file);
      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'fan_gallery'), {
        image: processed,
        timestamp: Date.now(),
        album: selectedAlbum,
        adminUid: user.uid
      });
      showToast(`Sucesso! Foto salva no álbum: ${selectedAlbum}`);
    } catch (err) { 
      console.error(err);
      showToast("Erro no upload."); 
    } finally { 
      setIsUploading(false); 
      if (fileInputRef.current) fileInputRef.current.value = ''; 
    }
  };

  // Firebase Auth (RULE 3)
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (e) { console.error("Auth error", e); }
    };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  // Data Sync
  useEffect(() => {
    if (!user || !db) return;
    const photosCol = collection(db, 'artifacts', appId, 'public', 'data', 'fan_gallery');
    const unsubscribe = onSnapshot(photosCol, (snapshot) => {
      const photos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      photos.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
      setGalleryPhotos(photos);
    }, (err) => {
      console.error("Firestore Error:", err);
    });
    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setVisibleItems((prev) => ({ ...prev, [entry.target.id]: true }));
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    document.querySelectorAll('.animate-on-scroll').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!nextMatch) return;
    const interval = setInterval(() => {
      const diff = nextMatch.pD - new Date();
      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / 86400000),
          hours: Math.floor((diff / 3600000) % 24),
          minutes: Math.floor((diff / 60000) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [nextMatch]);

  const getWaLink = (msg) => `https://wa.me/5511940741355?text=${encodeURIComponent(msg)}`;

  // --- RENDERS ---

  const renderHome = () => (
    <div className="animate-fadeIn">
      {/* Hero */}
      <section className="relative h-[90vh] flex flex-col items-center justify-center overflow-hidden bg-black text-center">
        <div className="absolute inset-0 z-0 opacity-40"><img src="https://i.imgur.com/lKKQfgK.png" className="w-full h-full object-cover" alt="Hero" /></div>
        <div className="relative z-10 px-4 text-white w-full max-w-4xl">
          <h1 className="text-6xl md:text-9xl font-black mb-6 uppercase leading-none tracking-tighter">ARENA <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-800 text-white font-black">HENKO</span></h1>
          <p className="max-w-2xl mx-auto text-xl text-gray-400 font-light mb-10 uppercase tracking-[0.3em]">Hospitalidade Premium & Experiências</p>
          <a href="#calendario" className="inline-flex px-10 py-5 bg-red-600 text-white rounded-full font-bold text-sm hover:bg-red-700 transition-all items-center gap-2 uppercase tracking-widest shadow-2xl">Explorar Agenda <ArrowRight className="w-5 h-5"/></a>
          
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl mx-auto relative z-20">
              {nextMatch && (
                <button onClick={() => window.open(getWaLink(`Quero reservar o jogo: ${nextMatch.home} x ${nextMatch.away}`))} className="relative bg-neutral-900/80 backdrop-blur-md border border-neutral-800 p-4 rounded-2xl flex items-center gap-4 hover:border-red-600 transition-all group text-left w-full overflow-visible">
                    <div className="absolute -top-3 -right-2 z-30 bg-red-600 text-white text-[8px] font-black px-3 py-1 rounded-full animate-bounce shadow-lg shadow-red-900/50 flex items-center gap-1 uppercase">
                       <Zap className="w-3 h-3 fill-white" /> ÚLTIMAS VAGAS
                    </div>
                    <div className="bg-neutral-800 p-3 rounded-xl group-hover:bg-red-600 transition-colors shrink-0 h-[60px] flex items-center justify-center font-bold">
                        <ImageWithFallback src={nextMatch.homeLogo} className="w-8 h-8 object-contain" alt="Time" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start text-white">
                          <div>
                            <p className="text-[9px] text-red-500 uppercase font-bold tracking-widest mb-1 flex items-center gap-1"><Ticket className="w-3 h-3"/> Próximo Jogo</p>
                            <h3 className="text-sm font-bold uppercase truncate mb-1">{nextMatch.home} x {nextMatch.away}</h3>
                          </div>
                          <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-white ml-2 shrink-0 mt-2 transition-colors"/>
                        </div>
                        <div className="flex items-center gap-2 mt-1 bg-black/40 p-1.5 rounded-lg w-fit border border-neutral-800/50 text-[10px] font-mono text-gray-300">
                          <Timer className="w-3 h-3 text-red-500 animate-pulse" />
                          <span>{String(timeLeft.days).padStart(2, '0')}d : {String(timeLeft.hours).padStart(2, '0')}h : {String(timeLeft.minutes).padStart(2, '0')}m</span>
                        </div>
                    </div>
                </button>
              )}
              <button onClick={() => window.open(getWaLink(`Interesse shows Arena Henko`))} className="bg-neutral-800 p-3 rounded-xl group-hover:bg-red-600 transition-colors shrink-0 h-full min-h-[60px] flex items-center justify-center text-white font-bold">
                   <div className="bg-neutral-800 p-3 rounded-xl group-hover:bg-red-600 transition-colors shrink-0 h-full min-h-[60px] flex items-center justify-center text-white font-bold">
                      <Music className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                      <p className="text-[9px] text-gray-400 uppercase font-bold tracking-widest mb-1 flex items-center gap-2 font-black"><Star className="w-3 h-3"/> Próximo Show</p>
                      <h3 className="text-sm font-bold text-white uppercase truncate font-bold">{SHOWS_DATA[0].name}</h3>
                      <p className="text-[10px] text-red-500 font-bold uppercase">{SHOWS_DATA[0].date}</p>
                  </div>
                   <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-white ml-2 shrink-0 transition-colors"/>
              </button>
          </div>
        </div>
      </section>

      {/* Sobre */}
      <section id="sobre" className="py-32 px-4 border-b border-neutral-900 text-center text-white bg-neutral-950">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-20 items-center text-left">
          <div>
            <span className="text-red-600 font-bold text-[10px] uppercase tracking-[0.4em] mb-4 block">EXCLUSIVIDADE</span>
            <h2 className="text-5xl font-black text-white uppercase mb-8 leading-tight">O palco da sua próxima história</h2>
            <p className="text-gray-400 text-lg leading-relaxed mb-8 font-light">Localizada no coração do Morumbis, a Arena Henko redefine hospitalidade. Gastronomia, conforto e a melhor vista do espetáculo em um ambiente planejado para o seu prazer.</p>
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-neutral-800 text-white font-bold">
              <div><h4 className="text-3xl font-black">5+</h4><p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Anos</p></div>
              <div><h4 className="text-3xl font-black">100+</h4><p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Eventos</p></div>
              <div><h4 className="text-3xl font-black">SP</h4><p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Sede</p></div>
            </div>
          </div>
          <div className="grid gap-4">
             <div className="bg-neutral-900/50 p-8 rounded-[32px] border border-neutral-800 text-left hover:border-red-900/50 transition-all group">
                <Star className="text-red-600 w-6 h-6 mb-4 group-hover:scale-110 transition-transform font-bold" />
                <h4 className="text-xl font-bold uppercase mb-2 text-white">Hospitalidade Elite</h4>
                <p className="text-gray-400 text-sm leading-relaxed font-light">Serviço de catering premium assinado por chefs e atendimento especializado durante todo o evento.</p>
             </div>
             <div className="bg-neutral-900/50 p-8 rounded-[32px] border border-neutral-800 text-left hover:border-red-900/50 transition-all group text-white font-black">
                <Shield className="text-red-600 w-8 h-8 mb-4 group-hover:scale-110 transition-transform text-red-600 font-bold" />
                <h4 className="text-xl font-bold uppercase mb-2 text-white font-bold">Privacidade Total</h4>
                <p className="text-gray-400 text-sm leading-relaxed font-light">Ambiente seguro e reservado para networking de alto valor entre convidados e parceiros.</p>
             </div>
          </div>
        </div>
      </section>

      {/* Serviços */}
      <section id="servicos" className="py-32 bg-neutral-900/30 px-4 text-white text-center">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-bold uppercase mb-20 tracking-tighter text-white">A Experiência Completa</h2>
          <div className="grid md:grid-cols-3 gap-8 text-left">
            {SERVICES_DATA.map((s, i) => (
              <div key={i} className="group relative h-[480px] rounded-[40px] overflow-hidden border border-neutral-800 hover:border-red-600/50 transition-all duration-1000">
                <div className="absolute inset-0 z-0"><img src={s.imageUrl} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-110" alt={s.title} /></div>
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/70 to-transparent z-10"></div>
                <div className="relative z-20 h-full p-10 flex flex-col justify-end">
                  <div className="bg-red-900/40 p-4 rounded-3xl w-fit mb-6 text-red-500 backdrop-blur-md font-bold">{s.icon}</div>
                  <h3 className="text-2xl font-bold uppercase mb-3 leading-none text-white">{s.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Calendário */}
      <section id="calendario" className="py-32 px-4 text-white text-center bg-neutral-950">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <h2 className="text-5xl font-bold uppercase tracking-tighter text-white font-black font-black">Temporada <span className="text-red-600 font-black">2026</span></h2>
            <div className="w-24 h-1 bg-red-600 mx-auto rounded-full mt-6 shadow-[0_0_15px_rgba(220,38,38,0.5)]"></div>
          </div>
          <div className="flex flex-wrap gap-2 mb-12 justify-center text-white">
            {SPORT_DATA.map(s => (
              <button key={s.id} onClick={() => setActiveSportId(s.id)} className={`px-8 py-4 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${activeSportId === s.id ? 'bg-red-600 text-white shadow-xl scale-105 font-black' : 'bg-neutral-900 text-gray-500 hover:text-gray-300'}`}>{s.name}</button>
            ))}
          </div>
          {selectedSport && (
            <div className="bg-neutral-900/30 backdrop-blur-sm rounded-[50px] p-8 md:p-16 border border-neutral-800 shadow-3xl text-white font-bold">
              <div className="grid lg:grid-cols-5 gap-12 items-center text-center">
                <div className="lg:col-span-2 flex flex-col items-center">
                  <div className="w-40 h-40 lg:w-56 lg:h-56 mb-6 bg-neutral-950 rounded-[30px] p-8 flex items-center justify-center border border-neutral-800 shadow-inner group transition-all hover:border-red-600/30 overflow-hidden relative text-white">
                    <ImageWithFallback key={selectedSport.id} src={selectedSport.image} className={`max-w-full max-h-full object-contain transition-transform duration-700 group-hover:scale-110 p-2 ${selectedSport.id === 3 ? 'brightness-0 invert' : ''}`} alt="Champ" fallback={<Trophy className="w-16 h-16 text-red-600" />} />
                  </div>
                  <h3 className="text-3xl lg:text-4xl font-black uppercase leading-none text-white font-bold">{selectedSport.name}</h3>
                  <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.5em] mt-3">{selectedSport.subtitle}</p>
                </div>
                <div className="lg:col-span-3 w-full text-white font-bold">
                  <h4 className="text-red-500 text-[11px] font-bold uppercase tracking-[0.4em] mb-6 flex items-center gap-3 justify-center lg:justify-start text-red-500 font-black"><Clock className="w-4 h-4"/> Agenda Morumbis</h4>
                  <div className="space-y-3">
                    {visibleMatches.length > 0 ? visibleMatches.map((m, i) => (
                      <div key={i} className="bg-neutral-950/50 border border-neutral-800 rounded-[24px] overflow-hidden hover:border-red-600/30 transition-all relative text-white text-left font-bold font-black">
                        <button onClick={() => setExpandedMatchKey(expandedMatchKey === i ? null : i)} className="w-full p-5 flex items-center justify-between text-white text-left font-black">
                          <div className="flex items-center gap-4 lg:gap-6">
                            <span className="text-[11px] font-bold text-gray-600 w-10">{m.date}</span>
                            <div className="flex items-center gap-3 font-black">
                              <span className="text-[11px] lg:text-[12px] font-bold uppercase hidden sm:block font-black">{m.home}</span>
                              <ImageWithFallback src={m.homeLogo} className="w-6 h-6 object-contain font-black" alt="H" />
                              <span className="text-[10px] font-bold opacity-20">VS</span>
                              <ImageWithFallback src={m.awayLogo} className="w-6 h-6 object-contain font-black" alt="A" />
                              <span className="text-[11px] lg:text-[12px] font-bold uppercase hidden sm:block font-black">{m.away}</span>
                            </div>
                            {m.scarcity && (
                              <div className="ml-2 hidden sm:flex items-center gap-1 bg-red-600/10 border border-red-600/30 px-2 py-1 rounded-full animate-pulse text-red-500 uppercase font-black font-bold font-black font-black"><Zap className="w-3 h-3 fill-red-500 font-black" /><span className="text-[8px] tracking-widest font-black uppercase font-black">{m.scarcity}</span></div>
                            )}
                          </div>
                          <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${expandedMatchKey === i ? 'rotate-180 text-red-500' : ''}`} />
                        </button>
                        {expandedMatchKey === i && (
                          <div className="p-6 border-t border-neutral-800 bg-neutral-900/30 text-center animate-fade-in text-white font-black font-black">
                            <div className="grid grid-cols-2 gap-4 mb-6 border-y border-neutral-800 py-4 text-center font-bold font-black">
                              <div><p className="text-[9px] text-gray-500 uppercase mb-1 text-gray-400 uppercase tracking-widest font-bold font-black font-black">Hora do Jogo</p><p className="text-lg font-bold text-white uppercase font-black font-black font-black">{m.time}</p></div>
                              <div><p className="text-[9px] text-gray-500 uppercase mb-1 text-gray-400 uppercase tracking-widest font-bold font-black font-black">Lounge Arena</p><p className="text-lg font-bold text-white uppercase font-bold font-black font-black font-black">2h antes</p></div>
                            </div>
                            <button onClick={() => window.open(getWaLink(`Reserva jogo: ${m.home} x ${m.away}`))} className="w-full bg-red-600 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest text-white font-bold shadow-xl hover:scale-[1.02] transition-all">Reservar Agora</button>
                          </div>
                        )}
                      </div>
                    )) : <div className="p-8 border border-dashed border-neutral-800 rounded-[24px] text-center opacity-30 text-[11px] font-black uppercase text-white font-black font-black">Sem jogos agendados</div>}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Shows */}
      <section className="py-32 bg-neutral-900/30 px-4 text-white text-center text-white font-black">
         <div className="max-w-7xl mx-auto">
            <h3 className="text-3xl font-black text-red-500 mb-16 uppercase tracking-[0.2em] text-red-500 font-bold font-black font-black">Shows & Entretenimento</h3>
            <div className="grid md:grid-cols-3 gap-8 text-white text-center font-black">
               {SHOWS_DATA.map((e, i) => (
                  <div key={i} className="flex flex-col items-center group cursor-pointer text-white font-black" onClick={() => window.open(getWaLink(`Tenho interesse no show do ${e.name} na Arena Henko`))}>
                     <div className="relative rounded-[48px] overflow-hidden aspect-[4/5] border border-neutral-800 shadow-2xl w-full mb-8 transition-all duration-700 group-hover:scale-[1.03] group-hover:border-red-600/50">
                        <img src={e.image} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 group-hover:brightness-110 font-bold" alt={e.name} />
                     </div>
                     <span className="bg-red-600 text-white text-[10px] font-bold px-5 py-1.5 rounded-full mb-4 uppercase tracking-widest text-white font-bold">{e.date}</span>
                     <h4 className="text-3xl font-bold uppercase mb-2 tracking-tighter text-white uppercase font-black">{e.name}</h4>
                     <p className="text-gray-400 text-sm font-light mb-6 uppercase tracking-widest leading-relaxed font-normal">{e.desc}</p>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* Parceiros Master */}
      <section id="parceiros" className="py-32 px-8 bg-neutral-950 border-y border-neutral-900 text-white text-center font-bold uppercase tracking-widest font-black">
         <div className="max-w-7xl mx-auto text-center text-white font-black font-black">
            <h3 className="text-[10px] text-gray-600 font-black uppercase tracking-[0.6em] mb-16 text-gray-500 font-bold uppercase tracking-[0.4em] font-black font-black">Marcas de Elite Connosco</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-12 items-center text-white font-black">
               {PARTNERS_DATA.map((p, i) => (
                  <div key={i} className={`bg-neutral-900/50 border border-neutral-800 rounded-[32px] h-32 flex items-center justify-center transition-all group hover:border-red-600/30 ${p.extraSize ? 'p-4' : 'p-8'} font-black`}>
                    <img src={p.logoUrl} className={`h-full w-full object-contain transition-all duration-500 group-hover:scale-110 ${p.extraSize ? 'scale-110' : ''} font-bold`} alt={p.name} />
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* Reviews */}
      <section className="py-32 px-4 bg-neutral-900/10 text-center text-white text-center text-white font-bold uppercase tracking-widest font-black">
         <div className="max-w-7xl mx-auto text-white font-bold font-black">
            <h3 className="text-4xl font-black uppercase mb-16 tracking-tighter text-white uppercase font-bold text-white font-black">A Melhor Avaliação</h3>
            <div className="grid md:grid-cols-3 gap-8 text-left text-white font-bold font-black font-black">
               {REVIEWS_DATA.map((r, i) => (
                  <div key={i} className="bg-neutral-950 p-10 rounded-[56px] border border-neutral-800 relative group hover:border-red-600/30 transition-all text-white font-black font-black font-black">
                     <Quote className="w-12 h-12 text-red-600/10 absolute top-8 right-8 group-hover:text-red-600/20 transition-colors font-black font-black" />
                     <p className="text-gray-300 text-sm italic mb-10 leading-relaxed font-light font-normal text-gray-300">"{r.text}"</p>
                     <div className="flex items-center gap-4 text-white font-bold font-black">
                        <div className="w-12 h-12 bg-red-600/20 border border-red-600/30 rounded-full flex items-center justify-center font-black text-red-500 uppercase text-red-500 font-bold font-bold font-black font-black font-black">{r.initial}</div>
                        <div><p className="text-white text-xs font-bold uppercase tracking-wider font-bold font-black font-black uppercase tracking-widest uppercase">{r.name}</p><p className="text-gray-600 text-[10px] font-bold uppercase font-bold font-black font-black font-black font-black">{r.role}</p></div>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* Contato Original */}
      <section id="contato" className="py-40 bg-neutral-950 px-6 relative overflow-hidden text-white border-t border-neutral-900 text-center font-bold font-black font-black">
        <div className="max-w-4xl mx-auto relative z-10 text-white font-bold font-bold font-bold font-black font-black">
          <h2 className="text-5xl md:text-8xl font-black mb-16 uppercase tracking-tighter text-white font-black text-white font-bold font-black font-black">Reserve sua <br/><span className="text-red-600 underline decoration-red-600/30 underline-offset-8 font-black text-red-600 font-bold font-black font-black">Experiência.</span></h2>
          <div className="grid md:grid-cols-3 gap-8 mb-20 text-white font-bold font-bold font-bold font-black font-black font-black font-black">
             <a href="https://instagram.com/arenahenko" target="_blank" rel="noreferrer" className="flex flex-col items-center p-10 bg-neutral-900/50 rounded-3xl border border-neutral-800 hover:border-red-600 group shadow-xl transition-all font-bold font-black font-black font-black"><Instagram className="w-10 h-10 text-red-600 mb-6 group-hover:scale-110 transition-transform text-red-600 font-bold font-bold font-black font-black font-black" /><span className="font-bold text-[11px] uppercase tracking-[0.2em] font-black font-black font-black font-black">Instagram</span></a>
             <a href="https://wa.me/5511940741355" target="_blank" rel="noreferrer" className="flex flex-col items-center p-10 bg-neutral-900/50 rounded-3xl border border-neutral-800 hover:border-red-600 group shadow-xl transition-all text-white font-bold font-bold font-bold font-black font-black font-black font-black"><Phone className="w-10 h-10 text-red-600 mb-6 group-hover:scale-110 transition-transform text-red-600 font-bold font-bold font-black font-black font-black" /><span className="font-bold text-[11px] uppercase tracking-[0.2em] font-black font-black font-black font-black">WhatsApp</span></a>
             <a href="mailto:sergio@henkoproducoes.com.br" className="flex flex-col items-center p-10 bg-neutral-900/50 rounded-3xl border border-neutral-800 hover:border-red-600 group shadow-xl transition-all text-white font-bold font-bold font-bold font-black font-black font-black font-black"><Mail className="w-10 h-10 text-red-600 mb-6 group-hover:scale-110 transition-transform text-red-600 font-bold font-bold font-black font-black font-black" /><span className="font-bold text-[11px] uppercase tracking-[0.2em] font-black font-black font-black font-black">E-mail</span></a>
          </div>
        </div>
      </section>
    </div>
  );

  const renderGallery = () => (
    <div className="pt-32 pb-20 px-4 min-h-screen bg-neutral-950 animate-fadeIn text-center text-white font-bold font-bold font-bold font-bold uppercase tracking-widest uppercase font-black">
      <div className="max-w-7xl mx-auto text-white font-bold font-bold font-bold font-bold font-bold font-bold uppercase tracking-widest uppercase font-black font-black font-black uppercase tracking-widest uppercase font-black font-black font-black font-black font-black">
        <button onClick={() => handleNavClick('home', '#')} className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors uppercase text-[10px] font-bold tracking-widest mb-10 mx-auto border border-neutral-800 px-10 py-5 rounded-full bg-neutral-900/50 shadow-xl hover:bg-neutral-800 text-gray-400 font-bold font-bold font-bold font-bold font-bold font-bold font-bold font-bold font-bold font-bold uppercase tracking-widest uppercase font-black font-black font-black font-black font-black font-black font-black font-black font-black font-black font-black uppercase tracking-widest uppercase font-black font-black font-black"><ArrowLeft className="w-4 h-4 text-white font-bold font-bold font-bold font-bold font-bold font-bold font-bold font-bold font-bold font-bold font-bold font-bold uppercase tracking-widest uppercase" /> Voltar para o Site</button>
        <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter mb-10 text-white text-center font-bold uppercase font-bold uppercase tracking-widest uppercase font-bold font-bold font-black font-black font-black font-black font-black font-black font-black font-black font-black font-black font-black font-black font-black uppercase tracking-widest uppercase">Galeria da <span className="text-red-600 underline decoration-red-600/20 underline-offset-8 text-red-600 font-bold font-bold font-bold font-bold font-bold font-bold font-bold font-bold font-bold font-bold font-bold font-bold uppercase tracking-widest uppercase">Torcida</span></h2>
        <div className="flex flex-wrap justify-center gap-2 mb-16 text-white text-center font-bold uppercase tracking-widest uppercase font-bold font-bold font-bold font-bold font-bold font-bold font-bold font-bold font-bold font-bold font-bold font-bold font-bold font-bold font-bold font-bold font-bold uppercase tracking-widest uppercase font-black font-black font-black">
            <button onClick={() => setGalleryFilter('Todos')} className={`px-6 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${galleryFilter === 'Todos' ? 'bg-red-600 text-white shadow-lg font-bold font-bold font-bold font-bold font-bold font-bold font-bold font-bold font-bold font-bold font-bold font-bold font-bold font-bold font-bold font-bold font-bold uppercase tracking-widest uppercase font-black font-black font-black' : 'bg-neutral-900 text-gray-500 hover:text-white font-bold font-bold font-bold font-bold font-bold font-bold font-bold font-bold font-bold font-bold font-bold font-bold font-bold font-bold font-bold uppercase tracking-widest uppercase font-black font-black font-black'}`}>Todos</button>
            {availableAlbums.filter(a => a !== 'Geral').map(album => (
              <button key={album} onClick={() => setGalleryFilter(album)} className={`px-6 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${galleryFilter === album ? 'bg-red-600 text-white shadow-lg font-bold font-bold font-bold font-bold font-bold font-bold font-bold font-bold font-bold font-bold font-bold font-bold font-bold font-bold font-bold font-bold font-bold font-bold font-bold font-bold font-bold uppercase tracking-widest uppercase font-black font-black font-black' : 'bg-neutral-900 text-gray-500 hover:text-white font-bold font-bold font-bold font-bold font-bold font-bold font-bold font-bold font-bold font-bold font-bold font-bold font-bold font-bold font-bold font-bold font-bold font-bold font-bold uppercase tracking-widest uppercase font-black font-black font-black'}`}>{album}</button>
            ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 text-white text-center font-bold uppercase tracking-widest uppercase font-bold font-bold font-bold font-bold font-bold font-bold font-bold font-bold font-bold font-bold font-bold font-bold font-bold font-bold font-bold font-bold font-bold uppercase tracking-widest uppercase font-black font-black font-black">
          {galleryPhotos.filter(p => galleryFilter === 'Todos' || p.album === galleryFilter).length > 0 ? galleryPhotos.filter(p => galleryFilter === 'Todos' || p.album === galleryFilter).map((photo) => (
            <div key={photo.id} className="aspect-[4/5] relative group overflow-hidden rounded-[56px] border border-neutral-800 bg-neutral-900 shadow-2xl transition-all hover:border-red-600/50 hover:-translate-y-3 font-black font-black font-black font-black font-black font-black font-black font-black font-black font-black font-black font-black font-black font-black font-black uppercase tracking-widest uppercase font-black font-black font-black">
              <img src={photo.image} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 font-bold font-bold uppercase tracking-widest uppercase font-black font-black font-black font-black font-black font-black font-black font-black font-black font-black font-black font-black font-black uppercase tracking-widest uppercase font-black" alt="Moment" />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 opacity-80 font-black font-black font-black font-black font-black font-black font-black font-black font-black font-black font-black font-black font-black font-black font-black uppercase tracking-widest uppercase font-black font-black font-black"></div>
              <div className="absolute top-4 right-4 z-20 font-black font-black font-black font-black font-black font-black font-black font-black font-black font-black font-black font-black font-black font-black font-black uppercase tracking-widest uppercase font-black font-black font-black">
                <button onClick={() => handleDownload(photo.image, `arena-henko-${photo.id}.jpg`)} className="bg-red-600 text-white p-3 rounded-full shadow-2xl hover:scale-110 transition-transform active:scale-95 font-black font-black font-black font-black font-black font-black font-black font-black font-black font-black font-black font-black font-black font-black font-black uppercase tracking-widest uppercase font-black font-black font-black"><Download className="w-5 h-5 font-black font-black font-black font-black font-black font-black font-black font-black font-black font-black font-black font-black font-black font-black font-black uppercase tracking-widest uppercase font-black font-black font-black" /></button>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-10 text-left text-white font-black font-black font-black font-black font-black font-black font-black font-black font-black font-black font-black font-black font-black font-black font-black uppercase tracking-widest uppercase font-black font-black font-black">
                <span className="bg-red-600 text-white text-[8px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest mb-3 inline-block border border-red-500/30 backdrop-blur-sm font-black font-black font-black font-black font-black font-black font-black font-black font-black font-black font-black font-black font-black font-black font-black uppercase tracking-widest uppercase font-black font-black font-black">{photo.album || 'Geral'}</span>
                <p className="text-white text-lg font-bold uppercase tracking-tight font-black font-black font-black font-black font-black font-black font-black font-black font-black font-black font-black font-black font-black uppercase tracking-widest uppercase font-black font-black font-black">Arena Henko Master</p>
                <p className="text-gray-500 text-[10px] font-bold mt-1 uppercase tracking-widest font-black font-black font-black font-black font-black font-black font-black font-black font-black font-black font-black font-black font-black uppercase tracking-widest uppercase font-black font-black font-black">{new Date(photo.timestamp).toLocaleDateString()}</p>
              </div>
            </div>
          )) : (
            <div className="col-span-full py-40 border-2 border-dashed border-neutral-800 rounded-[5rem] flex flex-col items-center justify-center text-gray-600 bg-neutral-900/20 font-black font-black font-black font-black font-black font-black font-black font-black uppercase tracking-widest uppercase font-black font-black font-black">
               <Camera className="w-20 h-20 mb-6 opacity-10 text-white font-black font-black font-black font-black font-black font-black font-black font-black font-black font-black font-black font-black font-black uppercase tracking-widest uppercase font-black font-black font-black" />
               <p className="text-2xl font-bold uppercase tracking-widest text-white font-black font-black font-black font-black font-black font-black font-black font-black uppercase tracking-widest uppercase font-black font-black font-black">Álbum em Branco...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderAdmin = () => (
    <div className="pt-32 pb-20 px-4 min-h-screen flex flex-col items-center bg-neutral-950 animate-fadeIn text-white text-center font-bold font-black font-black font-black font-black font-black font-black font-black font-black font-black font-black font-black font-black font-black font-black font-black uppercase tracking-widest uppercase font-black font-black">
       {!isAdminLoggedIn ? (
         <div className="bg-neutral-900 p-16 rounded-[60px] border border-neutral-800 max-w-md w-full text-center mt-20 shadow-3xl text-white font-bold text-center text-white font-bold font-bold font-bold font-bold font-bold font-bold font-bold font-bold font-bold font-bold font-bold font-bold uppercase tracking-widest uppercase font-black font-black font-black">
            <LockKeyhole className="w-20 h-20 text-red-600 mx-auto mb-10 animate-pulse text-red-600 font-bold font-bold font-bold font-bold font-bold font-bold font-bold font-bold font-bold font-bold font-bold font-bold uppercase tracking-widest uppercase font-black font-black font-black font-black" />
            <h2 className="text-3xl font-bold uppercase mb-4 tracking-tighter text-white font-bold font-bold font-bold font-bold font-bold font-bold font-bold font-bold font-bold uppercase tracking-widest uppercase font-black font-black font-black">Acesso Master</h2>
            <form onSubmit={handleAdminLogin} className="flex flex-col gap-6 text-white text-center font-bold font-bold font-bold font-bold font-bold font-bold font-bold font-bold font-bold font-bold font-bold font-bold uppercase tracking-widest uppercase font-black font-black font-black font-black">
               <input type="password" placeholder="SENHA" className="bg-neutral-950 border border-neutral-800 rounded-2xl px-6 py-6 text-white text-center font-bold outline-none focus:border-red-600 text-2xl tracking-widest transition-all placeholder:text-gray-800 text-white text-center font-bold font-bold font-bold font-bold font-bold font-bold font-bold font-bold font-bold font-bold font-bold font-bold font-bold uppercase tracking-widest uppercase font-black font-black font-black font-black font-black" value={adminInputPass} onChange={(e) => setAdminInputPass(e.target.value)} />
               <button type="submit" className="bg-red-600 text-white py-5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl hover:bg-red-700 font-bold font-bold font-bold font-bold font-bold font-bold font-bold font-bold font-bold uppercase tracking-widest uppercase font-black font-black font-black font-black">Entrar</button>
               {loginError && <p className="text-red-500 text-xs font-bold mt-2 animate-pulse font-bold font-bold font-bold font-bold font-bold font-bold font-bold font-bold font-bold font-bold font-bold uppercase tracking-widest uppercase font-black font-black font-black font-black font-black">{loginError}</p>}
            </form>
         </div>
       ) : (
         <div className="w-full max-w-7xl px-4 text-white text-center font-bold font-black font-black font-black font-black font-black font-black font-black font-black font-black font-black font-black font-black font-black font-black font-black uppercase tracking-widest uppercase font-black font-black font-black">
            <div className="flex flex-col md:flex-row justify-between items-center mb-20 gap-8 font-black font-black font-black font-black font-black font-black font-black font-black font-black font-black uppercase tracking-widest uppercase font-black font-black font-black">
                <button onClick={() => setIsAdminLoggedIn(false)} className="bg-neutral-800 text-gray-400 px-10 py-4 rounded-full font-bold uppercase text-[10px] hover:text-white transition-all shadow-xl font-bold font-bold font-bold font-bold font-bold font-bold font-bold font-bold font-bold uppercase tracking-widest uppercase font-black font-black font-black">Sair</button>
                <h2 className="text-4xl font-bold uppercase tracking-tighter text-white text-center font-bold uppercase uppercase font-bold uppercase tracking-widest uppercase font-bold font-bold font-bold font-bold font-bold font-bold font-bold font-bold font-bold uppercase tracking-widest uppercase font-black font-black font-black">Gestão de Álbuns</h2>
                <div className="flex flex-col sm:flex-row gap-4 items-center bg-neutral-900 p-6 rounded-[32px] border border-neutral-800 font-black font-black font-black font-black font-black font-black font-black font-black font-black font-black uppercase tracking-widest uppercase font-black font-black font-black">
                  <div className="flex flex-col gap-2 font-black font-black font-black font-black font-black font-black font-black font-black font-black font-black uppercase tracking-widest uppercase font-black font-black font-black">
                    <label className="text-[9px] font-bold uppercase text-gray-500 tracking-widest text-left ml-2 font-black font-black font-black font-black font-black font-black font-black font-black font-black uppercase tracking-widest uppercase font-black font-black font-black">Escolher Destino:</label>
                    <select value={selectedAlbum} onChange={(e) => setSelectedAlbum(e.target.value)} className="bg-neutral-950 border border-neutral-800 text-white text-xs font-bold py-3 px-4 rounded-xl outline-none focus:border-red-600 transition-all cursor-pointer font-bold font-bold font-bold font-bold font-bold font-bold font-bold font-bold font-bold uppercase tracking-widest uppercase font-black font-black font-black">
                      {availableAlbums.map(a => <option key={a} value={a}>{a}</option>)}
                    </select>
                  </div>
                  <div className="relative font-bold font-black font-black font-black font-black font-black font-black font-black font-black font-black uppercase tracking-widest uppercase font-black font-black font-black">
                    <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileUpload} />
                    <button onClick={() => fileInputRef.current.click()} disabled={isUploading} className="bg-red-600 text-white px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-2xl hover:scale-105 transition-all flex items-center gap-3 font-bold font-black font-black font-black font-black font-black font-black font-black font-black font-black uppercase tracking-widest uppercase font-black font-black font-black">
                      {isUploading ? <Loader2 className="w-4 h-4 animate-spin font-black font-black font-black font-black font-black font-black font-black font-black font-black uppercase tracking-widest uppercase font-black font-black font-black"/> : <Upload className="w-4 h-4 font-black font-black font-black font-black font-black font-black font-black font-black font-black uppercase tracking-widest uppercase font-black font-black font-black"/>} Enviar Foto
                    </button>
                  </div>
                </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 font-black font-black font-black font-black font-black font-black font-black font-black font-black font-black uppercase tracking-widest uppercase font-black font-black font-black">
              {galleryPhotos.map((photo) => (
                <div key={photo.id} className="relative aspect-square rounded-[48px] overflow-hidden group border border-neutral-800 bg-neutral-900 shadow-xl transition-all hover:border-red-600/50 font-black font-black font-black font-black font-black font-black font-black font-black font-black font-black uppercase tracking-widest uppercase font-black font-black font-black">
                   <img src={photo.image} className="w-full h-full object-cover opacity-50 font-bold font-bold font-bold font-bold font-bold font-bold font-bold font-bold font-bold font-bold uppercase tracking-widest uppercase font-black font-black font-black font-black font-black font-black font-black font-black uppercase tracking-widest uppercase font-black font-black font-black" alt="Admin" />
                   <div className="absolute top-2 left-2 bg-black/60 px-2 py-1 rounded-lg text-[8px] font-bold text-white uppercase tracking-tighter truncate max-w-[80%] font-bold font-bold font-bold font-bold font-bold font-bold font-bold font-bold font-bold font-bold uppercase tracking-widest uppercase font-black font-black font-black font-black font-black font-black font-black font-black uppercase tracking-widest uppercase font-black font-black font-black">{photo.album || 'Geral'}</div>
                   <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity font-black font-black font-black font-black font-black font-black font-black font-black font-black font-black uppercase tracking-widest uppercase font-black font-black font-black">
                      {deleteConfirmId === photo.id ? (
                        <div className="flex gap-2 font-bold font-black font-black font-black font-black font-black font-black font-black font-black uppercase tracking-widest uppercase font-black font-black font-black">
                           <button onClick={() => handleDeletePhoto(photo.id)} className="bg-red-600 text-white p-4 rounded-full border-2 border-white hover:scale-110 transition-all shadow-2xl text-white font-bold font-bold font-bold font-bold font-bold font-bold font-bold font-bold font-bold uppercase tracking-widest uppercase font-black font-black font-black font-black font-black font-black font-black font-black uppercase tracking-widest uppercase font-black font-black font-black"><Trash2 className="w-6 h-6 text-white font-bold font-bold font-bold font-bold font-bold font-bold font-bold font-bold font-bold uppercase tracking-widest uppercase font-black font-black font-black font-black font-black font-black font-black font-black font-bold font-black font-black font-black font-black font-black font-black font-black uppercase tracking-widest uppercase font-black font-black font-black" /></button>
                           <button onClick={() => setDeleteConfirmId(null)} className="bg-neutral-800 text-white p-4 rounded-full border-2 border-white hover:scale-110 transition-all shadow-2xl text-white font-bold font-bold font-bold font-bold font-bold font-bold font-bold font-bold font-bold uppercase tracking-widest uppercase font-black font-black font-black font-black font-black font-black font-black font-black uppercase tracking-widest uppercase font-black font-black font-black"><X className="w-6 h-6 text-white font-bold font-bold font-bold font-bold font-bold font-bold font-bold font-bold font-bold uppercase tracking-widest uppercase font-black font-black font-black font-black font-black font-black font-black font-black font-black font-black font-black font-black font-black font-black font-black font-black uppercase tracking-widest uppercase font-black font-black font-black" /></button>
                        </div>
                      ) : (
                        <button onClick={() => setDeleteConfirmId(photo.id)} className="bg-red-600 text-white p-6 rounded-full border-4 border-neutral-950 shadow-2xl hover:scale-110 text-white font-bold text-white font-bold font-bold font-bold font-bold font-bold font-bold font-bold font-bold uppercase tracking-widest uppercase font-black font-black font-black font-black font-black font-black font-black font-black uppercase tracking-widest uppercase font-black font-black font-black"><Trash2 className="w-6 h-6 text-white font-bold font-bold font-bold font-bold font-bold font-bold font-bold font-bold font-bold uppercase tracking-widest uppercase font-black font-black font-black font-black font-black font-black font-black font-black font-bold font-black font-black font-black font-black font-black font-black font-black uppercase tracking-widest uppercase font-black font-black font-black" /></button>
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
    <div className="font-sans text-gray-100 bg-neutral-950 min-h-screen selection:bg-red-600 selection:text-white overflow-x-hidden text-center text-white">
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 1s ease-out forwards; }
        .animate-fadeInUp { animation: fadeInUp 0.6s ease-out forwards; }
      `}</style>

      {toast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[2000] animate-fadeInUp text-center font-bold">
           <div className="bg-red-600 text-white px-8 py-4 rounded-full font-black uppercase text-xs shadow-[0_0_40px_rgba(220,38,38,0.5)] flex items-center gap-3 font-bold font-black">
              <CheckCircle className="w-4 h-4 text-white font-bold font-black" /> {toast}
           </div>
        </div>
      )}

      {/* HEADER FIXO COM BLUR E FUNDO PERMANENTE */}
      <nav className={`fixed w-full z-50 transition-all duration-300 bg-neutral-950/80 backdrop-blur-md border-b ${scrolled ? 'border-neutral-800' : 'border-white/10'} h-20 flex justify-between items-center px-8 text-white font-bold font-black`}>
        <button onClick={() => handleNavClick('home', '#')} className="hover:scale-105 transition-transform flex items-center font-bold font-black">
          <img src="https://i.imgur.com/cSYIvq6.png" className="h-8 w-auto font-bold font-black" alt="Logo" />
        </button>

        <div className="hidden md:flex space-x-10 items-center font-bold font-black">
          {NAV_LINKS.map(n => (
            <button key={n.name} onClick={() => handleNavClick(n.view, n.href)} className={`text-[10px] font-bold uppercase tracking-widest transition-colors hover:text-red-500 font-black ${currentView === n.view ? 'text-red-600 font-bold font-black' : 'text-gray-100 font-bold font-black'}`}>{n.name}</button>
          ))}
          <button onClick={() => handleNavClick('home', '#contato')} className="bg-red-600 text-white px-8 py-2 rounded-full font-black text-[10px] uppercase tracking-widest hover:scale-105 shadow-xl shadow-red-900/40 cursor-pointer font-bold font-black">Reservar</button>
        </div>

        <button onClick={() => setIsMenuOpen(true)} className="md:hidden text-white p-2 font-bold font-black">
          <MenuIcon className="w-6 h-6 font-bold font-black" />
        </button>
      </nav>

      {isMenuOpen && (
        <div className="fixed inset-0 z-[1000] bg-neutral-950/98 backdrop-blur-3xl flex flex-col items-center justify-center space-y-10 md:hidden animate-fadeIn font-bold font-black">
          <button onClick={() => setIsMenuOpen(false)} className="absolute top-8 right-8 text-white p-3 border border-neutral-800 rounded-full font-bold font-black"><X className="w-10 h-10 font-bold font-black" /></button>
          {NAV_LINKS.map(n => (
            <button key={n.name} onClick={() => handleNavClick(n.view, n.href)} className="text-4xl font-black uppercase hover:text-red-500 tracking-tighter font-bold font-black">{n.name}</button>
          ))}
          <button onClick={() => handleNavClick('home', '#contato')} className="bg-red-600 text-white px-16 py-6 rounded-full font-black text-sm uppercase tracking-widest shadow-2xl font-bold font-black">Reservar Agora</button>
        </div>
      )}

      <main>
        {currentView === 'home' && renderHome()}
        {currentView === 'gallery' && renderGallery()}
        {currentView === 'admin' && renderAdmin()}
      </main>

      <footer className="py-24 border-t border-neutral-900 opacity-50 text-white text-center relative font-bold uppercase tracking-widest font-black">
        <div className="absolute bottom-6 right-6 opacity-20 hover:opacity-100 transition-opacity cursor-pointer p-4 group font-bold font-black" onClick={() => handleNavClick('admin')}>
           <LockKeyhole className="w-6 h-6 text-gray-500 group-hover:text-red-600 font-bold font-black" />
        </div>
        <img src="https://i.imgur.com/cSYIvq6.png" className="h-10 mx-auto mb-10 grayscale opacity-30 text-white text-center text-white text-white font-bold uppercase tracking-widest font-bold font-black" alt="Footer Logo" />
        <p className="text-[11px] font-bold uppercase tracking-[0.5em] font-bold font-black">Hospitalidade Arena Henko © 2026</p>
      </footer>
    </div>
  );
};

export default App;
