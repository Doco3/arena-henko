import React, { useState, useEffect, useRef } from 'react';
import { 
  Menu as MenuIcon, X, Instagram, Mail, Phone, Calendar, Award, Users, Tv, Music, MapPin, 
  CheckCircle, ArrowRight, Lock, Edit2, Save, LogOut, Clock, CalendarDays, Shield, 
  ChevronDown, Info, Beer, Trophy, Star, Activity, MessageCircle, History, TrendingUp, MapPinned, Ticket, Zap, Timer, Quote, ChevronLeft, ChevronRight, Download, Trash2, Camera, Upload, Loader2, LockKeyhole, ArrowLeft, Filter, Coffee, Wine
} from 'lucide-react';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, addDoc, onSnapshot, deleteDoc, doc } from 'firebase/firestore';

// --- CONFIGURAÇÃO DO FIREBASE ---
const firebaseConfig = {
  apiKey: "AIzaSyDwLDVpSFe7aA2IX7Vhn736GETRvvjAorI",
  authDomain: "arena-henko.firebaseapp.com",
  projectId: "arena-henko",
  storageBucket: "arena-henko.firebasestorage.app",
  messagingSenderId: "34887593341",
  appId: "1:34887593341:web:d6d68012cc9b8389797014"
};

const appId = "arena-henko-master-v5-official";
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

const ADMIN_HASH = "SGVua29AMjAyNiM="; 
const LOGO_URL = 'https://i.imgur.com/cSYIvq6.png'; 

// --- CONSTANTES DE DADOS (FORA DO COMPONENTE PARA EVITAR ERROS DE ESCOPO) ---

const TEAM_LOGOS = {
  SPFC: "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/2026.png",
  SANTOS: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Santos_logo.svg/1045px-Santos_logo.svg.png",
  PRIMAVERA: "https://upload.wikimedia.org/wikipedia/pt/0/0c/Esporte_Clube_Primavera_logo.png",
  FLAMENGO: "https://upload.wikimedia.org/wikipedia/commons/9/93/Flamengo-RJ_%28BRA%29.png",
  GREMIO: "https://a.espncdn.com/i/teamlogos/soccer/500/6273.png",
  CHAPECOENSE: "https://upload.wikimedia.org/wikipedia/pt/b/bc/Escudo_de_2018_da_Chapecoense.png"
};

const NAV_LINKS = [
  { name: 'Sobre', href: '#sobre', view: 'home' },
  { name: 'Serviços', href: '#servicos', view: 'home' },
  { name: 'Agenda', href: '#calendario', view: 'home' },
  { name: 'Eventos', href: '#eventos', view: 'home' },
  { name: 'Parceiros', href: '#parceiros', view: 'home' },
  { name: 'Contato', href: '#contato', view: 'home' },
];

const SERVICES_DATA = [
    { title: 'Lounge de Hospitalidade', icon: <Users />, desc: 'Ponto exclusivo para networking, briefings e relaxamento pré-evento.', imageUrl: 'https://i.imgur.com/Bw5Yw4K.png' },
    { title: 'Recepção VIP', icon: <Award />, desc: 'Atendimento premium e acesso rápido e diferenciado desde a chegada.', imageUrl: 'https://i.imgur.com/pLUfmBf.png' },
    { title: 'Ambiente Premium', icon: <Beer />, desc: 'Open bar, Open Food com culinária sofisticada e entretenimento ao vivo.', imageUrl: 'https://i.imgur.com/Za2zSyx.png' },
    { title: 'Networking', icon: <CheckCircle />, desc: 'O ambiente ideal para expandir a sua rede de contactos profissionais.', imageUrl: 'https://i.imgur.com/PrhiB8E.png' },
    { title: 'Vista Privilegiada', icon: <MapPin />, desc: 'Acesso exclusivo e visão privilegiada do campo/palco no Morumbis.', imageUrl: 'https://i.imgur.com/7R1hOwg.png' },
    { title: 'Branding & Mídia', icon: <Tv />, desc: 'Ativações de marca em Ring LED e relatórios de visibilidade premium.', imageUrl: 'https://i.imgur.com/Gy62moQ.png' },
];

const SPORT_DATA = [
  { 
    id: 1, name: 'Brasileirão', subtitle: 'Série A 2026', image: "https://a.espncdn.com/combiner/i?img=/i/leaguelogos/soccer/500/85.png", 
    matches: [
      { id: 'br1', date: '28/01', home: 'SPFC', away: 'FLAMENGO', time: '21h30', homeLogo: TEAM_LOGOS.SPFC, awayLogo: TEAM_LOGOS.FLAMENGO, scarcity: 'Esgotando' },
      { id: 'br2', date: '11/02', home: 'SPFC', away: 'GRÊMIO', time: '21h30', homeLogo: TEAM_LOGOS.SPFC, awayLogo: TEAM_LOGOS.GREMIO },
      { id: 'br3', date: '15/02', home: 'SPFC', away: 'CHAPECOENSE', time: '18h30', homeLogo: TEAM_LOGOS.SPFC, awayLogo: TEAM_LOGOS.CHAPECOENSE, scarcity: 'Alta Procura' }
    ],
  },
  { 
    id: 2, name: 'Paulistão', subtitle: 'Sicredi 2026', image: 'https://i.imgur.com/Kl9LPUl.png', 
    matches: [
      { id: 'm3', date: '31/01', home: 'SPFC', away: 'SANTOS', time: '20h30', homeLogo: TEAM_LOGOS.SPFC, awayLogo: TEAM_LOGOS.SANTOS, scarcity: 'Clássico' },
      { id: 'm4', date: '07/02', home: 'SPFC', away: 'PRIMAVERA', time: '20h30', homeLogo: TEAM_LOGOS.SPFC, awayLogo: TEAM_LOGOS.PRIMAVERA },
    ],
  },
  { id: 3, name: 'Sudamericana', subtitle: 'Conmebol 2026', image: 'https://upload.wikimedia.org/wikipedia/en/thumb/c/c2/CONMEBOL_Sudamericana_logo_%282017%29.svg/250px-CONMEBOL_Sudamericana_logo_%282017%29.svg.png', matches: [] },
  { id: 4, name: 'Copa do Brasil', subtitle: 'CBF 2026', image: 'https://upload.wikimedia.org/wikipedia/pt/9/96/CopaDoBrasil.png', matches: [] }
];

const SHOWS_DATA = [
  { name: 'AC/DC', date: '15/03/2026', image: 'https://i.imgur.com/XawIqwq.jpg', desc: 'O maior espetáculo de rock do planeta chega ao Morumbis com a Arena Henko.' },
  { name: 'The Weeknd', date: '22/05/2026', image: 'https://i.imgur.com/1zpCq3e.jpg', desc: 'Uma experiência visual e sonora imersiva com a melhor vista do estádio.' },
  { name: 'Festa do Peão', date: '20/08/2026', image: 'https://i.imgur.com/GW8we0X.png', desc: 'Hospitalidade Arena Henko presente no maior evento sertanejo do Brasil.' },
];

const PARTNERS_DATA = [
  { name: 'Mali Pizzaria', logoUrl: 'https://i.imgur.com/YxcN44a.png' },
  { name: 'Santa Helena', logoUrl: 'https://i.imgur.com/XjXzNik.png' },
  { name: 'Tirolez', logoUrl: 'https://i.imgur.com/4NmAzLu.png' },
  { name: 'Matsuya', logoUrl: 'https://i.imgur.com/EeCB2GL.png' },
  { name: 'Oster', logoUrl: 'https://i.imgur.com/Kqwt8YH.png' },
  { name: 'Kicaldo', logoUrl: 'https://i.imgur.com/6ZVogLo.png' },
  { name: 'Churrasboat', logoUrl: 'https://i.imgur.com/CZ9lYO8.png' },
  { name: 'Henko Produções', logoUrl: 'https://i.imgur.com/qVnwNYs.png' },
  { name: 'Cap-Lab', logoUrl: 'https://i.imgur.com/LDGTXoZ.png' },
  { name: 'Estado Luso', logoUrl: 'https://i.imgur.com/rS7PHb3.png' },
  { name: 'Esfiha Imigrantes', logoUrl: 'https://i.imgur.com/VEjZgiI.png' },
  { name: 'Colonial Padaria', logoUrl: 'https://i.imgur.com/cexxcrW.png' },
  { name: 'Weach', logoUrl: 'https://i.imgur.com/jz15iRQ.png' },
];

const REVIEWS_DATA = [
  { name: "Mariana Costa", text: "Lugar maravilhoso, comida excelente e atendimento de primeira! O melhor camarote do Morumbis sem dúvidas.", role: "Google Review", initial: "M" },
  { name: "João Paulo S.", text: "Conforto e segurança total para levar minha família. Passam muita credibilidade em tudo o que fazem.", role: "Empresário", initial: "J" },
  { name: "Felipe Almeida", text: "O buffet é sensacional e a vista é a melhor possível. Atendimento nota 10 de toda a equipe!", role: "Google Review", initial: "F" },
  { name: "Ricardo Santos", text: "Atendimento diferenciado. Vale cada centavo pela hospitalidade e tranquilidade.", role: "Convidado VIP", initial: "R" },
  { name: "Letícia Rossi", text: "Ambiente familiar e muito seguro. Meus filhos adoraram o espaço. É o melhor investimento.", role: "Google Review", initial: "L" },
];

// --- UTILITÁRIOS ---
const ImageWithFallback = ({ src, alt, className, style }) => {
  const [error, setError] = useState(false);
  if (error) return <div className={`${className} bg-neutral-800 flex items-center justify-center`}><Shield className="w-6 h-6 text-gray-600" /></div>;
  return <img src={src} alt={alt} className={className} style={style} onError={() => setError(true)} />;
};

const App = () => {
  // 1. Estados
  const [currentView, setCurrentView] = useState('home'); 
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminInputPass, setAdminInputPass] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSportId, setActiveSportId] = useState(1); 
  const [expandedMatchKey, setExpandedMatchKey] = useState(null);
  const [toast, setToast] = useState(null);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [user, setUser] = useState(null);
  const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0 });

  // 2. Lógica de Próximos Eventos (Automática)
  const selectedSport = SPORT_DATA.find(s => s.id === activeSportId);
  const visibleMatches = selectedSport ? selectedSport.matches : [];
  
  const getNextMatchReal = () => {
    const all = SPORT_DATA.flatMap(s => s.matches.map(m => ({
        ...m,
        pDate: new Date(2026, parseInt(m.date.split('/')[1]) - 1, parseInt(m.date.split('/')[0]))
    })));
    // Data atual: 27/01/2026
    return all.filter(m => m.pDate >= new Date(2026, 0, 27)).sort((a,b) => a.pDate - b.pDate)[0];
  };

  const nextMatch = getNextMatchReal();
  const nextEvent = SHOWS_DATA[0];

  // 3. Efeitos
  useEffect(() => {
    const updateCountdown = () => {
        const now = new Date();
        const target = new Date(2026, 0, 28, 21, 30); // Jogo Flamengo
        const diff = target - now;
        if(diff > 0) {
            setTimeLeft({
                d: Math.floor(diff / (1000 * 60 * 60 * 24)),
                h: Math.floor((diff / (1000 * 60 * 60)) % 24),
                m: Math.floor((diff / (1000 * 60)) % 60)
            });
        }
    };
    updateCountdown();
    const timer = setInterval(updateCountdown, 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    signInAnonymously(auth);
    onAuthStateChanged(auth, setUser);
    const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/x-icon'; link.rel = 'shortcut icon'; link.href = LOGO_URL;
    document.getElementsByTagName('head')[0].appendChild(link);
  }, []);

  useEffect(() => {
    if (currentView === 'home') {
      const itv = setInterval(() => setCurrentReviewIndex(p => (p + 1) % REVIEWS_DATA.length), 5000);
      return () => clearInterval(itv);
    }
  }, [currentView]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 4. Ações
  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (btoa(adminInputPass) === ADMIN_HASH) {
      setIsAdminLoggedIn(true);
      setToast("Acesso Master Liberado");
      setTimeout(() => setToast(null), 3000);
      document.getElementById('login-modal').classList.add('hidden');
    } else {
      setToast("Senha incorreta");
      setTimeout(() => setToast(null), 3000);
    }
  };

  const handleNavClick = (view, href) => {
    setCurrentView(view);
    setIsMenuOpen(false);
    if (view === 'home' && href && href.startsWith('#')) {
      setTimeout(() => document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' }), 100);
    } else { window.scrollTo(0, 0); }
  };

  const getWaLink = (msg) => `https://wa.me/5511940741355?text=${encodeURIComponent(msg)}`;

  // 5. Renders
  const renderHome = () => (
    <div className="font-sans text-white bg-black animate-fadeIn">
      {/* Hero */}
      <section className="relative h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-40">
          <img src="https://i.imgur.com/lKKQfgK.png" className="w-full h-full object-cover" alt="Hero" />
        </div>
        <div className="relative z-10 w-full max-w-5xl font-black">
          <h1 className="text-6xl md:text-8xl font-black mb-2 uppercase italic tracking-tighter leading-none">
            ARENA <span className="text-red-600">HENKO</span>
          </h1>
          <p className="text-gray-400 uppercase tracking-[0.4em] mb-12 text-sm md:text-lg font-light">Hospitalidade Premium & Experiências</p>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12">
            {nextMatch && (
              <div onClick={() => window.open(getWaLink(`Interesse no jogo ${nextMatch.home} x ${nextMatch.away}`))} className="bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-3xl flex items-center gap-5 hover:bg-white/10 transition-all cursor-pointer text-left relative group shadow-2xl">
                <div className="absolute top-4 right-4 bg-red-600 px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-full shadow-lg animate-pulse z-20">
                    {nextMatch.scarcity || "Alta Procura"}
                </div>
                <div className="w-14 h-14 bg-neutral-900 rounded-2xl p-2 flex items-center justify-center shadow-xl border border-white/5">
                  <img src={nextMatch.homeLogo} alt="Next" className="object-contain" />
                </div>
                <div className="flex-1">
                  <p className="text-red-500 text-[10px] font-black uppercase tracking-widest mb-1 flex items-center gap-1"><Zap className="w-3 h-3 fill-red-500" /> Próximo Jogo</p>
                  <h3 className="text-base font-black uppercase leading-none truncate">{nextMatch.home} x {nextMatch.away}</h3>
                  <div className="flex items-center gap-2 mt-2 text-gray-500 text-[10px] font-mono">
                    <Clock className="w-3 h-3 text-red-500" />
                    <span>{timeLeft.d}d {timeLeft.h}h {timeLeft.m}m</span>
                  </div>
                </div>
              </div>
            )}
            <div onClick={() => window.open(getWaLink(`Interesse no evento ${nextEvent.name}`))} className="bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-3xl flex items-center gap-5 hover:bg-white/10 transition-all cursor-pointer text-left group shadow-2xl">
              <div className="w-14 h-14 bg-neutral-900 rounded-2xl p-3 flex items-center justify-center text-red-500 shadow-xl border border-white/5">
                <Music className="w-7 h-7" />
              </div>
              <div className="flex-1">
                <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">Próximo Evento</p>
                <h3 className="text-base font-black uppercase leading-none">{nextEvent.name}</h3>
                <p className="text-red-600 text-[9px] mt-1 font-mono uppercase tracking-widest">{nextEvent.date}</p>
              </div>
            </div>
          </div>
          <a href="#calendario" className="inline-flex px-12 py-5 bg-red-600 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-red-700 transition-all shadow-xl">Ver Agenda Completa</a>
        </div>
      </section>

      {/* Sobre Blindado */}
      <section id="sobre" className="py-24 px-6 bg-neutral-950 border-y border-neutral-900 font-black">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="text-left">
            <span className="text-red-600 text-xs uppercase tracking-[0.3em] mb-4 block font-black">A Arena</span>
            <h2 className="text-5xl font-black uppercase mb-8 italic text-white leading-tight">Onde a emoção <br/>encontra o luxo.</h2>
            <p className="text-gray-400 text-lg mb-12 font-light leading-relaxed">Localizada no Morumbis, a Arena Henko oferece hospitalidade máxima e segurança total para sua experiência oficial.</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center sm:text-left">
              <div>
                <div className="flex items-center gap-1 mb-1 justify-center sm:justify-start">
                    <span className="text-4xl font-black text-yellow-500 font-black">4.9</span>
                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                </div>
                <p className="text-[9px] uppercase tracking-widest text-gray-500 font-black">Google Rating</p>
              </div>
              <div><h4 className="text-4xl font-black text-white">200+</h4><p className="text-[9px] uppercase tracking-widest text-gray-500 font-black">Reviews</p></div>
              <div><h4 className="text-4xl font-black text-white">5+</h4><p className="text-[9px] uppercase tracking-widest text-gray-500 font-black">Anos</p></div>
              <div><h4 className="text-4xl font-black text-white">100+</h4><p className="text-[9px] uppercase tracking-widest text-gray-500 font-black">Eventos</p></div>
            </div>
          </div>
          <div className="grid gap-4">
             <div className="bg-neutral-900/40 p-6 rounded-2xl border border-neutral-800 flex gap-4 items-start shadow-xl">
                <Shield className="text-red-600 w-8 h-8 shrink-0" />
                <div><h4 className="text-sm font-black uppercase italic">Operação 100% Oficial</h4><p className="text-gray-500 text-xs mt-1">Somos credenciados e oficiais no Morumbis. Fuja de fraudes.</p></div>
             </div>
             <div className="bg-neutral-900/40 p-6 rounded-2xl border border-neutral-800 flex gap-4 items-start shadow-xl">
                <Award className="text-red-600 w-8 h-8 shrink-0" />
                <div><h4 className="text-sm font-black uppercase italic">Hospitalidade Vip</h4><p className="text-gray-500 text-xs mt-1">Buffet premium liberado e bebidas de primeira classe.</p></div>
             </div>
          </div>
        </div>
      </section>

      {/* Serviços */}
      <section id="servicos" className="py-24 px-6 bg-black text-center font-black">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-black uppercase mb-20 italic">Full Experience</h2>
          <div className="grid md:grid-cols-3 gap-10">
            {SERVICES_DATA.map((s, i) => (
              <div key={i} className="group relative h-[450px] rounded-[2.5rem] overflow-hidden border border-neutral-800 hover:border-red-600/50 transition-all duration-700 shadow-2xl">
                <div className="absolute inset-0"><img src={s.imageUrl} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-110" alt={s.title} /></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                <div className="relative z-20 h-full p-10 flex flex-col justify-end text-left font-black">
                  <div className="bg-red-600 p-3 rounded-2xl w-fit mb-4 text-white shadow-xl">{s.icon}</div>
                  <h3 className="text-2xl font-black uppercase mb-2 text-white italic">{s.title}</h3>
                  <p className="text-gray-300 text-sm font-normal leading-tight">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Agenda (Calendário) */}
      <section id="calendario" className="py-24 px-6 bg-neutral-950 font-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-black uppercase text-center mb-16 italic">Agenda <span className="text-red-600">2026</span></h2>
          <div className="flex flex-wrap gap-2 justify-center mb-12">
            {SPORT_DATA.map(s => (
              <button key={s.id} onClick={() => { setActiveSportId(s.id); setExpandedMatchKey(null); }} className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeSportId === s.id ? 'bg-red-600 text-white shadow-xl scale-105' : 'bg-neutral-900 text-gray-500 hover:text-white border border-white/5'}`}>{s.name}</button>
            ))}
          </div>
          <div className="bg-neutral-900/20 rounded-[3rem] p-8 md:p-16 border border-neutral-800 shadow-3xl">
             <div className="grid lg:grid-cols-5 gap-12 items-center">
                <div className="lg:col-span-2 text-center group">
                    <div className="bg-black w-44 h-44 mx-auto rounded-3xl p-8 border border-neutral-800 flex items-center justify-center mb-6 transition-all duration-500 hover:scale-110 shadow-2xl overflow-hidden">
                        <ImageWithFallback 
                            src={selectedSport.image} 
                            alt="Campeonato" 
                            className="max-h-full object-contain" 
                            style={selectedSport.id === 3 ? { filter: 'brightness(0) invert(1)' } : {}} 
                        />
                    </div>
                    <h3 className="text-4xl font-black uppercase italic leading-none">{selectedSport.name}</h3>
                    <p className="text-red-600 text-[10px] tracking-[0.4em] mt-3 uppercase font-black">{selectedSport.subtitle}</p>
                </div>
                <div className="lg:col-span-3 space-y-8 font-normal text-left">
                    {visibleMatches.length > 0 ? visibleMatches.map((m, i) => (
                      <div key={i} className="relative">
                         {m.scarcity && (
                             <div className="absolute -top-3 left-6 bg-red-600 text-white text-[8px] font-black px-3 py-1 rounded-full shadow-lg z-10 animate-bounce flex items-center gap-1 uppercase tracking-widest">
                                <Zap className="w-3 h-3 fill-white" /> {m.scarcity}
                             </div>
                         )}
                         <div className={`bg-neutral-950 border transition-all rounded-[2rem] overflow-hidden ${expandedMatchKey === i ? 'border-red-600/50 shadow-2xl' : 'border-neutral-800'}`}>
                            <button onClick={() => setExpandedMatchKey(expandedMatchKey === i ? null : i)} className="w-full p-7 flex items-center justify-between group">
                                <div className="flex items-center gap-8 font-black">
                                    <span className="text-xs text-gray-500 w-10">{m.date}</span>
                                    <div className="flex items-center gap-4">
                                    <span className="uppercase text-sm hidden sm:block text-white font-black">{m.home}</span>
                                    <img src={m.homeLogo} className="w-8 h-8 object-contain" alt="H" />
                                    <span className="opacity-30 italic text-xs font-black">VS</span>
                                    <img src={TEAM_LOGOS[m.away] || m.awayLogo} className="w-8 h-8 object-contain" alt="A" />
                                    <span className="uppercase text-sm hidden sm:block text-white font-black">{m.away}</span>
                                    </div>
                                </div>
                                <ChevronDown className={`w-5 h-5 transition-transform ${expandedMatchKey === i ? 'rotate-180 text-red-600' : 'text-gray-700'}`} />
                            </button>
                            <div className={`transition-all duration-500 ease-in-out overflow-hidden ${expandedMatchKey === i ? 'max-h-[350px]' : 'max-h-0'}`}>
                                <div className="px-10 pb-10 pt-4 bg-white/5 border-t border-white/5 font-black">
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 text-[9px] text-gray-400 uppercase tracking-widest font-black">
                                        <div className="flex flex-col gap-1"><span className="text-gray-600 flex items-center gap-1"><Clock className="w-3 h-3"/> Horário</span><span className="text-white text-xs">{m.time}</span></div>
                                        <div className="flex flex-col gap-1"><span className="text-gray-600 flex items-center gap-1"><LockKeyhole className="w-3 h-3"/> Abertura</span><span className="text-red-500 text-xs font-black">2h Antes</span></div>
                                        <div className="flex flex-col gap-1"><span className="text-gray-600 flex items-center gap-1"><Wine className="w-3 h-3"/> Open Bar</span><span className="text-white text-[8px]">Premium & Drinks</span></div>
                                        <div className="flex flex-col gap-1"><span className="text-gray-600 flex items-center gap-1"><Coffee className="w-3 h-3"/> Open Food</span><span className="text-white text-[8px]">Buffet Completo</span></div>
                                    </div>
                                    <button onClick={() => window.open(getWaLink(`Olá! Quero reservar minha experiência exclusiva para o jogo ${m.home} x ${m.away} na Arena Henko.`))} className="w-full bg-red-600 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest text-white shadow-xl hover:scale-105 transition-all">Reservar Agora</button>
                                </div>
                            </div>
                         </div>
                      </div>
                    )) : <p className="text-center text-gray-700 uppercase text-[10px] py-16 font-black tracking-widest italic">Novas datas em breve.</p>}
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Próximos Eventos */}
      <section id="eventos" className="py-24 px-6 bg-black">
        <div className="max-w-7xl mx-auto font-black">
          <h2 className="text-4xl md:text-6xl font-black uppercase text-center mb-20 italic text-white">Próximos <span className="text-red-600">Eventos</span></h2>
          <div className="grid md:grid-cols-3 gap-12">
            {SHOWS_DATA.map((show, i) => (
              <div key={i} className="group flex flex-col">
                <div className="relative h-[420px] rounded-[3rem] overflow-hidden mb-8 border border-neutral-800 group-hover:border-red-600 transition-all duration-700 shadow-2xl bg-neutral-900">
                    <img src={show.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-110" alt={show.name} />
                </div>
                <div className="px-2 text-left">
                    <span className="text-red-600 text-[10px] font-black uppercase tracking-[0.4em] mb-2 block">{show.date}</span>
                    <h3 className="text-3xl font-black uppercase mb-4 italic text-white leading-none">{show.name}</h3>
                    <p className="text-gray-500 text-sm font-normal mb-8 leading-relaxed font-normal">{show.desc}</p>
                    <button onClick={() => window.open(getWaLink(`Interesse no evento ${show.name}`))} className="text-[10px] font-black uppercase tracking-widest flex items-center gap-3 text-white hover:text-red-500 transition-colors group/btn">
                        Ver Disponibilidade <div className="p-2.5 bg-neutral-900 rounded-full group-hover/btn:bg-red-600 transition-all"><ArrowRight className="w-4 h-4"/></div>
                    </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Parceiros - 13 Logos Sempre Coloridos */}
      <section id="parceiros" className="py-24 bg-neutral-950 border-y border-neutral-900 px-10">
         <div className="max-w-7xl mx-auto text-center font-black">
            <h3 className="text-[10px] text-gray-700 uppercase tracking-[0.6em] mb-20">Marcas de Elite Connosco</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-10 items-center">
               {PARTNERS_DATA.map((p, i) => (
                  <div key={i} className="h-16 flex items-center justify-center transition-transform hover:scale-110 duration-500">
                    <img src={p.logoUrl} className="max-h-full max-w-full object-contain" alt={p.name} />
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* Contato Final */}
      <section id="contato" className="py-40 bg-black text-center font-black">
         <div className="max-w-5xl mx-auto">
            <h2 className="text-6xl md:text-[10rem] font-black mb-20 uppercase italic tracking-tighter leading-none text-white">
                Viva sua <br/><span className="text-white underline decoration-red-600/20">ARENA</span> <span className="text-red-600 underline decoration-red-600/20">HENKO.</span>
            </h2>
            <div className="grid sm:grid-cols-3 gap-6 font-black">
               <a href="https://instagram.com/arenahenko" target="_blank" className="bg-white/5 p-12 rounded-[2.5rem] border border-white/5 hover:border-red-600 transition-all flex flex-col items-center gap-5 group shadow-2xl text-white">
                 <Instagram className="w-12 h-12 text-red-600 group-hover:scale-110 transition-transform font-bold" />
                 <span className="text-[11px] uppercase tracking-widest font-black">Instagram</span>
               </a>
               <a href="https://wa.me/5511940741355" target="_blank" className="bg-white/5 p-12 rounded-[2.5rem] border border-white/5 hover:border-red-600 transition-all flex flex-col items-center gap-5 group shadow-2xl text-white">
                 <Phone className="w-12 h-12 text-red-600 group-hover:scale-110 transition-transform font-bold" />
                 <span className="text-[11px] uppercase tracking-widest font-black">WhatsApp</span>
               </a>
               <a href="mailto:sergio@henkoproducoes.com.br" className="bg-white/5 p-12 rounded-[2.5rem] border border-white/5 hover:border-red-600 transition-all flex flex-col items-center gap-5 group shadow-2xl text-white">
                 <Mail className="w-12 h-12 text-red-600 group-hover:scale-110 transition-transform font-bold" />
                 <span className="text-[11px] uppercase tracking-widest font-black">E-mail</span>
               </a>
            </div>
         </div>
      </section>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white selection:bg-red-600 overflow-x-hidden font-sans">
      <nav className={`fixed top-0 w-full z-[100] transition-all duration-500 bg-black/60 backdrop-blur-xl border-b border-white/5 py-4`}>
        <div className="max-w-7xl mx-auto px-8 flex justify-between items-center">
          <div onClick={() => handleNavClick('home', '#')} className="cursor-pointer group flex items-center gap-2">
              <img src={LOGO_URL} alt="Arena Henko" className="w-14 h-14 object-contain group-hover:scale-110 transition-all duration-500" />
          </div>
          <div className="hidden md:flex items-center gap-10 font-black uppercase text-[10px] tracking-widest">
            {NAV_LINKS.map(link => (
              <button key={link.name} onClick={() => handleNavClick(link.view, link.href)} className="hover:text-red-600 transition-colors font-black">{link.name}</button>
            ))}
            <button onClick={() => isAdminLoggedIn ? setIsAdminLoggedIn(false) : document.getElementById('login-modal').classList.remove('hidden')} className="hover:text-red-600 transition-colors p-2 bg-white/5 rounded-full">
              {isAdminLoggedIn ? <LogOut className="w-5 h-5" /> : <LockKeyhole className="w-5 h-5" />}
            </button>
          </div>
          <button onClick={() => setIsMenuOpen(true)} className="md:hidden text-red-600"><MenuIcon className="w-7 h-7" /></button>
        </div>
      </nav>

      {isMenuOpen && (
        <div className="fixed inset-0 z-[200] bg-black/98 backdrop-blur-3xl p-10 animate-fadeIn font-black text-center flex flex-col gap-10 justify-center">
          <button onClick={() => setIsMenuOpen(false)} className="absolute top-10 right-10 p-4 bg-neutral-900 rounded-full shadow-2xl"><X className="w-8 h-8 text-white font-bold" /></button>
          {NAV_LINKS.map(link => (
            <button key={link.name} onClick={() => handleNavClick(link.view, link.href)} className="text-4xl uppercase hover:text-red-600 italic transition-all font-black">{link.name}</button>
          ))}
        </div>
      )}

      {currentView === 'home' ? renderHome() : null}

      <footer className="bg-neutral-950 py-24 px-10 border-t border-neutral-900 font-black text-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12 text-center md:text-left">
          <div className="flex flex-col items-center md:items-start gap-5 font-black text-white">
            <img src={LOGO_URL} alt="Arena Henko" className="h-14 w-auto object-contain" />
            <p className="text-gray-700 text-[9px] uppercase tracking-[0.5em] font-black italic">Arena Henko &copy; 2026</p>
          </div>
          <div className="flex gap-4">
            <a href="https://instagram.com/arenahenko" target="_blank" className="bg-neutral-900 p-4 rounded-2xl hover:bg-red-600 shadow-xl transition-all"><Instagram className="w-6 h-6 text-white font-bold" /></a>
            <a href="mailto:sergio@henkoproducoes.com.br" className="bg-neutral-900 p-4 rounded-2xl hover:bg-red-600 shadow-xl transition-all"><Mail className="w-6 h-6 text-white font-bold" /></a>
          </div>
        </div>
      </footer>

      <div id="login-modal" className="fixed inset-0 z-[300] hidden bg-black/95 backdrop-blur-2xl flex items-center justify-center p-8 text-white">
        <div className="bg-neutral-900 border border-neutral-800 p-12 rounded-[3rem] w-full max-w-sm font-black shadow-3xl text-white">
          <h2 className="text-xl uppercase mb-8 text-center italic">Painel <span className="text-red-600 font-black">Admin</span></h2>
          <form onSubmit={handleAdminLogin}>
            <input type="password" placeholder="Senha" value={adminInputPass} onChange={(e) => setAdminInputPass(e.target.value)} className="w-full bg-black border border-neutral-800 rounded-2xl px-8 py-5 mb-6 text-white focus:outline-none focus:border-red-600 text-center tracking-widest font-black" />
            <div className="flex gap-4">
              <button type="button" onClick={() => document.getElementById('login-modal').classList.add('hidden')} className="flex-1 py-4 text-[10px] uppercase border border-neutral-800 rounded-2xl font-black">Voltar</button>
              <button type="submit" className="flex-1 py-4 text-[10px] uppercase bg-red-600 rounded-2xl shadow-xl font-black">Entrar</button>
            </div>
          </form>
        </div>
      </div>

      {toast && <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[400] bg-red-600 text-white px-10 py-4 rounded-full font-black text-[10px] uppercase tracking-widest shadow-3xl animate-bounce">{toast}</div>}
    </div>
  );
};

export default App;
