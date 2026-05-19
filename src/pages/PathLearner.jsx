import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Lock, CheckCircle2, Play, Pause, Bookmark } from 'lucide-react';

export default function PathLearner() {
  const navigate = useNavigate();
  const [selectedPath, setSelectedPath] = useState(null);
  const [activeModalNode, setActiveModalNode] = useState(null);
  const [reflectionText, setReflectionText] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);

  // Core high-utility curated mock pathways data structure
  const [pathways, setPathways] = useState([
    { id: 'anxiety', title: 'Finding Peace in Anxiety', days: 7, description: 'Ground your heart during intense, high-stakes moments.', level: 'Beginner' },
    { id: 'prophets', title: 'The Prayers of the Prophets', days: 14, description: 'Analyze scriptural protocols for calling upon divine mercy.', level: 'Intermediate' },
    { id: 'ethics', title: 'Financial Ethics & Barakah', days: 5, description: 'Unlock cosmic expansion through sound microeconomic habits.', level: 'Advanced' },
    { id: 'patience', title: 'Rebuilding Patience', days: 10, description: 'Build an internal fortress when external variables fail.', level: 'Beginner' },
  ]);

  // Track mock user progression state for the nodes mapping matrix
  const [nodes, setNodes] = useState([
    { day: 1, status: 'completed', title: 'The Mechanism of Ease', verse: '94:5', text: 'For indeed, with hardship will be ease.', tafsir: 'The verse guarantees that adversity does not merely precede comfort, but carries relief natively embedded inside it.' },
    { day: 2, status: 'completed', title: 'The Anchor of Remembrance', verse: '13:28', text: 'Unquestionably, by the remembrance of Allah hearts find rest.', tafsir: 'Remembrance coordinates neurological state shifts from flight-or-fight back into safe equilibrium.' },
    { day: 3, status: 'active', title: 'The Capacity Guardrail', verse: '2:286', text: 'Allah does not burden a soul beyond that it can bear.', tafsir: 'A total reassurance that your current environment contains no structural payload that you are mathematically incapable of handling.' },
    { day: 4, status: 'locked', title: 'The Shield of Perseverance', verse: '2:153' },
    { day: 5, status: 'locked', title: 'The Nearness Formula', verse: '2:186' },
  ]);

  const handleNodeClick = (node) => {
    if (node.status === 'locked') return;
    setActiveModalNode(node);
  };

  const submitReflection = () => {
    if (!reflectionText.trim()) return;
    
    // Simulate updating active state matrix inline to prove frontend functionality
    setNodes(prev => prev.map(n => {
      if (n.day === activeModalNode.day) return { ...n, status: 'completed' };
      if (n.day === activeModalNode.day + 1) return { ...n, status: 'active' };
      return n;
    }));
    
    setReflectionText('');
    setActiveModalNode(null);
    setIsPlaying(false);
  };

  return (
    <div className="flex flex-col h-full bg-parchment text-walnut relative">
      {/* Structural Header block */}
      <header className="flex items-center gap-4 p-4 border-b-2 border-walnut/10 bg-white shadow-sm">
        <button 
          onClick={() => selectedPath ? setSelectedPath(null) : navigate('/')} 
          className="p-1 hover:bg-parchment rounded-lg transition-colors"
        >
          <ArrowLeft size={22} />
        </button>
        <div>
          <h2 className="font-bold text-lg leading-tight">
            {selectedPath ? selectedPath.title : 'PathLearner Journeys'}
          </h2>
          <p className="text-xs text-walnut/60">
            {selectedPath ? 'Complete your daily node module' : 'Select an actionable scriptural track'}
          </p>
        </div>
      </header>

      {/* Layer 1: Curated Selection Track Hub */}
      {!selectedPath ? (
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {pathways.map((path) => (
            <div 
              key={path.id}
              onClick={() => setSelectedPath(path)}
              className="bg-white border-2 border-walnut rounded-2xl p-5 shadow-[4px_4px_0px_0px_var(--color-walnut)] cursor-pointer hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_var(--color-walnut)] transition-all"
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-bold uppercase px-2.5 py-0.5 bg-parchment border border-walnut text-walnut rounded-full">
                  {path.level}
                </span>
                <span className="text-xs font-bold text-primary flex items-center gap-1">
                  <BookOpen size={14} /> {path.days} Days
                </span>
              </div>
              <h3 className="font-bold text-lg mb-1 tracking-tight">{path.title}</h3>
              <p className="text-xs text-walnut/70 leading-relaxed">{path.description}</p>
            </div>
          ))}
        </div>
      ) : (
        /* Layer 2: Gamified Snaking Timeline Engine */
        <div className="flex-1 overflow-y-auto p-6 relative flex flex-col items-center">
          {/* Central Connecting Graph String line */}
          <div className="absolute top-0 bottom-0 left-1/2 w-0.5 border-l-2 border-dashed border-walnut/20 -translate-x-1/2 z-0" />

          <div className="w-full max-w-xs space-y-12 my-6 z-10 relative">
            {nodes.map((node, index) => {
              // Mathematical offsets to create standard gamified curves smoothly
              const offsets = ['translate-x-[-40px]', 'translate-x-[40px]', 'translate-x-[-20px]', 'translate-x-[30px]', 'translate-x-[-30px]'];
              const currentOffset = offsets[index % offsets.length];

              return (
                <div key={node.day} className={`flex flex-col items-center transform ${currentOffset}`}>
                  <button
                    onClick={() => handleNodeClick(node)}
                    disabled={node.status === 'locked'}
                    className={`w-16 h-16 rounded-full border-2 border-walnut flex items-center justify-center font-bold text-lg transition-all relative
                    ${node.status === 'completed' ? 'bg-walnut text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,0.15)]' : ''}
                    ${node.status === 'active' ? 'bg-primary text-white scale-110 animate-pulse border-2 shadow-[4px_4px_0px_0px_var(--color-walnut)]' : ''}
                    ${node.status === 'locked' ? 'bg-parchment-dark text-walnut/30 border-walnut/20 cursor-not-allowed' : ''}
                    `}
                  >
                    {node.status === 'completed' ? <CheckCircle2 size={24} /> : node.day}
                    
                    {node.status === 'locked' && (
                      <div className="absolute -top-1 -right-1 bg-white border border-walnut/40 p-0.5 rounded-full">
                        <Lock size={10} className="text-walnut/40" />
                      </div>
                    )}
                  </button>
                  <span className="text-[11px] font-bold mt-2 bg-white/90 px-2 py-0.5 rounded-md border border-walnut/10 shadow-xs max-w-[120px] text-center truncate">
                    {node.title || `Day ${node.day}`}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Layer 3: Overlay Sheet Daily Node Module (Prepped for Core APIs) */}
      {activeModalNode && (
        <div className="absolute inset-0 bg-walnut/40 backdrop-blur-xs flex items-end justify-center z-50">
          <div className="bg-parchment w-full max-h-[85%] rounded-t-3xl border-t-4 border-walnut p-6 overflow-y-auto shadow-2xl flex flex-col">
            
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Day {activeModalNode.day} Active Module</span>
                <h3 className="font-bold text-xl tracking-tight">{activeModalNode.title}</h3>
              </div>
              <button 
                onClick={() => { setActiveModalNode(null); setIsPlaying(false); }}
                className="text-xs font-bold border-2 border-walnut px-2.5 py-1 rounded-lg bg-white active:translate-y-0.5 transition-all"
              >
                Close
              </button>
            </div>

            {/* Core Quran Content Field Container */}
            <div className="bg-white border-2 border-walnut rounded-2xl p-5 space-y-4 mb-5 shadow-[2px_2px_0px_0px_var(--color-walnut)]">
              <div className="flex justify-between items-center border-b border-walnut/5 pb-2">
                <span className="text-xs font-bold text-walnut/50 flex items-center gap-1">
                  <Bookmark size={12} /> Verse {activeModalNode.verse}
                </span>
                {/* Mock Audio Stream Player Controller Toggle button */}
                <button 
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-xl border border-walnut bg-parchment hover:bg-primary hover:text-white transition-colors"
                >
                  {isPlaying ? <Pause size={12} fill="currentColor" /> : <Play size={12} fill="currentColor" />}
                  {isPlaying ? 'Streaming Recitation...' : 'Listen Audio'}
                </button>
              </div>

              {/* Dynamic script text displays */}
              <p className="text-right text-xl font-serif leading-loose tracking-wide font-bold text-walnut">
                {activeModalNode.day === 3 ? "لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا" : "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا"}
              </p>
              <p className="text-sm font-medium text-walnut/90 leading-relaxed italic">
                "{activeModalNode.text}"
              </p>

              {/* Collapsible/Toggle Tafsir Context Drawer metadata */}
              <div className="pt-3 border-t border-dashed border-walnut/10">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-primary mb-1">Context / Tafsir</h4>
                <p className="text-xs text-walnut/70 leading-relaxed font-medium">{activeModalNode.tafsir}</p>
              </div>
            </div>

            {/* Reflection Habit-Gate Input container */}
            <div className="space-y-3 mt-auto">
              <label className="block text-xs font-bold text-walnut/70">
                Write down your practical action item for today to unlock the next step:
              </label>
              <textarea
                value={reflectionText}
                onChange={(e) => setReflectionText(e.target.value)}
                rows={3}
                placeholder="How will you apply this verse to your current stressors today?"
                className="w-full bg-white border-2 border-walnut rounded-xl p-3 text-sm font-medium focus:outline-none focus:border-primary transition-colors resize-none"
              />
              <button
                onClick={submitReflection}
                disabled={!reflectionText.trim()}
                className={`w-full py-3.5 border-2 border-walnut rounded-xl font-bold text-sm tracking-tight shadow-[3px_3px_0px_0px_var(--color-walnut)] transition-all flex items-center justify-center gap-2
                ${reflectionText.trim() 
                  ? 'bg-primary text-white hover:bg-primary/90 active:shadow-none active:translate-y-0.5' 
                  : 'bg-parchment-dark text-walnut/30 border-walnut/10 shadow-none cursor-not-allowed'}`}
              >
                Log Reflection & Unlock Next Node
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}