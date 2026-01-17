import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Camera, User, Mic, Settings, Send, MapPin, Music } from 'lucide-react';

// --- COMPONENTI INTERNI ---

// 1. Schermata di Login (Simulata per ora)
const LoginScreen = ({ onLogin }) => (
  <div className="flex flex-col items-center justify-center h-screen bg-slate-950 text-white p-6">
    <div className="mb-8 text-center">
      <h1 className="text-4xl font-bold text-amber-500 mb-2 tracking-tighter">GENESI</h1>
      <p className="text-slate-400 text-sm uppercase tracking-widest">Lounge Bar & Live</p>
    </div>
    
    <div className="w-full max-w-sm space-y-3">
      <p className="text-center text-slate-500 mb-4">Seleziona il tuo ruolo (Demo)</p>
      <button onClick={() => onLogin('client')} className="w-full py-4 bg-gradient-to-r from-amber-600 to-amber-700 rounded-xl font-bold shadow-lg shadow-amber-900/20 active:scale-95 transition-transform">
        Entra come CLIENTE
      </button>
      <div className="grid grid-cols-2 gap-3">
        <button onClick={() => onLogin('staff')} className="py-3 bg-slate-800 rounded-xl border border-slate-700 text-slate-300 font-medium hover:bg-slate-700">
          Staff / Vocalist
        </button>
        <button onClick={() => onLogin('admin')} className="py-3 bg-slate-800 rounded-xl border border-slate-700 text-slate-300 font-medium hover:bg-slate-700">
          Gestore
        </button>
      </div>
    </div>
  </div>
);

// 2. Interfaccia Chat (Main Room)
const ChatInterface = ({ role }) => {
  const [messages, setMessages] = useState([
    { id: 1, user: 'Marco', text: 'Che serata ragazzi! 🔥', time: '22:30', isStaff: false },
    { id: 2, user: 'DJ Set', text: 'Tra 5 minuti inizia il contest!', time: '22:32', isStaff: true },
    { id: 3, user: 'Giulia', text: 'Qualcuno al tavolo 4?', time: '22:35', isStaff: false },
  ]);
  const [inputText, setInputText] = useState('');
  const scrollRef = useRef(null);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    
    // Simulazione invio (in seguito useremo Firebase)
    const newMsg = {
      id: messages.length + 1,
      user: role === 'staff' ? 'Staff Genesi' : 'Io',
      text: inputText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isStaff: role === 'staff'
    };
    
    setMessages([...messages, newMsg]);
    setInputText('');
  };

  useEffect(() => {
    if(scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-slate-900">
      {/* Header Chat */}
      <div className="p-4 bg-slate-950/90 backdrop-blur-md sticky top-0 z-10 border-b border-slate-800 flex justify-between items-center">
        <div>
          <h2 className="text-amber-500 font-bold text-lg">Main Room</h2>
          <span className="text-xs text-green-400 flex items-center gap-1">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> 42 Online
          </span>
        </div>
        {role === 'staff' && <div className="bg-red-500 text-white text-xs px-2 py-1 rounded font-bold">ON AIR</div>}
      </div>

      {/* Lista Messaggi */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col ${msg.user === 'Io' ? 'items-end' : 'items-start'}`}>
            <div className={`max-w-[80%] rounded-2xl p-3 ${
              msg.isStaff 
                ? 'bg-amber-500/10 border border-amber-500/50 text-amber-100' 
                : msg.user === 'Io' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-slate-800 text-slate-200'
            }`}>
              <div className="flex justify-between items-baseline gap-2 mb-1">
                <span className={`text-xs font-bold ${msg.isStaff ? 'text-amber-500' : 'text-slate-400'}`}>
                  {msg.user} {msg.isStaff && '👑'}
                </span>
              </div>
              <p className="text-sm leading-relaxed">{msg.text}</p>
            </div>
            <span className="text-[10px] text-slate-600 mt-1 px-1">{msg.time}</span>
          </div>
        ))}
      </div>

      {/* Input Bar */}
      <form onSubmit={sendMessage} className="p-3 bg-slate-950 border-t border-slate-800 flex gap-2">
        <input 
          type="text" 
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Scrivi qualcosa..." 
          className="flex-1 bg-slate-900 text-white rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500 border border-slate-800"
        />
        <button type="submit" className="bg-amber-600 p-3 rounded-full text-white hover:bg-amber-700 transition-colors">
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};

// 3. Bottom Navigation (Menu Clienti)
const BottomNav = ({ activeTab, setActiveTab }) => (
  <div className="bg-slate-950 border-t border-slate-800 p-2 pb-4 flex justify-around items-center sticky bottom-0">
    <button onClick={() => setActiveTab('chat')} className={`p-2 flex flex-col items-center ${activeTab === 'chat' ? 'text-amber-500' : 'text-slate-500'}`}>
      <MessageSquare size={24} />
      <span className="text-[10px] mt-1">Chat</span>
    </button>
    <button onClick={() => setActiveTab('gallery')} className={`p-2 flex flex-col items-center ${activeTab === 'gallery' ? 'text-amber-500' : 'text-slate-500'}`}>
      <Camera size={24} />
      <span className="text-[10px] mt-1">Gallery</span>
    </button>
    <button onClick={() => setActiveTab('profile')} className={`p-2 flex flex-col items-center ${activeTab === 'profile' ? 'text-amber-500' : 'text-slate-500'}`}>
      <User size={24} />
      <span className="text-[10px] mt-1">Profilo</span>
    </button>
  </div>
);

// --- APP MAIN COMPONENT ---

export default function App() {
  const [role, setRole] = useState(null); // null, 'client', 'staff', 'admin'
  const [activeTab, setActiveTab] = useState('chat');

  // Se non c'è ruolo, mostra login
  if (!role) {
    return <LoginScreen onLogin={setRole} />;
  }

  // Layout GESTORE
  if (role === 'admin') {
    return (
      <div className="h-screen bg-slate-900 text-white p-6">
        <h1 className="text-2xl font-bold text-amber-500 mb-6">Admin Dashboard</h1>
        <div className="grid grid-cols-1 gap-4">
          <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
            <h3 className="text-lg font-bold mb-2">Comandi Serata</h3>
            <button className="w-full bg-red-600 py-3 rounded-lg font-bold mb-2">Resetta Chat</button>
            <button className="w-full bg-green-600 py-3 rounded-lg font-bold">Attiva Happy Hour</button>
          </div>
          <button onClick={() => setRole(null)} className="mt-4 text-slate-400 underline">Logout</button>
        </div>
      </div>
    );
  }

  // Layout STAFF (Vocalist/Barman)
  if (role === 'staff') {
    return (
      <div className="h-screen flex flex-col bg-black text-white">
        <div className="p-4 bg-amber-900/20 border-b border-amber-900/50">
          <h1 className="text-xl font-bold text-amber-500 flex items-center gap-2">
            <Mic size={20} /> Modalità Vocalist
          </h1>
        </div>
        <div className="flex-1 overflow-hidden">
          <ChatInterface role="staff" />
        </div>
        <button onClick={() => setRole(null)} className="p-4 bg-slate-900 text-center text-slate-500 text-sm">Esci</button>
      </div>
    );
  }

  // Layout CLIENTE (Default)
  return (
    <div className="h-screen flex flex-col bg-slate-950 overflow-hidden font-sans">
      <div className="flex-1 overflow-hidden relative">
        {activeTab === 'chat' && <ChatInterface role="client" />}
        
        {activeTab === 'gallery' && (
          <div className="h-full flex flex-col items-center justify-center text-slate-500">
            <Camera size={48} className="mb-4 opacity-50" />
            <p>Galleria in arrivo...</p>
          </div>
        )}
        
        {activeTab === 'profile' && (
          <div className="h-full flex flex-col items-center justify-center text-slate-500">
            <User size={48} className="mb-4 opacity-50" />
            <p>Il tuo Wallet e Punti</p>
            <button onClick={() => setRole(null)} className="mt-8 px-6 py-2 bg-slate-800 rounded-full">Logout</button>
          </div>
        )}
      </div>
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}
