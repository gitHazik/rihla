import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bookmark, Quote, Loader2, Volume2, Play, Pause } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function SavedVerses() {
  const navigate = useNavigate();
  const [verses, setVerses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Audio Player State
  const [activeAudioId, setActiveAudioId] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    fetchSavedVerses();
    return () => { if (audioRef.current) audioRef.current.pause(); };
  }, []);

  const fetchSavedVerses = async () => {
    const { data, error } = await supabase
      .from('saved_verses')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (!error && data) {
      setVerses(data);
    }
    setLoading(false);
  };

  const toggleAudio = async (reference, verseId) => {
    if (activeAudioId === verseId && audioRef.current) {
      if (isPlaying) { audioRef.current.pause(); setIsPlaying(false); } 
      else { audioRef.current.play(); setIsPlaying(true); }
      return;
    }

    if (audioRef.current) audioRef.current.pause();

    setActiveAudioId(verseId);
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

  return (
    <div className="flex flex-col h-full bg-parchment text-walnut overflow-y-auto">
      <header className="flex items-center gap-4 p-4 border-b-2 border-walnut/10 bg-white shadow-sm sticky top-0 z-10">
        <button onClick={() => navigate('/')} className="p-1 hover:bg-parchment rounded-lg transition-colors">
          <ArrowLeft size={22} />
        </button>
        <div>
          <h2 className="font-bold text-lg leading-tight flex items-center gap-1.5">
            <Bookmark size={18} className="text-primary fill-primary/20" /> My Saved Ayahs
          </h2>
          <p className="text-xs text-walnut/60">Verses that spoke to your heart</p>
        </div>
      </header>

      <div className="p-4 space-y-5 pb-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-primary">
            <Loader2 className="animate-spin mb-2" size={32} />
            <p className="text-sm font-bold text-walnut/60">Opening your vault...</p>
          </div>
        ) : verses.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="w-20 h-20 bg-white border-2 border-walnut/20 rounded-3xl flex items-center justify-center mx-auto mb-5 shadow-sm">
              <Bookmark size={32} className="text-walnut/30" />
            </div>
            <h3 className="font-bold text-xl mb-2 tracking-tight">Your vault is empty</h3>
            <p className="text-sm text-walnut/60 max-w-[250px] mx-auto leading-relaxed">
              Use the MoodChat to find comfort, then click 'Save' to bookmark verses here for later.
            </p>
            <button 
              onClick={() => navigate('/mood')}
              className="mt-6 font-bold text-sm bg-primary text-white px-6 py-3 rounded-xl border-2 border-walnut shadow-[2px_2px_0px_0px_var(--color-walnut)] active:shadow-none active:translate-y-0.5 transition-all"
            >
              Go to MoodChat
            </button>
          </div>
        ) : (
          verses.map((verse) => (
            <div key={verse.id} className="bg-white border-2 border-walnut rounded-2xl p-5 shadow-[4px_4px_0px_0px_hsl(20,10%,20%)] relative mt-4">
              <div className="absolute -top-3 left-4 bg-primary text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border-2 border-walnut shadow-sm">
                When you felt: "{verse.feeling}"
              </div>

              <Quote size={24} className="text-primary/10 absolute top-5 right-5 fill-primary/10" />

              <div className="mt-4 space-y-3">
                <p className="text-right text-xl font-serif tracking-wide text-walnut font-bold leading-loose">
                  {verse.arabic}
                </p>
                <p className="text-sm italic text-walnut/80 font-medium border-l-2 border-primary/40 pl-3">
                  "{verse.translation}"
                </p>
                
                <div className="flex items-center justify-between pt-3 mt-2 border-t border-walnut/10">
                  <p className="text-[10px] uppercase tracking-widest font-bold text-primary">
                    {verse.reference}
                  </p>
                  <button 
                    onClick={() => toggleAudio(verse.reference, verse.id)}
                    className={`flex items-center gap-1.5 text-[10px] uppercase font-bold transition-colors bg-parchment px-3 py-1.5 rounded-lg border border-walnut/20
                      ${activeAudioId === verse.id ? 'text-primary border-primary/50' : 'text-walnut/70 hover:text-primary hover:border-primary/50'}`}
                  >
                    {activeAudioId === verse.id && isPlaying ? (
                      <><Pause size={14} className="fill-primary" /> Pause</>
                    ) : activeAudioId === verse.id && !isPlaying ? (
                      <><Play size={14} className="fill-primary" /> Resume</>
                    ) : (
                      <><Volume2 size={14} /> Listen</>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}