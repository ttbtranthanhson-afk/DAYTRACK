import { createRoot } from 'react-dom/client';
import App from './app/App.tsx';
import { loadTheme, applyTheme } from './app/hooks/useAppTheme';
import { cleanupTutorialSampleData } from './app/tutorial/tutorialData';
import './styles/index.css';

applyTheme(loadTheme());

// Undo any tutorial sample data left behind by an unfinished tour (reload /
// close mid-way) before the app renders.
cleanupTutorialSampleData();

createRoot(document.getElementById('root')!).render(<App />);