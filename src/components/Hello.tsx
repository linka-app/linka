import { useColorMode } from "@chakra-ui/react";

export const Hello = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <>
      colormode: {colorMode}
      <button onClick={toggleColorMode}> toggle </button>
    </>
  );
};
