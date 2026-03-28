import { useState, useCallback } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import LandingScreen from './screens/LandingScreen';
import AvatarScreen from './screens/AvatarScreen';
import VibeScreen from './screens/VibeScreen';
import LoadingScreen from './screens/LoadingScreen';
import QuestMap from './screens/QuestMap';
import CompleteScreen from './screens/CompleteScreen';
import { mockQuest } from './data/mockQuest';
import { generateQuest } from './lib/api';
import { withStopIcons } from './lib/icons';

function App() {
  const [screen, setScreen] = useState('landing');
  const [avatar, setAvatar] = useState(null);
  const [vibe, setVibe] = useState(null);
  const [time, setTime] = useState(2);
  const [location, setLocation] = useState('');
  const [activities, setActivities] = useState(4);
  const [stops, setStops] = useState([]);
  const [questTitle, setQuestTitle] = useState('');
  const [questSummary, setQuestSummary] = useState('');
  const [questWeather, setQuestWeather] = useState(null);

  const handlePlay = () => setScreen('avatar');

  const handleAvatarConfirm = (selectedAvatar) => {
    setAvatar(selectedAvatar);
    setScreen('vibe');
  };

  const handleVibeComplete = ({ vibe: v, time: t, location: l, activities: a }) => {
    setVibe(v);
    setTime(t);
    setLocation(l);
    setActivities(a);
    setScreen('loading');
  };

  const handleGenerateQuest = useCallback(async () => {
    const quest = await generateQuest({ vibe, time, location, activities });
    return {
      ...quest,
      stops: withStopIcons(quest.stops),
    };
  }, [vibe, time, location, activities]);

  const handleLoadingDone = quest => {
    setQuestTitle(quest?.title || mockQuest.title);
    setQuestSummary(quest?.summary ?? '');
    setQuestWeather(quest?.weather ?? null);
    const resolved =
      Array.isArray(quest?.stops) && quest.stops.length > 0
        ? quest.stops
        : withStopIcons(mockQuest.stops);
    setStops(resolved);
    setScreen('map');
  };

  const handleMapComplete = () => setScreen('complete');

  const handleRestart = () => {
    setScreen('landing');
    setAvatar(null);
    setVibe(null);
    setTime(2);
    setLocation('');
    setActivities(4);
    setStops([]);
    setQuestTitle('');
    setQuestSummary('');
    setQuestWeather(null);
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
          initialActivities={activities}
        />
      )}
      {screen === 'loading' && (
        <LoadingScreen
          onBack={() => setScreen('vibe')}
          onGenerateQuest={handleGenerateQuest}
          onDone={handleLoadingDone}
          avatar={avatar}
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
