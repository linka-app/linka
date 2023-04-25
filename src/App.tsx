import '@/App.css';
import { Linka } from '@/components/Linka';
import { Router } from '@/components/Router';

function App() {
  const version = '2.0.0';

  return (
    <Linka version={version}>
      <Router />
    </Linka>
  );
}

export default App;
