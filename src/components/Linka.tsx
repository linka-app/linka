import {
  Badge,
  Box,
  Button,
  Center,
  Container,
  Divider,
  Flex,
  Heading,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  Link,
  Spacer,
  Spinner,
  Text,
  Tooltip,
  useColorMode,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { Index, IndexSearchResult } from "flexsearch";
import { ChangeEvent, KeyboardEvent, useEffect, useState, useRef } from "react";
import { getBookmarks } from "../api";
import { shortenURL } from "../utils/url";
import { ColorModeSwitcher } from "./ColorModeSwitcher";

interface BookmarkItem {
  title: string;
  id: number;
  url: string;
  description: string;
  website_description: string;
  tag_names: string[];
  date_added: string;
  date_modified: string;
}
interface Res {
  results: BookmarkItem[];
}

interface Props {
  version: string;
}

function Linka(props: Props) {
  const { colorMode } = useColorMode();
  const inputRef = useRef(null);

  const defaultBookmarks: BookmarkItem[] = [];
  const [ready, setReady] = useState(false);
  const [bookmarks, setBookmarks] = useState(defaultBookmarks);
  const [index, setIndex] = useState(new Index({ tokenize: "full" }));
  const [query, setQuery] = useState("");

  const defaultSearchResults: IndexSearchResult = [];
  const [results, setResults] = useState(defaultSearchResults);

  const [token, setToken] = useState("");
  const [baseURL, setBaseURL] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const toast = useToast();

  useEffect(() => {
    // handle hotkeys
    const pressed = new Map<string, boolean>();
    window.addEventListener("keydown", (e) => {
      pressed.set(e.key, true);
      if (!(pressed.has("Meta") || pressed.has("Control"))) {
        return;
      }
      // focus input
      if (e.key === "l") {
        e.preventDefault();
        if (inputRef.current === null) {
          return;
        }
        (inputRef.current as HTMLInputElement).focus();
        return;
      }
    });
    window.addEventListener("keyup", (e) => {
      pressed.delete(e.key);
    });

    const token = localStorage.getItem("token");
    const url = localStorage.getItem("url");
    if (token != null && url != null) {
      getBookmarks({ token, url })
        .then((res: Res) => {
          setBookmarks(res.results);
          res.results.forEach((v, idx) => {
            setIndex(
              index.add(
                idx,
                [v.title, v.description, v.url, v.tag_names.join(" ")].join(" ")
              )
            );
          });

          setReady(true);
        })
        .catch((reason) => {
          console.log("reason: ", reason);
          setReady(false);
        });
    }
  }, [index, baseURL, token]);

  const onQueryUpdate = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);

    let positive: IndexSearchResult[] = [];
    let negative: IndexSearchResult[] = [];
    const segs = e.target.value.split(" ").filter((v) => v.length > 0);
    if (segs.length === 0) {
      setResults([]);
      return;
    }

    segs.forEach((q) => {
      if (q.startsWith("!")) {
        negative.push(index.search(q.replace("!", "")));
      } else {
        positive.push(index.search(q));
      }
    });
    let posResult = positive.reduce((prev, cur) => {
      return prev.filter((v) => cur.includes(v));
    });
    if (negative.length > 0) {
      let negaResult = negative.reduce((prev, cur) => [...prev, ...cur]);
      setResults(posResult.filter((v) => !negaResult.includes(v)));
    } else {
      setResults(posResult);
    }
  };

  const handleSetToken = () => {
    setSubmitting(true);
    getBookmarks({ token, url: baseURL })
      .then((res: Res) => {
        setBookmarks(res.results);
        res.results.forEach((v, idx) => {
          setIndex(
            index.add(
              idx,
              [v.title, v.description, v.url, v.tag_names.join(" ")].join(" ")
            )
          );
        });

        localStorage.setItem("token", token);
        localStorage.setItem("url", baseURL);
        setReady(true);
        setSubmitting(false);
      })
      .catch((reason) => {
        console.log(reason);
        toast({
          title: "Failed to load bookmarks.",
          description: "detail: " + reason,
        });
        setReady(false);
        setSubmitting(false);
      });
  };

  const onEnterPressed = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      results.forEach((v) => {
        window.open(bookmarks[Number(v.toString())].url);
      });
    }
  };

  return (
    <>
      {ready ? (
        // serach main page
        <VStack marginBottom="20px">
          <Container
            position="fixed"
            minW="xs"
            maxW="4xl"
            paddingTop="20px"
            paddingBottom="20px"
            backgroundColor={colorMode === "light" ? "white" : "#1a202c"}
          >
            <Flex>
              <InputGroup>
                <Input
                  autoFocus
                  placeholder="any text in url, title, description or tags"
                  size="lg"
                  value={query}
                  onChange={onQueryUpdate}
                  onKeyDown={onEnterPressed}
                  ref={inputRef}
                  pr="6.5rem"
                />
                <InputRightElement width="6.5rem" h="3rem">
                  <Tooltip label="type `Enter` to open hits in new tabs. keywords with `!` prefix to exclude">
                    <Button size="sm">
                      {results.length > 0
                        ? `${results.length} hits`
                        : `${bookmarks.length} total`}
                    </Button>
                  </Tooltip>
                </InputRightElement>
              </InputGroup>
              <Spacer />
            </Flex>
          </Container>
          <Container minW="xs" maxW="4xl" paddingTop="80px">
            <Flex wrap={"wrap"} flexDir="column" paddingBottom="40px">
              {results.length > 0
                ? results.map((val) => (
                    <Item
                      item={bookmarks[Number(val.toString())]}
                      key={bookmarks[Number(val.toString())].url}
                    ></Item>
                  ))
                : bookmarks.map((val) => (
                    <Item item={val} key={val.url}></Item>
                  ))}
            </Flex>
            <Spacer />
            <Divider marginBottom="20px"></Divider>
            <Center>
              <Link
                size="xs"
                href="https://github.com/cmsax/linka"
                target="_blank"
              >
                <Text size="xs" fontSize="10">
                  Linka! by cmsax on GitHub, current version {props.version}
                </Text>
              </Link>
            </Center>
          </Container>
        </VStack>
      ) : (
        // setup setting page
        <Center marginTop={100}>
          <Flex flexDir="column" minW="xs" maxWidth="md">
            <Heading as="h2" paddingLeft="1" paddingBottom="5">
              Linka!
            </Heading>
            <Input
              marginBottom={5}
              placeholder="linkding site base url"
              value={baseURL}
              onChange={(e) => {
                setBaseURL(e.target.value);
              }}
              size="lg"
              autoFocus
            />
            <Input
              marginBottom={5}
              placeholder="token"
              value={token}
              onChange={(e) => {
                setToken(e.target.value);
              }}
              size="lg"
            ></Input>
            <Box>
              <HStack>
                <Button
                  size="md"
                  onClick={handleSetToken}
                  disabled={submitting}
                  colorScheme="blue"
                >
                  Go!
                </Button>
                {submitting ? <Spinner /> : <></>}
              </HStack>
            </Box>
          </Flex>
        </Center>
      )}
      <Container marginBottom="20px">
        <Center>
          <ColorModeSwitcher></ColorModeSwitcher>
        </Center>
      </Container>
    </>
  );
}

function Item(props: { item: BookmarkItem; key: string }) {
  return (
    <Link
      href={props.item.url}
      target="_blank"
      p="0.5"
      pl="1"
      pr="1"
      _hover={{
        borderBottom: "1px solid",
        paddingBottom: "1px",
      }}
      key={props.item.id}
    >
      <Flex>
        <Center>
          <Box>
            <Heading as="h4" size="xs">
              {props.item.title || shortenURL(props.item.url)}
            </Heading>
          </Box>
        </Center>
        <Spacer />
        <Center>
          <Box>
            {props.item.tag_names.map((e) => (
              <Badge color={"green"} marginLeft="1">
                {e}
              </Badge>
            ))}
          </Box>
        </Center>
      </Flex>
    </Link>
  );
}

export default Linka;
