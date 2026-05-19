import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Map, Flame, Bookmark } from 'lucide-react';
import { getStreakData } from '../lib/streak'; 

export default function Dashboard() {
  const navigate = useNavigate();
  const [streakData, setStreakData] = useState({ streak: 0, lastActive: null });

  // Load the streak when the dashboard mounts
  useEffect(() => {
    setStreakData(getStreakData());
  }, []);

  // --- DYNAMIC CALENDAR LOGIC ---
  const today = new Date();
  const todayStr = today.toLocaleDateString('en-CA');
  const isTodayActive = streakData.lastActive === todayStr;
  const activeCount = Math.min(streakData.streak, 7); // Cap visual streak at 7
  
  const endIndex = isTodayActive ? 6 : 5;
  const startIndex = endIndex - activeCount + 1;

  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(today.getDate() - (6 - i)); 
    return {
      label: d.toLocaleDateString('en-US', { weekday: 'narrow' }), 
      isActive: i >= startIndex && i <= endIndex && activeCount > 0,
      isToday: i === 6
    };
  });

  return (
    <div className="flex flex-col h-full p-6 overflow-y-auto bg-white">
      
      {/* Header Profile Section */}
      <header className="flex justify-between items-center mb-8 pt-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Salam, Hazik</h1>
          <p className="text-walnut/70 text-sm mt-1">Welcome back to your journey.</p>
        </div>
        <div className="w-12 h-12 bg-walnut text-parchment rounded-full flex items-center justify-center font-bold text-lg shadow-[2px_2px_0px_0px_hsl(20,10%,20%)]">
          H
        </div>
      </header>

      {/* Dynamic Momentum / Streak Widget */}
      <section className="bg-white border-2 border-walnut rounded-2xl p-5 mb-8 shadow-[4px_4px_0px_0px_hsl(20,10%,20%)] transition-all">
        <div className="flex items-center gap-2 mb-4">
          <Flame 
            className={streakData.streak > 0 ? "text-primary animate-pulse" : "text-walnut/30"} 
            size={24} strokeWidth={2.5} 
          />
          <h2 className="font-bold text-lg tracking-tight">
            {streakData.streak > 0 ? `${streakData.streak} Day Streak` : "Start your streak"}
          </h2>
        </div>
        
        <div className="flex justify-between">
          {last7Days.map((day, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-500
                ${day.isActive 
                  ? 'bg-primary border-primary text-white shadow-sm scale-110' 
                  : day.isToday 
                    ? 'bg-white border-primary/40 text-primary animate-pulse'
                    : 'bg-parchment border-walnut/20 text-walnut/40'}`}
              >
                {day.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Core Application Hub Navigation */}
      <section className="flex flex-col gap-5 mt-auto mb-4">
        
        <button onClick={() => navigate('/mood')} className="flex flex-col items-start bg-white border-2 border-walnut rounded-2xl p-5 shadow-[4px_4px_0px_0px_hsl(20,10%,20%)] active:shadow-none active:translate-y-1 active:translate-x-1 transition-all text-left">
          <div className="flex items-center justify-between w-full mb-3">
            <Heart className="text-primary" size={28} strokeWidth={2.5} />
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary/80 bg-primary/10 px-2 py-1 rounded-md">AI Chat</span>
          </div>
          <h3 className="font-bold text-xl mb-1 tracking-tight">MoodQuran Chat</h3>
          <p className="text-sm text-walnut/70 leading-relaxed">How is your heart today? Let the Quran answer.</p>
        </button>

        <button onClick={() => navigate('/paths')} className="flex flex-col items-start bg-white border-2 border-walnut rounded-2xl p-5 shadow-[4px_4px_0px_0px_hsl(20,10%,20%)] active:shadow-none active:translate-y-1 active:translate-x-1 transition-all text-left">
          <div className="flex items-center justify-between w-full mb-3">
            <Map className="text-primary" size={28} strokeWidth={2.5} />
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary/80 bg-primary/10 px-2 py-1 rounded-md">Journeys</span>
          </div>
          <h3 className="font-bold text-xl mb-1 tracking-tight">PathLearner</h3>
          <p className="text-sm text-walnut/70 leading-relaxed">Continue your active pathways and build habits.</p>
        </button>

        <button onClick={() => navigate('/saved')} className="flex flex-col items-start bg-white border-2 border-walnut rounded-2xl p-5 shadow-[4px_4px_0px_0px_hsl(20,10%,20%)] active:shadow-none active:translate-y-1 active:translate-x-1 transition-all text-left">
          <div className="flex items-center justify-between w-full mb-3">
            <Bookmark className="text-primary" size={28} strokeWidth={2.5} />
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary/80 bg-primary/10 px-2 py-1 rounded-md">Library</span>
          </div>
          <h3 className="font-bold text-xl mb-1 tracking-tight">Saved Ayahs</h3>
          <p className="text-sm text-walnut/70 leading-relaxed">Revisit the verses that brought you comfort.</p>
        </button>

      </section>
    </div>
  );
}