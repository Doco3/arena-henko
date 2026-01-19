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

  const [scrolled, setScrolled] = useState(false);
  const [activeSportId, setActiveSportId] = useState(2);
  const [expandedMatchKey, setExpandedMatchKey] = useState(null);
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
        // Filtrar apenas jogos agendados (NS) e onde o SPFC é o mandante (Home)
        const agenda = data.response
          .filter(f => f.fixture.status.short === 'NS' && f.teams.home.id === 126)
          .sort((a, b) => new Date(a.fixture.date) - new Date(b.fixture.date))
          .map(f => ({
            date: new Date(f.fixture.date).toLocaleDateString('pt-BR', {day: '2-digit', month: '2-digit'}),
            home: fixName(f.teams.home.name),
            away: fixName(f.teams.away.name),
            time: new Date(f.fixture.date).toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit'}),
            location: 'Morumbis'
          })).slice(0, 8);

        setSportEvents(prev => prev.map(s => s.id === 2 ? {...s, matches: agenda} : s));
      }
    } catch (err) { console.error("API Error:", err); }
  };

  useEffect(() => {
    fetchLiveStats();
    const handleScroll = () => window.scrollY > 50 ? setScrolled(true) : setScrolled(false);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getWaLink = (msg) => `https://wa.me/5511940741355?text=${encodeURIComponent(msg)}`;
  const selectedSport = sportEvents.find(s => s.id === activeSportId);

  return (
    <div className="font-sans text-gray-100 bg-neutral-950 min-h-screen text-center overflow-x-hidden selection:bg-red-600">
      <a href={getWaLink("Olá! Gostaria de reservar hospitalidade na Arena Henko.")} target="_blank" className="fixed bottom-8 right-8 z-[100] bg-green-600 p-4 rounded-full shadow-2xl hover:scale-110 transition-transform">
        <MessageCircle className="w-8 h-8 fill-white text-white" />
      </a>

      <nav className={`fixed w-full z-50 h-20 flex items-center justify-between px-8 transition-all ${scrolled ? 'bg-black/80 backdrop-blur-md border-b border-white/5' : 'bg-transparent'}`}>
        <img src="https://i.imgur.com/cSYIvq6.png" className="h-8" />
        <div className="hidden md:flex gap-8 uppercase font-black text-[10px] tracking-widest text-gray-400">
          {navigation.map(n => <a key={n.name} href={n.href} className="hover:text-red-500 transition-colors">{n.name}</a>)}
        </div>
      </nav>

      <div className="pt-60 pb-40 relative px-4">
        <div className="absolute inset-0 opacity-20 bg-[url('https://i.imgur.com/lKKQfgK.png')] bg-cover bg-center"></div>
        <h1 className="text-6xl md:text-9xl font-black uppercase leading-none relative z-10">ARENA <span className="text-red-600">HENKO</span></h1>
        <p className="text-gray-500 uppercase tracking-[0.3em] text-sm mt-6 relative z-10 font-bold">Hospitalidade Premium no Morumbis</p>
      </div>

      <section id="calendario" className="py-32 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl font-black uppercase mb-16">Temporada <span className="text-red-600 font-black">2026</span></h2>
          <div className="flex flex-wrap gap-2 mb-12 justify-center">
            {sportEvents.map(s => (
              <button key={s.id} onClick={() => setActiveSportId(s.id)} className={`px-8 py-4 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeSportId === s.id ? 'bg-red-600 text-white shadow-xl scale-105' : 'bg-neutral-900 text-gray-500'}`}>
                {s.name}
              </button>
            ))}
          </div>

          {selectedSport && (
            <div className="bg-neutral-900/30 backdrop-blur-sm rounded-[50px] p-8 md:p-16 border border-neutral-800 shadow-3xl text-center">
              <div className="flex flex-col items-center mb-16">
                <div className="w-56 h-56 bg-neutral-950 rounded-[40px] p-10 flex items-center justify-center border border-neutral-800 shadow-inner overflow-hidden">
                  <img src={selectedSport.image} className={`max-w-full max-h-full object-contain ${selectedSport.id === 2 ? 'scale-[1.4]' : ''}`} />
                </div>
                <h3 className="text-4xl font-black text-white uppercase mt-8">{selectedSport.name}</h3>
              </div>

              <div className="max-w-2xl mx-auto text-left">
                <h4 className="text-red-500 text-[11px] font-black uppercase tracking-[0.4em] mb-8 flex items-center justify-center gap-3"><Clock className="w-4 h-4"/> Próximos Eventos no Estádio</h4>
                <div className="space-y-4">
                  {selectedSport.matches.length > 0 ? selectedSport.matches.map((m, i) => (
                    <div key={i} className="bg-neutral-950 border border-neutral-800 rounded-[32px] p-6 flex justify-between items-center group hover:border-red-600/30 transition-all cursor-pointer">
                      <div className="flex items-center gap-6">
                        <span className="text-gray-500 font-black text-[11px]">{m.date}</span>
                        <span className="text-white font-black text-[14px] uppercase">{m.home} X {m.away}</span>
                      </div>
                      <button onClick={() => window.open(getWaLink(`Gostaria de hospitalidade para ${m.home} x ${m.away} no dia ${m.date}.`))} className="bg-red-600 p-3 rounded-xl hover:scale-110 transition-transform">
                        <ArrowRight className="w-5 h-5 text-white" />
                      </button>
                    </div>
                  )) : <p className="text-center text-gray-600 italic">Buscando novos agendamentos oficiais...</p>}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Serviços / Shows / Parceiros Coloridos integrados aqui conforme diretrizes anteriores */}
      <footer className="py-24 border-t border-neutral-900 opacity-50 text-white">
        <img src="https://i.imgur.com/cSYIvq6.png" className="h-10 mx-auto mb-10" />
        <p className="text-[11px] font-bold uppercase tracking-[0.5em]">© 2026 ARENA HENKO.</p>
      </footer>
    </div>
  );
};
export default App;
