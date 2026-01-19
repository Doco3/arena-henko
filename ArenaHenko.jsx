/* CÓDIGO ARENA HENKO - RESTAURAÇÃO COMPLETA DIRETORIA */
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
    { name: 'Sobre', href: '#sobre' }, { name: 'Serviços', href: '#servicos' }, 
    { name: 'Calendário 2026', href: '#calendario' }, { name: 'Mídia & Parceiros', href: '#parceiros' }, 
    { name: 'Contacto', href: '#contato' }
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
  const [sportEvents, setSportEvents] = useState([
    { id: 2, name: 'Campeonato Paulista', subtitle: 'Paulistão 2026', image: 'https://i.imgur.com/Kl9LPUl.png', matches: [] },
    { id: 4, name: 'Copa do Brasil', subtitle: 'Mata-Mata', image: 'https://upload.wikimedia.org/wikipedia/pt/9/96/CopaDoBrasil.png', matches: [] },
    { id: 3, name: 'Sudamericana', subtitle: 'CONMEBOL', image: 'https://www.ogol.com.br//img/logos/competicoes/269_imgbank_cs_20250311124354.png', matches: [] },
    { id: 1, name: 'Brasileirão', subtitle: 'Série A', image: 'https://cdn-img.zerozero.pt/img/logos/competicoes/51_imgbank_d1_20250313102859.png', matches: [] },
  ]);

  const fetchLiveStats = async () => {
    if (!API_KEY) return;
    try {
      const res = await fetch(`https://v3.football.api-sports.io/fixtures?team=${SPFC_ID}&season=2026`, {
        method: "GET",
        headers: { "x-rapidapi-key": API_KEY, "x-rapidapi-host": "v3.football.api-sports.io" }
      });
      const data = await res.json();
      if (data.response) {
        const fix = (n) => n.toLowerCase().includes('sao paulo') ? 'SPFC' : n;
        const agenda = data.response
          .filter(f => f.fixture.status.short === 'NS' && f.teams.home.id === 126)
          .sort((a, b) => new Date(a.fixture.date) - new Date(b.fixture.date))
          .map(f => ({
            date: new Date(f.fixture.date).toLocaleDateString('pt-BR', {day: '2-digit', month: '2-digit'}),
            home: fix(f.teams.home.name),
            away: fix(f.teams.away.name),
            time: new Date(f.fixture.date).toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit'}),
          }));
        setSportEvents(prev => prev.map(s => s.id === 2 ? {...s, matches: agenda} : s));
      }
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchLiveStats(); }, []);

  return (
    <div className="font-sans text-gray-100 bg-neutral-950 min-h-screen text-center overflow-x-hidden selection:bg-red-600">
      <a href="https://wa.me/5511940741355" target="_blank" className="fixed bottom-8 right-8 z-[100] bg-green-600 p-4 rounded-full shadow-2xl hover:scale-110 transition-transform"><MessageCircle className="w-8 h-8 fill-white text-white" /></a>
      
      <nav className="fixed w-full z-50 h-20 flex items-center justify-between px-8 bg-black/80 backdrop-blur-md border-b border-white/5">
        <img src="https://i.imgur.com/cSYIvq6.png" className="h-8" />
        <div className="hidden md:flex gap-8 uppercase font-black text-[10px] tracking-widest text-gray-400">
          {navigation.map(n => <a key={n.name} href={n.href} className="hover:text-red-500 transition-colors">{n.name}</a>)}
        </div>
      </nav>

      {/* Hero */}
      <div className="pt-60 pb-40 relative px-4">
        <div className="absolute inset-0 opacity-20 bg-[url('https://i.imgur.com/lKKQfgK.png')] bg-cover bg-center"></div>
        <h1 className="text-6xl md:text-9xl font-black uppercase leading-none relative z-10 text-white animate-fade-in-up tracking-tighter">ARENA <span className="text-red-600">HENKO</span></h1>
        <p className="text-gray-500 uppercase tracking-[0.4em] text-sm mt-6 relative z-10 font-bold">Hospitalidade Premium no Morumbis</p>
      </div>

      {/* Sobre */}
      <section id="sobre" className="py-32 px-6 max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center text-left text-white border-b border-white/5">
        <div>
          <span className="text-red-600 font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">A ARENA</span>
          <h2 className="text-5xl font-black uppercase mb-8 leading-tight">Excelência <br/>Hospitalidade</h2>
          <p className="text-gray-400 leading-relaxed italic font-light text-lg">A Arena Henko oferece exclusividade, conforto e a melhor visão do espetáculo no Morumbis.</p>
        </div>
        <div className="bg-neutral-900/50 p-10 rounded-[40px] border border-white/10 shadow-2xl flex flex-col gap-6">
            <Shield className="text-red-600 w-10 h-10" />
            <h4 className="text-2xl font-black uppercase text-white tracking-widest">Privacidade VIP</h4>
            <p className="text-gray-500 text-sm">Espaço monitorado e reservado para grandes negócios e experiências de elite.</p>
        </div>
      </section>

      {/* Serviços / Vantagens Restauradas (6 itens) */}
      <section id="servicos" className="py-32 bg-neutral-900/30 px-4 text-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-black text-white uppercase mb-20 tracking-tighter">Hospitalidade</h2>
          <div className="grid md:grid-cols-3 gap-8 text-left">
            {services.map((s, i) => (
              <div key={i} className="group relative h-[450px] rounded-[50px] overflow-hidden border border-white/5 hover:border-red-600/50 transition-all shadow-3xl">
                <div className="absolute inset-0 duration-1000 group-hover:scale-110"><img src={s.imageUrl} className="w-full h-full object-cover opacity-20 grayscale group-hover:grayscale-0" alt={s.title} /></div>
                <div className="absolute inset-0 bg-neutral-950/85 group-hover:bg-neutral-950/40 transition-all"></div>
                <div className="relative z-20 h-full p-10 flex flex-col justify-end">
                  <div className="bg-red-900/30 p-4 rounded-2xl w-fit mb-6 text-red-500 shadow-xl">{s.icon}</div>
                  <h3 className="text-2xl font-black text-white uppercase mb-3 tracking-tighter">{s.title}</h3>
                  <p className="text-gray-400 text-sm font-light leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Calendário Centralizado */}
      <section id="calendario" className="py-32 px-4">
        <div className="max-w-4xl mx-auto text-white">
          <h2 className="text-5xl font-black uppercase mb-16 text-center">Temporada <span className="text-red-600">2026</span></h2>
          <div className="bg-neutral-900/40 backdrop-blur-sm rounded-[60px] p-12 border border-neutral-800 shadow-3xl text-center">
                <img src={sportEvents[0].image} className="w-40 mx-auto mb-10 scale-[1.3]" />
                <h3 className="text-3xl font-black text-white uppercase mb-12 tracking-widest uppercase">Agenda Morumbis</h3>
                <div className="space-y-4 text-left max-w-2xl mx-auto text-white">
                  {sportEvents[0].matches.length > 0 ? sportEvents[0].matches.map((m, i) => (
                    <div key={i} className="bg-neutral-950 border border-white/5 rounded-[32px] p-8 flex justify-between items-center group hover:border-red-600/30 transition-all cursor-pointer shadow-xl text-white">
                      <div className="flex items-center gap-10 text-white">
                        <span className="text-gray-600 font-black text-[12px]">{m.date}</span>
                        <span className="text-white font-black text-lg uppercase tracking-tight font-black uppercase">{m.home} X {m.away}</span>
                      </div>
                      <div className="bg-red-600 p-3 rounded-2xl group-hover:scale-110 transition-transform shadow-lg"><ArrowRight className="w-4 h-4 text-white" /></div>
                    </div>
                  )) : <p className="text-center text-gray-600 italic font-black uppercase text-[10px] tracking-widest text-white">Sincronizando jogos oficiais...</p>}
                </div>
          </div>
        </div>
      </section>

      {/* Próximos Eventos com Imagens */}
      <section className="py-32 bg-neutral-900/30 px-4 text-white">
        <h3 className="text-4xl font-black text-red-500 mb-20 uppercase tracking-tighter text-center font-black uppercase text-white">Próximos Eventos</h3>
        <div className="grid md:grid-cols-3 gap-10 max-w-7xl mx-auto text-white">
          {entertainmentEvents.map((e, i) => (
            <div key={i} className="group relative rounded-[50px] overflow-hidden aspect-[4/5] shadow-3xl border border-white/5 text-white">
                <img src={e.image} className="w-full h-full object-cover duration-1000 group-hover:scale-110 grayscale group-hover:grayscale-0 opacity-40 group-hover:opacity-100 text-white" alt={e.name} />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent flex flex-col justify-end p-10 text-left text-white">
                  <span className="bg-red-600 text-white text-[10px] font-black uppercase px-4 py-1.5 rounded-full w-fit mb-4 tracking-widest font-black uppercase text-white">{e.date}</span>
                  <h3 className="text-4xl font-black text-white uppercase leading-none font-black uppercase text-white">{e.name}</h3>
                  <p className="text-gray-400 text-sm mt-4 font-light leading-relaxed text-white">{e.desc}</p>
                </div>
            </div>
          ))}
        </div>
      </section>

      {/* Parceiros Coloridos Grid Completo (15 itens) */}
      <section id="parceiros" className="py-32 px-6 border-t border-neutral-900 text-white">
        <h3 className="text-xl text-gray-600 uppercase tracking-[0.6em] font-black mb-16 text-center uppercase font-black uppercase text-white">Parceiros de Elite</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 max-w-7xl mx-auto text-white">
          {partnerLogos.map((p, i) => (
            <div key={i} className="bg-neutral-900/50 border border-white/5 rounded-[40px] h-40 flex items-center justify-center p-8 hover:border-red-600/30 transition-all group shadow-xl text-white">
              <img src={p.logoUrl} className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-500 text-white" alt={p.name} />
            </div>
          ))}
        </div>
      </section>

      {/* Contato */}
      <section id="contato" className="py-40 bg-neutral-950 px-6 border-t border-neutral-900 text-white">
        <h2 className="text-6xl md:text-9xl font-black mb-16 uppercase tracking-tighter text-white font-black uppercase text-white text-white">Reserve seu <br/><span className="text-red-600 underline decoration-red-600/30 underline-offset-8 font-black uppercase">Espaço.</span></h2>
        <div className="bg-neutral-900 p-12 rounded-[60px] border border-white/5 shadow-3xl max-w-3xl mx-auto text-left backdrop-blur-sm text-white">
           <form className="space-y-8 text-white">
             <div className="grid md:grid-cols-2 gap-8 text-white">
               <div className="flex flex-col gap-3 text-white"><label className="text-[10px] font-black uppercase text-gray-500 tracking-[0.4em] ml-2 text-white">Nome Completo</label><input type="text" className="bg-neutral-950 border border-white/10 rounded-3xl px-8 py-6 text-white focus:border-red-600 outline-none transition-all font-bold placeholder:text-gray-800 text-white" placeholder="Digite seu nome" /></div>
               <div className="flex flex-col gap-3 text-white"><label className="text-[10px] font-black uppercase text-gray-500 tracking-[0.4em] ml-2 text-white">E-mail Corporativo</label><input type="email" className="bg-neutral-950 border border-white/10 rounded-3xl px-8 py-6 text-white focus:border-red-600 outline-none transition-all font-bold placeholder:text-gray-800 text-white" placeholder="seu@email.com" /></div>
             </div>
             <button type="button" className="w-full bg-red-600 py-7 rounded-[32px] font-black uppercase text-xs tracking-[0.5em] shadow-3xl hover:bg-red-700 transition-all active:scale-95 shadow-red-900/40 text-white font-black uppercase text-white">Solicitar Cotação Premium</button>
           </form>
        </div>
      </section>

      <footer className="py-24 border-t border-neutral-900 opacity-40 text-white text-white"><p className="text-[11px] font-bold uppercase tracking-[0.5em] text-white">© 2026 ARENA HENKO. TODOS OS DIREITOS RESERVADOS.</p></footer>
    </div>
  );
};
export default App;
