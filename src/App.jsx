import React, { useState, useEffect, useRef } from 'react';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, doc, updateDoc, increment, getDoc, setDoc } from 'firebase/firestore';
import { getAuth, signInAnonymously, onAuthStateChanged, signOut } from 'firebase/auth';
import { MessageSquare, User, Mic, Send, Music, Gift, Trophy, LogOut, Settings, Crown, Zap } from 'lucide-react';

// --- CONFIGURAZIONE FIREBASE (TUE CHIAVI) ---
const firebaseConfig = {
  apiKey: "AIzaSyCW-aNijrzu_ayV3OUgPIrgwxZ8xKJpnn8",
  authDomain: "gen2-4855a.firebaseapp.com",
  projectId: "gen2-4855a",
  storageBucket: "gen2-4855a.firebasestorage.app",
  messagingSenderId: "274630926466",
  appId: "1:274630926466:web:b70adaa8db64ded4d7549b",
  measurementId: "G-XZ5NKDVZZW"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// --- COMPONENTI UI ---

// 1. Schermata di Benvenuto (LOGIN)
const WelcomeScreen = ({ onEnter }) => (
  <div className="h-screen w-full flex flex-col items-center justify-center bg-[url('https://images.unsplash.com/photo-1574096079513-d8259312b785?q=80&w=2668&auto=format&fit=crop')] bg-cover bg-center relative overflow-hidden">
    {/* Overlay scuro */}
    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-0"></div>
    
    <div className="z-10 text-center px-6 animate-fade-in w-full max-w-md">
      <div className="mb-6 inline-block p-4 rounded-full border-2 border-amber-500/30 bg-black/50 shadow-[0_0_30px_rgba(245,158,11,0.3)]">
        <Crown size={48} className="text-amber-500" />
      </div>
      <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 mb-2 tracking-tighter drop-shadow-sm">
        GENESI
      </h1>
      <p className="text-slate-300 text-xs font-bold uppercase tracking-[0.4em] mb-12">Lounge & Experience</p>

      <div className="space-y-4">
        <button 
          onClick={() => onEnter('client')}
          className="w-full py-4 bg-gradient-to-r from-amber-600 to-amber-800 rounded-xl font-bold text-white shadow-lg shadow-amber-900/40 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <Zap size={20} fill="currentColor" /> ENTRA NEL PARTY
        </button>

        <div className="flex gap-3">
          <button onClick={() => onEnter('staff')} className="flex-1 py-3 bg-slate-900/80 backdrop-blur border border-slate-700 rounded-xl text-slate-400 text-xs font-bold hover:bg-slate-800 hover:text-white transition-colors">
            STAFF
          </button>
          <button onClick={() => onEnter('admin')} className="flex-1 py-3 bg-slate-900/80 backdrop-blur border border-slate-700 rounded-xl text-slate-400 text-xs font-bold hover:bg-slate-800 hover:text-white transition-colors">
            GESTIONE
          </button>
        </div>
      </div>
    </div>
    
    <div className="absolute bottom-6 text-slate-600 text-[10px]">Genesi Lounge App v2.0</div>
  </div>
);

// 2. Chat Component
const ChatRoom = ({ userRole, userName }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("createdAt", "asc")); // Rimosso limit per test
    const unsub = onSnapshot(q, (snap) => {
      setMessages(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    await addDoc(collection(db, "messages"), {
      text: input,
      user: userName,
      role: userRole,
      createdAt: serverTimestamp()
    });
    setInput('');
  };

  return (
    <div className="flex flex-col h-full bg-slate-950">
      <div className="p-4 bg-slate-900/90 backdrop-blur border-b border-slate-800 sticky top-0 z-10 flex justify-between items-center shadow-lg">
        <div>
          <h2 className="text-amber-500 font-bold text-lg">Main Room</h2>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Live Party
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
        {messages.map((msg) => {
          const isMe = msg.user === userName;
          const isStaff = msg.role === 'staff' || msg.role === 'admin';
          return (
            <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} animate-fade-in`}>
              <div className={`max-w-[85%] rounded-2xl px-4 py-2 ${
                isStaff 
                ? 'bg-gradient-to-r from-amber-900/80 to-amber-800/80 border border-amber-500/30 text-amber-100' 
                : isMe 
                  ? 'bg-slate-700 text-white' 
                  : 'bg-slate-800 text-slate-200'
              } shadow-md`}>
                {!isMe && (
                  <div className={`text-[10px] font-bold uppercase mb-1 ${isStaff ? 'text-amber-400' : 'text-slate-500'}`}>
                    {msg.user} {isStaff && '👑'}
                  </div>
                )}
                <p className="text-sm leading-relaxed">{msg.text}</p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={send} className="p-3 bg-slate-950 border-t border-slate-800 flex gap-2">
        <input 
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Scrivi un messaggio..."
          className="flex-1 bg-slate-900 text-white rounded-full px-5 py-3 border border-slate-800 focus:border-amber-500 focus:outline-none transition-colors"
        />
        <button type="submit" className="bg-amber-600 w-12 h-12 rounded-full flex items-center justify-center text-white hover:bg-amber-500 shadow-lg shadow-amber-900/20 active:scale-90 transition-all">
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};

// 3. Attività e Giochi (NUOVA SEZIONE)
const ActivityCenter = ({ userId }) => {
  const [activePoll, setActivePoll] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [spinResult, setSpinResult] = useState(null);

  // Ascolta sondaggi attivi
  useEffect(() => {
    const unsub = onSnapshot(doc(db, "games", "poll"), (doc) => {
      if(doc.exists()) setActivePoll(doc.data());
    });
    return () => unsub();
  }, []);

  const handleVote = async (optionIndex) => {
    if(hasVoted) return;
    setHasVoted(true);
    // Nota: in produzione servirebbe logica server-side per contare atomicamente
    // Qui simuliamo solo lato client per feedback immediato
  };

  const spinWheel = () => {
    // Simulazione semplice
    const outcomes = ["Ritenta 😢", "Shot Omaggio! 🥃", "Ritenta 😢", "Sconto 10% 🍹", "Ritenta 😢"];
    const result = outcomes[Math.floor(Math.random() * outcomes.length)];
    setSpinResult("Giro...");
    setTimeout(() => setSpinResult(result), 1500);
  };

  return (
    <div className="h-full bg-slate-950 p-4 overflow-y-auto no-scrollbar pb-20">
      <h2 className="text-2xl font-bold text-white mb-6">Attività Serata</h2>

      {/* Sezione Sondaggio Musicale */}
      <div className="mb-6 bg-slate-900 rounded-2xl p-5 border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400"><Music size={24} /></div>
          <div>
            <h3 className="font-bold text-lg">Prossimo Genere?</h3>
            <p className="text-slate-500 text-xs">Vota cosa deve suonare il DJ</p>
          </div>
        </div>
        
        <div className="space-y-3">
          {["Reggaeton", "House 90s", "Commerciale"].map((genre, idx) => (
            <button 
              key={idx}
              onClick={() => handleVote(idx)}
              disabled={hasVoted}
              className={`w-full p-3 rounded-xl text-left flex justify-between items-center transition-all ${hasVoted ? 'bg-slate-800 opacity-50' : 'bg-slate-800 hover:bg-slate-700 hover:border-purple-500 border border-transparent'}`}
            >
              <span className="font-medium text-slate-300">{genre}</span>
              {hasVoted && <span className="text-purple-400 text-xs">Votato</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Ruota della Fortuna */}
      <div className="bg-gradient-to-br from-amber-900/20 to-slate-900 rounded-2xl p-6 border border-amber-500/20 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 p-3 opacity-10"><Trophy size={100} /></div>
        <h3 className="font-bold text-xl text-amber-500 mb-2">Genesi Wheel</h3>
        <p className="text-slate-400 text-sm mb-6">Gira la ruota e prova a vincere un drink!</p>
        
        <div className="h-32 flex items-center justify-center mb-6">
           <div className="text-2xl font-bold text-white bg-black/40 px-6 py-4 rounded-xl border border-amber-500/50 min-w-[200px]">
             {spinResult || "Pronto?"}
           </div>
        </div>

        <button 
          onClick={spinWheel}
          disabled={!!spinResult}
          className="w-full py-3 bg-amber-600 rounded-xl font-bold text-white shadow-lg active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all"
        >
          {spinResult ? "Torna domani" : "GIRA ORA"}
        </button>
      </div>
    </div>
  );
};

// 4. Admin Dashboard Semplificata
const AdminPanel = ({ onLogout }) => {
  const sendAlert = async () => {
    const text = prompt("Testo dell'annuncio:");
    if(text) {
      await addDoc(collection(db, "messages"), {
        text: `📢 ANNUNCIO: ${text}`,
        user: "GENESI",
        role: "admin",
        createdAt: serverTimestamp()
      });
    }
  };

  return (
    <div className="h-screen bg-slate-950 p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-amber-500">Gestione Genesi</h1>
        <button onClick={onLogout} className="p-2 bg-slate-800 rounded-lg"><LogOut size={20}/></button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button onClick={sendAlert} className="p-6 bg-slate-900 rounded-xl border border-slate-700 flex flex-col items-center gap-2 hover:bg-slate-800">
          <Mic size={32} className="text-red-500" />
          <span className="font-bold">Annuncio Chat</span>
        </button>
        <button className="p-6 bg-slate-900 rounded-xl border border-slate-700 flex flex-col items-center gap-2 hover:bg-slate-800 opacity-50">
          <Music size={32} className="text-purple-500" />
          <span className="font-bold">Reset Sondaggio</span>
        </button>
      </div>
    </div>
  );
};

// --- APP PRINCIPALE (Gestione Navigazione) ---
export default function App() {
  const [user, setUser] = useState(null); // { role, name, uid }
  const [tab, setTab] = useState('chat'); // 'chat' | 'games' | 'profile'

  // Gestione Login / Logout
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (!u) setUser(null);
    });
    return () => unsub();
  }, []);

  const handleLogin = async (role) => {
    try {
      await signInAnonymously(auth);
      // Assegniamo un nome casuale temporaneo
      const randomName = role === 'staff' ? 'Staff' : role === 'admin' ? 'Admin' : `Ospite-${Math.floor(Math.random()*1000)}`;
      setUser({ role, name: randomName });
    } catch (e) {
      console.error(e);
      alert("Errore connessione Firebase");
    }
  };

  // Render condizionale
  if (!user) return <WelcomeScreen onEnter={handleLogin} />;
  if (user.role === 'admin') return <AdminPanel onLogout={() => signOut(auth)} />;

  return (
    <div className="h-screen w-full flex flex-col bg-slate-950 text-white overflow-hidden">
      
      {/* Contenuto Principale */}
      <div className="flex-1 overflow-hidden relative">
        {tab === 'chat' && <ChatRoom userRole={user.role} userName={user.name} />}
        {tab === 'games' && <ActivityCenter userId={user.name} />}
        {tab === 'profile' && (
          <div className="h-full flex flex-col items-center justify-center p-6 text-center">
            <div className="w-24 h-24 rounded-full bg-slate-900 border-2 border-amber-500 flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
              <User size={40} className="text-amber-500" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">{user.name}</h2>
            <p className="text-slate-500 mb-8">Livello: Party Starter</p>
            <button onClick={() => signOut(auth)} className="px-6 py-2 bg-slate-800 rounded-full text-sm font-bold text-red-400">
              Esci dal locale
            </button>
          </div>
        )}
      </div>

      {/* Barra di Navigazione (Stile iOS/Android) */}
      <div className="h-20 bg-slate-950 border-t border-slate-800 flex justify-around items-center px-2 pb-2 shadow-[0_-5px_20px_rgba(0,0,0,0.5)] z-20">
        <NavButton icon={MessageSquare} label="Chat" active={tab === 'chat'} onClick={() => setTab('chat')} />
        <NavButton icon={Gift} label="Attività" active={tab === 'games'} onClick={() => setTab('games')} />
        <NavButton icon={User} label="Profilo" active={tab === 'profile'} onClick={() => setTab('profile')} />
      </div>
    </div>
  );
}

// Bottone Navigazione Custom
const NavButton = ({ icon: Icon, label, active, onClick }) => (
  <button 
    onClick={onClick} 
    className={`flex-1 flex flex-col items-center justify-center h-full gap-1 transition-all duration-300 ${active ? 'text-amber-500 translate-y-[-2px]' : 'text-slate-600'}`}
  >
    <Icon size={24} strokeWidth={active ? 2.5 : 2} />
    <span className="text-[10px] font-medium tracking-wide">{label}</span>
  </button>
);
