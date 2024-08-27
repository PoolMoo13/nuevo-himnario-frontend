import { ReactNode, useState } from "react";
import "@mantine/core/styles.css";
import { MantineProvider, Container, Anchor, Group, Burger, Box, Image, Button } from "@mantine/core";
import { theme } from "./theme";
import { useDisclosure } from '@mantine/hooks';
// import { MantineLogo } from '@mantinex/mantine-logo';
import classes from './DoubleHeader.module.css';

interface Props {
  children?: ReactNode
}

export default function App({ children }: Props) {

  return <MantineProvider theme={theme}>

    <header className={classes.header}>
      <Container className={classes.inner}>
        <Image
          src="https://raw.githubusercontent.com/PoolMoo13/himnario-jovenes/master/public/logo192.png"
          height={40}
        />
        <h3> Himno 1 </h3>
      </Container>
    </header>
    <Image
      src="https://raw.githubusercontent.com/PoolMoo13/himnario-jovenes/master/public/logo192.png"
      h={90}
      w={409}
      fit="contain"
    />
    {
      children
    }

    <Button 
    variant="light"
    w={400}
    >
      Entrar
    </Button>

  </MantineProvider>;
}
