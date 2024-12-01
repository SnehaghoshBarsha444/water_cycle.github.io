import React, { useState } from 'react';
import { 
  Tabs, 
  TabsList, 
  TabsTrigger, 
  TabsContent 
} from '@/components/ui/tabs';

const EcoLearnApp = () => {
  const [activeGame, setActiveGame] = useState('water-cycle');
  const [userProfile, setUserProfile] = useState({
    ecoCoins: 0,
    level: 1,
    totalExperience: 0
  });

  const updateUserProfile = (points, gameType) => {
    setUserProfile(prev => {
      const newExperience = prev.totalExperience + points;
      const newLevel = Math.floor(newExperience / 100) + 1;

      return {
        ecoCoins: prev.ecoCoins + points,
        level: newLevel,
        totalExperience: newExperience
      };
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 p-4 max-w-7xl mx-auto">
      <header className="bg-green-700 text-white p-4 rounded-lg mb-4 flex flex-col sm:flex-row justify-between items-center">
        <h1 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-0">EcoLearn: Environmental Explorer</h1>
        <div className="flex space-x-4">
          <div className="flex items-center">
            <span className="mr-2">🌍</span> 
            <span>Level: {userProfile.level}</span>
          </div>
          <div className="flex items-center">
            <span className="mr-2">🍃</span> 
            <span>Eco Coins: {userProfile.ecoCoins}</span>
          </div>
        </div>
      </header>

      <Tabs 
        value={activeGame} 
        onValueChange={setActiveGame} 
        className="w-full"
      >
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="water-cycle">💧 Water Cycle</TabsTrigger>
          <TabsTrigger value="global-warming">🌡️ Climate Challenge</TabsTrigger>
          <TabsTrigger value="ar-explore">🔬 AR Explore</TabsTrigger>
        </TabsList>
        
        <TabsContent value="water-cycle">
          <WaterCycleGame 
            onUpdateProfile={updateUserProfile}
            currentLevel={userProfile.level}
          />
        </TabsContent>
        
        <TabsContent value="global-warming">
          <GlobalWarmingGame 
            onUpdateProfile={updateUserProfile}
            currentLevel={userProfile.level}
          />
        </TabsContent>
        
        <TabsContent value="ar-explore">
          <AREnvironmentExplorer />
        </TabsContent>
      </Tabs>
    </div>
  );
};

const WaterCycleGame = ({ onUpdateProfile, currentLevel }) => {
  const [gameState, setGameState] = useState({
    waterDrops: 0,
    stages: {
      evaporation: { completed: false, progress: 0, goal: 5 },
      condensation: { completed: false, progress: 0, goal: 5 },
      precipitation: { completed: false, progress: 0, goal: 5 }
    },
    currentStage: 'evaporation'
  });

  const stageDetails = {
    evaporation: {
      title: 'Evaporation',
      description: 'Heat transforms water into vapor',
      icon: '☀️',
      actionText: 'Apply Solar Heat',
      hint: 'Click to warm up water molecules!'
    },
    condensation: {
      title: 'Condensation',
      description: 'Water vapor cools and forms clouds',
      icon: '☁️',
      actionText: 'Cool Water Vapor',
      hint: 'Click to create cloud formations!'
    },
    precipitation: {
      title: 'Precipitation',
      description: 'Water returns to earth as rain or snow',
      icon: '🌧️',
      actionText: 'Release Water Droplets',
      hint: 'Click to make it rain!'
    }
  };

  const progressStage = (stageName) => {
    setGameState(prev => {
      const currentStageData = prev.stages[stageName];
      
      const newProgress = currentStageData.progress + 1;
      
      const updatedStages = {
        ...prev.stages,
        [stageName]: {
          ...currentStageData,
          progress: newProgress,
          completed: newProgress >= currentStageData.goal
        }
      };

      if (newProgress >= currentStageData.goal) {
        onUpdateProfile(30, 'water-cycle');
      }

      return {
        ...prev,
        waterDrops: prev.waterDrops + 1,
        stages: updatedStages
      };
    });
  };

  const resetGame = () => {
    setGameState({
      waterDrops: 0,
      stages: {
        evaporation: { completed: false, progress: 0, goal: 5 },
        condensation: { completed: false, progress: 0, goal: 5 },
        precipitation: { completed: false, progress: 0, goal: 5 }
      },
      currentStage: 'evaporation'
    });
  };

  const allStagesCompleted = Object.values(gameState.stages).every(stage => stage.completed);

  return (
    <div className="bg-blue-50 p-4 sm:p-6 rounded-lg">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 text-blue-800">Water Cycle Adventure</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {Object.entries(gameState.stages).map(([stageName, stageData]) => (
          <div 
            key={stageName}
            className={`p-4 rounded-lg transition-all ${
              stageData.completed 
                ? 'bg-green-500 text-white' 
                : 'bg-blue-300 hover:bg-blue-400'
            }`}
            >
            <div className="text-4xl mb-2 text-center">{stageDetails[stageName].icon}</div>
            <h3 className="font-bold text-center capitalize">{stageName}</h3>
            <p className="text-sm text-center mb-2">{stageDetails[stageName].description}</p>
            
            <div className="bg-white rounded-full h-2 mb-2">
              <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{width: `${(stageData.progress / stageData.goal) * 100}%`}}
              ></div>
            </div>
            
            <button 
              onClick={() => progressStage(stageName)}
              disabled={stageData.completed}
              className={`w-full p-2 rounded ${
                stageData.completed 
                  ? 'bg-green-700 text-white cursor-not-allowed' 
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              {stageData.completed ? 'Completed' : stageDetails[stageName].actionText}
            </button>
            
            {!stageData.completed && (
              <p className="text-xs text-center mt-2 text-blue-700">
                {stageDetails[stageName].hint}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="bg-white p-4 rounded-lg">
        <h3 className="font-bold mb-2">Game Progress</h3>
        <div>Water Drops Collected: {gameState.waterDrops}</div>
        <div>
          Stages Completed: {Object.values(gameState.stages).filter(stage => stage.completed).length} / 3
        </div>
        
        {allStagesCompleted && (
          <button 
            onClick={resetGame}
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
          >
            Reset Water Cycle 🔄
          </button>
        )}
      </div>
    </div>
  );
};

const GlobalWarmingGame = ({ onUpdateProfile, currentLevel }) => {
  const [scenario, setScenario] = useState({
    carbonLevel: 100,
    temperature: 15,
    ecosystemHealth: 100
  });

  const environmentalChallenges = [
    {
      title: 'Reduce Carbon Emissions',
      description: 'Choose strategies to lower carbon output',
      options: [
        { 
          text: 'Renewable Energy', 
          impact: { carbon: -20, temp: -1, ecosystem: +10 },
          points: 50
        },
        { 
          text: 'Forest Conservation', 
          impact: { carbon: -15, temp: -0.5, ecosystem: +20 },
          points: 40
        }
      ]
    }
  ];

  const makeDecision = (option) => {
    setScenario(prev => ({
      carbonLevel: Math.max(0, prev.carbonLevel + option.impact.carbon),
      temperature: prev.temperature + option.impact.temp,
      ecosystemHealth: Math.min(100, prev.ecosystemHealth + option.impact.ecosystem)
    }));

    onUpdateProfile(option.points, 'global-warming');
  };

  return (
    <div className="bg-green-50 p-4 sm:p-6 rounded-lg">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 text-green-800">Climate Crisis Simulator</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg">
          <h3>Carbon Level</h3>
          <div className="text-2xl">{scenario.carbonLevel}%</div>
        </div>
        <div className="bg-white p-4 rounded-lg">
          <h3>Global Temperature</h3>
          <div className="text-2xl">{scenario.temperature}°C</div>
        </div>
        <div className="bg-white p-4 rounded-lg">
          <h3>Ecosystem Health</h3>
          <div className="text-2xl">{scenario.ecosystemHealth}%</div>
        </div>
      </div>

      {environmentalChallenges.map((challenge, index) => (
        <div key={index} className="bg-white p-4 rounded-lg mb-4">
          <h3 className="font-bold mb-2">{challenge.title}</h3>
          <p className="mb-4">{challenge.description}</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {challenge.options.map((option, optIndex) => (
              <button
                key={optIndex}
                onClick={() => makeDecision(option)}
                className="bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 transition-colors"
              >
                {option.text}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const AREnvironmentExplorer = () => {
  return (
    <div className="bg-purple-50 p-4 sm:p-6 rounded-lg text-center">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 text-purple-800">AR Environmental Explorer</h2>
      <div className="bg-purple-200 p-8 sm:p-12 rounded-lg">
        <p className="text-base sm:text-lg mb-4">AR Feature Coming Soon! 🌍🔬</p>
        <p>Get ready to explore environmental systems in augmented reality!</p>
      </div>
    </div>
  );
};

export default EcoLearnApp;
