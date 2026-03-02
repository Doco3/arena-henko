import React, { useState, useEffect, useMemo } from 'react';
import { 
  Menu as MenuIcon, X, Instagram, Mail, Phone, Calendar, Award, Users, Tv, Music, MapPin, 
  CheckCircle, ArrowRight, Clock, Shield, ChevronDown, Star, MessageCircle, Quote, 
  LockKeyhole, Coffee, Wine, ShieldCheck, Headphones, MousePointerClick, Smartphone, UserCheck,
  Beer, Zap, Play, Image as ImageIcon, Plus, Trash2, FolderOpen, AlertTriangle, Loader2, Download
} from 'lucide-react';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged, signInWithCustomToken } from 'firebase/auth';
import { getFirestore, collection, addDoc, onSnapshot, deleteDoc, doc, updateDoc, query, where } from 'firebase/firestore';

// --- CONFIGURAÇÃO DO FIREBASE ---
const firebaseConfig = typeof __firebase_config !== 'undefined' 
  ? JSON.parse(__firebase_config) 
  : {
      apiKey: "", 
      authDomain: "arena-henko.firebaseapp.com",
      projectId: "arena-henko",
      storageBucket: "arena-henko.firebasestorage.app",
      messagingSenderId: "34887593341",
      appId: "1:34887593341:web:d6d68012cc9b8389797014"
    };

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'arena-henko';

const ADMIN_HASH = "SGVua29fTWFzdGVyXzIwMjZfU2VjdXJlISM="; 
const LOGO_URL = 'https://i.imgur.com/cSYIvq6.png'; 

// --- DADOS ESTÁTICOS ---
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
  { name: 'Depoimentos', href: '#reviews' },
  { name: 'Agenda', href: '#calendario' },
  { name: 'Eventos', href: '#eventos' },
  { name: 'Experiência', href: '#servicos' },
  { name: 'Galeria', href: '#galeria' },
  { name: 'Contato', href: '#contato' },
];

const SERVICES_DATA = [
    { title: 'Lounge de Hospitalidade', icon: <Users className="w-6 h-6" />, desc: 'Ponto exclusivo para networking e relaxamento pré-evento.', imageUrl: 'https://i.imgur.com/Bw5Yw4K.png' },
    { title: 'Recepção VIP', icon: <Award className="w-6 h-6" />, desc: 'Atendimento premium e acesso rápido e diferenciado.', imageUrl: 'https://i.imgur.com/pLUfmBf.png' },
    { title: 'Ambiente Premium', icon: <Beer className="w-6 h-6" />, desc: 'Open bar e Open Food com culinária sofisticada.', imageUrl: 'https://i.imgur.com/Za2zSyx.png' },
    { title: 'Networking', icon: <CheckCircle className="w-6 h-6" />, desc: 'O ambiente ideal para expandir sua rede de contatos.', imageUrl: 'https://i.imgur.com/PrhiB8E.png' },
    { title: 'Vista Privilegiada', icon: <MapPin className="w-6 h-6" />, desc: 'Acesso exclusivo e visão privilegiada do Morumbis.', imageUrl: 'https://i.imgur.com/7R1hOwg.png' },
    { title: 'Branding & Mídia', icon: <Tv className="w-6 h-6" />, desc: 'Ativações de marca em Ring LED e relatórios de visibilidade.', imageUrl: 'https://i.imgur.com/Gy62moQ.png' },
];

const SPORT_DATA = [
  { 
    id: 1, name: 'Brasileirão', subtitle: 'Série A 2026', image: "https://a.espncdn.com/combiner/i?img=/i/leaguelogos/soccer/500/85.png", 
    matches: [
      { id: 'br1', date: '28/01', home: 'SPFC', away: 'FLAMENGO', time: '21h30', homeLogo: TEAM_LOGOS.SPFC, awayLogo: TEAM_LOGOS.FLAMENGO, scarcity: 'Finalizado' },
      { id: 'br2', date: '11/02', home: 'SPFC', away: 'GRÊMIO', time: '21h30', homeLogo: TEAM_LOGOS.SPFC, awayLogo: TEAM_LOGOS.GREMIO },
      { id: 'br3', date: '15/02', home: 'SPFC', away: 'CHAPECOENSE', time: '18h30', homeLogo: TEAM_LOGOS.SPFC, awayLogo: TEAM_LOGOS.CHAPEPCOENSE }
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
  { name: 'The Weeknd', date: '30/04/2026', image: 'https://i.imgur.com/1zpCq3e.jpg', desc: 'Uma experiência visual e sonora imersiva com a melhor vista.' },
  { name: 'Festa do Peão', date: '20/08/2026', image: 'https://i.imgur.com/GW8we0X.png', desc: 'Hospitalidade Arena Henko presente no maior evento sertanejo.' },
];

const PARTNERS_DATA = [
  { name: 'Mali Pizzaria', logoUrl: 'https://i.imgur.com/YxcN44a.png' },
  { name: 'Santa Helena', logoUrl: 'https://i.imgur.com/XjXzNik.png' },
  { name: 'Tirolez', logoUrl: 'https://i.imgur.com/4NmAzLu.png', extra: true }, 
  { name: 'Matsuya', logoUrl: 'https://i.imgur.com/EeCB2GL.png', extra: true }, 
  { name: 'Oster', logoUrl: 'https://i.imgur.com/Kqwt8YH.png' },
  { name: 'Churrasboat', logoUrl: 'https://i.imgur.com/CZ9lYO8.png', extra: true, invert: true }, 
  { name: 'Henko Produções', logoUrl: 'https://i.imgur.com/qVnwNYs.png' },
  { name: 'Esfiha Imigrantes', logoUrl: 'https://i.imgur.com/VEjZgiI.png', extra: true, invert: true }, 
  { name: 'Colonial Padaria', logoUrl: 'https://i.imgur.com/cexxcrW.png' },
];

const REVIEWS_DATA = [
  { name: "Mariana Costa", text: "Lugar maravilhoso, comida excelente e atendimento de primeira! O melhor do Morumbis.", role: "Google Review", initial: "M" },
  { name: "João Paulo S.", text: "Conforto e segurança total para levar minha família. Passam muita credibilidade.", role: "Empresário", initial: "J" },
  { name: "Felipe Almeida", text: "O buffet é sensacional e a vista é a melhor possível. Atendimento nota 10.", role: "Google Review", initial: "F" },
  { name: "Ricardo Santos", text: "Atendimento diferenciado. Vale cada centavo pela hospitalidade e tranquilidade.", role: "Convidado VIP", initial: "R" },
  { name: "Letícia Rossi", text: "Ambiente familiar e muito seguro. Meus filhos adoraram o espaço.", role: "Google Review", initial: "L" }
];

const FAQ_DATA = [
    { q: "Como recebo o meu bilhete?", a: "Após a reserva oficial, o bilhete digital é enviado via e-mail ou WhatsApp (App SPFC) com QR Code dinâmico." },
    { q: "Vocês são o canal oficial?", a: "Sim. A Arena Henko é uma operação própria e credenciada dentro do Estádio do Morumbi." },
    { q: "Onde fica localizado o camarote?", a: "Estamos no Setor Lounge Oeste, oferecendo visão centralizada no nível do campo." },
    { q: "O que está incluído no valor?", a: "Full Experience inclui Buffet Gourmet, Open Bar Premium, banheiros privativos e climatização." },
];

// --- UTILITÁRIOS ---
function ImageWithFallback({ src, alt, className, style }) {
  const [error, setError] = useState(false);
  if (error) return <div className={`${className} bg-neutral-800 flex items-center justify-center rounded-xl`}><Shield className="w-6 h-6 text-gray-600" /></div>;
  return <img src={src} alt={alt} className={className} style={style} onError={() => setError(true)} />;
}

// Compressão de imagem via Canvas para garantir que caiba no Firestore
const compressImage = (base64Str, maxWidth = 1200, maxHeight = 1200) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width *= maxHeight / height;
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', 0.7)); // 0.7 qualidade para compressão eficiente
    };
  });
};

// --- COMPONENTE PRINCIPAL ---
const App = () => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [activeSportId, setActiveSportId] = useState(1); 
  const [expandedMatchKey, setExpandedMatchKey] = useState(null);
  const [expandedFaqKey, setExpandedFaqKey] = useState(null);
  const [toast, setToast] = useState(null);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0 });
  const [adminInputPass, setAdminInputPass] = useState('');

  // Estados da Galeria
  const [albums, setAlbums] = useState([]);
  const [allPhotos, setAllPhotos] = useState([]);
  const [activeAlbumId, setActiveAlbumId] = useState(null);
  const [isAddingAlbum, setIsAddingAlbum] = useState(false);
  const [isAddingPhoto, setIsAddingPhoto] = useState(false);
  const [newAlbumName, setNewAlbumName] = useState('');
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const nextMatch = useMemo(() => {
    try {
        const all = SPORT_DATA.flatMap(s => (s.matches || []).map(m => {
            if (!m.date || !m.date.includes('/')) return null;
            const [d, mo] = m.date.split('/');
            return { ...m, pDate: new Date(2026, parseInt(mo) - 1, parseInt(d)) };
        })).filter(Boolean);
        const future = all.filter(m => m.pDate >= today);
        return future.sort((a,b) => a.pDate - b.pDate)[0] || null;
    } catch(e) { return null; }
  }, [today]);

  const selectedSport = useMemo(() => SPORT_DATA.find(s => s.id === activeSportId) || SPORT_DATA[0], [activeSportId]);

  const visibleMatches = useMemo(() => {
      return (selectedSport.matches || []).filter(m => {
          if (!m.date || !m.date.includes('/')) return false;
          const [d, mo] = m.date.split('/');
          const pDate = new Date(2026, parseInt(mo) - 1, parseInt(d));
          return pDate >= today;
      });
  }, [selectedSport, today]);

  const nextEvent = SHOWS_DATA[0];

  useEffect(() => {
    if (!nextMatch) return;
    const updateCountdown = () => {
        const now = new Date();
        const [d, mo] = nextMatch.date.split('/');
        const target = new Date(2026, parseInt(mo) - 1, parseInt(d), 20, 0);
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
  }, [nextMatch]);

  // --- FIREBASE AUTH ---
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (err) {
        console.warn("Auth mode: Guest");
      }
    };
    initAuth();
    const unsubscribeAuth = onAuthStateChanged(auth, setUser);
    return () => unsubscribeAuth();
  }, []);

  // --- FIRESTORE SYNC ---
  useEffect(() => {
    if (!user) return;
    
    // Sincronizar Álbuns
    const albumsRef = collection(db, 'artifacts', appId, 'public', 'data', 'gallery');
    const unsubscribeAlbums = onSnapshot(albumsRef, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAlbums(docs);
      if (docs.length > 0 && !activeAlbumId) setActiveAlbumId(docs[0].id);
    });

    // Sincronizar Fotos (Individualmente)
    const photosRef = collection(db, 'artifacts', appId, 'public', 'data', 'photos');
    const unsubscribePhotos = onSnapshot(photosRef, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAllPhotos(docs);
    });

    return () => {
      unsubscribeAlbums();
      unsubscribePhotos();
    };
  }, [user, appId]);

  useEffect(() => {
    const itv = setInterval(() => setCurrentReviewIndex(p => (p + 1) % REVIEWS_DATA.length), 5000);
    return () => clearInterval(itv);
  }, []);

  // --- FUNÇÕES ADMIN ---
  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (btoa(adminInputPass) === ADMIN_HASH) {
      setToast("Acesso Admin Liberado");
      setIsAdmin(true);
      setTimeout(() => setToast(null), 3000);
      setIsLoginModalOpen(false);
    } else {
      setToast("Senha incorreta");
      setTimeout(() => setToast(null), 3000);
    }
  };

  const addAlbum = async () => {
    if (!newAlbumName || !user) return;
    try {
      const galleryRef = collection(db, 'artifacts', appId, 'public', 'data', 'gallery');
      await addDoc(galleryRef, { name: newAlbumName, createdAt: Date.now() });
      setNewAlbumName('');
      setIsAddingAlbum(false);
      setToast("Pasta criada!");
    } catch (e) {
      setToast("Erro ao criar pasta");
    }
  };

  const addPhoto = async () => {
    if (!newPhotoUrl || !activeAlbumId || !user) return;
    
    setIsUploading(true);
    try {
      // Comprimir antes de enviar
      const compressed = await compressImage(newPhotoUrl);
      
      // Criar um novo documento para esta foto
      const photosRef = collection(db, 'artifacts', appId, 'public', 'data', 'photos');
      await addDoc(photosRef, { 
        albumId: activeAlbumId, 
        url: compressed, 
        createdAt: Date.now() 
      });

      setNewPhotoUrl('');
      setIsAddingPhoto(false);
      setToast("Foto salva com sucesso!");
    } catch (e) {
      setToast("Erro ao guardar a foto");
      console.error(e);
    } finally {
      setIsUploading(false);
    }
  };

  const removePhoto = async (photoId) => {
    if (!window.confirm("Remover esta foto definitivamente?") || !user) return;
    try {
      await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'photos', photoId));
      setToast("Foto removida");
    } catch (e) {
      setToast("Erro ao remover");
    }
  };

  const deleteAlbum = async (id) => {
    if (!window.confirm("Atenção: Excluir a pasta não apagará as fotos individualmente no banco, mas elas deixarão de aparecer. Confirmar?") || !user) return;
    try {
      await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'gallery', id));
      setToast("Pasta excluída");
    } catch (e) {
      setToast("Erro ao excluir");
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setNewPhotoUrl(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleDownload = (url, albumName) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `ArenaHenko_${albumName || 'Galeria'}_${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setToast("Iniciando download...");
    setTimeout(() => setToast(null), 2000);
  };

  const getWaLink = (msg) => `https://wa.me/5511940741355?text=${encodeURIComponent(msg)}`;
  
  const currentAlbum = useMemo(() => albums.find(a => a.id === activeAlbumId), [albums, activeAlbumId]);
  const currentPhotos = useMemo(() => allPhotos.filter(p => p.albumId === activeAlbumId), [allPhotos, activeAlbumId]);

  return (
    <div className="font-sans text-white bg-black animate-fadeIn overflow-x-hidden scroll-smooth font-bold">
      <style>{`
        @keyframes customFadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-smooth { animation: customFadeIn 0.6s ease-out forwards; }
        @keyframes pulse-emerald { 0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); } 70% { box-shadow: 0 0 0 15px rgba(16, 185, 129, 0); } 100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); } }
        .animate-pulse-wa { animation: pulse-emerald 2s infinite; }
      `}</style>

      {/* Floating Elements */}
      <div className="fixed bottom-6 right-6 z-[250] flex flex-col items-end gap-3">
          <button onClick={() => window.open(getWaLink("Olá! Gostaria de falar com um consultor oficial da Arena Henko."))} className="w-16 h-16 bg-emerald-500 rounded-full shadow-2xl flex items-center justify-center animate-pulse-wa">
              <MessageCircle className="w-8 h-8 text-white fill-white" />
          </button>
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-[100] bg-black/60 backdrop-blur-xl border-b border-white/5 py-4 px-8 flex justify-between items-center">
        <div className="cursor-pointer" onClick={() => window.scrollTo({top:0, behavior:'smooth'})}><img src={LOGO_URL} alt="Logo" className="w-12 h-12 object-contain" /></div>
        <div className="hidden md:flex items-center gap-10 font-black uppercase text-[10px] tracking-widest text-white">
            {NAV_LINKS.map(link => <a key={link.name} href={link.href} className="hover:text-red-600 transition-all duration-300">{link.name}</a>)}
            <button onClick={() => setIsLoginModalOpen(true)} className={`p-2 rounded-full transition-colors ${isAdmin ? 'bg-red-600 text-white' : 'bg-white/5 hover:text-red-600'}`}><LockKeyhole className="w-5 h-5" /></button>
        </div>
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden text-red-600"><MenuIcon /></button>
      </nav>

      {/* Hero */}
      <section className="relative h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden font-black">
        <div className="absolute inset-0 z-0 opacity-40"><img src="https://i.imgur.com/lKKQfgK.png" className="w-full h-full object-cover" alt="Hero" /></div>
        <div className="relative z-10 w-full max-w-5xl">
          <h1 className="text-6xl md:text-[8rem] font-black mb-2 uppercase italic tracking-tighter text-white">ARENA <span className="text-red-600">HENKO</span></h1>
          <p className="text-gray-400 uppercase tracking-[0.4em] mb-12 text-sm md:text-lg font-light">Hospitalidade Premium & Experiências</p>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12">
            {nextMatch ? (
              <div onClick={() => window.open(getWaLink(`Interesse no jogo ${nextMatch.home} x ${nextMatch.away}`))} className="bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-3xl flex items-center gap-5 cursor-pointer text-left shadow-2xl">
                <div className="w-14 h-14 bg-neutral-900 rounded-2xl p-2 flex items-center justify-center border border-white/5"><img src={nextMatch.homeLogo} alt="Next" className="object-contain w-full h-full p-2" /></div>
                <div className="flex-1"><p className="text-red-500 text-[10px] font-bold uppercase tracking-widest mb-1 font-black"><Zap className="w-3 h-3 inline mr-1 fill-red-500" /> Próximo Jogo</p><h3 className="text-base font-bold uppercase truncate text-white">{nextMatch.home} x {nextMatch.away}</h3><div className="text-gray-500 text-[10px] font-mono">{timeLeft.d}d {timeLeft.h}h {timeLeft.m}m</div></div>
              </div>
            ) : null}
            <div onClick={() => window.open(getWaLink(`Interesse oficial no show do ${nextEvent.name}`))} className="bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-3xl flex items-center gap-5 hover:bg-white/10 transition-all cursor-pointer text-left group shadow-2xl">
              <div className="w-14 h-14 bg-neutral-900 rounded-2xl p-3 flex items-center justify-center text-red-500 shadow-xl border border-white/5"><Music className="w-7 h-7" /></div>
              <div className="flex-1 text-white font-black"><p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">Próximo Evento</p><h3 className="text-base font-black uppercase leading-none">{nextEvent.name}</h3><p className="text-red-600 text-[9px] font-mono mt-1">{nextEvent.date}</p></div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="bg-neutral-900/50 border-y border-white/5 py-8 font-black">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-center uppercase text-[10px] tracking-widest text-emerald-500">
            <div className="flex items-center justify-center gap-4"><ShieldCheck className="w-6 h-6" /> Canal Oficial</div>
            <div className="flex items-center justify-center gap-4"><CheckCircle className="w-6 h-6" /> Acesso Garantido</div>
            <div className="flex items-center justify-center gap-4"><Headphones className="w-6 h-6" /> Suporte VIP Credenciado</div>
        </div>
      </section>

      {/* Galeria de Fotos */}
      <section id="galeria" className="py-24 px-6 bg-black border-y border-white/5 font-black text-center">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-6">
            <h2 className="text-4xl md:text-6xl font-black uppercase italic text-white">Nossa <span className="text-red-600">Galeria</span></h2>
            <div className="flex flex-wrap gap-2 justify-center">
              {albums.map(album => (
                <div key={album.id} className="relative group">
                  <button onClick={() => setActiveAlbumId(album.id)} className={`px-6 py-3 rounded-full text-[10px] uppercase transition-all flex items-center gap-2 ${activeAlbumId === album.id ? 'bg-red-600 shadow-xl' : 'bg-neutral-900 text-gray-500'}`}>
                    <FolderOpen className="w-3 h-3" /> {album.name}
                  </button>
                  {isAdmin && <button onClick={() => deleteAlbum(album.id)} className="absolute -top-2 -right-2 bg-black border border-white/10 p-1 rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-3 h-3" /></button>}
                </div>
              ))}
              {isAdmin && <button onClick={() => setIsAddingAlbum(true)} className="px-6 py-3 rounded-full text-[10px] bg-white/5 text-emerald-500 border border-emerald-500/30 flex items-center gap-2 hover:bg-emerald-500/10 transition-all font-black"><Plus className="w-3 h-3" /> Nova Pasta</button>}
            </div>
          </div>
          <div className="min-h-[400px]">
            {currentAlbum ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {currentPhotos.map((photo, idx) => (
                  <div key={photo.id} className="group relative aspect-square rounded-[2rem] overflow-hidden border border-white/5 bg-neutral-900 shadow-xl">
                    <img src={photo.url} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="" />
                    
                    {/* Botões de Ação na Foto */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                       <button 
                         onClick={() => handleDownload(photo.url, currentAlbum?.name)}
                         className="bg-white/10 backdrop-blur-md p-4 rounded-2xl text-white hover:bg-red-600 hover:scale-110 transition-all shadow-2xl"
                         title="Baixar Foto"
                       >
                         <Download className="w-6 h-6" />
                       </button>
                       
                       {isAdmin && (
                         <button 
                           onClick={() => removePhoto(photo.id)} 
                           className="bg-black/60 backdrop-blur-md p-4 rounded-2xl text-red-500 hover:bg-red-600 hover:text-white hover:scale-110 transition-all shadow-2xl"
                           title="Remover Foto"
                         >
                           <Trash2 className="w-6 h-6" />
                         </button>
                       )}
                    </div>
                  </div>
                ))}
                {isAdmin && (
                  <button onClick={() => setIsAddingPhoto(true)} className="aspect-square rounded-[2rem] border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-4 text-gray-500 hover:border-red-600 hover:text-red-600 transition-all group font-black uppercase text-[10px]">
                    <Plus className="w-10 h-10" /> Adicionar Foto
                  </button>
                )}
              </div>
            ) : (
              <div className="py-20 text-center"><ImageIcon className="w-16 h-16 mx-auto mb-6 text-neutral-800" /><p className="text-gray-600 uppercase text-[10px]">Crie ou selecione uma pasta.</p></div>
            )}
            {currentAlbum && currentPhotos.length === 0 && !isAdmin && (
              <div className="py-20 text-center text-gray-600 uppercase text-[10px]">Esta pasta ainda não tem fotos.</div>
            )}
          </div>
        </div>
      </section>

      {/* Sobre, Agenda, Serviços... */}
      <section id="sobre" className="py-24 px-6 bg-neutral-950 border-y border-neutral-900 font-black text-center sm:text-left">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-red-600 text-xs uppercase tracking-[0.3em] mb-4 block">A Arena</span>
            <h2 className="text-5xl font-black uppercase mb-8 italic text-white leading-tight">Onde a emoção <br/>encontra o luxo.</h2>
            <p className="text-gray-400 text-lg mb-12 font-light leading-relaxed">Localizada no Morumbis, a Arena Henko oferece hospitalidade máxima e segurança total. Somos uma operação própria e oficial.</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
              <div><div className="flex items-center gap-1 mb-1 justify-center sm:justify-start font-black"><span className="text-4xl font-black text-emerald-500">4.9</span><Star className="w-5 h-5 text-emerald-500 fill-emerald-500" /></div><p className="text-[9px] uppercase tracking-widest text-gray-500 font-black">Google Rating</p></div>
              <div><h4 className="text-4xl font-black text-white">200+</h4><p className="text-[9px] uppercase tracking-widest text-gray-500 font-black">Reviews</p></div>
            </div>
          </div>
          <div className="grid gap-4 font-black">
             <div className="bg-neutral-900/40 p-6 rounded-2xl border border-neutral-800 flex gap-4 items-start shadow-xl group">
                <Shield className="text-red-600 w-8 h-8 shrink-0 group-hover:scale-110 transition-transform" />
                <div><h4 className="text-sm font-black uppercase italic text-white font-black">Operação Oficial</h4><p className="text-gray-500 text-xs mt-1 font-normal">Tratativa direta com o camarote. Sem intermediários.</p></div>
             </div>
          </div>
        </div>
      </section>

      {/* FAQ e Footer */}
      <footer id="contato" className="py-32 bg-neutral-950 border-t border-neutral-900 text-center font-black">
        <h2 className="text-5xl md:text-7xl font-black mb-20 uppercase italic text-white">Viva sua <br/><span className="text-red-600">ARENA HENKO.</span></h2>
        <div className="grid sm:grid-cols-3 gap-6 max-w-5xl mx-auto px-6 text-white uppercase text-[10px] tracking-widest mb-20 font-black">
            <a href="https://instagram.com/arenahenko" target="_blank" rel="noopener noreferrer" className="bg-black p-12 rounded-[2.5rem] border border-neutral-800 hover:border-red-600 transition-all flex flex-col items-center gap-5 shadow-2xl font-black"><Instagram className="text-red-600 w-10 h-10" /> Instagram</a>
            <a href="https://wa.me/5511940741355" target="_blank" rel="noopener noreferrer" className="bg-black p-12 rounded-[2.5rem] border border-neutral-800 hover:border-red-600 transition-all flex flex-col items-center gap-5 shadow-2xl font-black"><Phone className="text-red-600 w-10 h-10" /> WhatsApp</a>
            <a href="mailto:sergio@henkoproducoes.com.br" className="bg-black p-12 rounded-[2.5rem] border border-neutral-800 hover:border-red-600 transition-all flex flex-col items-center gap-5 shadow-2xl font-black"><Mail className="text-red-600 w-10 h-10" /> E-mail</a>
        </div>
        <img src={LOGO_URL} className="h-14 mx-auto opacity-30" alt="" />
      </footer>

      {/* Modais de Gerenciamento */}
      {isAddingAlbum && (
        <div className="fixed inset-0 z-[400] bg-black/95 backdrop-blur-xl flex items-center justify-center p-8">
          <div className="bg-neutral-900 border border-white/5 p-10 rounded-[3rem] w-full max-w-sm text-center">
            <h3 className="text-xl uppercase italic mb-8">Nome da <span className="text-red-600 font-black">Pasta</span></h3>
            <input type="text" value={newAlbumName} onChange={e => setNewAlbumName(e.target.value)} className="w-full bg-black border border-white/10 rounded-2xl p-5 mb-6 text-center outline-none font-black" placeholder="Ex: Show The Weeknd" />
            <div className="flex gap-4 font-black"><button onClick={() => setIsAddingAlbum(false)} className="flex-1 py-4 text-[10px] uppercase border border-white/10 rounded-2xl">Voltar</button><button onClick={addAlbum} className="flex-1 py-4 text-[10px] uppercase bg-red-600 rounded-2xl">Criar</button></div>
          </div>
        </div>
      )}

      {isAddingPhoto && (
        <div className="fixed inset-0 z-[400] bg-black/95 backdrop-blur-xl flex items-center justify-center p-8 font-black">
          <div className="bg-neutral-900 border border-white/5 p-10 rounded-[3rem] w-full max-w-sm text-center font-black">
            <h3 className="text-xl uppercase italic mb-8">Adicionar <span className="text-red-600">Foto</span></h3>
            {newPhotoUrl && <div className="mb-6 rounded-2xl overflow-hidden aspect-video border border-white/10"><img src={newPhotoUrl} className="w-full h-full object-cover" alt="" /></div>}
            
            {!newPhotoUrl ? (
              <label className="block w-full py-10 border-2 border-dashed border-white/10 rounded-3xl cursor-pointer hover:border-red-600 transition-all mb-6 font-black uppercase text-[10px]">
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                <Plus className="w-10 h-10 mx-auto mb-2 text-gray-500 font-black" />
                <span className="text-[10px] uppercase text-gray-500 font-black">Escolher Arquivo</span>
              </label>
            ) : (
              <div className="flex items-center gap-2 justify-center mb-6 text-emerald-500 text-[10px] uppercase font-black"><CheckCircle className="w-4 h-4" /> Foto pronta</div>
            )}

            {isUploading && (
              <div className="mb-6 flex flex-col items-center gap-3">
                <Loader2 className="w-8 h-8 text-red-600 animate-spin" />
                <span className="text-[10px] uppercase text-red-600 animate-pulse">A comprimir e enviar...</span>
              </div>
            )}

            <div className="flex gap-4 font-black"><button onClick={() => { setIsAddingPhoto(false); setNewPhotoUrl(''); }} className="flex-1 py-4 text-[10px] uppercase border border-white/10 rounded-2xl">Voltar</button><button onClick={addPhoto} className="flex-1 py-4 text-[10px] uppercase bg-red-600 rounded-2xl disabled:opacity-30" disabled={!newPhotoUrl || isUploading}>{isUploading ? 'A enviar...' : 'Salvar'}</button></div>
          </div>
        </div>
      )}

      {/* Login Modal */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-[300] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-8">
          <div className="bg-neutral-900 border border-neutral-800 p-12 rounded-[3rem] w-full max-w-sm shadow-3xl text-center">
            <h2 className="text-xl uppercase mb-8 italic text-white font-black">Painel <span className="text-red-600 font-black">Admin</span></h2>
            <form onSubmit={handleAdminLogin}>
              <input type="password" placeholder="Senha" value={adminInputPass} onChange={(e) => setAdminInputPass(e.target.value)} className="w-full bg-black border border-neutral-800 rounded-2xl px-8 py-5 mb-6 text-white focus:outline-none focus:border-red-600 text-center tracking-widest font-black" />
              <div className="flex gap-4 font-black"><button type="button" onClick={() => setIsLoginModalOpen(false)} className="flex-1 py-4 text-[10px] uppercase border border-neutral-800 rounded-2xl">Voltar</button><button type="submit" className="flex-1 py-4 text-[10px] uppercase bg-red-600 rounded-2xl text-white">Entrar</button></div>
            </form>
          </div>
        </div>
      )}
      {toast && <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[500] bg-red-600 text-white px-10 py-4 rounded-full font-black text-[10px] uppercase tracking-widest animate-bounce flex items-center gap-2"><AlertTriangle className="w-4 h-4" /> {toast}</div>}
    </div>
  );
};

export default App;
