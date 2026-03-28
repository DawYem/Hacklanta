import { useState, useCallback } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import LandingScreen from './screens/LandingScreen';
import VibeScreen from './screens/VibeScreen';
import LoadingScreen from './screens/LoadingScreen';
import QuestMap from './screens/QuestMap';
import CompleteScreen from './screens/CompleteScreen';
import { mockQuest } from './data/mockQuest';
import { generateQuest } from './lib/api';
import { withStopIcons } from './lib/icons';

function App() {
  const [screen, setScreen] = useState('landing');
  const [vibe, setVibe] = useState(null);
  const [time, setTime] = useState(2);
  const [location, setLocation] = useState('');
  const [stops, setStops] = useState([]);
  const [questTitle, setQuestTitle] = useState('');
  const [questSummary, setQuestSummary] = useState('');
  const [questWeather, setQuestWeather] = useState(null);

  const handlePlay = () => setScreen('vibe');

  const handleVibeComplete = ({ vibe: v, time: t, location: l }) => {
    setVibe(v);
    setTime(t);
    setLocation(l);
    setScreen('loading');
  };

  const handleGenerateQuest = useCallback(async () => {
    const quest = await generateQuest({ vibe, time, location });
    return {
      ...quest,
      stops: withStopIcons(quest.stops),
    };
  }, [vibe, time, location]);

  const handleLoadingDone = quest => {
    setQuestTitle(quest?.title || mockQuest.title);
    setStops(quest?.stops || withStopIcons(mockQuest.stops));
    setScreen('map');
  };

  const handleMapComplete = () => setScreen('complete');

  const handleRestart = () => {
    setScreen('landing');
    setVibe(null);
    setTime(2);
    setLocation('');
    setStops([]);
    setQuestTitle('');
    setQuestSummary('');
    setQuestWeather(null);
  };

  return (
    <ThemeProvider>
      {screen === 'landing' && <LandingScreen onPlay={handlePlay} />}
      {screen === 'vibe' && (
        <VibeScreen
          onBack={() => setScreen('landing')}
          onComplete={handleVibeComplete}
          initialVibe={vibe}
          initialTime={time}
          initialLocation={location}
        />
      )}
      {screen === 'loading' && (
        <LoadingScreen
          onBack={() => setScreen('vibe')}
          onGenerateQuest={handleGenerateQuest}
          onDone={handleLoadingDone}
        />
      )}
      {screen === 'map' && (
        <QuestMap
          key={`${questTitle}-${location}-${stops.length}`}
          title={questTitle}
          summary={questSummary}
          weather={questWeather}
          searchArea={location}
          stops={stops}
          onBack={() => setScreen('vibe')}
          onComplete={handleMapComplete}
        />
      )}
      {screen === 'complete' && <CompleteScreen onRestart={handleRestart} />}
    </ThemeProvider>
  );
}

export default App;
