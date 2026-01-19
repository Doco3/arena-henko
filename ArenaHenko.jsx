/* CÓDIGO COMPLETO RESTAURADO - DIRETORIA EDITION */
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
    { name: 'Sobre', href: '#sobre' }, { name: 'Serviços', href: '#servicos' }, { name: 'Calendário 2026', href: '#calendario' }, { name: 'Mídia & Parceiros', href: '#parceiros' }, { name: 'Contacto', href: '#contato' }
  ];

  const services = [
    { title: 'Lounge de Hospitalidade', icon: <Users className="w-8 h-8 text-red-400" />, desc: 'Ponto exclusivo para networking, briefings e relaxamento pré-evento.', imageUrl: 'https://i.imgur.com/Bw5Yw4K.png' },
    { title: 'Receção Exclusiva', icon: <Award className="w-8 h-8 text-red-400" />, desc: 'Atendimento premium e acesso rápido e diferenciado desde a chegada.', imageUrl: 'https://i.imgur.com/pLUfmBf.png' },
    { title: 'Ambiente Premium', icon: <Music className="w-8 h-8 text-red-400" />, desc: 'Open bar, Open Food com culinária sofisticada e entretenimento ao vivo.', imageUrl: 'https://i.imgur.com/Za2zSyx.png' },
    { title: 'Networking', icon: <CheckCircle className="w-8 h-8 text-red-400" />, desc: 'O ambiente ideal para expandir a sua rede de contactos profissionais.', imageUrl: 'https://i.imgur.com/PrhiB8E.png' },
    { title: 'Vista Privilegiada', icon: <MapPin className="w-8 h-8 text-red-400" />, desc: 'Acesso exclusivo e visão privilegiada do campo/palco.', imageUrl: 'https://i.imgur.com/7R1hOwg.png' },
    { title: 'Branding & Mídia', icon: <Tv className="w-8 h-8 text-red-400" />, desc: 'Ativações de marca em Ring LED e patrocínios.', imageUrl: 'https://i.imgur.com/Gy62moQ.png' },
  ];

  const partnerLogos = [
    { name: 'Mali Pizzaria', logoUrl: 'https://i.imgur.com/YxcN44a.png', extraSize: true },
    { name: 'Santa Helena', logoUrl: 'https://i.imgur.com/XjXzNik.png', extraSize: true },
    { name: 'Tirolez', logoUrl: 'https://i.imgur.com/4NmAzLu.png', extraSize: true },
    { name: 'Matsuya', logoUrl: 'https://i.imgur.com/EeCB2GL.png', extraSize: true },
    { name: 'Henko Produções', logoUrl: 'https://i.imgur.com/qVnwNYs.png' },
    { name: 'Esfiha Imigrantes', logoUrl: 'https://i.imgur.com/VEjZgiI.png', extraSize: true },
  ];

  const [activeSportId, setActiveSportId] = useState(2);
  const [sportEvents, setSportEvents] = useState([
    { id: 2, name: 'Campeonato Paulista', subtitle: 'Paulistão Sicredi 2026', image: 'https://i.imgur.com/Kl9LPUl.png', matches: [] },
    { id: 4, name: 'Copa do Brasil', subtitle: 'Mata-Mata', image: 'https://upload.wikimedia.org/wikipedia/pt/9/96/CopaDoBrasil.png', matches: [] },
    { id: 3, name: 'Sudamericana', subtitle: 'CONMEBOL', image: 'https://www.ogol.com.br//img/logos/competicoes/269_imgbank_cs_20250311124354.png', matches: [] },
    { id: 1, name: 'Brasileirão', subtitle: 'Série A', image: 'https://cdn-img.zerozero.pt/img/logos/competicoes/51_imgbank_d1_20250313102859.png', matches: [] },
  ]);

  const fetchLiveStats = async () => {
    if (!API_KEY) return;
    try {
      const response = await fetch(`https://v3.football.api-sports.io/fixtures?team=${SPFC_ID}&season=2026`, {
        method: "GET",
        headers: { "x-rapidapi-key": API_KEY, "x-rapidapi-host": "v3.football.api-sports.io" }
      });
      const data = await response.json();
      if (data.response) {
        const fixName = (n) => n.toLowerCase().includes('sao paulo') ? 'SPFC' : n;
        const agenda = data.response
          .filter(f => f.fixture.status.short === 'NS' && f.teams.home.id === 126)
          .sort((a, b) => new Date(a.fixture.date) - new Date(b.fixture.date))
          .map(f => ({
            date: new Date(f.fixture.date).toLocaleDateString('pt-BR', {day: '2-digit', month: '2-digit'}),
            home: fixName(f.teams.home.name),
            away: fixName(f.teams.away.name),
            time: new Date(f.fixture.date).toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit'}),
          })).slice(0, 8);
        setSportEvents(prev => prev.map(s => s.id === 2 ? {...s, matches: agenda} : s));
      }
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    fetchLiveStats();
    const handleScroll = () => window.scrollY > 50 ? setScrolled(true) : setScrolled(false);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const [scrolled, setScrolled] = useState(false);
  const selectedSport = sportEvents.find(s => s.id === activeSportId);

  return (
    <div className="font-sans text-gray-100 bg-neutral-950 min-h-screen text-center overflow-x-hidden selection:bg-red-600">
      {/* Botão WhatsApp */}
      <a href="https://wa.me/5511940741355" target="_blank" className="fixed bottom-8 right-8 z-[100] bg-green-600 p-4 rounded-full shadow-2xl hover:scale-110 transition-transform"><MessageCircle className="w-8 h-8 fill-white text-white" /></a>

      <nav className={`fixed w-full z-50 h-20 flex items-center justify-between px-8 transition-all ${scrolled ? 'bg-black/80 backdrop-blur-md border-b border-white/5' : 'bg-transparent'}`}>
        <img src="https://i.imgur.com/cSYIvq6.png" className="h-8" />
        <div className="hidden md:flex gap-8 uppercase font-black text-[10px] tracking-widest text-gray-400">
          {navigation.map(n => <a key={n.name} href={n.href} className="hover:text-red-500 transition-colors">{n.name}</a>)}
        </div>
      </nav>

      {/* Hero */}
      <div className="pt-60 pb-40 relative px-4">
        <div className="absolute inset-0 opacity-20 bg-[url('https://i.imgur.com/lKKQfgK.png')] bg-cover bg-center"></div>
        <h1 className="text-6xl md:text-9xl font-black uppercase leading-none relative z-10 text-white animate-fade-in-up">ARENA <span className="text-red-600">HENKO</span></h1>
        <p className="text-gray-500 uppercase tracking-[0.3em] text-sm mt-6 relative z-10 font-bold">Hospitalidade Premium no Morumbis</p>
      </div>

      {/* Sobre */}
      <section id="sobre" className="py-32 px-6 border-b border-neutral-900 max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center text-left">
        <div>
          <span className="text-red-600 font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">A ARENA</span>
          <h2 className="text-5xl font-black text-white uppercase mb-8">Hospitalidade <br/>Exclusiva</h2>
          <p className="text-gray-400 leading-relaxed italic">Localizada no coração do Estádio do Morumbis, a Arena Henko redefine a experiência VIP para eventos e espetáculos.</p>
        </div>
        <div className="bg-neutral-900/50 p-10 rounded-[40px] border border-white/5"><Shield className="text-red-600 w-10 h-10 mb-6" /><h4 className="text-2xl font-black text-white uppercase mb-4">Ambiente Seguro</h4><p className="text-gray-500">Privacidade total e segurança em cada detalhe da sua estadia.</p></div>
      </section>

      {/* Calendário Agenda Unificada */}
      <section id="calendario" className="py-32 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl font-black uppercase mb-16">Temporada <span className="text-red-600">2026</span></h2>
          <div className="flex flex-wrap gap-2 mb-12 justify-center">
            {sportEvents.map(s => <button key={s.id} onClick={() => setActiveSportId(s.id)} className={`px-8 py-4 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeSportId === s.id ? 'bg-red-600 text-white shadow-xl scale-105' : 'bg-neutral-900 text-gray-500'}`}>{s.name}</button>)}
          </div>
          {selectedSport && (
            <div className="bg-neutral-900/30 backdrop-blur-sm rounded-[50px] p-12 border border-neutral-800 shadow-3xl max-w-4xl mx-auto">
                <div className="w-56 h-56 bg-neutral-950 rounded-[40px] p-10 flex items-center justify-center border border-neutral-800 mx-auto mb-10 overflow-hidden"><img src={selectedSport.image} className={`max-w-full max-h-full object-contain ${selectedSport.id === 2 ? 'scale-[1.4]' : ''}`} /></div>
                <h3 className="text-3xl font-black text-white uppercase mb-12">Agenda Morumbis</h3>
                <div className="space-y-4 text-left max-w-2xl mx-auto">
                  {selectedSport.matches.length > 0 ? selectedSport.matches.map((m, i) => (
                    <div key={i} className="bg-neutral-950 border border-neutral-800 rounded-3xl p-6 flex justify-between items-center group hover:border-red-600/30 transition-all">
                      <div className="flex items-center gap-6"><span className="text-gray-500 font-black text-[11px]">{m.date}</span><span className="text-white font-black text-sm uppercase">{m.home} X {m.away}</span></div>
                      <ArrowRight className="w-4 h-4 text-red-600 group-hover:translate-x-1 transition-transform" />
                    </div>
                  )) : <p className="text-gray-600 text-center italic uppercase text-xs tracking-widest">Aguardando novos agendamentos...</p>}
                </div>
            </div>
          )}
        </div>
      </section>

      {/* Próximos Eventos */}
      <section className="py-32 bg-neutral-900/30 px-4">
        <h3 className="text-3xl font-black text-red-500 mb-16 uppercase tracking-[0.2em]">Próximos Eventos</h3>
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {["AC/DC", "The Weeknd", "Barretos"].map(e => (
            <div key={e} className="bg-neutral-900 h-64 rounded-[40px] border border-white/5 flex flex-col items-center justify-center font-black uppercase text-xl relative group overflow-hidden">
                <div className="absolute inset-0 bg-red-600/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                {e}<span className="text-[10px] text-gray-600 mt-2 font-bold tracking-widest">Show 2026</span>
            </div>
          ))}
        </div>
      </section>

      {/* Parceiros Grelha Colorida */}
      <section id="parceiros" className="py-32 px-6">
        <h3 className="text-xl text-gray-600 uppercase tracking-[0.5em] font-black mb-16 text-center">Parceiros de Elite</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 max-w-6xl mx-auto">
          {partnerLogos.map((p, i) => (
            <div key={i} className="bg-neutral-900/50 border border-neutral-800 rounded-[32px] h-32 flex items-center justify-center p-8 hover:border-red-600/30 transition-all"><img src={p.logoUrl} className="max-h-full max-w-full object-contain" /></div>
          ))}
        </div>
      </section>

      {/* Contato */}
      <section id="contato" className="py-40 bg-neutral-950 px-6 border-t border-neutral-900">
        <h2 className="text-5xl md:text-8xl font-black mb-16 uppercase tracking-tighter text-white">Fale <span className="text-red-600">Connosco.</span></h2>
        <div className="bg-neutral-900 p-12 rounded-[50px] border border-neutral-800 shadow-3xl max-w-2xl mx-auto text-left">
           <form className="space-y-6">
             <div className="flex flex-col gap-2"><label className="text-[10px] font-black uppercase text-gray-500 tracking-[0.2em] ml-2">Nome</label><input type="text" className="bg-neutral-950 border border-neutral-800 rounded-2xl px-6 py-4 text-white focus:border-red-600 outline-none transition-all" /></div>
             <button type="button" className="w-full bg-red-600 py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-red-700 transition-all">Enviar Solicitação</button>
           </form>
        </div>
      </section>

      <footer className="py-24 opacity-50 text-white"><p className="text-[10px] font-bold uppercase tracking-[0.5em]">© 2026 ARENA HENKO. TODOS OS DIREITOS RESERVADOS.</p></footer>
    </div>
  );
};
export default App;
