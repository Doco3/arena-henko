import React, { useState, useEffect, useMemo } from 'react';
import { 
  Menu as MenuIcon, X, Instagram, Mail, Phone, Calendar, Award, Users, Tv, Music, MapPin, 
  CheckCircle, ArrowRight, Clock, Shield, ChevronDown, Star, MessageCircle, Quote, 
  LockKeyhole, Coffee, Wine, ShieldCheck, Headphones, MousePointerClick, Smartphone, UserCheck,
  Beer, Zap, Play, Image as ImageIcon, Plus, Trash2, FolderOpen, AlertTriangle, Loader2, Download, Link as LinkIcon, ArrowLeft
} from 'lucide-react';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// --- CONFIGURAÇÃO DO FIREBASE ---
const firebaseConfig = {
  apiKey: "AIzaSyDwLDVpSFe7aA2IX7Vhn736GETRvvjAorI", 
  authDomain: "arena-henko.firebaseapp.com",
  projectId: "arena-henko",
  storageBucket: "arena-henko.firebasestorage.app",
  messagingSenderId: "34887593341",
  appId: "1:34887593341:web:d6d68012cc9b8389797014"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

// --- CONSTANTES E DADOS DO SITE ---
const ADMIN_HASH = "SGVua29fTWFzdGVyXzIwMjZfU2VjdXJlISM="; 
const LOGO_URL = 'https://i.imgur.com/cSYIvq6.png'; 

// Configuração da Galeria Estática
const STATIC_GALLERY = [
  {
    id: 'acdc-28-02',
    name: 'AC/DC - 28/02',
    folder: '/acdc-2802', 
    cover: 'https://www.rbsdirect.com.br/filestore/8/5/6/4/1/9/4_9472ea360a1702b/4914658_704acea3d79d4d7.jpg?version=1575255600',
    photos: [
      'show-acdc-01.jpeg', 'show-acdc-02.jpeg', 'show-acdc-03.jpeg', 'show-acdc-04.jpeg', 'show-acdc-05.jpeg',
      'show-acdc-06.jpeg', 'show-acdc-07.jpeg', 'show-acdc-08.jpeg', 'show-acdc-09.jpeg', 'show-acdc-10.jpeg',
      'show-acdc-11.jpeg', 'show-acdc-12.jpeg', 'show-acdc-13.jpeg', 'show-acdc-14.jpeg', 'show-acdc-15.jpeg',
      'show-acdc-16.jpeg', 'show-acdc-17.jpeg', 'show-acdc-18.jpeg', 'show-acdc-19.jpeg', 'show-acdc-20.jpeg',
      'show-acdc-21.jpeg', 'show-acdc-22.png', 'show-acdc-23.jpeg', 'show-acdc-24.jpeg', 'show-acdc-25.jpeg',
      'show-acdc-26.jpeg', 'show-acdc-27.jpeg', 'show-acdc-28.png', 'show-acdc-29.jpeg', 'show-acdc-30.jpeg'
    ]
  }
];

const TEAM_LOGOS = {
  SPFC: "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/2026.png",
  SANTOS: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Santos_logo.svg/1045px-Santos_logo.svg.png",
  PRIMAVERA: "https://upload.wikimedia.org/wikipedia/pt/0/0c/Esporte_Clube_Primavera_logo.png",
  FLAMENGO: "https://upload.wikimedia.org/wikipedia/commons/9/93/Flamengo-RJ_%28BRA%29.png",
  GREMIO: "https://a.espncdn.com/i/teamlogos/soccer/500/6273.png",
  CHAPECOENSE: "https://upload.wikimedia.org/wikipedia/pt/b/bc/Escudo_de_2018_da_Chapecoense.png",
  PALMEIRAS: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Palmeiras_logo.svg/330px-Palmeiras_logo.svg.png",
  CRUZEIRO: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Cruzeiro_Esporte_Clube_%28logo%29.svg/3840px-Cruzeiro_Esporte_Clube_%28logo%29.svg.png",
  OHIGGINS: "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/6072.png",
  MILLONARIOS: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Millonarios_F%C3%BAtbol_Club_logo.svg/3840px-Millonarios_F%C3%BAtbol_Club_logo.svg.png",
  BOSTON_RIVER: "https://upload.wikimedia.org/wikipedia/commons/d/da/Escudo_Boston_River_2019.png"
};

const NAV_LINKS = [
  { name: 'Sobre', href: '#sobre' },
  { name: 'Depoimentos', href: '#reviews' },
  { name: 'Agenda', href: '#calendario' },
  { name: 'Eventos', href: '#eventos' },
  { name: 'Experiência', href: '#servicos' },
  { name: 'Galeria', href: '#galeria' },
  { name: 'Contato', href: '#contato' },
];

const SERVICES_DATA = [
    { id: 1, title: 'Lounge de Hospitalidade', icon: <Users className="w-6 h-6" />, desc: 'Ponto exclusivo para networking e relaxamento pré-evento.', imageUrl: 'https://i.imgur.com/Bw5Yw4K.png' },
    { id: 2, title: 'Recepção VIP', icon: <Award className="w-6 h-6" />, desc: 'Atendimento premium e acesso rápido e diferenciado.', imageUrl: 'https://i.imgur.com/pLUfmBf.png' },
    { id: 3, title: 'Ambiente Premium', icon: <Beer className="w-6 h-6" />, desc: 'Open bar e Open Food com culinária sofisticada.', imageUrl: 'https://i.imgur.com/Za2zSyx.png' },
    { id: 4, title: 'Networking', icon: <CheckCircle className="w-6 h-6" />, desc: 'O ambiente ideal para expandir sua rede de contatos.', imageUrl: 'https://i.imgur.com/PrhiB8E.png' },
    { id: 5, title: 'Vista Privilegiada', icon: <MapPin className="w-6 h-6" />, desc: 'Acesso exclusivo e visão privilegiada do Morumbis.', imageUrl: 'https://i.imgur.com/7R1hOwg.png' },
    { id: 6, title: 'Branding & Mídia', icon: <Tv className="w-6 h-6" />, desc: 'Ativações de marca em Ring LED e relatórios de visibilidade.', imageUrl: 'https://i.imgur.com/Gy62moQ.png' },
];

const SPORT_DATA = [
  { 
    id: 1, name: 'Brasileirão', subtitle: 'Série A 2026', image: "https://a.espncdn.com/combiner/i?img=/i/leaguelogos/soccer/500/85.png", 
    matches: [
      { id: 'br1', date: '28/01', home: 'SPFC', away: 'FLAMENGO', time: '21h30', homeLogo: TEAM_LOGOS.SPFC, awayLogo: TEAM_LOGOS.FLAMENGO },
      { id: 'br2', date: '11/02', home: 'SPFC', away: 'GRÊMIO', time: '21h30', homeLogo: TEAM_LOGOS.SPFC, awayLogo: TEAM_LOGOS.GREMIO },
      { id: 'br3', date: '15/02', home: 'SPFC', away: 'CHAPECOENSE', time: '18h30', homeLogo: TEAM_LOGOS.SPFC, awayLogo: TEAM_LOGOS.CHAPECOENSE },
      { id: 'br4', date: '21/03', home: 'SPFC', away: 'PALMEIRAS', time: '21h00', homeLogo: TEAM_LOGOS.SPFC, awayLogo: TEAM_LOGOS.PALMEIRAS, scarcity: 'Choque-Rei' },
      { id: 'br5', date: '04/04', home: 'SPFC', away: 'CRUZEIRO', time: '18h30', homeLogo: TEAM_LOGOS.SPFC, awayLogo: TEAM_LOGOS.CRUZEIRO }
    ],
  },
  { 
    id: 2, name: 'Paulistão', subtitle: 'Sicredi 2026', image: 'https://i.imgur.com/Kl9LPUl.png', 
    matches: [
      { id: 'm3', date: '31/01', home: 'SPFC', away: 'SANTOS', time: '20h30', homeLogo: TEAM_LOGOS.SPFC, awayLogo: TEAM_LOGOS.SANTOS },
      { id: 'm4', date: '07/02', home: 'SPFC', away: 'PRIMAVERA', time: '20h30', homeLogo: TEAM_LOGOS.SPFC, awayLogo: TEAM_LOGOS.PRIMAVERA },
    ],
  },
  { 
    id: 3, name: 'Sudamericana', subtitle: 'Conmebol 2026', image: 'https://upload.wikimedia.org/wikipedia/en/thumb/c/c2/CONMEBOL_Sudamericana_logo_%282017%29.svg/250px-CONMEBOL_Sudamericana_logo_%282017%29.svg.png', 
    matches: [
        { id: 'sd1', date: '14/04', home: 'SPFC', away: 'O’HIGGINS', time: '19h00', homeLogo: TEAM_LOGOS.SPFC, awayLogo: TEAM_LOGOS.OHIGGINS },
        { id: 'sd2', date: '19/05', home: 'SPFC', away: 'MILLONARIOS', time: '21h30', homeLogo: TEAM_LOGOS.SPFC, awayLogo: TEAM_LOGOS.MILLONARIOS },
        { id: 'sd3', date: '26/05', home: 'SPFC', away: 'BOSTON RIVER', time: '19h00', homeLogo: TEAM_LOGOS.SPFC, awayLogo: TEAM_LOGOS.BOSTON_RIVER }
    ] 
  },
  { id: 4, name: 'Copa do Brasil', subtitle: 'CBF 2026', image: 'https://upload.wikimedia.org/wikipedia/pt/9/96/CopaDoBrasil.png', matches: [] }
];

const SHOWS_DATA = [
  { id: 'show1', name: 'The Weeknd', date: '30/04/2026', image: 'https://i.imgur.com/1zpCq3e.jpg', desc: 'Uma experiência visual e sonora imersiva com a melhor vista.' },
  { id: 'show2', name: 'Festa do Peão', date: '20/08/2026', image: 'https://i.imgur.com/GW8we0X.png', desc: 'Hospitalidade Arena Henko presente no maior evento sertanejo.' },
];

const REVIEWS_DATA = [
  { name: "Mariana Costa", text: "Lugar maravilhoso, comida excelente e atendimento de primeira! O melhor do Morumbis.", role: "Google Review", initial: "M" },
  { name: "João Paulo S.", text: "Conforto e segurança total para levar minha família. Passam muita credibilidade.", role: "Empresário", initial: "J" },
  { name: "Felipe Almeida", text: "O buffet é sensacional e a vista é a melhor possível. Atendimento nota 10.", role: "Google Review", initial: "F" },
  { name: "Ricardo Santos", text: "Atendimento diferenciado. Vale cada centavo pela hospitalidade e tranquilidade.", role: "Convidado VIP", initial: "R" },
  { name: "Letícia Rossi", text: "Ambiente familiar e muito seguro. Meus filhos adoraram o espaço.", role: "Google Review", initial: "L" }
];

const FAQ_DATA = [
    { q: "Como recebo o meu bilhete?", a: "Após a reserva oficial, o bilhete digital é enviado via e-mail ou WhatsApp (App SPFC) com QR Code dinâmico." },
    { q: "Vocês são o canal oficial?", a: "Sim. A Arena Henko é uma operação própria e credenciada dentro do Estádio do Morumbi." },
    { q: "Onde fica localizado o camarote?", a: "Estamos no Setor Lounge Oeste, oferecendo visão centralizada no nível do campo." },
    { q: "O que está incluído no valor?", a: "Full Experience inclui Buffet Gourmet, Open Bar Premium, banheiros privativos e climatização." },
];

const PARTNERS_DATA = [
  { name: 'Mali Pizzaria', logoUrl: 'https://i.imgur.com/YxcN44a.png', scale: 1.6 },
  { name: 'Santa Helena', logoUrl: 'https://i.imgur.com/XjXzNik.png', scale: 1.5 },
  { name: 'Tirolez', logoUrl: 'https://i.imgur.com/4NmAzLu.png', scale: 1.7 }, 
  { name: 'Matsuya', logoUrl: 'https://i.imgur.com/EeCB2GL.png', scale: 2.2 }, 
  { name: 'Oster', logoUrl: 'https://i.imgur.com/Kqwt8YH.png', scale: 1.0 },
  { name: 'Churrasboat', logoUrl: 'https://i.imgur.com/CZ9lYO8.png', invert: true, scale: 1.9 }, 
  { name: 'Henko Produções', logoUrl: 'https://i.imgur.com/qVnwNYs.png', scale: 1.1 },
  { name: 'Esfiha Imigrantes', logoUrl: 'https://i.imgur.com/VEjZgiI.png', invert: true, scale: 1.4 }, 
  { name: 'Colonial Padaria', logoUrl: 'https://i.imgur.com/cexxcrW.png', scale: 1.3 },
];

// --- COMPONENTES AUXILIARES ---
const ImageWithFallback = ({ src, alt, className, style }) => {
  const [error, setError] = useState(false);
  if (error) return <div className={`${className} bg-neutral-800 flex items-center justify-center rounded-xl`}><Shield className="w-6 h-6 text-gray-600" /></div>;
  return <img src={src} alt={alt} className={className} style={style} onError={() => setError(true)} />;
};

// --- COMPONENTE PRINCIPAL ---
const App = () => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [activeSportId, setActiveSportId] = useState(1); 
  const [expandedMatchKey, setExpandedMatchKey] = useState(null);
  const [expandedFaqKey, setExpandedFaqKey] = useState(null);
  const [toast, setToast] = useState(null);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0 });
  const [adminInputPass, setAdminInputPass] = useState('');
  
  const [activeAlbumId, setActiveAlbumId] = useState(null);
  const [isAlbumOpen, setIsAlbumOpen] = useState(false);

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const nextMatch = useMemo(() => {
    try {
        const all = SPORT_DATA.flatMap(s => (s.matches || []).map(m => {
            const [d, mo] = m.date.split('/');
            return { ...m, homeLogo: TEAM_LOGOS[m.home], pDate: new Date(2026, parseInt(mo) - 1, parseInt(d)) };
        }));
        const future = all.filter(m => m.pDate >= today);
        return future.sort((a,b) => a.pDate - b.pDate)[0] || null;
    } catch(e) { return null; }
  }, [today]);

  const nextEvent = SHOWS_DATA[0];

  const selectedSport = useMemo(() => SPORT_DATA.find(s => s.id === activeSportId) || SPORT_DATA[0], [activeSportId]);

  const visibleMatches = useMemo(() => {
      return (selectedSport.matches || []).filter(m => {
          const [d, mo] = m.date.split('/');
          const pDate = new Date(2026, parseInt(mo) - 1, parseInt(d));
          return pDate >= today;
      });
  }, [selectedSport, today]);

  useEffect(() => {
    if (!nextMatch) return;
    const updateCountdown = () => {
        const now = new Date();
        const [d, mo] = nextMatch.date.split('/');
        const matchHour = parseInt(nextMatch.time.split('h')[0]);
        const matchMin = parseInt(nextMatch.time.split('h')[1] || 0);
        const target = new Date(2026, parseInt(mo) - 1, parseInt(d), matchHour, matchMin);
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
  }, [nextMatch]);

  useEffect(() => {
    signInAnonymously(auth).catch(() => {});
    onAuthStateChanged(auth, setUser);
  }, []);

  useEffect(() => {
    const itv = setInterval(() => setCurrentReviewIndex(p => (p + 1) % REVIEWS_DATA.length), 5000);
    return () => clearInterval(itv);
  }, []);

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (btoa(adminInputPass) === ADMIN_HASH) {
      setToast("Acesso Admin Liberado");
      setIsAdmin(true);
      setTimeout(() => setToast(null), 3000);
      setIsLoginModalOpen(false);
    } else {
      setToast("Senha incorreta");
      setTimeout(() => setToast(null), 3000);
    }
  };

  const handleDownload = (url) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `ArenaHenko_${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getWaLink = (msg) => `https://wa.me/5511940741355?text=${encodeURIComponent(msg)}`;
  const currentAlbum = useMemo(() => STATIC_GALLERY.find(a => a.id === activeAlbumId), [activeAlbumId]);

  return (
    <div className="font-sans text-white bg-black animate-fadeIn overflow-x-hidden scroll-smooth font-bold">
      <style>{`
        @keyframes customFadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-smooth { animation: customFadeIn 0.6s ease-out forwards; }
        @keyframes pulse-emerald { 0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); } 70% { box-shadow: 0 0 0 15px rgba(16, 185, 129, 0); } 100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); } }
        .animate-pulse-wa { animation: pulse-emerald 2s infinite; }
        @keyframes infiniteScroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .animate-infinite-scroll { display: flex; width: max-content; animation: infiniteScroll 45s linear infinite; }
        .animate-infinite-scroll:hover { animation-play-state: paused; }
      `}</style>

      {/* Botão Flutuante WhatsApp */}
      <div className="fixed bottom-6 right-6 z-[250] flex flex-col items-end gap-3">
          <button onClick={() => window.open(getWaLink("Olá! Gostaria de falar com um consultor oficial da Arena Henko."))} className="w-16 h-16 bg-emerald-500 rounded-full shadow-2xl flex items-center justify-center animate-pulse-wa">
              <MessageCircle className="w-8 h-8 text-white fill-white" />
          </button>
      </div>

      {/* Header */}
      <nav className="fixed top-0 w-full z-[100] bg-black/60 backdrop-blur-xl border-b border-white/5 py-2 px-8 flex justify-between items-center font-black">
        <div className="cursor-pointer" onClick={() => window.scrollTo({top:0, behavior:'smooth'})}>
          <img src={LOGO_URL} alt="Logo" className="h-16 w-auto object-contain transition-transform hover:scale-105" />
        </div>
        <div className="hidden md:flex items-center gap-10 uppercase text-[10px] tracking-widest text-white">
            {NAV_LINKS.map(link => <a key={link.name} href={link.href} className="hover:text-red-600 transition-all duration-300">{link.name}</a>)}
            <button onClick={() => setIsLoginModalOpen(true)} className={`p-2 rounded-full transition-colors ${isAdmin ? 'bg-red-600 text-white' : 'bg-white/5 hover:text-red-600'}`}>
                {isAdmin ? <UserCheck className="w-5 h-5" /> : <LockKeyhole className="w-5 h-5" />}
            </button>
        </div>
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden text-red-600"><MenuIcon /></button>
      </nav>

      {isMenuOpen && (
        <div className="fixed inset-0 z-[200] bg-black/98 backdrop-blur-3xl p-10 animate-fadeIn text-center flex flex-col gap-10 justify-center">
          <button onClick={() => setIsMenuOpen(false)} className="absolute top-10 right-10 p-4 bg-neutral-900 rounded-full text-white"><X /></button>
          {NAV_LINKS.map(link => <a key={link.name} href={link.href} onClick={() => setIsMenuOpen(false)} className="text-4xl uppercase hover:text-red-600 italic">{link.name}</a>)}
        </div>
      )}

      {/* Hero */}
      <section className="relative h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-40"><img src="https://i.imgur.com/lKKQfgK.png" className="w-full h-full object-cover" alt="Hero" /></div>
        <div className="relative z-10 w-full max-w-5xl">
          <h1 className="text-6xl md:text-[8rem] font-black mb-2 uppercase italic tracking-tighter text-white">ARENA <span className="text-red-600">HENKO</span></h1>
          <p className="text-gray-400 uppercase tracking-[0.4em] mb-12 text-sm md:text-lg">Hospitalidade Premium & Experiências</p>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12">
            {nextMatch && (
              <div onClick={() => window.open(getWaLink(`Interesse no jogo ${nextMatch.home} x ${nextMatch.away}`))} className="bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-3xl flex items-center gap-5 cursor-pointer text-left shadow-2xl">
                <div className="w-14 h-14 bg-neutral-900 rounded-2xl p-2 flex items-center justify-center border border-white/5"><img src={nextMatch.homeLogo} alt="Next" className="object-contain w-full h-full p-2" /></div>
                <div className="flex-1"><p className="text-red-500 text-[10px] font-bold uppercase tracking-widest mb-1"><Zap className="w-3 h-3 inline mr-1 fill-red-500" /> Próximo Jogo</p><h3 className="text-base font-bold uppercase truncate text-white">{nextMatch.home} x {nextMatch.away}</h3><div className="text-gray-500 text-[10px] font-mono">{timeLeft.d}d {timeLeft.h}h {timeLeft.m}m</div></div>
              </div>
            )}
            <div onClick={() => window.open(getWaLink(`Interesse oficial no show do ${nextEvent.name}`))} className="bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-3xl flex items-center gap-5 hover:bg-white/10 transition-all cursor-pointer text-left group shadow-2xl font-bold">
              <div className="w-14 h-14 bg-neutral-900 rounded-2xl p-3 flex items-center justify-center text-red-500 shadow-xl border border-white/5"><Music className="w-7 h-7" /></div>
              <div className="flex-1 text-white"><p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">Próximo Evento</p><h3 className="text-base font-black uppercase leading-none">{nextEvent.name}</h3><p className="text-red-600 text-[9px] font-mono mt-1 font-bold">{nextEvent.date}</p></div>
            </div>
          </div>
          <a href="#calendario" className="inline-flex px-12 py-5 bg-red-600 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-red-700 transition-all shadow-xl">Explorar Agenda Completa</a>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="bg-neutral-900/50 border-y border-white/5 py-8 font-black text-emerald-500 text-[10px] tracking-widest uppercase">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex items-center justify-center gap-4 font-black"><ShieldCheck className="w-6 h-6" /> Canal Oficial</div>
            <div className="flex items-center justify-center gap-4 font-black"><CheckCircle className="w-6 h-6" /> Acesso Garantido</div>
            <div className="flex items-center justify-center gap-4 font-black"><Headphones className="w-6 h-6" /> Suporte VIP Credenciado</div>
        </div>
      </section>

      {/* Sobre */}
      <section id="sobre" className="py-24 px-6 bg-neutral-950 border-y border-neutral-900 font-bold text-center sm:text-left">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-red-600 text-xs uppercase tracking-[0.3em] mb-4 block">A Arena</span>
            <h2 className="text-5xl font-black uppercase mb-8 italic text-white leading-tight">Onde a emoção <br/>encontra o luxo.</h2>
            <p className="text-gray-400 text-lg mb-12 font-light leading-relaxed">Localizada no Morumbis, a Arena Henko oferece hospitalidade máxima e segurança total. Somos uma operação própria e oficial.</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
              <div><div className="flex items-center gap-1 mb-1 justify-center sm:justify-start font-bold"><span className="text-4xl font-black text-emerald-500">4.9</span><Star className="w-5 h-5 text-emerald-500 fill-emerald-500" /></div><p className="text-[9px] uppercase tracking-widest text-gray-500">Google Rating</p></div>
              <div><h4 className="text-4xl font-black text-white">200+</h4><p className="text-[9px] uppercase tracking-widest text-gray-500">Reviews</p></div>
              <div><h4 className="text-4xl font-black text-white font-bold">5+</h4><p className="text-[9px] uppercase tracking-widest text-gray-500 font-bold">Anos</p></div>
            </div>
          </div>
          <div className="grid gap-4">
             <div className="bg-neutral-900/40 p-6 rounded-2xl border border-neutral-800 flex gap-4 items-start shadow-xl group">
                <Shield className="text-red-600 w-8 h-8 shrink-0 group-hover:scale-110 transition-transform" />
                <div className="font-bold text-left">
                    <h4 className="text-sm font-black uppercase italic text-white">Operação Oficial</h4>
                    <p className="text-gray-500 text-xs mt-1 font-normal">Tratativa direta com o camarote. Sem intermediários ou riscos.</p>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Agenda - Melhorada com nomes e transições */}
      <section id="calendario" className="py-24 px-6 bg-neutral-950 font-black text-white">
        <h2 className="text-4xl md:text-6xl font-black uppercase text-center mb-16 italic">Agenda <span className="text-red-600">2026</span></h2>
        <div className="flex flex-wrap gap-2 justify-center mb-12">
            {SPORT_DATA.map(s => (
              <button key={s.id} onClick={() => setActiveSportId(s.id)} className={`px-8 py-3 rounded-full text-[10px] font-black uppercase transition-all ${activeSportId === s.id ? 'bg-red-600 shadow-xl' : 'bg-neutral-900 text-gray-500 hover:text-white'}`}>{s.name}</button>
            ))}
        </div>
        <div key={activeSportId} className="max-w-6xl mx-auto bg-neutral-900/20 rounded-[3rem] p-8 md:p-16 border border-neutral-800 shadow-3xl animate-smooth">
            <div className="grid lg:grid-cols-5 gap-12 items-center font-bold">
                <div className="lg:col-span-2 text-center font-bold">
                    <div className="bg-black w-32 h-32 mx-auto rounded-3xl p-6 border border-neutral-800 flex items-center justify-center mb-6 overflow-hidden">
                      <ImageWithFallback src={selectedSport.image} alt="League" className="max-h-full object-contain" />
                    </div>
                    <h3 className="text-4xl font-black uppercase italic">{selectedSport.name}</h3>
                </div>
                <div className="lg:col-span-3 space-y-4">
                    {visibleMatches.length > 0 ? visibleMatches.map((m) => (
                    <div key={m.id} className={`bg-neutral-950 border transition-all duration-300 rounded-[2rem] overflow-hidden ${expandedMatchKey === m.id ? 'border-red-600 shadow-2xl bg-neutral-900/50' : 'border-neutral-800 hover:border-neutral-700'}`}>
                        <button onClick={() => setExpandedMatchKey(expandedMatchKey === m.id ? null : m.id)} className="w-full p-6 md:p-8 flex flex-wrap md:flex-nowrap items-center justify-between gap-4 font-black">
                           <span className="text-red-600 text-sm md:text-base font-mono w-full md:w-auto text-left mb-2 md:mb-0">{m.date}</span> 
                           
                           <div className="flex flex-1 items-center justify-center gap-3 md:gap-6">
                              <div className="flex items-center gap-2 md:gap-3">
                                  <span className="hidden sm:inline uppercase text-[11px] tracking-tighter">{m.home}</span>
                                  <img src={m.homeLogo} className="w-8 h-8 md:w-10 md:h-10 object-contain" alt="" />
                              </div>
                              <span className="opacity-30 italic text-sm font-black">VS</span>
                              <div className="flex items-center gap-2 md:gap-3">
                                  <img src={m.awayLogo} className="w-8 h-8 md:w-10 md:h-10 object-contain" alt="" />
                                  <span className="uppercase text-[11px] tracking-tighter">{m.away}</span>
                              </div>
                           </div>
                           
                           <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${expandedMatchKey === m.id ? 'rotate-180 text-red-600' : ''}`} />
                        </button>
                        
                        <div className={`transition-all duration-500 ease-in-out ${expandedMatchKey === m.id ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
                           <div className="px-8 pb-10 pt-4 bg-black/40 border-t border-white/5 text-white">
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 text-[10px] uppercase tracking-widest">
                                  <div className="flex items-center gap-2 bg-white/5 p-3 rounded-xl"><Clock className="w-4 h-4 text-red-600" /> {m.time}</div>
                                  <div className="flex items-center gap-2 bg-white/5 p-3 rounded-xl"><Wine className="w-4 h-4 text-red-600" /> Open Bar</div>
                                  <div className="flex items-center gap-2 bg-white/5 p-3 rounded-xl"><Coffee className="w-4 h-4 text-red-600" /> Open Food</div>
                                  <div className="flex items-center gap-2 bg-white/5 p-3 rounded-xl"><Award className="w-4 h-4 text-red-600" /> VIP</div>
                              </div>
                              <button onClick={() => window.open(getWaLink(`Reserva para ${m.home} x ${m.away} no dia ${m.date}`))} className="w-full bg-red-600 py-5 rounded-2xl uppercase text-[11px] font-black hover:bg-red-700 transition-all shadow-xl hover:scale-[1.01]">Garantir Ingresso Seguro</button>
                           </div>
                        </div>
                    </div>
                    )) : <p className="text-center text-gray-700 py-16 uppercase text-[10px] font-normal">Novas datas em breve.</p>}
                </div>
            </div>
        </div>
      </section>

      {/* Mega Eventos */}
      <section id="eventos" className="py-24 px-6 bg-black font-black text-center">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-black uppercase mb-20 italic text-white">Mega <span className="text-red-600 font-black">Eventos</span></h2>
          <div className="grid md:grid-cols-2 gap-12 font-black">
            {SHOWS_DATA.map((show, i) => (
              <div key={show.id} className="group flex flex-col">
                <div className="relative h-[420px] rounded-[3rem] overflow-hidden mb-8 border border-neutral-800 group-hover:border-red-600 transition-all duration-700 shadow-2xl bg-neutral-900"><img src={show.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-110" alt={show.name} /></div>
                <div className="px-2 text-left">
                    <span className="text-red-600 text-[10px] font-black uppercase tracking-[0.4em] mb-2 block">{show.date}</span>
                    <h3 className="text-3xl font-black uppercase mb-4 italic text-white leading-none">{show.name}</h3>
                    <p className="text-gray-500 text-sm font-normal mb-8 leading-relaxed font-normal">{show.desc}</p>
                    <button onClick={() => window.open(getWaLink(`Interesse oficial no evento ${show.name}.`))} className="text-[10px] font-black uppercase tracking-widest flex items-center gap-3 text-white hover:text-red-600 transition-colors group/btn"><ArrowRight className="w-4 h-4" /> Ver Disponibilidade</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Experiência */}
      <section id="servicos" className="py-24 px-6 bg-neutral-950 border-t border-white/5 font-black text-center">
        <h2 className="text-4xl md:text-6xl font-black uppercase mb-20 italic">A Experiência</h2>
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-10 font-bold">
          {SERVICES_DATA.map((s, i) => (
            <div key={s.id} className="group relative h-[450px] rounded-[2.5rem] overflow-hidden border border-neutral-800 hover:border-red-600/50 transition-all duration-700 shadow-2xl">
              <div className="absolute inset-0"><img src={s.imageUrl} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000" alt={s.title} /></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              <div className="relative z-20 h-full p-10 flex flex-col justify-end text-left font-bold">
                <div className="bg-red-600 p-3 rounded-2xl w-fit mb-4 text-white shadow-xl font-bold">{s.icon}</div>
                <h3 className="text-2xl font-black uppercase mb-2 text-white italic">{s.title}</h3>
                <p className="text-gray-300 text-sm font-normal leading-tight font-normal">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Galeria - SISTEMA DE PASTAS FECHADAS */}
      <section id="galeria" className="py-24 px-6 bg-black border-y border-white/5 font-black text-center">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center justify-center mb-16 gap-4 font-black">
            <h2 className="text-4xl md:text-6xl font-black uppercase italic text-white">Nossa <span className="text-red-600">Galeria</span></h2>
            <p className="text-gray-500 uppercase text-[10px] tracking-widest">
              {isAlbumOpen ? `Explorando: ${currentAlbum.name}` : 'Selecione uma pasta para visualizar'}
            </p>
            {isAlbumOpen && (
              <button 
                onClick={() => setIsAlbumOpen(false)}
                className="mt-4 flex items-center gap-2 text-red-500 hover:text-white transition-colors uppercase text-[10px]"
              >
                <ArrowLeft className="w-4 h-4" /> Voltar para Álbuns
              </button>
            )}
          </div>

          <div className="min-h-[400px]">
            {!isAlbumOpen ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-smooth">
                {STATIC_GALLERY.map((album) => (
                  <div 
                    key={album.id}
                    onClick={() => { setActiveAlbumId(album.id); setIsAlbumOpen(true); }}
                    className="group cursor-pointer relative overflow-hidden rounded-[3rem] aspect-[4/3] border border-white/10 bg-neutral-900 shadow-2xl"
                  >
                    <div className="absolute inset-0">
                      <img 
                        src={album.cover} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-100" 
                        alt={album.name} 
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                    <div className="absolute bottom-10 left-10 text-left font-black">
                       <div className="bg-red-600 px-4 py-1 rounded-full text-[8px] w-fit mb-3 uppercase">Pasta</div>
                       <h3 className="text-2xl italic uppercase">{album.name}</h3>
                       <p className="text-gray-400 text-[10px] mt-1 uppercase">{album.photos.length} Fotos</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-smooth">
                {currentAlbum.photos.map((photoName, idx) => (
                  <div key={idx} className="group relative aspect-square rounded-[2rem] overflow-hidden border border-white/5 bg-neutral-900 shadow-xl">
                    <img 
                      src={`${currentAlbum.folder}/${photoName}`} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 font-black" 
                      alt="Evento" 
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/400x400?text=Erro+Imagem'; }}
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 font-black">
                       <button onClick={() => handleDownload(`${currentAlbum.folder}/${photoName}`)} className="bg-white/10 backdrop-blur-md p-4 rounded-2xl text-white hover:bg-red-600 hover:scale-110 transition-all shadow-2xl">
                         <Download className="w-6 h-6 font-bold" />
                       </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Parceiros */}
      <section id="parceiros" className="py-24 bg-neutral-900/40 border-y border-neutral-900 overflow-hidden font-black">
        <h3 className="text-[10px] text-gray-500 uppercase tracking-widest mb-16 italic text-center font-bold">Parceiros Oficiais</h3>
        <div className="relative flex overflow-hidden">
          <div className="flex animate-infinite-scroll whitespace-nowrap gap-28 items-center font-bold">
            {[...PARTNERS_DATA, ...PARTNERS_DATA].map((p, i) => (
                <div key={i} className="flex-shrink-0 flex items-center justify-center w-64 h-24 transition-all duration-500 font-bold font-black">
                    <img src={p.logoUrl} className="object-contain" alt={p.name} style={{ maxHeight: '70px', maxWidth: '220px', transform: `scale(${p.scale || 1.0})`, filter: p.invert ? 'brightness(0) invert(1)' : 'none' }} />
                </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 px-6 bg-black border-t border-white/5 font-black text-white text-center">
        <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-black uppercase mb-16 italic font-bold">Dúvidas <span className="text-red-600">Frequentes</span></h2>
            <div className="space-y-4 font-bold">
                {FAQ_DATA.map((item, i) => (
                    <div key={i} className="bg-neutral-900/50 border border-neutral-800 rounded-2xl overflow-hidden text-left transition-all font-bold">
                        <button onClick={() => setExpandedFaqKey(expandedFaqKey === i ? null : i)} className="w-full p-6 flex items-center justify-between font-black uppercase text-[10px] tracking-widest group font-bold font-black">{item.q}<ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${expandedFaqKey === i ? 'rotate-180' : ''}`} /></button>
                        {expandedFaqKey === i && <p className="px-6 pb-6 text-gray-400 text-xs font-light leading-relaxed animate-smooth font-normal">{item.a}</p>}
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contato" className="py-32 bg-neutral-950 border-t border-neutral-900 text-center font-black">
        <h2 className="text-5xl md:text-7xl font-black mb-20 uppercase italic text-white font-bold">Viva sua <br/><span className="text-red-600">ARENA HENKO.</span></h2>
        <div className="grid sm:grid-cols-3 gap-6 max-w-5xl mx-auto px-6 text-white uppercase text-[10px] tracking-widest mb-20 font-bold">
            <a href="https://instagram.com/arenahenko" target="_blank" rel="noopener noreferrer" className="bg-black p-12 rounded-[2.5rem] border border-neutral-800 hover:border-red-600 transition-all flex flex-col items-center gap-5 shadow-2xl font-bold"><Instagram className="text-red-600 w-10 h-10 font-bold" /> Instagram</a>
            <a href="https://wa.me/5511940741355" target="_blank" rel="noopener noreferrer" className="bg-black p-12 rounded-[2.5rem] border border-neutral-800 hover:border-red-600 transition-all flex flex-col items-center gap-5 shadow-2xl font-bold"><Phone className="text-red-600 w-10 h-10 font-bold" /> WhatsApp</a>
            <a href="mailto:sergio@henkoproducoes.com.br" className="bg-black p-12 rounded-[2.5rem] border border-neutral-800 hover:border-red-600 transition-all flex flex-col items-center gap-5 shadow-2xl font-bold"><Mail className="text-red-600 w-10 h-10 font-bold" /> E-mail</a>
        </div>
        <img src={LOGO_URL} className="h-14 mx-auto opacity-30 font-bold" alt="" />
      </footer>

      {/* Login Modal */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-[300] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-8 font-bold">
          <div className="bg-neutral-900 border border-neutral-800 p-12 rounded-[3rem] w-full max-w-sm shadow-3xl text-center font-bold">
            <h2 className="text-xl uppercase mb-8 italic text-white font-black font-black">Painel <span className="text-red-600">Admin</span></h2>
            <form onSubmit={handleAdminLogin}>
              <input 
                type="password" 
                placeholder="Senha" 
                value={adminInputPass} 
                onChange={(e) => setAdminInputPass(e.target.value)} 
                className="w-full bg-black border border-neutral-800 rounded-2xl px-8 py-5 mb-6 text-white focus:outline-none focus:border-red-600 text-center tracking-widest font-bold font-black" 
              />
              <div className="flex gap-4 font-bold">
                <button type="button" onClick={() => setIsLoginModalOpen(false)} className="flex-1 py-4 text-[10px] uppercase border border-neutral-800 rounded-2xl font-bold font-black font-black">Voltar</button>
                <button type="submit" className="flex-1 py-4 text-[10px] uppercase bg-red-600 rounded-2xl text-white font-bold font-black font-black font-black">Entrar</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {toast && <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[500] bg-red-600 text-white px-10 py-4 rounded-full font-black text-[10px] uppercase tracking-widest animate-bounce flex items-center gap-2 font-black font-black font-black"><AlertTriangle className="w-4 h-4 font-bold" /> {toast}</div>}
    </div>
  );
};

export default App;
