import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Badge, Box, Center, ChakraProvider, Container, Divider, Flex, Heading, HStack, Input, InputGroup, InputRightAddon, InputRightElement, Kbd, Tag } from '@chakra-ui/react';
import { VStack } from '@chakra-ui/react';
import { getBookmarks } from './api';

function App() {
  getBookmarks({q: "devops"}).then(res => {
    console.log('res:', res.data)
  }).catch(reason => {
    console.log('reason: ', reason)
  })

  return (
    <ChakraProvider>
      <VStack marginTop='100px'>
        {/* header */}
        <VStack>
          {/* search */}
          <Container minW='4xl'>
            <InputGroup>
              <Input placeholder='search anything' size='lg' />
              <InputRightElement >
                <Center>
                  <Box>
                    <Kbd>cmd</Kbd> <Kbd>k</Kbd>
                  </Box>
                </Center>
              </InputRightElement>
            </InputGroup>

          </Container>
          {/* filter */}
          <HStack>
          </HStack>
        </VStack>
        {/* body */}
        <Container minW='4xl'>
          <Flex>
            <Box maxW='sm' borderWidth='1px' borderRadius='md' overflow='hidden' p='3' >
              <Heading as='h4' size='xs'>智研监控宝流水线-生产环境</Heading>
              <Divider marginBottom='1' marginTop='1' />
              <Box display='flex' flexWrap='wrap' maxW='200px' p='0.5'>
                <Tag marginRight={0.5} marginBottom={0.5}>devops</Tag>
                <Tag marginRight={0.5} marginBottom={0.5}>devops</Tag>
                <Tag marginRight={0.5} marginBottom={0.5}>devops</Tag>
                <Tag marginRight={0.5} marginBottom={0.5}>devops</Tag>
              </Box>
            </Box>
          </Flex>
        </Container>

      </VStack>
    </ChakraProvider>

  );
}

export default App;
