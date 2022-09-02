import { ChakraProvider } from "@chakra-ui/react";
import "./App.css";
import Linka from "./components/Linka";

function App() {
  return (
    <ChakraProvider>
      {/* to use colormode, must be a sub component of a ChakraProvider */}
      <Linka></Linka>
    </ChakraProvider>
  );
}

export default App;
