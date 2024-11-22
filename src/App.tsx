import "@mantine/core/styles.css";
import '@mantine/tiptap/styles.css';
import { MantineProvider, Container, Image } from "@mantine/core";
import { theme } from "./theme";
import classes from './Home.module.css';
import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  children?: ReactNode
}

export default function App({ children }: Props) {

  const navigate = useNavigate();

  const navigateIcon = () => {
      navigate("/");
  };


  return <MantineProvider theme={theme}>
      <header className={classes.header}> 
        <Container className={classes.inner}>
          <Image
            src='/logo192.png'
            height={40}
            onClick={navigateIcon}
            style={{ cursor: "pointer" }}
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
