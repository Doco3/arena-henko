import React, { useState, useEffect, useMemo } from 'react';
import { 
  Menu as MenuIcon, X, Instagram, Mail, Phone, Calendar, Award, Users, Tv, Music, MapPin, 
  CheckCircle, ArrowRight, Clock, Shield, ChevronDown, Star, MessageCircle, Quote, 
  LockKeyhole, Coffee, Wine, ShieldCheck, Headphones, MousePointerClick, Smartphone, UserCheck,
  Beer, Zap, Play, Image as ImageIcon, Plus, Trash2, FolderOpen, AlertTriangle, Loader2, Download, Link as LinkIcon, ArrowLeft,
  Sparkles, Heart, MicVocal, Globe, Flame, Music2, TrendingUp, Verified, Info, Ticket
} from 'lucide-react';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

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

const ADMIN_HASH = "SGVua29fTWFzdGVyXzIwMjZfU2VjdXJlISM="; 
const LOGO_URL = 'https://i.imgur.com/vIWDDID.png'; 
const BTS_BANNER_URL = 'https://static.wikia.nocookie.net/the-bangtan-boys/images/e/ed/BTS_ARIRANG_Concept_Picture.png/revision/latest?cb=20260313221019';
const PEAO_BANNER_URL = 'https://i.imgur.com/GW8we0X.png';

const TEAM_LOGOS = {
  SPFC: "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/2026.png",
  SANTOS: "https://upload.wikimedia.org/wikipedia/commons/1/15/Santos_Logo.png?utm_source=pt.wikipedia.org&utm_campaign=index&utm_content=original",
  CORITIBA: "https://upload.wikimedia.org/wikipedia/commons/c/ca/ECFC6.png?utm_source=pt.wikipedia.org&utm_campaign=index&utm_content=original",
  BOLIVAR: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Escudo_de_Club_Bol%C3%ADvar.svg/1920px-Escudo_de_Club_Bol%C3%ADvar.svg.png",
  MACARA: "https://upload.wikimedia.org/wikipedia/commons/5/57/Macara_6.png",
  MIRASSOL: "https://upload.wikimedia.org/wikipedia/commons/5/5b/Mirassol_FC_logo.png"
};

const SERVICES_DATA = [
    { id: 1, title: 'Lounge de Hospitalidade', icon: <Users className="w-6 h-6" />, desc: 'Espaço exclusivo para relaxamento e networking antes do evento.', imageUrl: 'https://i.imgur.com/Bw5Yw4K.png' },
    { id: 2, title: 'Recepção VIP', icon: <Award className="w-6 h-6" />, desc: 'Atendimento diferenciado e entrada exclusiva sem filas.', imageUrl: 'https://i.imgur.com/pLUfmBf.png' },
    { id: 3, title: 'Ambiente Premium', icon: <Beer className="w-6 h-6" />, desc: 'Open bar e Open Food com um cardápio sofisticado.', imageUrl: 'https://i.imgur.com/Za2zSyx.png' },
    { id: 4, title: 'Conforto Absoluto', icon: <ShieldCheck className="w-6 h-6" />, desc: 'Ambiente climatizado com assentos de alto padrão.', imageUrl: 'https://i.imgur.com/PrhiB8E.png' },
    { id: 5, title: 'Vista Privilegiada', icon: <MapPin className="w-6 h-6" />, desc: 'A melhor visão do estádio para acompanhar todos os detalhes.', imageUrl: 'https://i.imgur.com/7R1hOwg.png' },
    { id: 6, title: 'Segurança Dedicada', icon: <Shield className="w-6 h-6" />, desc: 'Equipe especializada para garantir sua total tranquilidade.', imageUrl: 'https://i.imgur.com/Gy62moQ.png' },
];

const VENUES_DATA = {
  spfc: {
    id: 'spfc',
    name: 'Camarote Morumbis',
    teamName: 'São Paulo FC',
    logo: TEAM_LOGOS.SPFC,
    primaryColor: 'red',
    accentClass: 'text-red-600',
    bgAccentClass: 'bg-red-600',
    borderAccentClass: 'border-red-600',
    btnClass: 'bg-orange-gradient text-white hover:opacity-90',
    leagues: [
      { 
        id: 1, name: 'Brasileirão', subtitle: 'Série A 2026', image: "https://a.espncdn.com/combiner/i?img=/i/leaguelogos/soccer/500/85.png", 
        matches: [
          { id: 'sp_br1', date: '15/08', home: 'SPFC', away: 'CORITIBA', time: '21h00', homeLogo: TEAM_LOGOS.SPFC, awayLogo: TEAM_LOGOS.CORITIBA }
        ]
      },
      { id: 2, name: 'Copa do Brasil', subtitle: '2026', image: 'https://upload.wikimedia.org/wikipedia/pt/9/96/CopaDoBrasil.png', matches: [] },
      { id: 3, name: 'Paulistão', subtitle: '2026', image: 'https://i.imgur.com/Kl9LPUl.png', matches: [] },
      { 
        id: 4, name: 'Sudamericana', subtitle: 'Conmebol 2026', image: 'https://upload.wikimedia.org/wikipedia/en/thumb/c/c2/CONMEBOL_Sudamericana_logo_%282017%29.svg/250px-CONMEBOL_Sudamericana_logo_%282017%29.svg.png', 
        matches: [
            { id: 'sp_sd1', date: '18/08', home: 'SPFC', away: 'BOLÍVAR', time: '19h30', homeLogo: TEAM_LOGOS.SPFC, awayLogo: TEAM_LOGOS.BOLIVAR }
        ] 
      }
    ]
  },
  santos: {
    id: 'santos',
    name: 'Camarote Vila Belmiro',
    teamName: 'Santos FC',
    logo: TEAM_LOGOS.SANTOS,
    primaryColor: 'white',
    accentClass: 'text-zinc-100',
    bgAccentClass: 'bg-white text-black',
    borderAccentClass: 'border-white',
    btnClass: 'bg-white text-black hover:bg-neutral-200',
    leagues: [
      { 
        id: 1, name: 'Brasileirão', subtitle: 'Campeonato Brasileiro 2026', image: "https://a.espncdn.com/combiner/i?img=/i/leaguelogos/soccer/500/85.png", 
        matches: [
          { id: 'san_br1', date: '23/08', home: 'SANTOS', away: 'MIRASSOL', time: '16h00', homeLogo: TEAM_LOGOS.SANTOS, awayLogo: TEAM_LOGOS.MIRASSOL }
        ]
      },
      { id: 2, name: 'Copa do Brasil', subtitle: '2026', image: 'https://upload.wikimedia.org/wikipedia/pt/9/96/CopaDoBrasil.png', matches: [] },
      { id: 3, name: 'Paulistão', subtitle: '2026', image: 'https://i.imgur.com/Kl9LPUl.png', matches: [] },
      { 
        id: 4, name: 'Sudamericana', subtitle: 'Conmebol 2026', image: 'https://upload.wikimedia.org/wikipedia/en/thumb/c/c2/CONMEBOL_Sudamericana_logo_%282017%29.svg/250px-CONMEBOL_Sudamericana_logo_%282017%29.svg.png', 
        matches: [
            { id: 'san_sd1', date: '13/08', home: 'SANTOS', away: 'MACARÁ', time: '21h30', homeLogo: TEAM_LOGOS.SANTOS, awayLogo: TEAM_LOGOS.MACARA }
        ] 
      }
    ]
  }
};

const REVIEWS_DATA = [
  { name: "Mariana Costa", text: "Lugar maravilhoso, comida excelente e atendimento de primeira! O melhor do Morumbis.", role: "Google Review" },
  { name: "João Paulo S.", text: "Conforto e segurança total para levar minha família. Passam muita credibilidade.", role: "Empresário" },
  { name: "Felipe Almeida", text: "O buffet é sensacional e a vista é a melhor possível. Atendimento nota 10.", role: "Google Review" },
  { name: "Ricardo Santos", text: "Atendimento diferenciado. Vale cada centavo pela hospitalidade.", role: "Convidado VIP" },
  { name: "Letícia Rossi", text: "Ambiente familiar e muito seguro. Meus filhos adoraram o espaço.", role: "Google Review" }
];

const STATIC_GALLERY = [
  {
    id: 'acdc-28-02',
    name: 'AC/DC - 28/02',
    folder: '/acdc-2802',
    cover: 'https://www.rbsdirect.com.br/filestore/8/5/6/4/1/9/4_9472ea360a1702b/4914658_704acea3d79d4d7.jpg?version=1575255600',
    photos: Array.from({length: 30}, (_, i) => `show-acdc-${String(i+1).padStart(2, '0')}.jpeg`)
  }
];

const NAV_LINKS = [
  { name: 'Sobre', href: '#sobre' },
  { name: 'Depoimentos', href: '#reviews' },
  { name: 'Agenda', href: '#calendario' },
  { name: 'Experiência', href: '#servicos' },
  { name: 'Galeria', href: '#galeria' },
  { name: 'Contato', href: '#contato' },
];

const StarRating = ({ count = 5 }) => (
  <div className="flex gap-1 text-emerald-500">
    {[...Array(count)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
  </div>
);

const ImageWithFallback = ({ src, alt, className }) => {
  const [error, setError] = useState(false);
  if (error) return <div className={`${className} bg-neutral-800 flex items-center justify-center rounded-xl`}><ImageIcon className="text-neutral-600" /></div>;
  return <img src={src} alt={alt} className={className} onError={() => setError(true)} />;
};

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeVenueId, setActiveVenueId] = useState('spfc');
  const [activeLeagueId, setActiveLeagueId] = useState(1); 
  const [expandedMatchKey, setExpandedMatchKey] = useState(null);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [toast, setToast] = useState(null);
  const [activeAlbumId, setActiveAlbumId] = useState(null);
  const [isAlbumOpen, setIsAlbumOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [adminInputPass, setAdminInputPass] = useState('');

  const currentVenue = VENUES_DATA[activeVenueId];
  const isSantos = activeVenueId === 'santos';

  useEffect(() => {
    signInAnonymously(auth).catch(() => {});
    onAuthStateChanged(auth, () => {});
    const itv = setInterval(() => setCurrentReviewIndex(p => (p + 1) % REVIEWS_DATA.length), 6000);
    return () => clearInterval(itv);
  }, []);

  const selectedLeague = useMemo(() => currentVenue.leagues.find(l => l.id === activeLeagueId) || currentVenue.leagues[0], [currentVenue, activeLeagueId]);
  
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const visibleMatches = useMemo(() => (selectedLeague?.matches || []).filter(m => {
      const [d, mo] = m.date.split('/');
      const pDate = new Date(2026, parseInt(mo) - 1, parseInt(d));
      return pDate >= today;
  }), [selectedLeague, today]);

  const nextMatch = useMemo(() => {
    let allMatches = [];
    currentVenue.leagues.forEach(league => {
      league.matches.forEach(match => {
        const [d, mo] = match.date.split('/');
        const pDate = new Date(2026, parseInt(mo) - 1, parseInt(d));
        if (pDate >= today) {
          allMatches.push({ ...match, leagueName: league.name, parsedDate: pDate });
        }
      });
    });
    allMatches.sort((a, b) => a.parsedDate - b.parsedDate);
    return allMatches.length > 0 ? allMatches[0] : null;
  }, [currentVenue, today]);

  const currentAlbum = useMemo(() => STATIC_GALLERY.find(a => a.id === activeAlbumId), [activeAlbumId]);

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (btoa(adminInputPass) === ADMIN_HASH) {
      setToast("Acesso Admin Liberado");
      setTimeout(() => setToast(null), 3000);
      setIsLoginModalOpen(false);
    } else {
      setToast("Senha incorreta");
      setTimeout(() => setToast(null), 3000);
    }
  };

  const getWaLink = (msg) => `https://wa.me/5511940741355?text=${encodeURIComponent(msg)}`;

  return (
    <div className={`font-sans text-white bg-black animate-fadeIn overflow-x-hidden scroll-smooth font-black italic transition-colors duration-700`}>
      <style>{`
        @keyframes customFadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-smooth { animation: customFadeIn 0.6s ease-out forwards; }
        @keyframes pulse-emerald { 0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); } 70% { box-shadow: 0 0 0 15px rgba(16, 185, 129, 0); } 100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); } }
        .animate-pulse-wa { animation: pulse-emerald 2s infinite; }
        .bg-orange-gradient { background: linear-gradient(90deg, #ff8a00 0%, #e52e12 100%); }
        .bg-purple-gradient { background: linear-gradient(90deg, #7c3aed 0%, #4c1d95 100%); }
        .drawer-content { max-height: 0; opacity: 0; overflow: hidden; transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1); }
        .drawer-open { max-height: 2000px; opacity: 1; padding-top: 1rem; }
      `}</style>

      {/* Floating WhatsApp */}
      <div className="fixed bottom-6 right-6 z-[250]">
          <button onClick={() => window.open(getWaLink("Olá! Gostaria de falar com um consultor oficial do Camarote Arena Henko."))} className="w-16 h-16 bg-emerald-500 rounded-full shadow-2xl flex items-center justify-center animate-pulse-wa transition-transform hover:scale-110 active:scale-95">
              <MessageCircle className="w-8 h-8 text-white fill-white" />
          </button>
      </div>

      {/* Header com Seletor de Camarote */}
      <nav className="fixed top-0 w-full z-[100] bg-black/60 backdrop-blur-md border-b border-white/5 py-4 px-8 transition-all">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
            {/* Logo principal com scroll to top */}
            <div className="flex items-center gap-6">
                <div className="cursor-pointer" onClick={() => window.scrollTo({top:0, behavior:'smooth'})}>
                    <img src={LOGO_URL} alt="Logo" className="h-12 w-auto object-contain transition-transform hover:scale-105 hidden sm:block" />
                </div>
                
                {/* SELETOR DE TEMAS/ESTÁDIOS - Sem scroll */}
                <div className="flex bg-neutral-900/80 rounded-full p-1 border border-white/10">
                    <button 
                    onClick={() => { setActiveVenueId('spfc'); setActiveLeagueId(1); }} 
                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${!isSantos ? 'bg-red-600 shadow-lg' : 'opacity-50 hover:opacity-100'}`}
                    >
                    <img src={TEAM_LOGOS.SPFC} className="w-5 h-5 object-contain" alt="SPFC"/>
                    <span className="text-[10px] uppercase tracking-widest hidden md:block">Morumbis</span>
                    </button>
                    <button 
                    onClick={() => { setActiveVenueId('santos'); setActiveLeagueId(1); }} 
                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${isSantos ? 'bg-white text-black shadow-lg' : 'opacity-50 hover:opacity-100'}`}
                    >
                    <img src={TEAM_LOGOS.SANTOS} className="w-5 h-5 object-contain" alt="Santos"/>
                    <span className="text-[10px] uppercase tracking-widest hidden md:block">Vila Belmiro</span>
                    </button>
                </div>
            </div>

            <div className="hidden lg:flex items-center gap-8 uppercase text-[10px] tracking-[0.2em] text-white/80">
                {NAV_LINKS.map(link => <a key={link.name} href={link.href} className={`transition-all hover:${isSantos ? 'text-zinc-300' : 'text-red-600'}`}>{link.name}</a>)}
            </div>
            <button onClick={() => setIsMenuOpen(true)} className="lg:hidden text-white p-2 hover:bg-white/5 rounded-lg transition-all"><MenuIcon /></button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`fixed inset-0 z-[200] bg-black/98 backdrop-blur-3xl p-10 transition-all duration-500 ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
          <button onClick={() => setIsMenuOpen(false)} className="absolute top-10 right-10 p-4 bg-neutral-900 rounded-full text-white"><X /></button>
          <div className="flex flex-col gap-8 justify-center items-center h-full text-center">
            {NAV_LINKS.map(link => <a key={link.name} href={link.href} onClick={() => setIsMenuOpen(false)} className={`text-4xl uppercase italic transition-all hover:${isSantos ? 'text-zinc-300' : 'text-red-600'}`}>{link.name}</a>)}
          </div>
      </div>

      {/* HERO SECTION - FESTA DO PEÃO */}
      <section className="relative h-screen flex flex-col justify-between bg-black overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 z-0">
          <img src={PEAO_BANNER_URL} className="w-full h-full object-cover object-center opacity-70 transition-transform duration-[30s] hover:scale-110" alt="Festa do Peão" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
        </div>

        <div className="relative z-20 w-full max-w-7xl mx-auto px-10 pt-48 text-center lg:text-left animate-smooth">
            <h1 className="text-4xl md:text-6xl lg:text-8xl font-black uppercase tracking-tighter leading-[0.9] text-white drop-shadow-2xl">
              FESTA DO <br className="hidden md:block"/> <span className={isSantos ? 'text-white' : 'text-red-600'}>PEÃO 2026</span>
            </h1>
            <div className="flex items-center justify-center lg:justify-start gap-4 mt-4">
                <p className="text-lg md:text-2xl font-black uppercase tracking-[0.3em] text-white italic">BARRETOS</p>
                <div className={`h-[2px] w-12 ${isSantos ? 'bg-white/60' : 'bg-red-600/60'}`} />
                <p className={`text-sm md:text-xl font-black uppercase tracking-widest italic ${isSantos ? 'text-zinc-400' : 'text-red-400'}`}>AGOSTO 2026</p>
            </div>
        </div>

        <div className="relative z-20 w-full max-w-7xl mx-auto px-10 pb-16 flex flex-col lg:flex-row items-center lg:items-end justify-between gap-8">
            <div className="flex flex-col gap-2 text-white/60 text-[10px] md:text-xs uppercase tracking-[0.3em] italic text-center lg:text-left">
                <div className="flex items-center gap-3 justify-center lg:justify-start">
                    <Verified size={16} className={isSantos ? 'text-white' : 'text-red-600'} />
                    <span className="font-bold">HOSPITALIDADE ARENA HENKO</span>
                </div>
                <div className="flex items-center gap-3 justify-center lg:justify-start">
                    <Star size={16} className={isSantos ? 'text-white fill-white' : 'text-red-600 fill-red-600'} />
                    <span className="font-bold">O MAIOR EVENTO DO BRASIL</span>
                </div>
            </div>

            <div className="flex flex-col items-center lg:items-end gap-5 w-full lg:w-auto">
                <button 
                  onClick={() => window.open(getWaLink("QUERO GARANTIR MEU LUGAR NA FESTA DO PEÃO - HOSPITALIDADE ARENA HENKO"))}
                  className={`w-full sm:w-80 py-5 rounded-full text-xs uppercase tracking-[0.3em] shadow-2xl hover:scale-[1.05] active:scale-95 transition-all flex items-center justify-center gap-4 group font-black ${isSantos ? 'bg-white text-black' : 'bg-orange-gradient text-white'}`}
                >
                  CONSULTAR DISPONIBILIDADE <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                </button>
            </div>
        </div>
      </section>

      {/* BTS SECTION - REDUZIDA, ESGOTADO (MANTÉM O ROXO COMO IDENTIDADE DO SHOW) */}
      <section className="relative py-16 bg-neutral-950 overflow-hidden border-b border-purple-900/30">
        <div className="absolute inset-0 z-0">
          <img src={BTS_BANNER_URL} className="w-full h-full object-cover object-center opacity-20 scale-105" alt="BTS" />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-purple-900/20 to-black z-10" />
        </div>

        <div className="relative z-20 max-w-7xl mx-auto px-10 flex flex-col lg:flex-row items-center justify-between gap-10 text-center lg:text-left">
          <div>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-white mb-3">
              BTS WORLD TOUR <span className="text-purple-500 block lg:inline">- ARIRANG</span>
            </h2>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <p className="text-sm md:text-base font-black uppercase tracking-widest text-purple-400 italic">MORUMBIS • NOV 2026</p>
                <span className="bg-purple-600 text-white text-[10px] px-4 py-1.5 rounded-full uppercase tracking-widest font-black shadow-lg">Lote Esgotado</span>
            </div>
          </div>

          <div className="flex flex-col items-center lg:items-end gap-3">
              <p className="text-purple-400 text-[10px] uppercase tracking-[0.2em] font-black">MAIS INFORMAÇÕES NO NOSSO INSTAGRAM</p>
              <button 
                onClick={() => window.open("https://instagram.com/arenahenko", "_blank")}
                className="w-full sm:w-auto px-10 py-4 rounded-full bg-neutral-900 border border-purple-500 text-white font-black text-[10px] uppercase tracking-[0.3em] shadow-2xl hover:bg-purple-600 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 group"
              >
                ACESSAR INSTAGRAM <Instagram size={16} className="group-hover:scale-110 transition-transform" />
              </button>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="bg-neutral-900/50 border-y border-white/5 py-12 text-emerald-500 text-[10px] tracking-widest uppercase italic text-center font-black">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center gap-3"><ShieldCheck size={28}/><span className="uppercase">Canal Oficial {currentVenue.name}</span><StarRating /></div>
            <div className="flex flex-col items-center gap-3"><CheckCircle size={28}/><span className="uppercase">Acesso Garantido</span><StarRating /></div>
            <div className="flex flex-col items-center gap-3"><Headphones size={28}/><span className="uppercase">Suporte VIP Arena</span><StarRating /></div>
        </div>
      </section>

      {/* Sobre Section */}
      <section id="sobre" className="py-24 px-6 bg-neutral-950 border-y border-neutral-900 text-center sm:text-left">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className={`${currentVenue.accentClass} text-xs uppercase tracking-[0.3em] mb-4 block font-black`}>{currentVenue.name}</span>
            <h2 className="text-5xl font-black uppercase mb-8 italic text-white leading-tight">Onde a emoção <br/>encontra o luxo.</h2>
            <p className="text-gray-400 text-lg mb-12 font-normal leading-relaxed italic">Localizada no {currentVenue.name}, o Camarote Arena Henko oferece hospitalidade máxima e segurança total. Operação própria e oficial.</p>
          </div>
          <div className="grid gap-4">
             <div className={`bg-neutral-900/40 p-10 rounded-[3rem] border border-neutral-800 flex gap-6 items-start shadow-xl group hover:${currentVenue.borderAccentClass} transition-all`}>
                <Shield className={`${currentVenue.accentClass} w-10 h-10 shrink-0`} />
                <div><h4 className="text-lg font-black uppercase italic text-white">Operação Oficial</h4><p className="text-gray-500 text-sm mt-2 font-normal italic">Tratativa direta com o camarote. Sem intermediários.</p></div>
             </div>
          </div>
        </div>
      </section>

      {/* Experiência Section */}
      <section id="servicos" className="py-24 px-6 bg-black italic text-center">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-black uppercase mb-20 italic text-white">Nossa <span className={currentVenue.accentClass}>Experiência</span></h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {SERVICES_DATA.map((service) => (
              <div key={service.id} className="group relative h-[400px] rounded-[3rem] overflow-hidden border border-white/5 bg-neutral-900 shadow-2xl transition-all hover:scale-[1.02]">
                <img src={service.imageUrl} className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity" alt={service.title} />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                <div className="absolute bottom-10 left-10 right-10 text-left">
                  <div className={`${currentVenue.bgAccentClass} w-12 h-12 rounded-2xl flex items-center justify-center mb-6 shadow-xl`}>{service.icon}</div>
                  <h3 className="text-2xl font-black uppercase italic mb-2 text-white">{service.title}</h3>
                  <p className="text-gray-400 text-sm font-normal">{service.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AGENDA DE JOGOS - DINÂMICA POR TIME */}
      <section id="calendario" className="py-24 px-6 bg-neutral-950 text-white italic border-y border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col items-center mb-12 text-center">
            <div className="flex items-center gap-3 mb-4">
               <img src={currentVenue.logo} alt={currentVenue.teamName} className="w-10 h-10 object-contain" />
               <span className={`text-sm font-black uppercase tracking-widest ${isSantos ? 'text-zinc-300' : 'text-red-500'}`}>{currentVenue.name}</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black uppercase italic">
              Agenda <span className={isSantos ? 'text-white underline decoration-zinc-500' : 'text-red-600'}>2026</span>
            </h2>
        </div>

        {/* PRÓXIMO JOGO DESTAQUE */}
        {nextMatch && (
          <div className="max-w-4xl mx-auto mb-16 relative animate-smooth">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
              <span className={`px-4 py-1 text-[10px] uppercase font-black tracking-[0.2em] rounded-full shadow-lg ${isSantos ? 'bg-white text-black' : 'bg-red-600 text-white'}`}>
                Próximo Jogo
              </span>
            </div>
            <div className={`relative overflow-hidden rounded-[2.5rem] bg-neutral-900 border shadow-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 ${isSantos ? 'border-white/20' : 'border-red-600/30'}`}>
              <div className="flex flex-col items-center md:items-start text-center md:text-left gap-2 w-full md:w-auto">
                <span className="text-xs uppercase tracking-widest text-gray-500 font-black">{nextMatch.leagueName}</span>
                <span className={`text-3xl md:text-4xl font-black ${isSantos ? 'text-white' : 'text-red-600'}`}>{nextMatch.date}</span>
                <span className="text-sm font-bold text-gray-400">{nextMatch.time} • {currentVenue.name}</span>
              </div>
              <div className="flex items-center justify-center gap-6 md:gap-10">
                <img src={nextMatch.homeLogo} alt={nextMatch.home} className="w-16 h-16 md:w-20 md:h-20 object-contain drop-shadow-xl" />
                <span className="opacity-30 italic text-xl font-black">VS</span>
                <img src={nextMatch.awayLogo} alt={nextMatch.away} className="w-16 h-16 md:w-20 md:h-20 object-contain drop-shadow-xl" />
              </div>
              <div className="w-full md:w-auto flex justify-center">
                <button 
                  onClick={() => window.open(getWaLink(`Interesse no PRÓXIMO JOGO: ${nextMatch.home} x ${nextMatch.away} (${nextMatch.date}) - ${currentVenue.name}`))} 
                  className={`w-full md:w-auto px-8 py-5 rounded-full font-black text-[10px] md:text-xs uppercase tracking-widest shadow-xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3 ${
                    isSantos ? 'bg-white text-black hover:bg-neutral-200' : 'bg-orange-gradient text-white'
                  }`}
                >
                  <Ticket size={16}/> Garantir Lugar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Ligas da Arena Ativa */}
        <div className="flex flex-wrap gap-2 justify-center mb-12 animate-smooth">
            {currentVenue.leagues.map(l => (
              <button 
                key={l.id} 
                onClick={() => setActiveLeagueId(l.id)} 
                className={`px-8 py-3 rounded-full text-[10px] font-black uppercase transition-all ${
                  activeLeagueId === l.id 
                    ? (isSantos ? 'bg-white text-black shadow-xl' : 'bg-red-600 text-white shadow-xl') 
                    : 'bg-neutral-900 text-gray-500 hover:text-white'
                }`}
              >
                {l.name}
              </button>
            ))}
        </div>

        {/* Grade de Jogos */}
        <div key={activeLeagueId + activeVenueId} className="max-w-6xl mx-auto bg-black/40 rounded-[3rem] p-8 md:p-16 border border-neutral-800 shadow-3xl animate-smooth">
            <div className="grid lg:grid-cols-5 gap-12 items-center">
                <div className="lg:col-span-2 text-center">
                    <div className="bg-neutral-950 w-32 h-32 mx-auto rounded-3xl p-6 border border-neutral-800 flex items-center justify-center mb-6 overflow-hidden">
                      <ImageWithFallback src={selectedLeague.image} alt="League" className="max-h-full object-contain" />
                    </div>
                    <h3 className="text-3xl font-black uppercase italic mb-2">{selectedLeague.name}</h3>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">{selectedLeague.subtitle}</p>
                </div>
                <div className="lg:col-span-3 space-y-4">
                    {visibleMatches.length > 0 ? visibleMatches.map((m) => (
                    <div key={m.id} className={`bg-neutral-900 border transition-all duration-300 rounded-[2.5rem] overflow-hidden ${expandedMatchKey === m.id ? (isSantos ? 'border-white shadow-2xl bg-black' : 'border-red-600 shadow-2xl bg-black') : 'border-neutral-800 hover:border-neutral-700'}`}>
                        <button onClick={() => setExpandedMatchKey(expandedMatchKey === m.id ? null : m.id)} className="w-full p-6 md:p-8 flex flex-wrap md:flex-nowrap items-center justify-between gap-4">
                           <span className={`${currentVenue.accentClass} text-sm md:text-base font-mono font-bold w-full md:w-auto text-left`}>{m.date}</span> 
                           <div className="flex flex-1 items-center justify-center gap-4 md:gap-6">
                              <img src={m.homeLogo} className="w-10 h-10 md:w-12 md:h-12 object-contain" alt="" />
                              <span className="opacity-30 italic text-xs md:text-sm font-black">VS</span>
                              <img src={m.awayLogo} className="w-10 h-10 md:w-12 md:h-12 object-contain" alt="" />
                           </div>
                           <ChevronDown size={24} className={`text-gray-500 transition-transform ${expandedMatchKey === m.id ? (isSantos ? 'rotate-180 text-white' : 'rotate-180 text-red-600') : ''}`} />
                        </button>
                        <div className={`drawer-content ${expandedMatchKey === m.id ? 'drawer-open px-6 md:px-8 pb-8' : ''}`}>
                             <div className="pt-4 border-t border-white/5 grid grid-cols-2 gap-4 text-left">
                                <div><p className="text-[10px] text-gray-500 uppercase tracking-widest font-black">Horário / Local</p><p className="text-xs md:text-sm font-bold text-white">{m.time} • {currentVenue.name}</p></div>
                                <div className="text-right"><p className="text-[10px] text-gray-500 uppercase tracking-widest font-black">Hospitalidade</p><p className="text-xs md:text-sm font-bold text-emerald-500 uppercase">Full Open Bar & Food</p></div>
                                <button onClick={() => window.open(getWaLink(`Interesse no jogo ${m.home} x ${m.away} (${m.date}) - ${currentVenue.name}`))} className={`col-span-2 mt-4 py-4 rounded-2xl flex items-center justify-center gap-3 transition-all font-black text-xs uppercase tracking-widest ${isSantos ? 'bg-white/10 hover:bg-white text-white hover:text-black' : 'bg-white/5 hover:bg-red-600 text-white'}`}>
                                  <Ticket size={16}/> Consultar Disponibilidade
                                </button>
                             </div>
                        </div>
                    </div>
                    )) : <p className="text-center text-gray-700 py-16 uppercase text-[10px] font-black">Sem jogos programados para os próximos dias.</p>}
                </div>
            </div>
        </div>
      </section>

      {/* Depoimentos */}
      <section id="reviews" className="py-24 bg-neutral-950 border-b border-white/5 text-center italic">
        <div className="max-w-4xl mx-auto px-6">
          <Quote className={`w-12 h-12 mx-auto mb-8 opacity-40 ${currentVenue.accentClass}`} />
          <div className="relative overflow-hidden h-48 md:h-40">
            {REVIEWS_DATA.map((review, i) => (
              <div key={i} className={`absolute inset-0 transition-all duration-700 ${currentReviewIndex === i ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <p className="text-xl md:text-2xl text-white italic mb-6 font-bold">"{review.text}"</p>
                <div className="flex justify-center mb-2"><StarRating /></div>
                <h4 className={`${currentVenue.accentClass} uppercase text-xs tracking-widest font-black`}>{review.name} — {review.role}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Galeria */}
      <section id="galeria" className="py-24 px-6 bg-black border-b border-white/5 text-center italic">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center justify-center mb-16 gap-4">
            <h2 className="text-4xl md:text-6xl font-black uppercase italic text-white">Nossa <span className={currentVenue.accentClass}>Galeria</span></h2>
            {isAlbumOpen && (
              <button onClick={() => setIsAlbumOpen(false)} className={`mt-4 flex items-center gap-2 hover:text-white transition-colors uppercase text-[10px] font-black ${currentVenue.accentClass}`}>
                <ArrowLeft size={18} /> Voltar para Álbuns
              </button>
            )}
          </div>

          {!isAlbumOpen ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-smooth">
              {STATIC_GALLERY.map((album) => (
                <div key={album.id} onClick={() => { setActiveAlbumId(album.id); setIsAlbumOpen(true); }} className="group relative cursor-pointer overflow-hidden rounded-[3rem] aspect-[4/3] border border-white/10 bg-neutral-900 shadow-2xl transition-transform hover:scale-[1.02]">
                  <img src={album.cover} className="absolute inset-0 w-full h-full object-cover opacity-60 transition-all duration-700" alt={album.name} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                  <div className="absolute bottom-10 left-10 text-left">
                     <div className={`${currentVenue.bgAccentClass} px-4 py-1 rounded-full text-[8px] w-fit mb-3 uppercase font-black italic`}>Pasta</div>
                     <h3 className="text-2xl italic uppercase font-black text-white">{album.name}</h3>
                     <p className="text-gray-400 text-[10px] mt-1 uppercase font-black opacity-60">{album.photos.length} Fotos</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 animate-smooth">
              {currentAlbum.photos.map((photoName, idx) => (
                <div key={idx} className="group relative aspect-square rounded-[2rem] overflow-hidden border border-white/5 bg-neutral-900 shadow-xl">
                   <img 
                    src={`${currentAlbum.folder}/${photoName}`} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                    alt={`Foto ${idx}`} 
                    onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&q=80&w=800"; }}
                   />
                   <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                     <button className="bg-white/10 backdrop-blur-md p-4 rounded-2xl text-white"><Download size={24} /></button>
                   </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer id="contato" className="py-32 bg-neutral-950 border-t border-neutral-900 text-center italic transition-colors">
        <h2 className="text-5xl md:text-7xl font-black mb-20 uppercase italic text-white leading-none">VIVA SUA <br/><span className={currentVenue.accentClass}>ARENA HENKO.</span></h2>
        <div className="grid sm:grid-cols-3 gap-6 max-w-5xl mx-auto px-6 text-white uppercase text-[10px] tracking-widest mb-20 font-black">
            <a href="https://instagram.com/arenahenko" target="_blank" rel="noopener noreferrer" className={`bg-black p-14 rounded-[3rem] border border-neutral-800 transition-all flex flex-col items-center gap-5 shadow-2xl italic hover:${currentVenue.borderAccentClass}`}><Instagram className={`${currentVenue.accentClass} w-12 h-12`} /> Instagram</a>
            <a href="https://wa.me/5511940741355" target="_blank" rel="noopener noreferrer" className={`bg-black p-14 rounded-[3rem] border border-neutral-800 transition-all flex flex-col items-center gap-5 shadow-2xl italic hover:${currentVenue.borderAccentClass}`}><Phone className={`${currentVenue.accentClass} w-12 h-12`} /> WhatsApp</a>
            <a href="mailto:sergio@henkoproducoes.com.br" className={`bg-black p-14 rounded-[3rem] border border-neutral-800 transition-all flex flex-col items-center gap-5 shadow-2xl italic hover:${currentVenue.borderAccentClass}`}><Mail className={`${currentVenue.accentClass} w-12 h-12`} /> E-mail</a>
        </div>
        <img src={LOGO_URL} className="h-16 mx-auto opacity-30" alt="" />
      </footer>

      {toast && <div className={`fixed bottom-12 left-1/2 -translate-x-1/2 z-[500] text-white px-12 py-5 rounded-full font-black text-[11px] uppercase tracking-widest animate-bounce flex items-center gap-3 ${currentVenue.bgAccentClass}`}><AlertTriangle size={16} /> {toast}</div>}
    </div>
  );
};

export default App;
