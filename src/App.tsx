import "@mantine/core/styles.css";
import '@mantine/tiptap/styles.css';
import { MantineProvider, Container, Image } from "@mantine/core";
import { theme } from "./theme";
import classes from './Home.module.css';
import { ReactNode } from "react";

interface Props {
  children?: ReactNode
}

export default function App({ children }: Props) {

  return <MantineProvider theme={theme}>
      <header className={classes.header}>
        <Container className={classes.inner}>
          <Image
            src='/public/logo192.png'
            height={40}
          />
        </Container>
      </header>
      <Container>
        {
          children
        }
      </Container>
  </MantineProvider>;
}
