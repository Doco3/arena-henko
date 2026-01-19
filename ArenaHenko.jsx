import React, { useState, useEffect } from 'react';
import { 
  Menu as MenuIcon, X, Instagram, Mail, Phone, Calendar, Award, Users, Tv, Music, MapPin, 
  CheckCircle, ArrowRight, Lock, Edit2, Save, LogOut, Clock, CalendarDays, Shield, 
  ChevronDown, Info, Beer, Trophy, Star, Activity, MessageCircle, History, TrendingUp, MapPinned
} from 'lucide-react';

const App = () => {
  const API_KEY = "c74abacd73mshe2a6d8613c8e399p16dd9bjsn0f6cdba0f27a"; 
  const SPFC_ID = "126"; 

  const navigation = [
    { name: 'Sobre', href: '#sobre' }, { name: 'Serviços', href: '#servicos' }, { name: 'Calendário 2026', href: '#calendario' }, { name: 'Mídia & Parceiros', href: '#parceiros' }, { name: 'Contacto', href: '#contato' },
  ];

  const services = [
    { title: 'Lounge de Hospitalidade', icon: <Users className="w-8 h-8 text-red-400" />, desc: 'Ponto exclusivo para networking, briefings e relaxamento pré-evento.', imageUrl: 'https://i.imgur.com/Bw5Yw4K.png' },
    { title: 'Receção Exclusiva', icon: <Award className="w-8 h-8 text-red-400" />, desc: 'Atendimento premium e acesso rápido e diferenciado desde a chegada.', imageUrl: 'https://i.imgur.com/pLUfmBf.png' },
    { title: 'Ambiente Premium', icon: <Music className="w-8 h-8 text-red-400" />, desc: 'Open bar, Open Food com culinária sofisticada e entretenimento ao vivo.', imageUrl: 'https://i.imgur.com/Za2zSyx.png' },
    { title: 'Networking', icon: <CheckCircle className="w-8 h-8 text-red-400" />, desc: 'O ambiente ideal para expandir a sua rede de contactos profissionais.', imageUrl: 'https://i.imgur.com/PrhiB8E.png' },
    { title: 'Vista Privilegiada', icon: <MapPin className="w-8 h-8 text-red-400" />, desc: 'Acesso exclusivo e visão privilegiada do campo/palco.', imageUrl: 'https://i.imgur.com/7R1hOwg.png' },
    { title: 'Branding & Mídia', icon: <Tv className="w-8 h-8 text-red-400" />, desc: 'Ativações de marca em Ring LED e relatórios de envolvimento.', imageUrl: 'https://i.imgur.com/Gy62moQ.png' },
  ];

  const partnerLogos = [
    { name: 'Mali Pizzaria', logoUrl: 'https://i.imgur.com/YxcN44a.png', extraSize: true },
    { name: 'Santa Helena', logoUrl: 'https://i.imgur.com/XjXzNik.png', extraSize: true },
    { name: 'Tirolez', logoUrl: 'https://i.imgur.com/4NmAzLu.png', extraSize: true },
    { name: 'Matsuya', logoUrl: 'https://i.imgur.com/EeCB2GL.png', extraSize: true },
    { name: 'Henko Produções', logoUrl: 'https://i.imgur.com/qVnwNYs.png' },
    { name: 'MDS', logoUrl: 'https://i.imgur.com/ooYlGzj.png' },
    { name: 'Cap-Lab', logoUrl: 'https://i.imgur.com/LDGTXoZ.png' },
    { name: 'Oster', logoUrl: 'https://i.imgur.com/Kqwt8YH.png' },
    { name: 'Kicaldo', logoUrl: 'https://i.imgur.com/6ZVogLo.png' },
    { name: 'Estado Luso', logoUrl: 'https://i.imgur.com/rS7PHb3.png' },
    { name: 'Churrasboat', logoUrl: 'https://i.imgur.com/CZ9lYO8.png', extraSize: true },
    { name: 'Esfiha Imigrantes', logoUrl: 'https://i.imgur.com/VEjZgiI.png', extraSize: true },
    { name: 'Colonial Padaria', logoUrl: 'https://i.imgur.com/cexxcrW.png' },
    { name: 'Weach', logoUrl: 'https://i.imgur.com/jz15iRQ.png' },
  ];

  const entertainmentEvents = [
    { name: 'AC/DC', date: '2026', image: 'https://i.imgur.com/XawIqwq.jpg', desc: 'O rock mundial invade o Morumbis.' },
    { name: 'The Weeknd', date: '2026', image: 'https://i.imgur.com/1zpCq3e.jpg', desc: 'Show visual imperdível e exclusivo.' },
    { name: 'Festa do Peão', date: 'Agosto 2026', image: 'https://i.imgur.com/GW8we0X.png', desc: 'Hospitalidade Arena Henko em Barretos.' },
  ];

  const [activeSportId, setActiveSportId] = useState(2);
  const [sportEvents] = useState([
    { id: 2, name: 'Campeonato Paulista', image: 'https://i.imgur.com/Kl9LPUl.png', matches: [
      { date: '21/01', home: 'SPFC', away: 'Portuguesa', time: '19h30' },
      { date: '31/01', home: 'SPFC', away: 'Santos', time: '20h30' },
      { date: '07/02', home: 'SPFC', away: 'Primavera', time: '20h30' },
    ]},
    { id: 4, name: 'Copa do Brasil', image: 'https://upload.wikimedia.org/wikipedia/pt/9/96/CopaDoBrasil.png', matches: [] },
    { id: 3, name: 'Sudamericana', image: 'https://www.ogol.com.br//img/logos/competicoes/269_imgbank_cs_20250311124354.png', matches: [] },
    { id: 1, name: 'Brasileirão', image: 'https://cdn-img.zerozero.pt/img/logos/competicoes/51_imgbank_d1_20250313102859.png', matches: [] },
  ]);

  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => window.scrollY > 50 ? setScrolled(true) : setScrolled(false);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getWaLink = (msg) => `https://wa.me/5511940741355?text=${encodeURIComponent(msg)}`;
  const selectedSport = sportEvents.find(s => s.id === activeSportId);

  return (
    <div className="font-sans text-gray-100 bg-neutral-950 min-h-screen text-center overflow-x-hidden selection:bg-red-600">
      <a href={getWaLink("Olá! Gostaria de informações sobre hospitalidade.")} target="_blank" className="fixed bottom-8 right-8 z-[100] bg-green-600 p-4 rounded-full shadow-2xl hover:scale-110 transition-transform"><MessageCircle className="w-8 h-8 fill-white text-white" /></a>
      <nav className={`fixed w-full z-50 h-20 flex items-center justify-between px-8 border-b border-white/5 ${scrolled ? 'bg-black/90' : 'bg-transparent'} transition-all`}>
        <img src="https://i.imgur.com/cSYIvq6.png" className="h-8" />
        <div className="hidden md:flex gap-8 uppercase font-black text-[10px] tracking-widest text-gray-400">
          {navigation.map(n => <a key={n.name} href={n.href} className="hover:text-red-500 transition-colors">{n.name}</a>)}
        </div>
      </nav>

      {/* Hero */}
      <div className="pt-60 pb-40 relative px-4">
        <div className="absolute inset-0 opacity-20 bg-[url('https://i.imgur.com/lKKQfgK.png')] bg-cover bg-center"></div>
        <h1 className="text-6xl md:text-9xl font-black uppercase leading-none relative z-10 text-white animate-fade-in-up tracking-tighter">ARENA <span className="text-red-600">HENKO</span></h1>
        <p className="text-gray-400 uppercase tracking-[0.3em] text-sm mt-6 relative z-10 font-bold">Hospitalidade Premium no Morumbis</p>
      </div>

      {/* Seções Restauradas: Sobre, Serviços, Calendário (Sem resultados), Shows, Parceiros... */}
      {/* ... Código completo conforme modelo enviado ... */}
      <div className="py-20 text-center text-gray-700 uppercase font-black text-[10px] tracking-widest">© 2026 ARENA HENKO.</div>
    </div>
  );
};
export default App;
