/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * written by Brian McCarthy
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, History, Plus, Save, Clock, Calendar } from 'lucide-react';

// Types for the application state
type Screen = 'MAIN' | 'CALORIES' | 'HISTORY';

interface DailyLog {
  id: string;
  date: string;
  steps: number;
  weight: number;
  age: number;
  burned: number;
  sleep: number;
  stairs: number;
  lifting: number;
  food: number;
  moveMinutes: number;
  exerciseMinutes: number;
  standHours: number;
}

const STEPS_GOAL = 10000;
const EXERCISE_GOAL = 30;
const STAND_GOAL = 12;
const MOVE_GOAL = 60;

const Ring = ({ size, stroke, progress, color }: { size: number, stroke: number, progress: number, color: string }) => {
  const radius = (size - stroke) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="currentColor"
        strokeWidth={stroke}
        fill="transparent"
        className="text-white/5"
      />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={color}
        strokeWidth={stroke}
        fill="transparent"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        strokeLinecap="round"
      />
    </svg>
  );
};

const ActivityRings = ({ steps, exercise, stand }: { steps: number, exercise: number, stand: number }) => {
  return (
    <div className="relative flex items-center justify-center p-2">
      {/* Outer: Move (Red) */}
      <Ring size={200} stroke={22} progress={steps} color="#fa114f" />
      {/* Middle: Exercise (Green) */}
      <div className="absolute">
        <Ring size={152} stroke={22} progress={exercise} color="#9efd38" />
      </div>
      {/* Inner: Stand (Cyan) */}
      <div className="absolute">
        <Ring size={104} stroke={22} progress={stand} color="#21ffd6" />
      </div>

      <div className="absolute flex flex-col items-center justify-center text-white/40">
        <div className="w-1 h-1 rounded-full bg-[#fa114f] mb-1 shadow-[0_0_8px_#fa114f]" />
        <div className="w-1 h-1 rounded-full bg-[#9efd38] mb-1 shadow-[0_0_8px_#9efd38]" />
        <div className="w-1 h-1 rounded-full bg-[#21ffd6] shadow-[0_0_8px_#21ffd6]" />
      </div>
    </div>
  );
};

export default function App() {
  const [screen, setScreen] = useState<Screen>('MAIN');
  const [steps, setSteps] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [age, setAge] = useState<string>('');
  const [sleep, setSleep] = useState<string>('');
  const [stairs, setStairs] = useState<string>('');
  const [lifting, setLifting] = useState<string>('');
  const [food, setFood] = useState<string>('');
  const [moveMinutes, setMoveMinutes] = useState<string>('');
  const [exerciseMinutes, setExerciseMinutes] = useState<string>('');
  const [standHours, setStandHours] = useState<string>('');
  
  const [result, setResult] = useState<number | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [history, setHistory] = useState<DailyLog[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update clock every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Load history from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('fitness_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  // Show a toast message briefly
  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const handleCalculateCaloriesMain = () => {
    if (!steps || isNaN(Number(steps))) {
      showToast("Please enter your steps");
      return;
    }
    setScreen('CALORIES');
  };

  const calculateCalories = () => {
    if (!weight || !age) {
      showToast("Please enter weight and age");
      return;
    }

    const weightNum = parseFloat(weight);
    const ageNum = parseInt(age);
    const stepsNum = parseInt(steps) || 0;
    const stairsNum = parseInt(stairs) || 0;
    const liftingNum = parseInt(lifting) || 0;

    // MET values
    const walkingMet = 3.5;
    const stairsMet = 8.0;
    const liftingMet = 6.0;

    // Conversions
    const stepsPerMile = 2000;
    const miles = stepsNum / stepsPerMile;
    
    // Time estimations (walking at 3mph)
    const walkingHours = miles / 3;
    const liftingHours = liftingNum / 60;
    // Assuming 1 flight of stairs takes ~30 seconds of intense effort
    const stairHours = (stairsNum * 30) / 3600;

    // Adjust factor based on age
    const ageFactor = 1 - (ageNum - 20) * 0.001;

    // Kcal = MET * weight(kg) * time(hr)
    // Convert lbs to kg (approx 2.2)
    const weightKg = weightNum / 2.2;

    const burnedWalking = walkingMet * weightKg * walkingHours * ageFactor;
    const burnedLifting = liftingMet * weightKg * liftingHours * ageFactor;
    const burnedStairs = stairsMet * weightKg * stairHours * ageFactor;

    const totalBurned = Math.round(burnedWalking + burnedLifting + burnedStairs);
    
    setResult(totalBurned);
    return totalBurned;
  };

  const saveLog = () => {
    const burned = calculateCalories();
    if (burned === undefined) return;

    const newLog: DailyLog = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString(),
      steps: parseInt(steps) || 0,
      weight: parseFloat(weight),
      age: parseInt(age),
      burned: burned,
      sleep: parseFloat(sleep) || 0,
      stairs: parseInt(stairs) || 0,
      lifting: parseInt(lifting) || 0,
      food: parseInt(food) || 0,
      moveMinutes: parseInt(moveMinutes) || 0,
      exerciseMinutes: parseInt(exerciseMinutes) || 0,
      standHours: parseInt(standHours) || 0,
    };

    const updatedHistory = [newLog, ...history];
    setHistory(updatedHistory);
    localStorage.setItem('fitness_history', JSON.stringify(updatedHistory));
    showToast("Daily activity logged successfully!");
  };

  const handleBack = () => {
    setScreen('MAIN');
    setResult(null);
  };

  const deleteLog = (id: string) => {
    const updated = history.filter(item => item.id !== id);
    setHistory(updated);
    localStorage.setItem('fitness_history', JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-[#4CAF50] flex flex-col items-center justify-center p-4 font-sans relative overflow-hidden">
      {/* Background Graphic Patterns */}
      <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
        <img src="https://picsum.photos/seed/fitness/400/400" alt="Fitness Graphic" className="w-64 h-64 rounded-full" referrerPolicy="no-referrer" />
      </div>
      <div className="absolute bottom-0 left-0 opacity-10 pointer-events-none transform rotate-12">
        <img src="https://picsum.photos/seed/android/400/400" alt="Android Graphic" className="w-64 h-64 rounded-xl" referrerPolicy="no-referrer" />
      </div>

      {/* Clock and Date Header - Centered and Enlarged */}
      <div className="absolute top-8 inset-x-0 mx-auto text-white font-black flex flex-col items-center gap-2 z-20">
        <div className="flex items-center gap-3 text-6xl md:text-7xl drop-shadow-2xl tracking-tighter">
          <Clock className="w-8 h-8 text-black/30" />
          {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
        <div className="flex items-center gap-3 text-xl md:text-2xl opacity-90 drop-shadow-lg uppercase tracking-widest font-bold">
          <Calendar className="w-6 h-6 text-black/30" />
          {currentTime.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
        </div>
      </div>

      {/* History Button (Main Screen only) */}
      {screen === 'MAIN' && (
        <button 
          onClick={() => setScreen('HISTORY')}
          className="absolute top-6 right-6 bg-black/20 p-3 rounded-full hover:bg-black/30 transition-colors z-20 shadow-lg text-white"
        >
          <History className="w-6 h-6" />
        </button>
      )}

      {/* Toast Notification mimicking Android Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-10 bg-gray-800 text-white px-6 py-3 rounded-full text-sm shadow-xl z-50 font-medium"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {screen === 'MAIN' ? (
          <motion.div
            key="main-screen"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="w-full max-w-md flex flex-col items-center gap-8 relative z-10 pt-32"
            id="main_container"
          >
            <div className="flex flex-col items-center gap-2">
               <img 
                src="/input_file_0.png" 
                alt="Android Fitness Bot" 
                className="h-32 w-auto drop-shadow-2xl mb-2 rounded-2xl"
                referrerPolicy="no-referrer"
              />
              <h1 id="app_title" className="text-4xl font-extrabold text-white text-center leading-tight drop-shadow-md">
                Daily Fitness Tracker<br/>
                <span className="text-2xl font-medium opacity-90 underline decoration-black/20">Android Mobile App</span>
              </h1>
            </div>

            <div className="bg-black/30 backdrop-blur-xl p-6 rounded-[2.5rem] shadow-2xl border border-white/10 w-full flex flex-col items-center gap-4">
              <ActivityRings 
                steps={Math.min(((parseInt(moveMinutes) || 0) / MOVE_GOAL) * 100, 100)}
                exercise={Math.min(((parseInt(exerciseMinutes) || 0) / EXERCISE_GOAL) * 100, 100)}
                stand={Math.min(((parseInt(standHours) || 0) / STAND_GOAL) * 100, 100)}
              />
              <div className="grid grid-cols-3 gap-8 w-full px-4">
                <div className="flex flex-col items-center">
                  <div className="text-[#fa114f] font-black text-lg">{moveMinutes || 0}m</div>
                  <div className="text-white/40 text-[8px] uppercase font-bold tracking-widest leading-none">Move</div>
                </div>
                <div className="flex flex-col items-center border-x border-white/5">
                  <div className="text-[#9efd38] font-black text-lg">{exerciseMinutes || 0}m</div>
                  <div className="text-white/40 text-[8px] uppercase font-bold tracking-widest leading-none">Ex.</div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-[#21ffd6] font-black text-lg">{standHours || 0}h</div>
                  <div className="text-white/40 text-[8px] uppercase font-bold tracking-widest leading-none">Stand</div>
                </div>
              </div>
            </div>

            <div className="w-full space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-white p-2 rounded-sm shadow-inner group transition-all focus-within:ring-2 ring-[#fa114f]/30">
                  <label className="text-[10px] font-bold text-[#fa114f] ml-1 mb-[-4px] block uppercase tracking-widest leading-none">Move min</label>
                  <input
                    type="number"
                    value={moveMinutes}
                    onChange={(e) => setMoveMinutes(e.target.value)}
                    placeholder="0"
                    className="w-full bg-transparent text-black text-xl p-2 pt-1 outline-none placeholder:text-gray-400"
                  />
                </div>
                <div className="bg-white p-2 rounded-sm shadow-inner group transition-all focus-within:ring-2 ring-[#9efd38]/30">
                  <label className="text-[10px] font-bold text-[#9efd38] ml-1 mb-[-4px] block uppercase tracking-widest leading-none text-shadow-sm">Exer min</label>
                  <input
                    type="number"
                    value={exerciseMinutes}
                    onChange={(e) => setExerciseMinutes(e.target.value)}
                    placeholder="0"
                    className="w-full bg-transparent text-black text-xl p-2 pt-1 outline-none placeholder:text-gray-400"
                  />
                </div>
                <div className="bg-white p-2 rounded-sm shadow-inner group transition-all focus-within:ring-2 ring-[#21ffd6]/30">
                  <label className="text-[10px] font-bold text-[#21ffd6] ml-1 mb-[-4px] block uppercase tracking-widest leading-none">Stand hr</label>
                  <input
                    type="number"
                    value={standHours}
                    onChange={(e) => setStandHours(e.target.value)}
                    placeholder="0"
                    className="w-full bg-transparent text-black text-xl p-2 pt-1 outline-none placeholder:text-gray-400"
                  />
                </div>
              </div>

              <div className="bg-white p-2 rounded-sm shadow-inner border-l-8 border-blue-500 ring-2 ring-blue-100 scale-105 my-2">
                <label className="text-xs font-black text-blue-600 ml-4 mb-[-8px] block uppercase tracking-tighter flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                  Daily Food Intake (kcal)
                </label>
                <input
                  type="number"
                  value={food}
                  onChange={(e) => setFood(e.target.value)}
                  placeholder="Enter total food calories"
                  className="w-full bg-transparent text-black text-3xl font-bold p-4 pt-1 outline-none placeholder:text-gray-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white p-2 rounded-sm shadow-inner">
                  <label className="text-[10px] font-bold text-gray-400 ml-2 mb-[-4px] block uppercase tracking-widest">Steps</label>
                  <input
                    id="steps_input"
                    type="number"
                    value={steps}
                    onChange={(e) => setSteps(e.target.value)}
                    placeholder="0"
                    className="w-full bg-transparent text-black text-xl p-2 pt-0 outline-none placeholder:text-gray-400"
                  />
                </div>
                <div className="bg-white p-2 rounded-sm shadow-inner">
                  <label className="text-[10px] font-bold text-gray-400 ml-2 mb-[-4px] block uppercase tracking-widest">Sleep (hr)</label>
                  <input
                    type="number"
                    value={sleep}
                    onChange={(e) => setSleep(e.target.value)}
                    placeholder="0"
                    className="w-full bg-transparent text-black text-xl p-2 pt-0 outline-none placeholder:text-gray-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-2 rounded-sm shadow-inner">
                  <label className="text-xs font-bold text-gray-500 ml-4 mb-[-8px] block uppercase tracking-wider">Stairs (flights)</label>
                  <input
                    type="number"
                    value={stairs}
                    onChange={(e) => setStairs(e.target.value)}
                    placeholder="0"
                    className="w-full bg-transparent text-black text-xl p-4 pt-1 outline-none placeholder:text-gray-400"
                  />
                </div>
                <div className="bg-white p-2 rounded-sm shadow-inner">
                  <label className="text-xs font-bold text-gray-500 ml-4 mb-[-8px] block uppercase tracking-wider">Weights (min)</label>
                  <input
                    type="number"
                    value={lifting}
                    onChange={(e) => setLifting(e.target.value)}
                    placeholder="0"
                    className="w-full bg-transparent text-black text-xl p-4 pt-1 outline-none placeholder:text-gray-400"
                  />
                </div>
              </div>

              <button
                id="calculate_calories_button"
                onClick={handleCalculateCaloriesMain}
                className="w-full bg-black text-white text-2xl font-bold py-6 rounded-sm shadow-xl active:scale-95 transition-all hover:bg-gray-900 border-b-4 border-gray-800 flex items-center justify-center gap-2"
              >
                Next Step <ChevronLeft className="rotate-180 w-8 h-8" />
              </button>
            </div>

            <footer className="mt-4 text-white/80 font-medium text-lg">
              Written by Brian McCarthy
            </footer>
          </motion.div>
        ) : screen === 'CALORIES' ? (
          <motion.div
            key="calories-screen"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="w-full max-w-md flex flex-col items-center gap-6 relative z-10 pt-32"
            id="calories_container"
          >
            <div className="w-full bg-black/10 p-6 rounded-xl backdrop-blur-sm shadow-sm border border-white/10">
              <div id="calories_burned" className="text-5xl font-black text-white text-center py-2 tracking-tighter">
                {result !== null ? result : 0} 
                <span className="text-xl font-medium ml-2 opacity-80">kcal</span>
              </div>
              <div className="text-white/60 text-center text-sm font-bold uppercase tracking-widest">Est. Calories Burned</div>
              
              {food && result !== null && (
                <div className="mt-4 pt-4 border-t border-white/10 text-center">
                  <div className="text-3xl font-bold text-white">
                    {parseInt(food) - result} 
                    <span className="text-sm font-medium ml-2 opacity-70">Net kcal</span>
                  </div>
                  <div className="text-white/40 text-[10px] uppercase font-bold tracking-widest">Food Intake - Activity</div>
                </div>
              )}
            </div>

            <div className="w-full space-y-4">
              <div className="bg-white p-2 rounded-sm shadow-inner group transition-all focus-within:ring-2 ring-black/20">
                <label className="text-[10px] font-bold text-gray-400 ml-4 mb-[-4px] block uppercase tracking-widest">Weight (lbs)</label>
                <input
                  id="weight_input"
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="Enter your weight"
                  className="w-full bg-transparent text-black text-2xl p-4 pt-0 outline-none placeholder:text-gray-400"
                />
              </div>

              <div className="bg-white p-2 rounded-sm shadow-inner group transition-all focus-within:ring-2 ring-black/20">
                <label className="text-[10px] font-bold text-gray-400 ml-4 mb-[-4px] block uppercase tracking-widest">Age</label>
                <input
                  id="age_input"
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="Enter your age"
                  className="w-full bg-transparent text-black text-2xl p-4 pt-0 outline-none placeholder:text-gray-400"
                />
              </div>

              <div className="w-full bg-blue-50 p-4 rounded-sm border border-blue-100 flex justify-between items-center">
                 <span className="text-blue-800 font-bold uppercase text-xs tracking-wider">Daily Food Goal</span>
                 <span className="text-blue-600 font-black text-xl">{food || '0'} kcal</span>
              </div>

              <div className="flex gap-2">
                <button
                  id="calculate_button"
                  onClick={calculateCalories}
                  className="flex-1 bg-white text-black text-2xl font-bold py-6 rounded-sm shadow-xl flex items-center justify-center active:scale-95 transition-all border-b-4 border-gray-200"
                >
                  Calc
                </button>
                <button
                  onClick={saveLog}
                  className="flex-[2] bg-black text-white text-2xl font-bold py-6 rounded-sm shadow-xl flex items-center justify-center gap-2 active:scale-95 transition-all hover:bg-gray-900 border-b-4 border-gray-800"
                >
                  <Save className="w-6 h-6" /> Log Day
                </button>
              </div>

              <button
                id="back_button"
                onClick={handleBack}
                className="w-full bg-black/10 text-white text-xl font-bold py-4 rounded-sm shadow-lg flex items-center justify-center active:scale-95 transition-all hover:bg-black/20"
              >
                <ChevronLeft className="mr-2 h-6 w-6" />
                Edit Metrics
              </button>
            </div>

            <footer className="mt-4 text-white/80 font-medium text-lg">
              Written by Brian McCarthy
            </footer>
          </motion.div>
        ) : (
          <motion.div
            key="history-screen"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="w-full max-w-md flex flex-col items-center gap-6 relative z-10 pt-32"
            id="history_container"
          >
            <div className="w-full flex items-center justify-between text-white drop-shadow-md">
               <h2 className="text-3xl font-black italic tracking-tighter">HISTORY</h2>
               <button onClick={() => setScreen('MAIN')} className="bg-white/20 p-2 rounded-full hover:bg-white/30 transition-colors">
                  <Plus className="w-6 h-6 rotate-45" />
               </button>
            </div>

            <div className="w-full flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-hide">
              {history.length === 0 ? (
                <div className="text-white/60 text-center py-10 italic">No logs found yet. Start tracking!</div>
              ) : (
                history.map((log) => (
                  <div key={log.id} className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10 relative group">
                    <div className="flex justify-between items-start mb-2">
                       <div>
                          <div className="text-xs font-bold text-white/40 uppercase tracking-widest">{log.date}</div>
                          <div className="text-2xl font-black text-white">{log.burned} <span className="text-sm opacity-60">kcal</span></div>
                       </div>
                       <div className="text-right">
                          <div className="text-xs font-bold text-white/40 uppercase tracking-widest">Food</div>
                          <div className="text-xl font-bold text-blue-300">{log.food} <span className="text-xs opacity-60">kcal</span></div>
                       </div>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-2 border-t border-white/10 pt-3 mt-1">
                      <div className="text-center">
                        <div className="text-[8px] font-bold text-[#fa114f] uppercase">Move</div>
                        <div className="text-sm font-bold text-white">{log.moveMinutes}m</div>
                      </div>
                      <div className="text-center">
                        <div className="text-[8px] font-bold text-[#9efd38] uppercase">Exer</div>
                        <div className="text-sm font-bold text-white">{log.exerciseMinutes}m</div>
                      </div>
                      <div className="text-center">
                        <div className="text-[8px] font-bold text-[#21ffd6] uppercase">Stand</div>
                        <div className="text-sm font-bold text-white">{log.standHours}h</div>
                      </div>
                      <div className="text-center">
                        <div className="text-[8px] font-bold text-white/40 uppercase">Steps</div>
                        <div className="text-sm font-bold text-white italic">{log.steps}</div>
                      </div>
                    </div>

                    <button 
                      onClick={() => deleteLog(log.id)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                    >
                      ×
                    </button>
                  </div>
                ))
              )}
            </div>

            <button
               onClick={() => setScreen('MAIN')}
               className="w-full bg-black text-white text-2xl font-bold py-6 rounded-sm shadow-xl active:scale-95 transition-all hover:bg-gray-900 border-b-4 border-gray-800"
            >
              Back Home
            </button>

            <footer className="mt-4 text-white/80 font-medium text-lg">
              Written by Brian McCarthy
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
