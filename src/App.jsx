import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import MoodChat from "./pages/MoodChat";
import PathLearner from "./pages/PathLearner";
import SavedVerses from "./pages/SavedVerses"; // 1. IMPORT THIS

function App() {
  return (
    <Router>
      <div className="h-[100dvh] w-full max-w-md mx-auto bg-white overflow-hidden shadow-2xl relative">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/mood" element={<MoodChat />} />
          <Route path="/paths" element={<PathLearner />} />
          <Route path="/saved" element={<SavedVerses />} /> {/* 2. ADD THIS ROUTE */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;