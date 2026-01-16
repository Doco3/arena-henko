import React, { useState, useEffect } from 'react';
import { 
  Menu as MenuIcon, X, Instagram, Mail, Phone, Calendar, Award, Users, Tv, Music, MapPin, 
  CheckCircle, ArrowRight, Lock, Edit2, Save, LogOut, Clock, CalendarDays, Shield, 
  ChevronDown, Info, Beer, Trophy, Star, Activity, MessageCircle, History, TrendingUp, MapPinned
} from 'lucide-react';

const App = () => {
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
    { name: 'AC/DC', date: '2026', image: 'https://i.imgur.com/XawIqwq.jpg', desc: 'O rock mundial invade o Morumbis.' },
    { name: 'The Weeknd', date: '2026', image: 'https://i.imgur.com/1zpCq3e.jpg', desc: 'Experiência visual única.' },
    { name: 'Festa do Peão', date: 'Agosto 2026', image: 'https://i.imgur.com/GW8we0X.png', desc: 'Hospitalidade Arena Henko em Barretos.' },
  ];

  const partnerLogos = [
    { name: 'Mali Pizzaria', logoUrl: 'https://i.imgur.com/YxcN44a.png', extraSize: true },
    { name: 'Santa Helena', logoUrl: 'https://i.imgur.com/XjXzNik.png', extraSize: true },
    { name: 'Tirolez', logoUrl: 'https://i.imgur.com/4NmAzLu.png', extraSize: true },
    { name: 'Matsuya', logoUrl: 'https://i.imgur.com/EeCB2GL.png', extraSize: true },
    { name: 'Henko Produções', logoUrl: 'https://i.imgur.com/qVnwNYs.png' },
    { name: 'Weach', logoUrl: 'https://i.imgur.com/jz15iRQ.png' },
  ];

  const getWaLink = (message) => {
    const waNumber = '5511940741355';
    return `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;
  };

  const selectedSport = sportEvents.find(s => s.id === activeSportId);
  const nextMatch = sportEvents[0].matches[0]; 

  return (
    <div className="font-sans text-gray-100 bg-neutral-950 min-h-screen text-center overflow-x-hidden">
      <nav className="fixed w-full z-50 bg-neutral-950/95 backdrop-blur-md border-b border-neutral-800 h-20 flex justify-between items-center px-8">
        <img src="https://i.imgur.com/cSYIvq6.png" className="h-8 w-auto" alt="Logo" />
        <div className="hidden md:flex space-x-8">
          {navigation.map(n => <a key={n.name} href={n.href} className="text-sm font-bold uppercase text-gray-300 hover:text-red-500">{n.name}</a>)}
          <a href="#contato" className="bg-red-600 text-white px-5 py-2 rounded-full font-black text-xs uppercase">Fale Connosco</a>
        </div>
      </nav>

      <div className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20"><img src="https://i.imgur.com/lKKQfgK.png" className="w-full h-full object-cover" alt="Hero" /></div>
        <div className="relative z-10">
          <h1 className="text-6xl md:text-9xl font-black mb-6 uppercase leading-none">ARENA <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-800">HENKO</span></h1>
          <p className="max-w-2xl mx-auto text-xl text-gray-400 font-light mb-10 uppercase tracking-widest">Hospitalidade Premium no Morumbis</p>
        </div>
      </div>

      <section id="calendario" className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-black text-white uppercase mb-12">Temporada <span className="text-red-600">2026</span></h2>
          <div className="flex flex-wrap gap-2 mb-12 justify-center">
            {sportEvents.map(s => (
              <button key={s.id} onClick={() => setActiveSportId(s.id)} className={`px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeSportId === s.id ? 'bg-red-600 text-white shadow-xl' : 'bg-neutral-900 text-gray-500'}`}>
                {s.name}
              </button>
            ))}
          </div>

          {selectedSport && (
            <div className="bg-neutral-900/30 backdrop-blur-sm rounded-[40px] p-12 border border-neutral-800 shadow-3xl">
              <div className="flex flex-col items-center mb-16">
                <div className="w-48 h-48 md:w-64 md:h-64 mb-6 bg-neutral-950 rounded-[32px] p-8 flex items-center justify-center border border-neutral-800">
                  <img src={selectedSport.image} className={`max-w-full max-h-full object-contain ${selectedSport.id === 2 ? 'scale-[1.3]' : ''}`} alt="Campeonato" />
                </div>
                <h3 className="text-3xl font-black uppercase">{selectedSport.name}</h3>
              </div>

              <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto items-start">
                <div className="flex flex-col">
                  <h4 className="text-red-500 text-[10px] font-black uppercase tracking-[0.4em] mb-8 flex items-center gap-2 justify-center text-red-500"><Clock className="w-4 h-4"/> Agenda Morumbis</h4>
                  <div className="space-y-4">
                    {selectedSport.matches.map((match, mIdx) => (
                      <div key={mIdx} className="bg-neutral-950/50 border border-neutral-800 rounded-3xl overflow-hidden hover:border-red-600/30 transition-all p-5 flex items-center justify-between">
                        <span className="text-[10px] font-black text-gray-500 w-10">{match.date}</span>
                        <div className="flex items-center gap-4">
                          <span className="text-[11px] font-black uppercase">{match.home}</span>
                          <img src={match.homeLogo} className="w-6 h-6 object-contain" alt="H" />
                          <span className="text-[9px] font-black opacity-20">X</span>
                          <img src={match.awayLogo} className="w-6 h-6 object-contain" alt="A" />
                          <span className="text-[11px] font-black uppercase">{match.away}</span>
                        </div>
                        <button onClick={() => window.open(getWaLink(`Gostaria de reservar para ${match.home} x ${match.away}`))} className="p-2 bg-red-600 rounded-lg"><ArrowRight className="w-4 h-4" /></button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col">
                  <h4 className="text-gray-400 text-[10px] font-black uppercase tracking-[0.4em] mb-8 flex items-center gap-2 justify-center text-gray-400"><History className="w-4 h-4"/> Últimos Placares</h4>
                  <div className="max-h-[440px] overflow-y-auto space-y-4 pr-2 scrollbar-thin scrollbar-thumb-red-900">
                    {selectedSport.results.map((res, rIdx) => (
                      <div key={rIdx} className="bg-neutral-950 border border-neutral-800 p-5 rounded-3xl flex flex-col gap-4">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-black text-gray-600">{res.date}</span>
                          <span className={`text-[8px] font-black uppercase px-2 py-1 rounded-full border ${res.location === 'Morumbis' ? 'bg-red-900/50 text-red-500 border-red-800/50' : 'bg-neutral-800 text-gray-600 border-neutral-800'}`}>{res.location}</span>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex-1 flex items-center gap-2"><img src={res.homeLogo} className="w-8 h-8 object-contain" /><span className="text-[10px] font-black uppercase truncate">{res.home}</span></div>
                          <div className="flex items-center gap-2 bg-black px-4 py-2 rounded-xl border border-neutral-800"><span className="text-xl font-black tabular-nums">{res.scoreHome}</span><span className="text-red-700 font-black animate-pulse">:</span><span className="text-xl font-black tabular-nums">{res.scoreAway}</span></div>
                          <div className="flex-1 flex items-center gap-2 justify-end text-right"><span className="text-[10px] font-black uppercase truncate">{res.away}</span><img src={res.awayLogo} className="w-8 h-8 object-contain" /></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <section id="parceiros" className="py-32 px-4">
        <h3 className="text-xl text-gray-600 uppercase tracking-[0.5em] font-black mb-16">Parceiros Comerciais</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-6 max-w-7xl mx-auto">
          {partnerLogos.map(p => <div key={p.name} className="bg-neutral-900/50 border border-neutral-800 rounded-3xl h-28 flex items-center justify-center p-4 hover:border-red-600/30 transition-all"><img src={p.logoUrl} className="h-full w-full object-contain" alt={p.name} /></div>)}
        </div>
      </section>

      <footer className="py-20 opacity-40 text-white"><img src="https://i.imgur.com/cSYIvq6.png" className="h-8 mx-auto mb-8" alt="Logo" /><p className="text-[10px] font-bold uppercase tracking-widest text-white">© {new Date().getFullYear()} Arena Henko. Todos os direitos reservados.</p></footer>
    </div>
  );
};

export default App;
