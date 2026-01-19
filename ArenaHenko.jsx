import React, { useState, useEffect } from 'react';
import { 
  Menu as MenuIcon, X, Instagram, Mail, Phone, Calendar, Award, Users, Tv, Music, MapPin, 
  CheckCircle, ArrowRight, Lock, Edit2, Save, LogOut, Clock, CalendarDays, Shield, 
  ChevronDown, Info, Beer, Trophy, Star, Activity, MessageCircle, History, TrendingUp, MapPinned
} from 'lucide-react';

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
    FLAMENGO: "https://i.imgur.com/FF7D8Xm.png",
    BRAGANTINO: "https://i.imgur.com/YwN9Tsh.png"
  };

  const navigation = [
    { name: 'Sobre', href: '#sobre' },
    { name: 'Serviços', href: '#servicos' },
    { name: 'Calendário 2026', href: '#calendario' },
    { name: 'Mídia & Parceiros', href: '#parceiros' },
    { name: 'Contacto', href: '#contato' },
  ];

  const services = [
    { title: 'Lounge de Hospitalidade', icon: <Users className="w-8 h-8 text-red-400" />, desc: 'Ponto exclusivo para networking, briefings e relaxamento pré-evento.', imageUrl: 'https://i.imgur.com/Bw5Yw4K.png' },
    { title: 'Receção Exclusiva', icon: <Award className="w-8 h-8 text-red-400" />, desc: 'Atendimento premium e acesso rápido e diferenciado desde a chegada.', imageUrl: 'https://i.imgur.com/pLUfmBf.png' },
    { title: 'Ambiente Premium', icon: <Music className="w-8 h-8 text-red-400" />, desc: 'Open bar, Open Food com culinária sofisticada e entretenimento ao vivo.', imageUrl: 'https://i.imgur.com/Za2zSyx.png' },
    { title: 'Networking', icon: <CheckCircle className="w-8 h-8 text-red-400" />, desc: 'O ambiente ideal para expandir a sua rede de contactos profissionais.', imageUrl: 'https://i.imgur.com/PrhiB8E.png' },
    { title: 'Vista Privilegiada', icon: <MapPin className="w-8 h-8 text-red-400" />, desc: 'Acesso exclusivo e visão privilegiada do campo/palco.', imageUrl: 'https://i.imgur.com/7R1hOwg.png' },
    { title: 'Branding & Mídia', icon: <Tv className="w-8 h-8 text-red-400" />, desc: 'Ativações de marca em Ring LED e relatórios de envolvimento.', imageUrl: 'https://i.imgur.com/Gy62moQ.png' },
  ];

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSportId, setActiveSportId] = useState(2); 
  const [expandedMatchKey, setExpandedMatchKey] = useState(null);

  const [sportEvents] = useState([
    { 
      id: 2,
      name: 'Campeonato Paulista', 
      subtitle: 'Paulistão Sicredi 2026',
      image: 'https://i.imgur.com/Kl9LPUl.png', 
      matches: [
        { id: 'm2', date: '21/01', home: 'SPFC', away: 'Portuguesa', time: '19h30', homeLogo: teamLogos.SPFC, awayLogo: teamLogos.PORTUGUESA, location: 'Morumbis' },
        { id: 'm3', date: '31/01', home: 'SPFC', away: 'Santos', time: '20h30', homeLogo: teamLogos.SPFC, awayLogo: teamLogos.SANTOS, location: 'Morumbis' },
        { id: 'm4', date: '07/02', home: 'SPFC', away: 'Primavera', time: '20h30', homeLogo: teamLogos.SPFC, awayLogo: teamLogos.PRIMAVERA, location: 'Morumbis' },
      ],
      results: [
        { id: 'r1', date: '15/01', home: 'SPFC', away: 'São Bernardo', scoreHome: 1, scoreAway: 0, homeLogo: teamLogos.SPFC, awayLogo: teamLogos.SAO_BERNARDO, location: 'Morumbis', status: 'Final' },
        { id: 'r2', date: '11/01', home: 'Mirassol', away: 'SPFC', scoreHome: 3, scoreAway: 0, homeLogo: teamLogos.MIRASSOL, awayLogo: teamLogos.SPFC, location: 'Fora', status: 'Final' }
      ]
    },
    { id: 4, name: 'Copa do Brasil', subtitle: 'Mata-Mata', image: 'https://upload.wikimedia.org/wikipedia/pt/9/96/CopaDoBrasil.png', matches: [], results: [] },
    { id: 3, name: 'Sudamericana', subtitle: 'CONMEBOL', image: 'https://www.ogol.com.br//img/logos/competicoes/269_imgbank_cs_20250311124354.png', matches: [], results: [] },
    { id: 1, name: 'Brasileirão', subtitle: 'Série A', image: 'https://cdn-img.zerozero.pt/img/logos/competicoes/51_imgbank_d1_20250313102859.png', matches: [], results: [] },
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

  const getWaLink = (message) => \`https://wa.me/5511940741355?text=\${encodeURIComponent(message)}\`;
  const selectedSport = sportEvents.find(s => s.id === activeSportId);

  return (
    <div className="font-sans text-gray-100 bg-neutral-950 min-h-screen text-center overflow-x-hidden selection:bg-red-600">
      <a 
        href={getWaLink("Olá! Gostaria de informações sobre hospitalidade na Arena Henko.")}
        target="_blank"
        className="fixed bottom-8 right-8 z-[100] bg-green-600 hover:bg-green-500 text-white p-4 rounded-full shadow-[0_0_30px_rgba(22,163,74,0.4)] transition-all hover:scale-110 active:scale-95 group"
      >
        <MessageCircle className="w-8 h-8 fill-white" />
        <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-neutral-900 text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl border border-neutral-800 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap hidden md:block">Falar Connosco</span>
      </a>

      <nav className={\`fixed w-full z-50 transition-all duration-300 \${scrolled ? 'bg-neutral-950/95 backdrop-blur-md border-b border-neutral-800' : 'bg-transparent'} h-20 flex justify-between items-center px-8\`}>
        <img src="https://i.imgur.com/cSYIvq6.png" className="h-8 w-auto" alt="Logo" />
        <div className="hidden md:flex space-x-8">
          {navigation.map(n => <a key={n.name} href={n.href} className="text-[10px] font-black uppercase text-gray-300 hover:text-red-500 tracking-widest transition-colors">{n.name}</a>)}
          <a href="#contato" className="bg-red-600 text-white px-5 py-2 rounded-full font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-red-900/40">Reservar Agora</a>
        </div>
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden text-white"><MenuIcon /></button>
      </nav>

      <div className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20"><img src="https://i.imgur.com/lKKQfgK.png" className="w-full h-full object-cover" alt="Hero" /></div>
        <div className="relative z-10 px-4 text-white">
          <h1 className="text-6xl md:text-9xl font-black mb-6 uppercase leading-none">ARENA <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-800 font-black">HENKO</span></h1>
          <p className="max-w-2xl mx-auto text-xl text-gray-400 font-light mb-10 uppercase tracking-[0.3em]">Hospitalidade Premium no Morumbis</p>
          <a href="#calendario" className="inline-flex px-10 py-5 bg-red-600 text-white rounded-full font-black text-sm hover:bg-red-700 transition-all items-center gap-2 uppercase tracking-widest shadow-2xl shadow-red-900/40">Explorar Agenda <ArrowRight className="w-5 h-5"/></a>
        </div>
      </div>

      <section id="sobre" className="py-32 px-4 border-b border-neutral-900">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-20 items-center text-left">
          <div className="text-white">
            <span className="text-red-600 font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">EXCLUSIVIDADE</span>
            <h2 className="text-5xl font-black text-white uppercase mb-8 leading-tight">O Palco da sua <br/>Próxima História</h2>
            <p className="text-gray-400 text-lg leading-relaxed mb-8 font-light">Localizada no coração do Morumbis, a Arena Henko redefine hospitalidade. Gastronomia, conforto e a melhor vista do espetáculo, tudo em um só lugar.</p>
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-neutral-800 text-white font-black uppercase">
              <div><h4 className="text-3xl font-black">5+</h4><p className="text-[10px] text-gray-500 uppercase tracking-widest">Anos</p></div>
              <div><h4 className="text-3xl font-black">100+</h4><p className="text-[10px] text-gray-500 uppercase tracking-widest">Eventos</p></div>
              <div><h4 className="text-3xl font-black">SP</h4><p className="text-[10px] text-gray-500 uppercase tracking-widest">Sede</p></div>
            </div>
          </div>
          <div className="grid gap-4">
             <div className="bg-neutral-900/50 p-8 rounded-[32px] border border-neutral-800 text-left hover:border-red-900/50 transition-all group">
                <Star className="text-red-600 w-6 h-6 mb-4 group-hover:scale-110 transition-transform" />
                <h4 className="text-xl font-black text-white uppercase mb-2">Hospitalidade de Elite</h4>
                <p className="text-gray-500 text-sm">Serviço de catering premium e atendimento bilíngue em todos os eventos.</p>
             </div>
             <div className="bg-neutral-900/50 p-8 rounded-[32px] border border-neutral-800 text-left hover:border-red-900/50 transition-all group">
                <Shield className="text-red-600 w-6 h-6 mb-4 group-hover:scale-110 transition-transform" />
                <h4 className="text-xl font-black text-white uppercase mb-2">Privacidade Total</h4>
                <p className="text-gray-500 text-sm">Ambiente seguro e reservado para networking de alto valor.</p>
             </div>
          </div>
        </div>
      </section>

      <footer className="py-24 border-t border-neutral-900 opacity-50 text-white text-center font-black uppercase tracking-widest text-white"><p className="text-[11px]">© 2026 ARENA HENKO. TODOS OS DIREITOS RESERVADOS.</p></footer>
    </div>
  );
};

export default App;
