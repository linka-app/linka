import '@/App.css';
import { Linka } from '@/components/Linka';
import { Router } from '@/components/Router';
import { ColorModeContextProvider } from './contexts/ColorModeContext';

function App() {
  const version = '2.0.0';

  return (
    <ColorModeContextProvider>
      <Linka version={version}>
        <Router />
      </Linka>
    </ColorModeContextProvider>
  );
}

export default App;
