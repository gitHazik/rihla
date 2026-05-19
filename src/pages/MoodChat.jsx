import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Sparkles, Bookmark, Volume2, Pause, Play } from 'lucide-react';
import { recordDailyActivity } from '../lib/streak';
import { supabase } from '../lib/supabase';

export default function MoodChat() {
  const navigate = useNavigate();
  const chatEndRef = useRef(null);
  
  const [messages, setMessages] = useState([]); 
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  // Media Player State
  const [activeAudioId, setActiveAudioId] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const suggestedPrompts = [
    "I feel overwhelmed with work.",
    "I am anxious about my future.",
    "I need a reminder to be patient.",
    "I am feeling grateful today."
  ];

  // Cleanup audio when leaving the page
  useEffect(() => {
    return () => { if (audioRef.current) audioRef.current.pause(); };
  }, []);

  const toggleAudio = async (reference, msgId) => {
    if (activeAudioId === msgId && audioRef.current) {
      if (isPlaying) { audioRef.current.pause(); setIsPlaying(false); } 
      else { audioRef.current.play(); setIsPlaying(true); }
      return;
    }

    if (audioRef.current) audioRef.current.pause();

    setActiveAudioId(msgId);
    setIsPlaying(true);

    // BULLETPROOF REGEX: Extract the text inside the brackets, then grab the first two numbers
    const bracketMatch = reference.match(/\[(.*?)\]/);
    if (!bracketMatch) {
      setActiveAudioId(null); setIsPlaying(false);
      return;
    }

    const numbers = bracketMatch[1].match(/\d+/g);
    if (!numbers || numbers.length < 2) {
      setActiveAudioId(null); setIsPlaying(false);
      return;
    }
    
    const ayahKey = `${numbers[0]}:${numbers[1]}`;

    try {
      const res = await fetch(`https://api.alquran.cloud/v1/ayah/${ayahKey}/ar.alafasy`);
      const json = await res.json();
      
      if (json.data && json.data.audio) {
        audioRef.current = new Audio(json.data.audio);
        audioRef.current.onended = () => { setIsPlaying(false); setActiveAudioId(null); };
        await audioRef.current.play();
      }
    } catch (error) {
      console.error("Audio Error:", error);
      setActiveAudioId(null); setIsPlaying(false);
    }
  };

  const sendMessage = async (textToProcess) => {
    if (!textToProcess.trim() || isTyping) return;

    const userMessage = { id: Date.now(), sender: 'user', text: textToProcess };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    
    recordDailyActivity();

    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat-groq`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}` 
        },
        body: JSON.stringify({ messages: [{ role: "user", content: textToProcess }] })
      });

      const data = await response.json();
      const aiResponse = JSON.parse(data.reply);

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'bot',
          text: aiResponse.message,
          verse: aiResponse.verse,
          suggestedPath: aiResponse.suggestedPath,
          originalPrompt: textToProcess
        }
      ]);
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages((prev) => [...prev, { id: Date.now() + 1, sender: 'bot', text: "Please try again." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  return (
    <div className="flex flex-col h-full bg-parchment text-walnut">
      <header className="flex items-center gap-4 p-4 border-b-2 border-walnut/10 bg-white shadow-sm">
        <button onClick={() => navigate('/')} className="p-1 hover:bg-parchment rounded-lg transition-colors">
          <ArrowLeft size={22} />
        </button>
        <div>
          <h2 className="font-bold text-lg leading-tight flex items-center gap-1.5">
            <Sparkles size={18} className="text-primary" /> MoodQuran Chat
          </h2>
          <p className="text-xs text-walnut/60">Powered by Groq</p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-5 pb-10 mt-8">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center border-2 border-primary/20 shadow-sm">
              <Sparkles size={32} className="text-primary" />
            </div>
            <div className="text-center space-y-2 mb-2">
              <p className="font-extrabold text-walnut text-2xl tracking-tight">Spiritual Companion</p>
              <p className="text-sm text-walnut/70 max-w-[260px] mx-auto leading-relaxed font-medium">
                How is your heart today? Select a prompt below or type your own feeling.
              </p>
            </div>
            <div className="flex flex-wrap gap-2.5 justify-center max-w-[320px]">
              {suggestedPrompts.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(prompt)}
                  className="text-xs font-bold px-4 py-2.5 rounded-full border-2 border-walnut/10 bg-white text-walnut/80 hover:bg-primary/10 hover:border-primary/30 hover:text-primary transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,0.05)] active:translate-y-0.5 active:shadow-none"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
            <div className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed border-2 border-walnut ${msg.sender === 'user' ? 'bg-walnut text-parchment rounded-br-none shadow-[2px_2px_0px_0px_rgba(0,0,0,0.15)]' : 'bg-white text-walnut rounded-bl-none shadow-[2px_2px_0px_0px_var(--color-walnut)]'}`}>
              <p>{msg.text}</p>
              
              {msg.verse && (
                <div className="mt-4 pt-3 border-t border-walnut/10 space-y-2 bg-parchment/40 p-2.5 rounded-xl">
                  <div className="flex justify-between items-center mb-2 pb-2 border-b border-walnut/10">
                    
                    <button onClick={() => toggleAudio(msg.verse.reference, msg.id)} className={`flex items-center gap-1.5 text-[10px] uppercase font-bold transition-colors w-[80px] ${activeAudioId === msg.id ? 'text-primary' : 'text-walnut/50 hover:text-primary'}`}>
                      {activeAudioId === msg.id && isPlaying ? <><Pause size={14} className="fill-primary" /> Pause</> : activeAudioId === msg.id && !isPlaying ? <><Play size={14} className="fill-primary" /> Resume</> : <><Volume2 size={14} /> Listen</>}
                    </button>
                    
                    <button 
                      onClick={async (e) => {
                        const btn = e.currentTarget;
                        btn.innerHTML = 'Saving...';
                        btn.classList.add('text-primary'); 
                        
                        try {
                          const { data: { user } } = await supabase.auth.getUser();
                          const payload = {
                            arabic: msg.verse.arabic,
                            translation: msg.verse.translation,
                            reference: msg.verse.reference,
                            feeling: msg.originalPrompt || "Felt overwhelmed"
                          };
                          
                          if (user) payload.user_id = user.id;

                          await supabase.from('saved_verses').insert([payload]);
                          btn.innerHTML = 'Saved!';
                        } catch (err) {
                          btn.innerHTML = 'Error';
                        }
                      }} 
                      className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-walnut/50 hover:text-primary transition-colors"
                    >
                      <Bookmark size={14} /> Save
                    </button>
                  </div>

                  <p className="text-right text-lg font-serif tracking-wide text-walnut font-bold leading-loose">{msg.verse.arabic}</p>
                  <p className="text-xs italic text-walnut/80 font-medium">"{msg.verse.translation}"</p>
                  <p className="text-[10px] uppercase tracking-wider font-bold text-primary mt-1">{msg.verse.reference}</p>
                </div>
              )}

              {msg.suggestedPath && (
                <button onClick={() => navigate('/paths')} className="mt-3 w-full bg-primary hover:bg-primary/90 text-white font-bold text-xs py-2 px-3 rounded-xl border border-walnut transition-all flex items-center justify-center gap-1 shadow-[2px_2px_0px_0px_var(--color-walnut)]">
                  Enter '{msg.suggestedPath}' Pathway →
                </button>
              )}
            </div>
          </div>
        ))}
        {isTyping && <div className="flex items-center gap-1 bg-white border border-walnut px-4 py-3 rounded-full rounded-bl-none text-xs text-walnut/60 font-bold w-max animate-pulse shadow-sm">Consulting scripture...</div>}
        <div ref={chatEndRef} />
      </div>

      <form onSubmit={handleFormSubmit} className="p-4 bg-white border-t-2 border-walnut/10 flex gap-2 items-center">
        <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Share your current emotion or distress..." className="flex-1 bg-parchment border-2 border-walnut rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary font-medium transition-colors" />
        <button type="submit" disabled={!input.trim() || isTyping} className="p-3 bg-primary disabled:bg-primary/50 hover:bg-primary/90 text-white rounded-xl border-2 border-walnut shadow-[2px_2px_0px_0px_var(--color-walnut)] active:shadow-none active:translate-y-0.5 transition-all">
          <Send size={18} strokeWidth={2.5} />
        </button>
      </form>
    </div>
  );
}