import { ReactNode } from "react";
import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import { theme } from "./theme";

interface Props {
  children?: ReactNode
}

export default function App ({ children }: Props) {
  return <MantineProvider theme={theme}>
    {
      children
    }

  </MantineProvider>;
}
