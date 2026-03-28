import { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import LandingScreen from './screens/LandingScreen';
import VibeScreen from './screens/VibeScreen';
import LoadingScreen from './screens/LoadingScreen';
import QuestMap from './screens/QuestMap';
import CompleteScreen from './screens/CompleteScreen';
import { mockQuest } from './data/mockQuest';

function App() {
  const [screen, setScreen] = useState('landing');
  const [vibe, setVibe] = useState(null);
  const [time, setTime] = useState(2);
  const [location, setLocation] = useState('');
  const [stops, setStops] = useState([]);

  const handlePlay = () => setScreen('vibe');

  const handleVibeComplete = ({ vibe: v, time: t, location: l }) => {
    setVibe(v);
    setTime(t);
    setLocation(l);
    setScreen('loading');
  };

  const handleLoadingDone = () => {
    setStops(mockQuest.stops);
    setScreen('map');
  };

  const handleMapComplete = () => setScreen('complete');

  const handleRestart = () => {
    setScreen('landing');
    setVibe(null);
    setTime(2);
    setLocation('');
    setStops([]);
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
      {screen === 'loading' && <LoadingScreen onDone={handleLoadingDone} />}
      {screen === 'map' && (
        <QuestMap
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
