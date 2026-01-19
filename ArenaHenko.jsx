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

  const getWaLink = (message) => `https://wa.me/5511940741355?text=${encodeURIComponent(message)}`;

  const selectedSport = sportEvents.find(s => s.id === activeSportId);

  return (
    <div className="font-sans text-gray-100 bg-neutral-950 min-h-screen text-center overflow-x-hidden selection:bg-red-600">
      
      {/* Botão WhatsApp Flutuante */}
      <a 
        href={getWaLink("Olá! Gostaria de informações sobre hospitalidade na Arena Henko.")}
        target="_blank"
        className="fixed bottom-8 right-8 z-[100] bg-green-600 hover:bg-green-500 text-white p-4 rounded-full shadow-[0_0_30px_rgba(22,163,74,0.4)] transition-all hover:scale-110 active:scale-95 group"
      >
        <MessageCircle className="w-8 h-8 fill-white" />
        <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-neutral-900 text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl border border-neutral-800 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap hidden md:block">Falar Connosco</span>
      </a>

      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-neutral-950/95 backdrop-blur-md border-b border-neutral-800' : 'bg-transparent'} h-20 flex justify-between items-center px-8`}>
        <img src="https://i.imgur.com/cSYIvq6.png" className="h-8 w-auto" alt="Logo" />
        <div className="hidden md:flex space-x-8">
          {navigation.map(n => <a key={n.name} href={n.href} className="text-[10px] font-black uppercase text-gray-300 hover:text-red-500 tracking-widest transition-colors">{n.name}</a>)}
          <a href="#contato" className="bg-red-600 text-white px-5 py-2 rounded-full font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-red-900/40">Reservar Agora</a>
        </div>
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden text-white"><MenuIcon /></button>
      </nav>

      {/* Hero */}
      <div className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20"><img src="https://i.imgur.com/lKKQfgK.png" className="w-full h-full object-cover" alt="Hero" /></div>
        <div className="relative z-10 px-4 text-white">
          <h1 className="text-6xl md:text-9xl font-black mb-6 uppercase leading-none">ARENA <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-800">HENKO</span></h1>
          <p className="max-w-2xl mx-auto text-xl text-gray-400 font-light mb-10 uppercase tracking-[0.3em]">Hospitalidade Premium no Morumbis</p>
          <a href="#calendario" className="inline-flex px-10 py-5 bg-red-600 text-white rounded-full font-black text-sm hover:bg-red-700 transition-all items-center gap-2 uppercase tracking-widest shadow-2xl shadow-red-900/40">Explorar Agenda <ArrowRight className="w-5 h-5"/></a>
        </div>
      </div>

      {/* Sobre Nós */}
      <section id="sobre" className="py-32 px-4 border-b border-neutral-900">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-20 items-center">
          <div className="text-left">
            <span className="text-red-600 font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">EXCLUSIVIDADE</span>
            <h2 className="text-5xl font-black text-white uppercase mb-8 leading-tight text-white">O Palco da sua <br/>Próxima História</h2>
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
                <div className="absolute inset-0 z-0"><img src={s.imageUrl} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt={s.title} /></div>
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
        <div className="max-w-7xl mx-auto text-white">
          <div className="mb-16">
            <h2 className="text-5xl font-black text-white uppercase tracking-tighter text-white">Temporada <span className="text-red-600 font-black">2026</span></h2>
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
            <div className="bg-neutral-900/30 backdrop-blur-sm rounded-[50px] p-8 md:p-16 border border-neutral-800 shadow-3xl text-white">
              <div className="flex flex-col items-center mb-16 text-white text-white">
                <div className="w-48 h-48 md:w-72 md:h-72 mb-8 bg-neutral-950 rounded-[40px] p-10 flex items-center justify-center border border-neutral-800 shadow-inner group transition-all hover:border-red-600/30 overflow-hidden relative text-white">
                  <img src={selectedSport.image} className={`max-w-full max-h-full object-contain transition-transform duration-700 group-hover:scale-110 ${selectedSport.id === 2 ? 'scale-[1.4] translate-y-3' : ''}`} alt="Champ" />
                </div>
                <h3 className="text-4xl font-black text-white uppercase tracking-tight text-white">{selectedSport.name}</h3>
                <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.5em] mt-3 text-white">{selectedSport.subtitle}</p>
              </div>

              <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto items-start text-left text-white text-white">
                <div className="flex flex-col text-white">
                  <h4 className="text-red-500 text-[11px] font-black uppercase tracking-[0.4em] mb-8 flex items-center gap-3 justify-center lg:justify-start text-red-500"><Clock className="w-4 h-4"/> Agenda Morumbis</h4>
                  <div className="space-y-4">
                    {selectedSport.matches.length > 0 ? selectedSport.matches.map((m, i) => (
                      <div key={i} className="bg-neutral-950/50 border border-neutral-800 rounded-[32px] overflow-hidden hover:border-red-600/30 transition-all text-white text-white">
                        <button onClick={() => setExpandedMatchKey(expandedMatchKey === i ? null : i)} className="w-full p-6 flex items-center justify-between text-white text-white">
                          <div className="flex items-center gap-6 text-white text-white">
                            <span className="text-[11px] font-black text-gray-600 w-10 text-white">{m.date}</span>
                            <div className="flex items-center gap-3 text-white text-white text-white">
                              <span className="text-[12px] font-black uppercase text-white font-black">{m.home}</span>
                              <img src={m.homeLogo} className="w-6 h-6 object-contain text-white" alt="H" />
                              <span className="text-[10px] font-black opacity-20 text-white">VS</span>
                              <img src={m.awayLogo} className="w-6 h-6 object-contain text-white" alt="A" />
                              <span className="text-[12px] font-black uppercase text-white font-black">{m.away}</span>
                            </div>
                          </div>
                          <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${expandedMatchKey === i ? 'rotate-180 text-red-500' : ''}`} />
                        </button>
                        {expandedMatchKey === i && (
                          <div className="p-8 border-t border-neutral-800 bg-neutral-900/30 text-center animate-fade-in text-white text-white">
                            <div className="grid grid-cols-2 gap-6 mb-6 border-y border-neutral-800 py-6 text-white">
                              <div><p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Hora do Jogo</p><p className="text-lg font-bold text-white">{m.time}</p></div>
                              <div><p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1 text-white">Lounge Arena</p><p className="text-lg font-bold text-white text-white">2h antes</p></div>
                            </div>
                            <button onClick={() => window.open(getWaLink(`Quero hospitalidade para ${m.home} x ${m.away} dia ${m.date}`))} className="w-full bg-red-600 py-4 rounded-2xl font-black uppercase text-[11px] tracking-widest shadow-xl hover:bg-red-700 transition-colors text-white font-black text-white">Reservar Agora</button>
                          </div>
                        )}
                      </div>
                    )) : <div className="p-12 border border-dashed border-neutral-800 rounded-[32px] text-center opacity-30 text-[11px] font-black uppercase tracking-widest text-white text-white">Sem jogos no Morumbis agendados</div>}
                  </div>
                </div>

                <div className="flex flex-col text-white text-white">
                  <h4 className="text-gray-400 text-[11px] font-black uppercase tracking-[0.4em] mb-8 flex items-center gap-3 justify-center lg:justify-start text-white"><History className="w-4 h-4"/> Histórico Temporada</h4>
                  <div className="max-h-[460px] overflow-y-auto space-y-4 pr-3 scrollbar-thin scrollbar-thumb-red-900 text-white text-white text-white">
                    {selectedSport.results.length > 0 ? selectedSport.results.map((res, i) => (
                      <div key={i} className="bg-neutral-950 border border-neutral-800 p-6 rounded-[32px] flex flex-col gap-5 hover:border-gray-600 transition-all group text-white">
                        <div className="flex justify-between items-center text-white text-white text-white text-white">
                          <span className="text-[10px] font-black text-gray-600 text-white">{res.date}</span>
                          <span className={`text-[8px] font-black uppercase px-3 py-1 rounded-full border ${res.location === 'Morumbis' ? 'bg-red-950/50 text-red-500 border-red-900/50' : 'bg-neutral-900 text-gray-600 border-neutral-800'}`}>{res.location}</span>
                        </div>
                        <div className="flex items-center justify-between gap-3 text-white text-white text-white text-white">
                          <div className="flex-1 flex flex-col items-center gap-2 text-white"><img src={res.homeLogo} className="w-10 h-10 object-contain text-white" /><span className="text-[10px] font-black uppercase truncate text-white text-white">{res.home}</span></div>
                          <div className="flex items-center gap-3 bg-black px-6 py-3 rounded-2xl border border-neutral-800 shadow-inner group-hover:border-red-900/50 transition-colors text-white"><span className="text-2xl font-black tabular-nums text-white text-white">{res.scoreHome}</span><span className="text-red-700 font-black animate-pulse">:</span><span className="text-2xl font-black tabular-nums text-white text-white">{res.scoreAway}</span></div>
                          <div className="flex-1 flex flex-col items-center gap-2 text-white"><img src={res.awayLogo} className="w-10 h-10 object-contain text-white" /><span className="text-[10px] font-black uppercase truncate text-white text-white">{res.away}</span></div>
                        </div>
                        <div className="flex justify-center items-center gap-2 text-white"><div className="w-1.5 h-1.5 rounded-full bg-green-500 text-white text-white"></div><span className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-600 font-black text-white">Partida Encerrada</span></div>
                      </div>
                    )) : <div className="p-12 border border-dashed border-neutral-800 rounded-[32px] text-center opacity-30 text-[11px] font-black uppercase tracking-widest text-white">Sem registos realizados</div>}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Próximos Eventos (Título alterado de Shows Internacionais) */}
      <section className="py-32 bg-neutral-900/30 px-4 text-white">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-3xl font-black text-red-500 mb-16 uppercase tracking-[0.2em]">Próximos Eventos</h3>
          <div className="grid md:grid-cols-3 gap-8 text-white">
            {entertainmentEvents.map((e, i) => (
              <div key={i} className="group flex flex-col items-center text-white">
                <div className="relative rounded-[40px] overflow-hidden aspect-[4/5] mb-8 border border-neutral-800 group/img shadow-2xl w-full text-white">
                  <img src={e.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 text-white" alt={e.name} />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm text-white">
                    <button onClick={() => window.open(getWaLink(`Tenho interesse no evento ${e.name} na Arena Henko`))} className="bg-red-600 text-white px-8 py-4 rounded-full font-black uppercase text-[11px] tracking-widest flex items-center gap-2 shadow-2xl text-white font-black">
                      <MessageCircle className="w-4 h-4 fill-white" /> Consultar Show
                    </button>
                  </div>
                </div>
                <div className="inline-block px-5 py-1.5 bg-red-600 text-white text-[10px] font-black rounded-full mb-4 uppercase tracking-widest text-white font-black">{e.date}</div>
                <h3 className="text-3xl font-black text-white uppercase text-white font-black">{e.name}</h3>
                <p className="text-gray-500 text-sm mt-3 font-light px-6 leading-relaxed text-white">{e.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Parceiros de Elite - COLORIDOS */}
      <section id="parceiros" className="py-32 px-6 border-t border-neutral-900 text-white">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-xl text-gray-600 uppercase tracking-[0.5em] font-black mb-16 text-white font-black">Parceiros de Elite</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {partnerLogos.map((p, i) => (
              <div key={i} className={`bg-neutral-900/50 border border-neutral-800 rounded-[32px] h-32 flex items-center justify-center transition-all group hover:border-red-600/30 ${p.extraSize ? 'p-4' : 'p-8'}`}>
                <img src={p.logoUrl} className="h-full w-full object-contain transition-all duration-500 group-hover:scale-110" alt={p.name} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contacto */}
      <section id="contato" className="py-40 bg-neutral-950 px-6 relative overflow-hidden text-white">
        <div className="max-w-4xl mx-auto relative z-10 text-white">
          <h2 className="text-5xl md:text-8xl font-black mb-16 uppercase tracking-tighter text-white font-black">Reserve sua <br/><span className="text-red-600 underline decoration-red-600/30 underline-offset-8 font-black">Experiência.</span></h2>
          <div className="grid md:grid-cols-3 gap-8 mb-20 text-white text-white">
             <a href="https://instagram.com/arenahenko" target="_blank" className="flex flex-col items-center p-10 bg-neutral-900/50 rounded-3xl border border-neutral-800 hover:border-red-600/30 group text-white">
                <Instagram className="w-10 h-10 text-red-600 mb-6 group-hover:scale-110 transition-transform" /><span className="font-black text-[11px] uppercase tracking-[0.2em]">Instagram</span>
             </a>
             <a href="https://wa.me/5511940741355" target="_blank" className="flex flex-col items-center p-10 bg-neutral-900/50 rounded-3xl border border-neutral-800 hover:border-red-600/30 group text-white">
                <Phone className="w-10 h-10 text-red-600 mb-6 group-hover:scale-110 transition-transform" /><span className="font-black text-[11px] uppercase tracking-[0.2em]">(11) 94074-1355</span>
             </a>
             <a href="mailto:sergio@henkoproducoes.com.br" className="flex flex-col items-center p-10 bg-neutral-900/50 rounded-3xl border border-neutral-800 hover:border-red-600/30 group text-white text-white">
                <Mail className="w-10 h-10 text-red-600 mb-6 group-hover:scale-110 transition-transform text-red-600" /><span className="font-black text-[11px] uppercase tracking-[0.2em]">E-mail</span>
             </a>
          </div>
          <div className="bg-neutral-900 p-12 rounded-[50px] border border-neutral-800 shadow-3xl text-left max-w-3xl mx-auto text-white text-white">
             <form className="space-y-8 text-white">
               <div className="grid md:grid-cols-2 gap-8 text-white">
                 <div className="flex flex-col gap-3 text-white">
                   <label className="text-[10px] font-black uppercase text-gray-500 tracking-[0.3em] ml-2 font-black">Nome Completo</label>
                   <input type="text" className="bg-neutral-950 border border-neutral-800 rounded-2xl px-6 py-5 text-white focus:border-red-600 outline-none transition-all font-bold placeholder:text-gray-800 text-white font-black" placeholder="Digite seu nome" />
                 </div>
                 <div className="flex flex-col gap-3 text-white">
                   <label className="text-[10px] font-black uppercase text-gray-500 tracking-[0.3em] ml-2 font-black">E-mail</label>
                   <input type="email" className="bg-neutral-950 border border-neutral-800 rounded-2xl px-6 py-5 text-white focus:border-red-600 outline-none transition-all font-bold placeholder:text-gray-800 text-white font-black" placeholder="seu@email.com" />
                 </div>
               </div>
               <div className="flex flex-col gap-3 text-white">
                 <label className="text-[10px] font-black uppercase text-gray-500 tracking-[0.3em] ml-2 font-black">Mensagem</label>
                 <textarea rows="4" className="bg-neutral-950 border border-neutral-800 rounded-3xl px-6 py-5 text-white focus:border-red-600 outline-none transition-all font-bold placeholder:text-gray-800 resize-none text-white font-black" placeholder="Conte-nos sobre sua necessidade"></textarea>
               </div>
               <button type="button" className="w-full bg-red-600 py-6 rounded-3xl font-black uppercase text-xs tracking-[0.3em] shadow-3xl shadow-red-900/40 text-white hover:bg-red-700 active:scale-95 transition-all text-white font-black">Enviar Solicitação</button>
             </form>
          </div>
        </div>
      </section>

      <footer className="py-24 border-t border-neutral-900 opacity-50 text-white text-white">
        <img src="https://i.imgur.com/cSYIvq6.png" className="h-10 mx-auto mb-10 text-white" alt="Logo" />
        <p className="text-[11px] font-bold uppercase tracking-[0.5em] text-white">© {new Date().getFullYear()} Arena Henko. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
};

export default App;
