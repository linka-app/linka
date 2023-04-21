import './App.css';
import { AppFrame } from './components/AppFrame';
import Linka from './components/Linka';

function App() {
  const version = '1.3.0';

  return (
    <AppFrame>
      <Linka version={version}></Linka>
    </AppFrame>
  );
}

export default App;
