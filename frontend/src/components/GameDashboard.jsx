import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import TopBar from './TopBar';
import RoadViewport from './RoadViewport';
import AITeacherBubble from './AITeacherBubble';
import ControlDock from './ControlDock';
import TycoonShopModal from './TycoonShopModal';
import VehiclePlateInspector from './VehiclePlateInspector';
import StatsModal from './StatsModal';

import { fetchChallenge, verifyPlate } from '../utils/api';
import { sounds } from '../utils/audio';

export default function GameDashboard({ initialDifficulty = 'normal' }) {
  const TIME_LIMITS = { easy: 20, normal: 15, hard: 10 };

  // Game state - Session Fresh (resets on reload, no localStorage)
  const [challenge, setChallenge] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle', 'loading', 'correct', 'incorrect', 'driving_away'
  const [difficulty, setDifficulty] = useState(initialDifficulty); // 'easy', 'normal', 'hard'
  const [timeLeft, setTimeLeft] = useState(TIME_LIMITS[initialDifficulty]);
  
  // Player Tycoon metrics (Starts fresh each session: 150 welcome coins)
  const [coins, setCoins] = useState(150);
  const [streak, setStreak] = useState(0);
  const [remarks, setRemarks] = useState('');
  const [apilogyUsed, setApilogyUsed] = useState(false);
  const [confidenceScore, setConfidenceScore] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Garage Shop Upgrades State (Fresh session - player must earn coins to unlock)
  const [upgrades, setUpgrades] = useState({
    magnifier: false,
    wiper: false,
    double_coins: false,
    vip_permit: false
  });

  // Gameplay Statistics (Fresh session)
  const [stats, setStats] = useState({
    totalChecked: 0,
    totalCorrect: 0,
    highestStreak: 0,
    totalCoinsEarned: 0
  });

  // Modal Visibility
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);

  // Initial challenge load & difficulty change handler
  useEffect(() => {
    loadNewChallenge(null, difficulty);
  }, [difficulty]);

  useEffect(() => {
    if (!challenge || status !== 'idle') return undefined;

    const timerId = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerId);
          setStatus('incorrect');
          setStreak(0);
          setStats(currentStats => ({
            ...currentStats,
            totalChecked: currentStats.totalChecked + 1
          }));
          setRemarks('Waktu habis! Plat kendaraan ini terlewat. Bersiap untuk kendaraan berikutnya.');
          setTimeout(() => {
            setStatus('driving_away');
            setTimeout(() => loadNewChallenge(challenge.car_id, difficulty), 700);
          }, 1100);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [challenge, status, difficulty]);

  const loadNewChallenge = async (excludeId = null, currentDiff = difficulty) => {
    setStatus('loading');
    setInputValue('');
    setShowHint(false);
    try {
      const data = await fetchChallenge(excludeId, currentDiff);
      setChallenge(data);
      setTimeLeft(TIME_LIMITS[currentDiff]);
      const diffLabel = currentDiff === 'easy' ? 'Mudah 🟢' : (currentDiff === 'hard' ? 'Ekstrem Lumpur 🔴' : 'Normal 🟡');
      setRemarks(`Mobil ${data.vehicle_name} (Level ${diffLabel}) tiba di pos pemeriksaan! Periksa plat nomornya.`);
      setStatus('idle');
    } catch (err) {
      console.error("Failed to load challenge:", err);
      setStatus('idle');
    }
  };

  const handleChangeDifficulty = (newDiff) => {
    setDifficulty(newDiff);
  };

  const handleCheckAnswer = async () => {
    if (!inputValue.trim() || !challenge || timeLeft <= 0 || status === 'loading' || status === 'driving_away') return;

    setStatus('loading');
    setRemarks('Sedang memverifikasi plat dengan AI Guru Evaluator...');

    try {
      const result = await verifyPlate(
        challenge.car_id, 
        inputValue, 
        streak, 
        upgrades.double_coins,
        difficulty
      );

      setApilogyUsed(result.apilogy_used || false);
      setConfidenceScore(result.confidence_score || 95);
      setRemarks(result.remarks);

      setStats(prev => ({
        ...prev,
        totalChecked: prev.totalChecked + 1
      }));

      if (result.is_correct) {
        // SUCCESS MATCH
        sounds.playCoin();
        sounds.playEngineVroom();

        // Confetti Burst!
        try {
          confetti({
            particleCount: 90,
            spread: 75,
            origin: { y: 0.6 }
          });
        } catch (e) {}

        const newStreak = streak + 1;
        const newCoins = coins + result.total_reward;

        setStreak(newStreak);
        setCoins(newCoins);
        setStatus('correct');

        setStats(prev => ({
          ...prev,
          totalCorrect: prev.totalCorrect + 1,
          highestStreak: Math.max(prev.highestStreak, newStreak),
          totalCoinsEarned: prev.totalCoinsEarned + result.total_reward
        }));

        // After 1 second, trigger dynamic driving away animation
        setTimeout(() => {
          setStatus('driving_away');
          setTimeout(() => {
            loadNewChallenge(challenge.car_id, difficulty);
          }, 700);
        }, 1100);

      } else {
        // INCORRECT MATCH
        sounds.playError();
        setStreak(0);
        setStatus('incorrect');
      }

    } catch (err) {
      console.error("Verification error:", err);
      setRemarks("Terjadi kendala jaringan saat menghubungi server AI.");
      setStatus('idle');
    }
  };

  const handlePurchaseUpgrade = (itemId, cost) => {
    if (coins >= cost && !upgrades[itemId]) {
      setCoins(coins - cost);
      setUpgrades(prev => ({ ...prev, [itemId]: true }));
    }
  };

  return (
    <div className="min-h-screen bg-tycoon-yellow flex flex-col justify-between selection:bg-tycoon-purple selection:text-white">
      
      {/* Top Bar Score Bubble & Difficulty Selector */}
      <TopBar 
        coins={coins} 
        streak={streak} 
        difficulty={difficulty}
        timeLeft={timeLeft}
        onChangeDifficulty={handleChangeDifficulty}
        onOpenShop={() => setIsShopOpen(true)}
        onOpenStats={() => setIsStatsOpen(true)}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
      />

      {/* Central Viewport Container */}
      <main className="w-full flex-1 flex flex-col items-center justify-center px-4 py-2">
        
        {/* AI Teacher Speech Bubble */}
        <AITeacherBubble 
          remarks={remarks}
          status={status}
          apilogyUsed={apilogyUsed}
          confidenceScore={confidenceScore}
          hintText={challenge?.hint}
          showHint={showHint}
          onToggleInspector={() => setIsInspectorOpen(true)}
        />

        {/* The Road Highway Viewport & Chibi Vehicle */}
        <RoadViewport 
          challenge={challenge}
          status={status}
          onOpenInspector={() => setIsInspectorOpen(true)}
          hasMagnifier={upgrades.magnifier}
        />

      </main>

      {/* Bottom Control Dock */}
      <ControlDock 
        inputValue={inputValue}
        setInputValue={setInputValue}
        onSubmit={handleCheckAnswer}
        onToggleHint={() => setShowHint(!showHint)}
        showHint={showHint}
        isLoading={status === 'loading'}
        disabled={status === 'driving_away'}
      />

      {/* Tycoon Garage Shop Modal */}
      <TycoonShopModal 
        isOpen={isShopOpen}
        onClose={() => setIsShopOpen(false)}
        coins={coins}
        upgrades={upgrades}
        onPurchaseUpgrade={handlePurchaseUpgrade}
      />

      {/* Vehicle License Plate Inspector Modal */}
      <VehiclePlateInspector 
        isOpen={isInspectorOpen}
        onClose={() => setIsInspectorOpen(false)}
        challenge={challenge}
        hasWiper={upgrades.wiper}
        hasMagnifier={upgrades.magnifier}
      />

      {/* Gameplay Stats Modal */}
      <StatsModal 
        isOpen={isStatsOpen}
        onClose={() => setIsStatsOpen(false)}
        stats={stats}
      />

    </div>
  );
}
