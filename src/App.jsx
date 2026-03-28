import { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import LandingScreen from './screens/LandingScreen';
import AvatarScreen from './screens/AvatarScreen';
import VibeScreen from './screens/VibeScreen';
import LoadingScreen from './screens/LoadingScreen';
import QuestMap from './screens/QuestMap';
import CompleteScreen from './screens/CompleteScreen';
import { mockQuest } from './data/mockQuest';

function App() {
  const [screen, setScreen] = useState('landing');
  const [avatar, setAvatar] = useState(null);
  const [vibe, setVibe] = useState(null);
  const [time, setTime] = useState(2);
  const [location, setLocation] = useState('');
  const [stops, setStops] = useState([]);

  const handlePlay = () => setScreen('avatar');

  const handleAvatarConfirm = (selectedAvatar) => {
    setAvatar(selectedAvatar);
    setScreen('vibe');
  };

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
    setAvatar(null);
    setVibe(null);
    setTime(2);
    setLocation('');
    setStops([]);
  };

  return (
    <ThemeProvider>
      {screen === 'landing' && <LandingScreen onPlay={handlePlay} />}
      {screen === 'avatar' && (
        <AvatarScreen
          onBack={() => setScreen('landing')}
          onConfirm={handleAvatarConfirm}
        />
      )}
      {screen === 'vibe' && (
        <VibeScreen
          onBack={() => setScreen('avatar')}
          onComplete={handleVibeComplete}
          initialVibe={vibe}
          initialTime={time}
          initialLocation={location}
        />
      )}
      {screen === 'loading' && (
        <LoadingScreen onDone={handleLoadingDone} avatar={avatar} />
      )}
      {screen === 'map' && (
        <QuestMap
          stops={stops}
          onBack={() => setScreen('vibe')}
          onComplete={handleMapComplete}
          avatar={avatar}
        />
      )}
      {screen === 'complete' && (
        <CompleteScreen onRestart={handleRestart} avatar={avatar} />
      )}
    </ThemeProvider>
  );
}

export default App;
