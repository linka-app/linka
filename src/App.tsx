import { ChakraProvider } from "@chakra-ui/react";
import "./App.css";
import Linka from "./components/Linka";

function App() {
  const version = "1.3.0";
  return (
    <ChakraProvider>
      {/* to use colormode, must be a sub component of a ChakraProvider */}
      <Linka version={version}></Linka>
    </ChakraProvider>
  );
}

export default App;
