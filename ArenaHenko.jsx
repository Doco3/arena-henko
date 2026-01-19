import React, { useState, useEffect } from 'react';
import { 
  Menu as MenuIcon, X, Instagram, Mail, Phone, Calendar, Award, Users, Tv, Music, MapPin, 
  CheckCircle, ArrowRight, Lock, Edit2, Save, LogOut, Clock, CalendarDays, Shield, 
  ChevronDown, Info, Beer, Trophy, Star, Activity, MessageCircle, History, TrendingUp, MapPinned, Ticket, Zap, Timer, Quote, ChevronLeft, ChevronRight
} from 'lucide-react';

// Componente auxiliar para lidar com imagens quebradas de forma segura e evitar bloqueios de CORS/Hotlink
const ImageWithFallback = ({ src, alt, className, fallback }) => {
  const [error, setError] = useState(false);

  useEffect(() => {
    setError(false); // Reseta o erro se a URL da imagem mudar
  }, [src]);

  if (error) {
    return fallback;
  }

  return (
    <img 
      src={src} 
      alt={alt} 
      className={className} 
      onError={() => setError(true)}
      referrerPolicy="no-referrer" // TRUQUE DE MESTRE: Evita bloqueios de hotlink (essencial para Imgur)
    />
  );
};

const App = () => {
  // API CONFIGURATION - CHAVE INTEGRADA
  const API_KEY = "c74abacd73mshe2a6d8613c8e399p16dd9bjsn0f6cdba0f27a"; 
  const SPFC_ID = "126"; 

  const teamLogos = {
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
    CHAPECOENSE: "https://static.wikia.nocookie.net/futebol/images/b/b6/Chapecoense.png/revision/latest?cb=20161220151034"
  };

  const navigation = [
    { name: 'Sobre', href: '#sobre' },
    { name: 'Serviços', href: '#servicos' },
    { name: 'Calendário 2026', href: '#calendario' },
    { name: 'Mídia & Parceiros', href: '#parceiros' },
    { name: 'Contato', href: '#contato' },
  ];

  const services = [
    { title: 'Lounge de Hospitalidade', icon: <Users className="w-8 h-8 text-red-400" />, desc: 'Ponto exclusivo para networking, briefings e relaxamento pré-evento.', imageUrl: 'https://i.imgur.com/Bw5Yw4K.png' },
    { title: 'Recepção Exclusiva', icon: <Award className="w-8 h-8 text-red-400" />, desc: 'Atendimento premium e acesso rápido e diferenciado desde a chegada.', imageUrl: 'https://i.imgur.com/pLUfmBf.png' },
    { title: 'Ambiente Premium', icon: <Music className="w-8 h-8 text-red-400" />, desc: 'Open bar, Open Food com culinária sofisticada e entretenimento ao vivo.', imageUrl: 'https://i.imgur.com/Za2zSyx.png' },
    { title: 'Networking', icon: <CheckCircle className="w-8 h-8 text-red-400" />, desc: 'O ambiente ideal para expandir a sua rede de contactos profissionais.', imageUrl: 'https://i.imgur.com/PrhiB8E.png' },
    { title: 'Vista Privilegiada', icon: <MapPin className="w-8 h-8 text-red-400" />, desc: 'Acesso exclusivo e visão privilegiada do campo/palco.', imageUrl: 'https://i.imgur.com/7R1hOwg.png' },
    { title: 'Branding & Mídia', icon: <Tv className="w-8 h-8 text-red-400" />, desc: 'Ativações de marca em Ring LED e relatórios de envolvimento.', imageUrl: 'https://i.imgur.com/Gy62moQ.png' },
  ];

  // REVIEWS DATA EXPANDIDA
  const reviews = [
    { name: "Ricardo Silva", role: "Torcedor SPFC", text: "A melhor vista do Morumbis! O serviço de open food é impecável do início ao fim e a equipe super atenciosa. Recomendo de olhos fechados.", initial: "R" },
    { name: "Fernanda M.", role: "Camarote Premium", text: "Experiência única. A comodidade de chegar e ter tudo pronto, bebida gelada e comida quente, faz valer cada centavo. Voltarei sempre!", initial: "F" },
    { name: "Pedro Almeida", role: "Empresário", text: "Simplesmente fantástico. O ambiente para networking é ótimo e os shows pós-jogo são um diferencial enorme. Parabéns à Arena Henko.", initial: "P" },
    { name: "Juliana Costa", role: "Eventos Corporativos", text: "Realizamos nossa confraternização corporativa e superou as expectativas. Buffet variado e atendimento de primeira classe.", initial: "J" },
    { name: "Marcos Oliveira", role: "Fã de Shows", text: "Assistir aos shows internacionais daqui é outro nível. Conforto total, sem filas e com visão privilegiada do palco.", initial: "M" },
    { name: "Dr. Roberto", role: "Cliente VIP", text: "Frequento camarotes há anos, mas a Henko tem um diferencial de hospitalidade que é raro encontrar. Me sinto em casa.", initial: "D" }
  ];

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSportId, setActiveSportId] = useState(2); 
  const [expandedMatchKey, setExpandedMatchKey] = useState(null);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  
  // Carousel State
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const [sportEvents] = useState([
    { 
      id: 2,
      name: 'Campeonato Paulista', 
      subtitle: 'Paulistão Sicredi 2026',
      // VOLTANDO PARA O IMGUR DO USUÁRIO (com proteção de referrer ativada no componente)
      image: 'https://i.imgur.com/Kl9LPUl.png', 
      matches: [
        { id: 'm2', date: '21/01', home: 'SPFC', away: 'Portuguesa', time: '19h30', homeLogo: teamLogos.SPFC, awayLogo: teamLogos.PORTUGUESA, location: 'Morumbis', scarcity: 'Últimas Vagas' },
        { id: 'm3', date: '31/01', home: 'SPFC', away: 'Santos', time: '20h30', homeLogo: teamLogos.SPFC, awayLogo: teamLogos.SANTOS, location: 'Morumbis', scarcity: 'Alta Procura' },
        { id: 'm4', date: '07/02', home: 'SPFC', away: 'Primavera', time: '20h30', homeLogo: teamLogos.SPFC, awayLogo: teamLogos.PRIMAVERA, location: 'Morumbis' },
      ],
      results: [
        { id: 'r1', date: '15/01', home: 'SPFC', away: 'São Bernardo', scoreHome: 1, scoreAway: 0, homeLogo: teamLogos.SPFC, awayLogo: teamLogos.SAO_BERNARDO, location: 'Morumbis', status: 'Final' },
        { id: 'r2', date: '11/01', home: 'Mirassol', away: 'SPFC', scoreHome: 3, scoreAway: 0, homeLogo: teamLogos.MIRASSOL, awayLogo: teamLogos.SPFC, location: 'Fora', status: 'Final' }
      ]
    },
    { 
      id: 4, 
      name: 'Copa do Brasil', 
      subtitle: 'Mata-Mata', 
      // Link Wikimedia PT (Correto)
      image: 'https://upload.wikimedia.org/wikipedia/pt/9/96/CopaDoBrasil.png', 
      matches: [], 
      results: [] 
    },
    { 
      id: 3, 
      name: 'Sudamericana', 
      subtitle: 'CONMEBOL', 
      // Link Wikimedia EN (Correto) - Filtro de cor branca aplicado via CSS
      image: 'https://upload.wikimedia.org/wikipedia/en/thumb/c/c2/CONMEBOL_Sudamericana_logo_%282017%29.svg/250px-CONMEBOL_Sudamericana_logo_%282017%29.svg.png', 
      matches: [], 
      results: [] 
    },
    { 
      id: 1, 
      name: 'Brasileirão', 
      subtitle: 'Série A', 
      // Link ESPN (Correto)
      image: 'https://a.espncdn.com/combiner/i?img=/i/leaguelogos/soccer/500/85.png', 
      matches: [
        { id: 'br1', date: '28/01', home: 'SPFC', away: 'Flamengo', time: '21h30', homeLogo: teamLogos.SPFC, awayLogo: teamLogos.FLAMENGO, location: 'Morumbis', scarcity: 'Alta Procura' },
        { id: 'br2', date: '11/02', home: 'SPFC', away: 'Grêmio', time: '21h30', homeLogo: teamLogos.SPFC, awayLogo: teamLogos.GREMIO, location: 'Morumbis' },
        { id: 'br3', date: '12/03', home: 'SPFC', away: 'Chapecoense', time: '20h00', homeLogo: teamLogos.SPFC, awayLogo: teamLogos.CHAPECOENSE, location: 'Morumbis' }
      ], 
      results: [] 
    },
  ]);

  const entertainmentEvents = [
    { name: 'AC/DC', date: '2026', subtitle: 'PWR UP TOUR', image: 'https://i.imgur.com/XawIqwq.jpg', desc: 'O rock mundial invade o Morumbis.' },
    { name: 'The Weeknd', date: '2026', subtitle: 'After Hours Til Dawn', image: 'https://i.imgur.com/1zpCq3e.jpg', desc: 'Show visual imperdível.' },
    { name: 'Festa do Peão', date: 'Agosto 2026', subtitle: '70 Anos', image: 'https://i.imgur.com/GW8we0X.png', desc: 'Hospitalidade Arena Henko em Barretos.' },
  ];

  const partnerLogos = [
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

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Countdown Logic
  useEffect(() => {
    // Definindo a data do próximo jogo: 21 de Janeiro de 2026 às 19:30
    const matchDate = new Date('2026-01-21T19:30:00');

    const interval = setInterval(() => {
      const now = new Date();
      const difference = matchDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Auto-rotate Reviews with Smooth Animation
  useEffect(() => {
    const timer = setInterval(() => {
      handleReviewChange((currentReviewIndex + 1) % reviews.length);
    }, 6000); 
    return () => clearInterval(timer);
  }, [currentReviewIndex]);

  const handleReviewChange = (newIndex) => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentReviewIndex(newIndex);
      setIsAnimating(false);
    }, 300); // Aguarda a animação de fade-out antes de trocar o texto
  };

  const nextReview = () => {
    handleReviewChange((currentReviewIndex + 1) % reviews.length);
  };

  const prevReview = () => {
    handleReviewChange((currentReviewIndex - 1 + reviews.length) % reviews.length);
  };

  const getWaLink = (message) => `https://wa.me/5511940741355?text=${encodeURIComponent(message)}`;

  const selectedSport = sportEvents.find(s => s.id === activeSportId);

  // Quick Access Data
  const nextMatch = sportEvents[0].matches[0];
  const nextShow = entertainmentEvents[0];

  return (
    <div className="font-sans text-gray-100 bg-neutral-950 min-h-screen text-center overflow-x-hidden selection:bg-red-600">
      
      {/* Botão WhatsApp Flutuante */}
      <a 
        href={getWaLink("Olá! Gostaria de informações sobre hospitalidade na Arena Henko.")}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 z-[100] bg-green-600 hover:bg-green-500 text-white p-4 rounded-full shadow-[0_0_30px_rgba(22,163,74,0.4)] transition-all hover:scale-110 active:scale-95 group"
      >
        <MessageCircle className="w-8 h-8 fill-white" />
        <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-neutral-900 text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl border border-neutral-800 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap hidden md:block">Falar Connosco</span>
      </a>

      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-neutral-950/95 backdrop-blur-md border-b border-neutral-800' : 'bg-transparent'} h-20 flex justify-between items-center px-8`}>
        <img src="https://i.imgur.com/cSYIvq6.png" className="h-8 w-auto" alt="Logo" />
        <div className="hidden md:flex space-x-8 items-center">
          {navigation.map(n => <a key={n.name} href={n.href} className="text-[10px] font-black uppercase text-gray-300 hover:text-red-500 tracking-widest transition-colors">{n.name}</a>)}
          <a href="#contato" className="bg-red-600 text-white px-5 py-2 rounded-full font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-red-900/40 inline-flex items-center justify-center">Reservar Agora</a>
        </div>
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden text-white"><MenuIcon /></button>
      </nav>

      {/* Hero */}
      <div className="relative h-[90vh] flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20"><img src="https://i.imgur.com/lKKQfgK.png" className="w-full h-full object-cover" alt="Hero" /></div>
        <div className="relative z-10 px-4 text-white w-full max-w-4xl">
          <h1 className="text-6xl md:text-9xl font-black mb-6 uppercase leading-none">ARENA <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-800">HENKO</span></h1>
          <p className="max-w-2xl mx-auto text-xl text-gray-400 font-light mb-10 uppercase tracking-[0.3em]">Hospitalidade Premium & Experiências</p>
          <a href="#calendario" className="inline-flex px-10 py-5 bg-red-600 text-white rounded-full font-black text-sm hover:bg-red-700 transition-all items-center gap-2 uppercase tracking-widest shadow-2xl shadow-red-900/40">Explorar Agenda <ArrowRight className="w-5 h-5"/></a>
          
          {/* Botões de Ação Rápida */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl mx-auto relative z-20">
              {/* Card Próximo Jogo com Contagem Regressiva */}
              <button onClick={() => window.open(getWaLink(`Quero reservar o jogo: ${nextMatch.home} x ${nextMatch.away}`))} className="relative bg-neutral-900/80 backdrop-blur-md border border-neutral-800 p-4 rounded-2xl flex items-center gap-4 hover:border-red-600 hover:shadow-[0_0_20px_rgba(220,38,38,0.2)] transition-all group text-left w-full overflow-visible">
                  {/* Badge de Urgência */}
                  <div className="absolute -top-3 -right-2 z-30 bg-red-600 text-white text-[9px] font-black px-3 py-1 rounded-full animate-bounce shadow-lg shadow-red-900/50 flex items-center gap-1">
                     <Zap className="w-3 h-3 fill-white" /> ÚLTIMAS VAGAS
                  </div>

                  <div className="bg-neutral-800 p-3 rounded-xl group-hover:bg-red-600 transition-colors shrink-0 flex flex-col items-center justify-center h-full min-h-[60px]">
                      <img src={nextMatch.homeLogo} className="w-8 h-8 object-contain" alt="Time" />
                  </div>
                  <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-[9px] text-gray-400 uppercase font-black tracking-widest mb-1 flex items-center gap-2"><Ticket className="w-3 h-3 text-red-500"/> Próximo Jogo</p>
                          <p className="text-sm font-black text-white uppercase truncate mb-1">{nextMatch.home} x {nextMatch.away}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-white ml-2 transition-colors shrink-0 mt-2"/>
                      </div>
                      
                      {/* Cronômetro */}
                      <div className="flex items-center gap-2 mt-1 bg-black/40 p-1.5 rounded-lg w-fit border border-neutral-800/50">
                        <Timer className="w-3 h-3 text-red-500 animate-pulse" />
                        <div className="flex gap-1 text-[10px] font-mono text-gray-300">
                          <span className="text-white font-bold">{String(timeLeft.days).padStart(2, '0')}</span>d
                          <span className="text-neutral-600">:</span>
                          <span className="text-white font-bold">{String(timeLeft.hours).padStart(2, '0')}</span>h
                          <span className="text-neutral-600">:</span>
                          <span className="text-white font-bold">{String(timeLeft.minutes).padStart(2, '0')}</span>m
                        </div>
                      </div>
                  </div>
              </button>

              <button onClick={() => window.open(getWaLink(`Quero reservar o show: ${nextShow.name}`))} className="bg-neutral-900/80 backdrop-blur-md border border-neutral-800 p-4 rounded-2xl flex items-center gap-4 hover:border-red-600 hover:shadow-[0_0_20px_rgba(220,38,38,0.2)] transition-all group text-left w-full">
                   <div className="bg-neutral-800 p-3 rounded-xl group-hover:bg-red-600 transition-colors shrink-0 h-full min-h-[60px] flex items-center justify-center">
                      <Music className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                      <p className="text-[9px] text-gray-400 uppercase font-black tracking-widest mb-1 flex items-center gap-2"><Star className="w-3 h-3"/> Próximo Show</p>
                      <p className="text-sm font-black text-white uppercase truncate">{nextShow.name}</p>
                      <p className="text-[10px] text-red-500 font-bold">{nextShow.date}</p>
                  </div>
                   <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-white ml-2 transition-colors shrink-0"/>
              </button>
          </div>
        </div>
      </div>

      {/* Sobre Nós */}
      <section id="sobre" className="py-32 px-4 border-b border-neutral-900">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-20 items-center">
          <div className="text-left">
            <span className="text-red-600 font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">EXCLUSIVIDADE</span>
            <h2 className="text-5xl font-black text-white uppercase mb-8 leading-tight">O Palco da sua <br/>Próxima História</h2>
            <p className="text-gray-400 text-lg leading-relaxed mb-8 font-light">Localizada no coração do Morumbis, a Arena Henko redefine hospitalidade. Gastronomia, conforto e a melhor vista do espetáculo, tudo em um só lugar.</p>
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-neutral-800 text-white">
              <div><h4 className="text-3xl font-black text-white">5+</h4><p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Anos</p></div>
              <div><h4 className="text-3xl font-black text-white">100+</h4><p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Eventos</p></div>
              <div><h4 className="text-3xl font-black text-white">SP</h4><p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Sede</p></div>
            </div>
          </div>
          <div className="grid gap-4">
             <div className="bg-neutral-900/50 p-8 rounded-[32px] border border-neutral-800 text-left hover:border-red-900/50 transition-all group">
                <Star className="text-red-600 w-6 h-6 mb-4 group-hover:scale-110 transition-transform" />
                <h4 className="text-xl font-black text-white uppercase mb-2">Hospitalidade de Elite</h4>
                <p className="text-gray-500 text-sm">Serviço de catering premium e atendimento bilíngue em todos os eventos.</p>
             </div>
             <div className="bg-neutral-900/50 p-8 rounded-[32px] border border-neutral-800 text-left hover:border-red-900/50 transition-all group text-white">
                <Shield className="text-red-600 w-6 h-6 mb-4 group-hover:scale-110 transition-transform" />
                <h4 className="text-xl font-black text-white uppercase mb-2">Privacidade Total</h4>
                <p className="text-gray-500 text-sm">Ambiente seguro e reservado para networking de alto valor.</p>
             </div>
          </div>
        </div>
      </section>

      {/* Vantagens / Serviços */}
      <section id="servicos" className="py-32 bg-neutral-900/30 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-black text-white uppercase mb-20 tracking-tighter">A Experiência Completa</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {services.map((s, i) => (
              <div key={i} className="group relative h-[450px] rounded-[40px] overflow-hidden border border-neutral-800 hover:border-red-600/50 transition-all">
                <div className="absolute inset-0 z-0"><img src={s.imageUrl} className="w-full h-full object-cover transition-all duration-700" alt={s.title} /></div>
                <div className="absolute inset-0 bg-neutral-950/85 group-hover:bg-neutral-950/60 transition-all z-10"></div>
                <div className="relative z-20 h-full p-10 flex flex-col justify-end text-left">
                  <div className="bg-red-900/30 p-3 rounded-2xl w-fit mb-6 text-red-500">{s.icon}</div>
                  <h3 className="text-2xl font-black text-white uppercase mb-3 leading-none">{s.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Calendário e Resultados */}
      <section id="calendario" className="py-32 px-4 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <h2 className="text-5xl font-black text-white uppercase tracking-tighter">Temporada <span className="text-red-600 font-black">2026</span></h2>
            <div className="w-24 h-1 bg-red-600 mx-auto rounded-full mt-6 shadow-[0_0_15px_rgba(220,38,38,0.5)]"></div>
          </div>

          <div className="flex flex-wrap gap-2 mb-12 justify-center">
            {sportEvents.map(s => (
              <button key={s.id} onClick={() => setActiveSportId(s.id)} className={`px-8 py-4 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeSportId === s.id ? 'bg-red-600 text-white shadow-xl scale-105' : 'bg-neutral-900 text-gray-500 hover:text-gray-300'}`}>
                {s.name}
              </button>
            ))}
          </div>

          {selectedSport && (
            <div className="bg-neutral-900/30 backdrop-blur-sm rounded-[40px] p-8 lg:p-12 border border-neutral-800 shadow-3xl text-white">
              <div className="grid lg:grid-cols-5 gap-8 lg:gap-16 items-center">
                
                {/* Coluna Esquerda: Identidade Visual - CENTRALIZADA */}
                <div className="lg:col-span-2 flex flex-col items-center text-center">
                  <div className="w-40 h-40 lg:w-56 lg:h-56 mb-6 bg-neutral-950 rounded-[30px] p-8 flex items-center justify-center border border-neutral-800 shadow-inner group transition-all hover:border-red-600/30 overflow-hidden relative">
                    {/* USO DO COMPONENTE SEGURO DE IMAGEM COM KEY PARA FORÇAR ATUALIZAÇÃO */}
                    <ImageWithFallback 
                      key={selectedSport.id}
                      src={selectedSport.image} 
                      // APLICA FILTRO INVERT PARA SUL-AMERICANA (ID 3) E PARA O FALLBACK DO PAULISTÃO SE PRECISAR
                      className={`max-w-full max-h-full object-contain transition-transform duration-700 group-hover:scale-110 p-2 ${selectedSport.id === 3 ? 'brightness-0 invert' : ''}`}
                      alt="Champ" 
                      fallback={<Trophy className="w-16 h-16 text-red-600" />} 
                    />
                  </div>
                  <h3 className="text-3xl lg:text-4xl font-black text-white uppercase tracking-tight leading-none">{selectedSport.name}</h3>
                  <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.5em] mt-3">{selectedSport.subtitle}</p>
                </div>

                {/* Coluna Direita: Agenda Compacta */}
                <div className="lg:col-span-3 w-full">
                  <h4 className="text-red-500 text-[11px] font-black uppercase tracking-[0.4em] mb-6 flex items-center gap-3 justify-center lg:justify-start"><Clock className="w-4 h-4"/> Agenda Morumbis</h4>
                  <div className="space-y-3">
                    {selectedSport.matches.length > 0 ? selectedSport.matches.map((m, i) => (
                      <div key={i} className="bg-neutral-950/50 border border-neutral-800 rounded-[24px] overflow-hidden hover:border-red-600/30 transition-all text-white relative">
                        <button onClick={() => setExpandedMatchKey(expandedMatchKey === i ? null : i)} className="w-full p-5 flex items-center justify-between">
                          <div className="flex items-center gap-4 lg:gap-6">
                            <span className="text-[11px] font-black text-gray-600 w-10 text-left">{m.date}</span>
                            <div className="flex items-center gap-3">
                              <span className="text-[11px] lg:text-[12px] font-black uppercase hidden sm:block">{m.home}</span>
                              <img src={m.homeLogo} className="w-6 h-6 object-contain" alt="H" />
                              <span className="text-[10px] font-black opacity-20">VS</span>
                              <img src={m.awayLogo} className="w-6 h-6 object-contain" alt="A" />
                              <span className="text-[11px] lg:text-[12px] font-black uppercase hidden sm:block">{m.away}</span>
                            </div>
                            {/* TAG DE ESCASSEZ NO CARD DA LISTA */}
                            {m.scarcity && (
                              <div className="ml-2 hidden sm:flex items-center gap-1 bg-red-600/10 border border-red-600/30 px-2 py-1 rounded-full animate-pulse">
                                <Zap className="w-3 h-3 text-red-500 fill-red-500" />
                                <span className="text-[8px] font-black text-red-500 uppercase tracking-wider">{m.scarcity}</span>
                              </div>
                            )}
                          </div>
                          <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${expandedMatchKey === i ? 'rotate-180 text-red-500' : ''}`} />
                        </button>
                        {expandedMatchKey === i && (
                          <div className="p-6 border-t border-neutral-800 bg-neutral-900/30 text-center animate-fade-in">
                            <div className="grid grid-cols-2 gap-4 mb-6 border-y border-neutral-800 py-4">
                              <div><p className="text-[9px] text-gray-500 uppercase font-black tracking-widest mb-1">Hora do Jogo</p><p className="text-lg font-bold text-white">{m.time}</p></div>
                              <div><p className="text-[9px] text-gray-500 uppercase font-black tracking-widest mb-1">Lounge Arena</p><p className="text-lg font-bold text-white">2h antes</p></div>
                            </div>
                            <button onClick={() => window.open(getWaLink(`Quero hospitalidade para ${m.home} x ${m.away} dia ${m.date}`))} className="w-full bg-red-600 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-xl hover:bg-red-700 transition-colors text-white">Reservar Agora</button>
                          </div>
                        )}
                      </div>
                    )) : <div className="p-8 border border-dashed border-neutral-800 rounded-[24px] text-center opacity-30 text-[11px] font-black uppercase tracking-widest">Sem jogos no Morumbis agendados</div>}
                  </div>
                </div>

              </div>
            </div>
          )}
        </div>
      </section>

      {/* Próximos Eventos */}
      <section className="py-32 bg-neutral-900/30 px-4 text-white">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-3xl font-black text-red-500 mb-16 uppercase tracking-[0.2em]">Próximos Eventos</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {entertainmentEvents.map((e, i) => (
              <div key={i} className="group flex flex-col items-center">
                <div className="relative rounded-[40px] overflow-hidden aspect-[4/5] mb-8 border border-neutral-800 group/img shadow-2xl w-full">
                  <img src={e.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={e.name} />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                    <button onClick={() => window.open(getWaLink(`Tenho interesse no evento ${e.name} na Arena Henko`))} className="bg-red-600 text-white px-8 py-4 rounded-full font-black uppercase text-[11px] tracking-widest flex items-center gap-2 shadow-2xl">
                      <MessageCircle className="w-4 h-4 fill-white" /> Consultar Show
                    </button>
                  </div>
                </div>
                <div className="inline-block px-5 py-1.5 bg-red-600 text-white text-[10px] font-black rounded-full mb-4 uppercase tracking-widest">{e.date}</div>
                <h3 className="text-3xl font-black text-white uppercase">{e.name}</h3>
                <p className="text-gray-500 text-sm mt-3 font-light px-6 leading-relaxed">{e.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Parceiros de Elite */}
      <section id="parceiros" className="py-32 px-6 border-t border-neutral-900 text-white">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-xl text-gray-600 uppercase tracking-[0.5em] font-black mb-16">Parceiros de Elite</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {partnerLogos.map((p, i) => (
              <div key={i} className={`bg-neutral-900/50 border border-neutral-800 rounded-[32px] h-32 flex items-center justify-center transition-all group hover:border-red-600/30 ${p.extraSize ? 'p-4' : 'p-8'}`}>
                <img src={p.logoUrl} className="h-full w-full object-contain transition-all duration-500 group-hover:scale-110" alt={p.name} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Prova Social - Google Reviews Rotativos */}
      <section className="py-24 bg-neutral-900/20 border-t border-neutral-900 px-4">
        <div className="max-w-7xl mx-auto text-center">
           <div className="flex flex-col items-center justify-center mb-16">
              <div className="flex gap-2 mb-4 bg-black/40 p-3 rounded-full border border-neutral-800/50">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                ))}
              </div>
              <h3 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-4">4.9 de 5 Estrelas</h3>
              <p className="text-gray-500 text-xs font-bold uppercase tracking-[0.4em] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span>
                Avaliação verificada no Google
              </p>
           </div>
           
           {/* Carrossel de Reviews */}
           <div className="relative">
              {/* Controles Laterais (Visíveis apenas em telas maiores para evitar clutter no mobile) */}
              <button onClick={prevReview} className="hidden lg:flex absolute top-1/2 -left-12 -translate-y-1/2 w-10 h-10 items-center justify-center rounded-full border border-neutral-800 text-gray-500 hover:text-white hover:bg-neutral-800 transition-all z-10">
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button onClick={nextReview} className="hidden lg:flex absolute top-1/2 -right-12 -translate-y-1/2 w-10 h-10 items-center justify-center rounded-full border border-neutral-800 text-gray-500 hover:text-white hover:bg-neutral-800 transition-all z-10">
                <ChevronRight className="w-6 h-6" />
              </button>

              <div className="grid md:grid-cols-3 gap-8 pt-12 pb-2"> {/* pt-12 para garantir que as aspas flutuem sem corte */}
                  {[0, 1, 2].map((offset) => {
                     const index = (currentReviewIndex + offset) % reviews.length;
                     const review = reviews[index];
                     return (
                      <div 
                        key={`${index}-${offset}`} 
                        className={`bg-neutral-950 p-8 rounded-[32px] border border-neutral-800 relative hover:border-red-600/20 transition-all duration-300 text-left group flex flex-col justify-between h-full ${offset > 0 ? 'hidden md:flex' : 'flex'} ${isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
                      >
                         <div className="absolute -top-5 left-8 bg-neutral-800 border border-neutral-700 p-3 rounded-2xl group-hover:bg-red-600 group-hover:border-red-600 transition-all">
                            <Quote className="w-5 h-5 text-white fill-white" />
                         </div>
                         <p className="text-gray-300 text-sm leading-relaxed mb-8 mt-4 flex-grow">{review.text}</p>
                         <div className="flex items-center gap-4 pt-6 border-t border-neutral-900 mt-auto">
                            <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center font-black text-red-500 border border-neutral-700">{review.initial}</div>
                            <div className="text-left">
                               <p className="text-white text-xs font-black uppercase tracking-wider">{review.name}</p>
                               <p className="text-gray-600 text-[10px] font-bold uppercase">{review.role}</p>
                            </div>
                         </div>
                      </div>
                     );
                  })}
              </div>

              {/* Indicadores de Paginação */}
              <div className="flex justify-center gap-2 mt-12">
                 {reviews.map((_, idx) => (
                    <button 
                      key={idx} 
                      onClick={() => handleReviewChange(idx)}
                      className={`w-2 h-2 rounded-full transition-all ${idx === currentReviewIndex ? 'bg-red-600 w-6' : 'bg-neutral-800 hover:bg-neutral-600'}`} 
                    />
                 ))}
              </div>
           </div>
        </div>
      </section>

      {/* Contacto */}
      <section id="contato" className="py-40 bg-neutral-950 px-6 relative overflow-hidden text-white">
        <div className="max-w-4xl mx-auto relative z-10">
          <h2 className="text-5xl md:text-8xl font-black mb-16 uppercase tracking-tighter">Reserve sua <br/><span className="text-red-600 underline decoration-red-600/30 underline-offset-8">Experiência.</span></h2>
          <div className="grid md:grid-cols-3 gap-8 mb-20">
             <a href="https://instagram.com/arenahenko" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center p-10 bg-neutral-900/50 rounded-3xl border border-neutral-800 hover:border-red-600/30 group">
                <Instagram className="w-10 h-10 text-red-600 mb-6 group-hover:scale-110 transition-transform" /><span className="font-black text-[11px] uppercase tracking-[0.2em]">Instagram</span>
             </a>
             <a href="https://wa.me/5511940741355" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center p-10 bg-neutral-900/50 rounded-3xl border border-neutral-800 hover:border-red-600/30 group">
                <Phone className="w-10 h-10 text-red-600 mb-6 group-hover:scale-110 transition-transform" /><span className="font-black text-[11px] uppercase tracking-[0.2em]">(11) 94074-1355</span>
             </a>
             <a href="mailto:sergio@henkoproducoes.com.br" className="flex flex-col items-center p-10 bg-neutral-900/50 rounded-3xl border border-neutral-800 hover:border-red-600/30 group">
                <Mail className="w-10 h-10 text-red-600 mb-6 group-hover:scale-110 transition-transform" /><span className="font-black text-[11px] uppercase tracking-[0.2em]">E-mail</span>
             </a>
          </div>
          <div className="bg-neutral-900 p-12 rounded-[50px] border border-neutral-800 shadow-3xl text-left max-w-3xl mx-auto">
             <form className="space-y-8">
               <div className="grid md:grid-cols-2 gap-8">
                 <div className="flex flex-col gap-3">
                   <label className="text-[10px] font-black uppercase text-gray-500 tracking-[0.3em] ml-2">Nome Completo</label>
                   <input type="text" className="bg-neutral-950 border border-neutral-800 rounded-2xl px-6 py-5 text-white focus:border-red-600 outline-none transition-all font-bold placeholder:text-gray-800" placeholder="Digite seu nome" />
                 </div>
                 <div className="flex flex-col gap-3">
                   <label className="text-[10px] font-black uppercase text-gray-500 tracking-[0.3em] ml-2">E-mail</label>
                   <input type="email" className="bg-neutral-950 border border-neutral-800 rounded-2xl px-6 py-5 text-white focus:border-red-600 outline-none transition-all font-bold placeholder:text-gray-800" placeholder="seu@email.com" />
                 </div>
               </div>
               <div className="flex flex-col gap-3">
                 <label className="text-[10px] font-black uppercase text-gray-500 tracking-[0.3em] ml-2">Mensagem</label>
                 <textarea rows="4" className="bg-neutral-950 border border-neutral-800 rounded-3xl px-6 py-5 text-white focus:border-red-600 outline-none transition-all font-bold placeholder:text-gray-800 resize-none" placeholder="Conte-nos sobre sua necessidade"></textarea>
               </div>
               <button type="button" className="w-full bg-red-600 py-6 rounded-3xl font-black uppercase text-xs tracking-[0.3em] shadow-3xl shadow-red-900/40 text-white hover:bg-red-700 active:scale-95 transition-all">Enviar Solicitação</button>
             </form>
          </div>
        </div>
      </section>

      <footer className="py-24 border-t border-neutral-900 opacity-50 text-white">
        <img src="https://i.imgur.com/cSYIvq6.png" className="h-10 mx-auto mb-10" alt="Logo" />
        <p className="text-[11px] font-bold uppercase tracking-[0.5em]">© {new Date().getFullYear()} Arena Henko. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
};

export default App;
