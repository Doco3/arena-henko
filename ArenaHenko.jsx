import React, { useState, useEffect, useRef } from 'react';
import { 
  Menu as MenuIcon, X, Instagram, Mail, Phone, Calendar, Award, Users, Tv, Music, MapPin, 
  CheckCircle, ArrowRight, Lock, Edit2, Save, LogOut, Clock, CalendarDays, Shield, 
  ChevronDown, Info, Beer, Trophy, Star, Activity, MessageCircle, History, TrendingUp, MapPinned, Ticket, Zap, Timer, Quote, ChevronLeft, ChevronRight, Download, Trash2, Camera, Upload, Loader2, LockKeyhole, ArrowLeft, Filter, Coffee, Wine
} from 'lucide-react';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, addDoc, onSnapshot, deleteDoc, doc } from 'firebase/firestore';

// --- 1. CONFIGURAÇÃO DO FIREBASE ---
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

// --- 2. CONSTANTES DE DADOS GLOBAIS ---

const TEAM_LOGOS = {
  SPFC: "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/2026.png",
  SANTOS: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Santos_logo.svg/1045px-Santos_logo.svg.png",
  PRIMAVERA: "https://upload.wikimedia.org/wikipedia/pt/0/0c/Esporte_Clube_Primavera_logo.png",
  FLAMENGO: "https://upload.wikimedia.org/wikipedia/commons/9/93/Flamengo-RJ_%28BRA%29.png",
  GREMIO: "https://a.espncdn.com/i/teamlogos/soccer/500/6273.png",
  CHAPECOENSE: "https://upload.wikimedia.org/wikipedia/pt/b/bc/Escudo_de_2018_da_Chapecoense.png"
};

const NAV_LINKS = [
  { name: 'Sobre', href: '#sobre' },
  { name: 'Serviços', href: '#servicos' },
  { name: 'Agenda', href: '#calendario' },
  { name: 'Eventos', href: '#eventos' },
  { name: 'Parceiros', href: '#parceiros' },
  { name: 'Contato', href: '#contato' },
];

const SERVICES_DATA = [
    { title: 'Lounge de Hospitalidade', icon: <Users className="w-6 h-6" />, desc: 'Ponto exclusivo para networking, briefings e relaxamento pré-evento.', imageUrl: 'https://i.imgur.com/Bw5Yw4K.png' },
    { title: 'Recepção VIP', icon: <Award className="w-6 h-6" />, desc: 'Atendimento premium e acesso rápido e diferenciado desde a chegada.', imageUrl: 'https://i.imgur.com/pLUfmBf.png' },
    { title: 'Ambiente Premium', icon: <Beer className="w-6 h-6" />, desc: 'Open bar, Open Food com culinária sofisticada e entretenimento ao vivo.', imageUrl: 'https://i.imgur.com/Za2zSyx.png' },
    { title: 'Networking', icon: <CheckCircle className="w-6 h-6" />, desc: 'O ambiente ideal para expandir a sua rede de contactos profissionais.', imageUrl: 'https://i.imgur.com/PrhiB8E.png' },
    { title: 'Vista Privilegiada', icon: <MapPin className="w-6 h-6" />, desc: 'Acesso exclusivo e visão privilegiada do campo/palco no Morumbis.', imageUrl: 'https://i.imgur.com/7R1hOwg.png' },
    { title: 'Branding & Mídia', icon: <Tv className="w-6 h-6" />, desc: 'Ativações de marca em Ring LED e relatórios de visibilidade premium.', imageUrl: 'https://i.imgur.com/Gy62moQ.png' },
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
  { name: 'Mali Pizzaria', logoUrl: 'https://i.imgur.com/YxcN44a.png', extra: false },
  { name: 'Santa Helena', logoUrl: 'https://i.imgur.com/XjXzNik.png', extra: false },
  { name: 'Tirolez', logoUrl: 'https://i.imgur.com/4NmAzLu.png', extra: true }, 
  { name: 'Matsuya', logoUrl: 'https://i.imgur.com/EeCB2GL.png', extra: true }, 
  { name: 'Oster', logoUrl: 'https://i.imgur.com/Kqwt8YH.png', extra: false },
  { name: 'Kicaldo', logoUrl: 'https://i.imgur.com/6ZVogLo.png', extra: false },
  { name: 'Churrasboat', logoUrl: 'https://i.imgur.com/CZ9lYO8.png', extra: true, invert: true }, 
  { name: 'Henko Produções', logoUrl: 'https://i.imgur.com/qVnwNYs.png', extra: false },
  { name: 'Cap-Lab', logoUrl: 'https://i.imgur.com/LDGTXoZ.png', extra: false },
  { name: 'Estado Luso', logoUrl: 'https://i.imgur.com/rS7PHb3.png', extra: false },
  { name: 'Esfiha Imigrantes', logoUrl: 'https://i.imgur.com/VEjZgiI.png', extra: true, invert: true }, 
  { name: 'Colonial Padaria', logoUrl: 'https://i.imgur.com/cexxcrW.png', extra: false },
  { name: 'Weach', logoUrl: 'https://i.imgur.com/jz15iRQ.png', extra: false },
];

const REVIEWS_DATA = [
  { name: "Mariana Costa", text: "Lugar maravilhoso, comida excelente e atendimento de primeira! O melhor camarote do Morumbis sem dúvidas.", role: "Google Review", initial: "M" },
  { name: "João Paulo S.", text: "Conforto e segurança total para levar minha família. Passam muita credibilidade em tudo o que fazem.", role: "Empresário", initial: "J" },
  { name: "Felipe Almeida", text: "O buffet é sensacional e a vista é a melhor possível. Atendimento nota 10 de toda a equipe!", role: "Google Review", initial: "F" },
  { name: "Ricardo Santos", text: "Atendimento diferenciado. Vale cada centavo pela hospitalidade e tranquilidade.", role: "Convidado VIP", initial: "R" },
  { name: "Letícia Rossi", text: "Ambiente familiar e muito seguro. Meus filhos adoraram o espaço. É o melhor investimento.", role: "Google Review", initial: "L" },
  { name: "André Luiz", text: "Ambiente sensacional para levar clientes. A organização da Arena Henko é simplesmente impecável.", role: "Empresário", initial: "A" },
  { name: "Bruna Meirelles", text: "O buffet é maravilhoso. Melhor camarote do Morumbis para quem quer conforto e gastronomia.", role: "Digital Influencer", initial: "B" },
  { name: "Carlos Eduardo", text: "Segurança total. Entrei sem filas e fui super bem atendido por toda a equipa de recepção.", role: "Google Review", initial: "C" },
  { name: "Daniela Souza", text: "Vista perfeita do gramado. Dá pra ver cada detalhe do jogo sem perder o luxo do lounge.", role: "Torcedora VIP", initial: "D" },
  { name: "Eduardo Vaz", text: "Catering de primeira. Bebidas geladas e serviço ágil. Vale muito a pena para eventos corporativos.", role: "CEO", initial: "E" },
  { name: "Fernanda G.", text: "Experiência incrível nos shows. Tudo muito bem planejado, desde o acesso até o pós-evento.", role: "Google Review", initial: "F" },
  { name: "Gustavo Henrique", text: "Melhor investimento para curtir o jogo com a família com paz e mordomia completa.", role: "Empresário", initial: "G" },
  { name: "Heloísa Lima", text: "O atendimento dos garçons é nota 10. Muito prestativos e atenciosos com todos os convidados.", role: "Convidada", initial: "H" },
  { name: "Igor Cavalcante", text: "Networking de alto nível no lounge. Conheci pessoas incríveis enquanto assistia ao meu time.", role: "Empreendedor", initial: "I" },
  { name: "Juliana Paiva", text: "Ambiente limpo, seguro e muito sofisticado. Os banheiros privativos são um diferencial enorme.", role: "Google Review", initial: "J" },
  { name: "Lucas Martins", text: "Fui no show do The Weeknd pela Henko e foi inesquecível. Vista privilegiada do palco.", role: "Fã VIP", initial: "L" },
  { name: "Patrícia Oliveira", text: "Sempre escolho a Henko pela confiança e tradição. São os melhores do Morumbis.", role: "Google Review", initial: "P" },
  { name: "Rodrigo Mello", text: "O melhor buffet que já comi num estádio. A variedade e qualidade impressionam de verdade.", role: "Gastrónomo", initial: "R" },
  { name: "Sofia Rocha", text: "Tudo impecável. Organização que respeita o cliente. Não troco por nenhum outro camarote.", role: "Google Review", initial: "S" },
  { name: "Tiago Abravanel", text: "Lugar de gente bonita e energia lá em cima. A hospitalidade da Henko é fora de série.", role: "Artista", initial: "T" }
];

// --- 3. UTILITÁRIOS ---
const ImageWithFallback = ({ src, alt, className, style }) => {
  const [error, setError] = useState(false);
  if (error) return <div className={`${className} bg-neutral-800 flex items-center justify-center rounded-xl`}><Shield className="w-6 h-6 text-gray-600" /></div>;
  return <img src={src} alt={alt} className={className} style={style} onError={() => setError(true)} />;
};

// --- 4. COMPONENTE PRINCIPAL ---
const App = () => {
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

  // Lógica de Datas Blindada
  const selectedSport = SPORT_DATA.find(s => s.id === activeSportId) || SPORT_DATA[0];
  const visibleMatches = selectedSport.matches || [];
  
  const getNextMatch = () => {
    try {
        const all = SPORT_DATA.flatMap(s => (s.matches || []).map(m => ({
            ...m,
            pDate: new Date(2026, parseInt(m.date.split('/')[1]) - 1, parseInt(m.date.split('/')[0]))
        })));
        // Data atual simulada: 27/01/2026
        const future = all.filter(m => m.pDate >= new Date(2026, 0, 27));
        return future.sort((a,b) => a.pDate - b.pDate)[0] || null;
    } catch(e) { return null; }
  };

  const nextMatch = getNextMatch();
  const nextEvent = SHOWS_DATA[0];

  // Efeitos
  useEffect(() => {
    const updateCountdown = () => {
        const now = new Date();
        const target = new Date(2026, 0, 28, 21, 30); 
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
    signInAnonymously(auth).catch(() => {});
    onAuthStateChanged(auth, setUser);
    const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/x-icon'; link.rel = 'shortcut icon'; link.href = LOGO_URL;
    document.getElementsByTagName('head')[0].appendChild(link);
  }, []);

  useEffect(() => {
    const itv = setInterval(() => setCurrentReviewIndex(p => (p + 1) % REVIEWS_DATA.length), 5000);
    return () => clearInterval(itv);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  const getWaLink = (msg) => `https://wa.me/5511940741355?text=${encodeURIComponent(msg)}`;

  return (
    <div className="font-sans text-white bg-black animate-fadeIn overflow-x-hidden scroll-smooth">
      <style>{`
        @keyframes customFadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-smooth { animation: customFadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
        html { scroll-behavior: smooth; }
      `}</style>

      {/* Navbar Premium */}
      <nav className={`fixed top-0 w-full z-[100] transition-all duration-500 bg-black/60 backdrop-blur-xl border-b border-white/5 py-4`}>
        <div className="max-w-7xl mx-auto px-8 flex justify-between items-center">
          <div className="cursor-pointer group" onClick={() => window.scrollTo({top:0, behavior:'smooth'})}>
              <img src={LOGO_URL} alt="Arena Henko" className="w-14 h-14 object-contain group-hover:scale-110 transition-all duration-500" />
          </div>
          <div className="hidden md:flex items-center gap-10 font-black uppercase text-[10px] tracking-widest">
            {NAV_LINKS.map(link => (
              <a key={link.name} href={link.href} className="hover:text-red-600 transition-all duration-300 font-black">{link.name}</a>
            ))}
            <button onClick={() => document.getElementById('login-modal').classList.remove('hidden')} className="hover:text-red-600 transition-all p-2 bg-white/5 rounded-full">
               <LockKeyhole className="w-5 h-5" />
            </button>
          </div>
          <button onClick={() => setIsMenuOpen(true)} className="md:hidden text-red-600"><MenuIcon className="w-7 h-7" /></button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[200] bg-black/98 backdrop-blur-3xl p-10 animate-fadeIn font-black text-center flex flex-col gap-10 justify-center">
          <button onClick={() => setIsMenuOpen(false)} className="absolute top-10 right-10 p-4 bg-neutral-900 rounded-full shadow-2xl"><X className="w-8 h-8 text-white font-bold" /></button>
          {NAV_LINKS.map(link => (
            <a key={link.name} href={link.href} onClick={() => setIsMenuOpen(false)} className="text-4xl uppercase hover:text-red-600 italic transition-all font-black leading-none">{link.name}</a>
          ))}
        </div>
      )}

      {/* Hero */}
      <section className="relative h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden font-black">
        <div className="absolute inset-0 z-0 opacity-40">
          <img src="https://i.imgur.com/lKKQfgK.png" className="w-full h-full object-cover" alt="Hero" />
        </div>
        <div className="relative z-10 w-full max-w-5xl">
          <h1 className="text-6xl md:text-[8rem] font-black mb-2 uppercase italic tracking-tighter leading-none text-white">
            ARENA <span className="text-red-600">HENKO</span>
          </h1>
          <p className="text-gray-400 uppercase tracking-[0.4em] mb-12 text-sm md:text-lg font-light">Hospitalidade Premium & Experiências</p>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12 font-black">
            {nextMatch && (
              <div onClick={() => window.open(getWaLink(`Interesse no jogo ${nextMatch.home} x ${nextMatch.away}`))} className="bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-3xl flex items-center gap-5 hover:bg-white/10 transition-all cursor-pointer text-left relative group shadow-2xl">
                <div className="absolute top-4 right-4 bg-red-600 px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-full shadow-lg animate-pulse z-20">
                    {nextMatch.scarcity || "Alta Procura"}
                </div>
                <div className="w-14 h-14 bg-neutral-900 rounded-2xl p-2 flex items-center justify-center shadow-xl border border-white/5">
                  <img src={nextMatch.homeLogo} alt="Next" className="object-contain" />
                </div>
                <div className="flex-1">
                  <p className="text-red-500 text-[10px] font-black uppercase tracking-widest mb-1 flex items-center gap-1 font-black uppercase tracking-widest"><Zap className="w-3 h-3 fill-red-500" /> Próximo Jogo</p>
                  <h3 className="text-base font-black uppercase leading-none truncate text-white">{nextMatch.home} x {nextMatch.away}</h3>
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
                <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1 font-black uppercase tracking-widest">Próximo Evento</p>
                <h3 className="text-base font-black uppercase leading-none text-white">{nextEvent.name}</h3>
                <p className="text-red-600 text-[9px] mt-2 font-mono uppercase tracking-widest">{nextEvent.date}</p>
              </div>
            </div>
          </div>
          <a href="#calendario" className="inline-flex px-12 py-5 bg-red-600 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-red-700 transition-all shadow-xl font-black">Explorar Agenda Completa</a>
        </div>
      </section>

      {/* Sobre Blindado */}
      <section id="sobre" className="py-24 px-6 bg-neutral-950 border-y border-neutral-900 font-black">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="text-center sm:text-left">
            <span className="text-red-600 text-xs uppercase tracking-[0.3em] mb-4 block font-black">A Arena</span>
            <h2 className="text-5xl font-black uppercase mb-8 italic text-white leading-tight">Onde a emoção <br/>encontra o luxo.</h2>
            <p className="text-gray-400 text-lg mb-12 font-light leading-relaxed">Localizada no Morumbis, a Arena Henko oferece hospitalidade máxima e segurança total para sua experiência oficial.</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center gap-1 mb-1 justify-center sm:justify-start">
                    <span className="text-4xl font-black text-emerald-500 font-black">4.9</span>
                    <Star className="w-5 h-5 text-emerald-500 fill-emerald-500" />
                </div>
                <p className="text-[9px] uppercase tracking-widest text-gray-500 font-black">Google Rating</p>
              </div>
              <div><h4 className="text-4xl font-black text-white">200+</h4><p className="text-[9px] uppercase tracking-widest text-gray-500 font-black">Reviews</p></div>
              <div><h4 className="text-4xl font-black text-white">5+</h4><p className="text-[9px] uppercase tracking-widest text-gray-500 font-black">Anos</p></div>
              <div><h4 className="text-4xl font-black text-white">100+</h4><p className="text-[9px] uppercase tracking-widest text-gray-500 font-black">Eventos</p></div>
            </div>
          </div>
          <div className="grid gap-4">
             <div className="bg-neutral-900/40 p-6 rounded-2xl border border-neutral-800 flex gap-4 items-start shadow-xl hover:border-red-900/50 transition-all group font-black">
                <Shield className="text-red-600 w-8 h-8 shrink-0 group-hover:scale-110 transition-transform font-black" />
                <div><h4 className="text-sm font-black uppercase italic text-white font-black">Operação Oficial</h4><p className="text-gray-500 text-xs mt-1 font-normal font-black">Somos credenciados e oficiais no Morumbis. Fuja de fraudes.</p></div>
             </div>
             <div className="bg-neutral-900/40 p-6 rounded-2xl border border-neutral-800 flex gap-4 items-start shadow-xl hover:border-red-900/50 transition-all group font-black">
                <Award className="text-red-600 w-8 h-8 shrink-0 group-hover:scale-110 transition-transform font-black" />
                <div><h4 className="text-sm font-black uppercase italic text-white font-black">Hospitalidade Vip</h4><p className="text-gray-500 text-xs mt-1 font-normal font-black">Buffet premium liberado e bebidas de primeira classe.</p></div>
             </div>
          </div>
        </div>
      </section>

      {/* Serviços */}
      <section id="servicos" className="py-24 px-6 bg-black text-center font-black">
        <div className="max-w-7xl mx-auto font-black">
          <h2 className="text-4xl md:text-6xl font-black uppercase mb-20 italic text-white font-black">Full Experience</h2>
          <div className="grid md:grid-cols-3 gap-10 font-black">
            {SERVICES_DATA.map((s, i) => (
              <div key={i} className="group relative h-[450px] rounded-[2.5rem] overflow-hidden border border-neutral-800 hover:border-red-600/50 transition-all duration-700 shadow-2xl font-black">
                <div className="absolute inset-0 font-black"><img src={s.imageUrl} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-110 font-black" alt={s.title} /></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent font-black" />
                <div className="relative z-20 h-full p-10 flex flex-col justify-end text-left font-black">
                  <div className="bg-red-600 p-3 rounded-2xl w-fit mb-4 text-white shadow-xl font-black">{s.icon}</div>
                  <h3 className="text-2xl font-black uppercase mb-2 text-white italic leading-none font-black">{s.title}</h3>
                  <p className="text-gray-300 text-sm font-normal leading-tight font-black">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Agenda (Calendário) com Efeito Smooth */}
      <section id="calendario" className="py-24 px-6 bg-neutral-950 font-black text-white">
        <div className="max-w-6xl mx-auto font-black">
          <h2 className="text-4xl md:text-6xl font-black uppercase text-center mb-16 italic text-white font-black">Agenda <span className="text-red-600 font-black">2026</span></h2>
          <div className="flex flex-wrap gap-2 justify-center mb-12 font-black">
            {SPORT_DATA.map(s => (
              <button key={s.id} onClick={() => { setActiveSportId(s.id); setExpandedMatchKey(null); }} className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeSportId === s.id ? 'bg-red-600 text-white shadow-xl scale-105 font-black' : 'bg-neutral-900 text-gray-500 hover:text-white border border-white/5 font-black'}`}>{s.name}</button>
            ))}
          </div>
          <div key={activeSportId} className="bg-neutral-900/20 rounded-[3rem] p-8 md:p-16 border border-neutral-800 shadow-3xl animate-smooth transition-all duration-500 font-black">
             <div className="grid lg:grid-cols-5 gap-12 items-center font-black">
                <div className="lg:col-span-2 text-center group font-black">
                    <div className="bg-black w-44 h-44 mx-auto rounded-3xl p-8 border border-neutral-800 flex items-center justify-center mb-6 transition-transform duration-500 hover:scale-110 shadow-2xl overflow-hidden font-black">
                        <ImageWithFallback 
                            src={selectedSport.image} 
                            alt="Campeonato" 
                            className="max-h-full object-contain font-black" 
                            style={selectedSport.id === 3 ? { filter: 'brightness(0) invert(1)' } : {}} 
                        />
                    </div>
                    <h3 className="text-4xl font-black uppercase italic leading-none text-white font-black">{selectedSport.name}</h3>
                    <p className="text-red-600 text-[10px] tracking-[0.4em] mt-3 uppercase font-black">{selectedSport.subtitle}</p>
                </div>
                <div className="lg:col-span-3 space-y-10 font-normal text-left font-black text-white font-black">
                    {visibleMatches.length > 0 ? visibleMatches.map((m, i) => (
                      <div key={i} className="relative font-black">
                         {m.scarcity && (
                             <div className="absolute -top-3 left-6 bg-red-600 text-white text-[8px] font-black px-3 py-1 rounded-full shadow-lg z-10 animate-bounce flex items-center gap-1 uppercase tracking-widest font-black">
                                <Zap className="w-3 h-3 fill-white font-black" /> {m.scarcity}
                             </div>
                         )}
                         <div className={`bg-neutral-950 border transition-all duration-300 rounded-[2rem] overflow-hidden ${expandedMatchKey === i ? 'border-red-600/50 shadow-2xl font-black' : 'border-neutral-800 font-black'}`}>
                            <button onClick={() => setExpandedMatchKey(expandedMatchKey === i ? null : i)} className="w-full p-7 flex items-center justify-between group font-black">
                                <div className="flex items-center gap-8 font-black text-white font-black">
                                    <span className="text-xs text-gray-500 w-10 font-black">{m.date}</span>
                                    <div className="flex items-center gap-4 font-black">
                                    <span className="uppercase text-sm hidden sm:block font-black text-white font-black">{m.home}</span>
                                    <img src={m.homeLogo} className="w-8 h-8 object-contain font-black" alt="H" />
                                    <span className="opacity-30 italic text-xs font-black font-black">VS</span>
                                    <img src={TEAM_LOGOS[m.away] || m.awayLogo} className="w-8 h-8 object-contain font-black" alt="A" />
                                    <span className="uppercase text-sm hidden sm:block font-black text-white font-black">{m.away}</span>
                                    </div>
                                </div>
                                <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${expandedMatchKey === i ? 'rotate-180 text-red-600 font-black' : 'text-gray-700 font-black'}`} />
                            </button>
                            <div className={`transition-all duration-500 ease-in-out overflow-hidden ${expandedMatchKey === i ? 'max-h-[350px] opacity-100 font-black' : 'max-h-0 opacity-0 font-black'}`}>
                                <div className="px-10 pb-10 pt-4 bg-white/5 border-t border-white/5 font-black text-white text-left font-black">
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 text-[9px] text-gray-400 uppercase tracking-widest font-black">
                                        <div className="flex flex-col gap-1 font-black font-black"><span className="text-gray-600 flex items-center gap-1 font-black"><Clock className="w-3 h-3 font-black"/> Horário</span><span className="text-white text-xs font-black">{m.time}</span></div>
                                        <div className="flex flex-col gap-1 font-black font-black"><span className="text-gray-600 flex items-center gap-1 font-black"><LockKeyhole className="w-3 h-3 font-black"/> Abertura</span><span className="text-red-500 text-xs font-black font-black font-black font-black">2h Antes</span></div>
                                        <div className="flex flex-col gap-1 font-black font-black"><span className="text-gray-600 flex items-center gap-1 font-black"><Wine className="w-3 h-3 font-black"/> Open Bar</span><span className="text-white text-[8px] font-black font-black">Premium & Drinks</span></div>
                                        <div className="flex flex-col gap-1 font-black font-black"><span className="text-gray-600 flex items-center gap-1 font-black"><Coffee className="w-3 h-3 font-black"/> Open Food</span><span className="text-white text-[8px] font-black font-black">Buffet Completo</span></div>
                                    </div>
                                    <button onClick={() => window.open(getWaLink(`Olá! Quero reservar minha experiência exclusiva para o jogo ${m.home} x ${m.away} na Arena Henko.`))} className="w-full bg-red-600 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest text-white shadow-xl hover:scale-105 transition-all font-black">Reservar Agora</button>
                                </div>
                            </div>
                         </div>
                      </div>
                    )) : <p className="text-center text-gray-700 uppercase text-[10px] py-16 font-black tracking-widest italic text-white font-black">Novas datas em breve.</p>}
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Próximos Eventos */}
      <section id="eventos" className="py-24 px-6 bg-black font-black">
        <div className="max-w-7xl mx-auto font-black text-white font-black">
          <h2 className="text-4xl md:text-6xl font-black uppercase text-center mb-20 italic text-white font-black">Próximos <span className="text-red-600 font-black">Eventos</span></h2>
          <div className="grid md:grid-cols-3 gap-12 font-black">
            {SHOWS_DATA.map((show, i) => (
              <div key={i} className="group flex flex-col font-black">
                <div className="relative h-[420px] rounded-[3rem] overflow-hidden mb-8 border border-neutral-800 group-hover:border-red-600 transition-all duration-700 shadow-2xl bg-neutral-900 font-black">
                    <img src={show.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-110 font-black" alt={show.name} />
                </div>
                <div className="px-2 text-left font-black">
                    <span className="text-red-600 text-[10px] font-black uppercase tracking-[0.4em] mb-2 block font-black">{show.date}</span>
                    <h3 className="text-3xl font-black uppercase mb-4 italic text-white leading-none font-black">{show.name}</h3>
                    <p className="text-gray-500 text-sm font-normal mb-8 leading-relaxed font-normal font-black">{show.desc}</p>
                    <button onClick={() => window.open(getWaLink(`Interesse no evento ${show.name}`))} className="text-[10px] font-black uppercase tracking-widest flex items-center gap-3 text-white hover:text-red-500 transition-colors group/btn font-black uppercase font-black">
                        Ver Disponibilidade <div className="p-2.5 bg-neutral-900 rounded-full group-hover/btn:bg-red-600 transition-all font-black"><ArrowRight className="w-4 h-4 font-black"/></div>
                    </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Parceiros - 13 Logos Coloridos (Zoom ajustado e fundo mais claro) */}
      <section id="parceiros" className="py-24 bg-neutral-900/40 border-y border-neutral-900 px-10 font-black">
         <div className="max-w-7xl mx-auto text-center font-black">
            <h3 className="text-[10px] text-gray-500 uppercase tracking-[0.6em] mb-20 font-black italic uppercase font-black">Marcas de Elite Conosco</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-10 items-center font-black text-center">
               {PARTNERS_DATA.map((p, i) => (
                  <div key={i} className={`h-20 flex items-center justify-center transition-transform duration-500 ${p.extra ? 'hover:scale-150 scale-140 font-black' : 'hover:scale-125 font-black'} font-black`}>
                    <img 
                        src={p.logoUrl} 
                        className="max-h-full max-w-full object-contain font-black" 
                        alt={p.name} 
                        style={p.invert ? { filter: 'brightness(0) invert(1)' } : {}}
                    />
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* Prova Social (RESTAURADA) */}
      <section id="reviews" className="py-32 px-6 bg-black text-center font-black">
         <div className="max-w-4xl mx-auto font-black text-white">
            <div className="flex flex-col items-center gap-6 mb-20 font-black">
              <h3 className="text-4xl md:text-5xl font-black uppercase tracking-tighter italic font-black">Aprovação Máxima</h3>
              <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-8 py-4 rounded-full backdrop-blur-md font-black">
                <span className="text-xs text-gray-500 uppercase tracking-widest font-black">Google Rating</span>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 text-emerald-500 fill-emerald-500 font-black" />)}
                </div>
                <span className="text-sm font-bold text-emerald-500 ml-1 font-black">4.9/5</span>
              </div>
            </div>
            
            <div className="relative min-h-[350px] flex items-center justify-center overflow-hidden font-black">
               {REVIEWS_DATA.map((r, i) => (
                 <div key={i} className={`absolute w-full transition-all duration-1000 transform ${i === currentReviewIndex ? 'opacity-100 translate-y-0 scale-100 font-black' : 'opacity-0 translate-y-10 scale-90 pointer-events-none font-black'}`}>
                    <div className="bg-neutral-900 p-12 md:p-16 rounded-[4rem] border border-neutral-800 shadow-2xl relative font-black">
                       <Quote className="w-20 h-20 text-red-600/5 absolute top-8 right-12 font-black" />
                       <p className="text-gray-300 text-xl md:text-2xl italic mb-12 leading-relaxed font-light font-black text-white">"{r.text}"</p>
                       <div className="flex items-center justify-center gap-5 font-black">
                          <div className="w-14 h-14 bg-red-600/20 border border-red-600/30 rounded-full flex items-center justify-center text-red-500 text-xl font-black font-black">{r.initial}</div>
                          <div className="text-left font-black"><p className="font-bold uppercase text-base text-white italic font-black">{r.name}</p><p className="text-gray-600 text-[10px] uppercase tracking-widest font-black">{r.role}</p></div>
                       </div>
                    </div>
                 </div>
               ))}
            </div>
            <div className="flex justify-center gap-3 mt-12 font-black">
              {REVIEWS_DATA.map((_, i) => (
                <button key={i} onClick={() => setCurrentReviewIndex(i)} className={`h-1.5 rounded-full transition-all duration-500 font-black ${i === currentReviewIndex ? 'w-10 bg-red-600' : 'w-2 bg-neutral-800'}`} />
              ))}
            </div>
         </div>
      </section>

      {/* Contato Final com Texto Reduzido */}
      <section id="contato" className="py-40 bg-neutral-950 border-t border-neutral-900 text-center font-black">
         <div className="max-w-5xl mx-auto font-black text-white font-black text-white">
            <h2 className="text-5xl md:text-7xl font-black mb-20 uppercase italic tracking-tighter leading-none text-white font-black font-black">
                Viva sua <br/><span className="text-white underline decoration-red-600/20 font-black font-black font-black">ARENA</span> <span className="text-red-600 underline decoration-red-600/20 font-black font-black font-black">HENKO.</span>
            </h2>
            <div className="grid sm:grid-cols-3 gap-6 font-black text-white uppercase font-black text-white">
               <a href="https://instagram.com/arenahenko" target="_blank" className="bg-black p-12 rounded-[2.5rem] border border-neutral-800 hover:border-red-600 transition-all flex flex-col items-center gap-5 group shadow-2xl text-white font-black text-white">
                 <Instagram className="w-12 h-12 text-red-600 group-hover:scale-110 transition-transform font-bold font-black text-red-600" />
                 <span className="text-[11px] uppercase tracking-widest font-black text-white font-black text-white">Instagram</span>
               </a>
               <a href="https://wa.me/5511940741355" target="_blank" className="bg-black p-12 rounded-[2.5rem] border border-neutral-800 hover:border-red-600 transition-all flex flex-col items-center gap-5 group shadow-2xl text-white font-black text-white">
                 <Phone className="w-12 h-12 text-red-600 group-hover:scale-110 transition-transform font-bold font-black text-red-600" />
                 <span className="text-[11px] uppercase tracking-widest font-black text-white font-black text-white">WhatsApp</span>
               </a>
               <a href="mailto:sergio@henkoproducoes.com.br" className="bg-black p-12 rounded-[2.5rem] border border-neutral-800 hover:border-red-600 transition-all flex flex-col items-center gap-5 group shadow-2xl text-white font-black text-white">
                 <Mail className="w-12 h-12 text-red-600 group-hover:scale-110 transition-transform font-bold font-black text-red-600" />
                 <span className="text-[11px] uppercase tracking-widest font-black text-white font-black text-white">E-mail</span>
               </a>
            </div>
         </div>
      </section>

      {/* Footer Final */}
      <footer className="bg-neutral-950 py-24 px-10 border-t border-neutral-900 font-black text-white font-black text-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12 text-center md:text-left font-black">
          <div className="flex flex-col items-center md:items-start gap-5 font-black text-white font-black font-black text-white">
            <img src={LOGO_URL} alt="Arena Henko" className="h-14 w-auto object-contain font-black" />
            <p className="text-gray-700 text-[9px] uppercase tracking-[0.5em] font-black italic text-white font-black text-white">Arena Henko &copy; 2026</p>
          </div>
          <div className="flex gap-4 font-black text-white font-black text-white">
            <a href="https://instagram.com/arenahenko" target="_blank" className="bg-neutral-900 p-4 rounded-2xl hover:bg-red-600 shadow-xl transition-all font-black font-black text-white"><Instagram className="w-6 h-6 text-white font-bold font-black text-white" /></a>
            <a href="mailto:sergio@henkoproducoes.com.br" className="bg-neutral-900 p-4 rounded-2xl hover:bg-red-600 shadow-xl transition-all font-black font-black text-white"><Mail className="w-6 h-6 text-white font-bold font-black text-white" /></a>
          </div>
        </div>
      </footer>

      {/* Login Admin Modal */}
      <div id="login-modal" className="fixed inset-0 z-[300] hidden bg-black/95 backdrop-blur-2xl flex items-center justify-center p-8 text-white font-black font-black text-white">
        <div className="bg-neutral-900 border border-neutral-800 p-12 rounded-[3rem] w-full max-w-sm font-black shadow-3xl text-white font-black text-white">
          <h2 className="text-xl uppercase mb-8 text-center italic font-black font-black font-black text-white">Painel <span className="text-red-600 font-black uppercase italic font-black text-red-600">Admin</span></h2>
          <form onSubmit={handleAdminLogin} className="font-black">
            <input type="password" placeholder="Senha" value={adminInputPass} onChange={(e) => setAdminInputPass(e.target.value)} className="w-full bg-black border border-neutral-800 rounded-2xl px-8 py-5 mb-6 text-white focus:outline-none focus:border-red-600 text-center tracking-widest font-black font-black text-white" />
            <div className="flex gap-4 font-black font-black text-white">
              <button type="button" onClick={() => document.getElementById('login-modal').classList.add('hidden')} className="flex-1 py-4 text-[10px] uppercase border border-neutral-800 rounded-2xl font-black font-black text-white">Voltar</button>
              <button type="submit" className="flex-1 py-4 text-[10px] uppercase bg-red-600 rounded-2xl shadow-xl font-black text-white font-black text-white">Entrar</button>
            </div>
          </form>
        </div>
      </div>

      {toast && <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[400] bg-red-600 text-white px-10 py-4 rounded-full font-black text-[10px] uppercase tracking-widest shadow-3xl animate-bounce font-black text-white">{toast}</div>}
    </div>
  );
};

export default App;
