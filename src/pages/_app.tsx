import { ThemeProvider } from "@mui/material";
import {
  createTheme,
  responsiveFontSizes,
  StyledEngineProvider,
} from "@mui/material/styles";
import type { NextComponentType } from "next";
import { type Session } from "next-auth";
import { SessionProvider, useSession } from "next-auth/react";
import type { AppProps } from "next/app";
import { type AppType } from "next/app";
import React from "react";
import MainLayout from "../components/MainLayout";
import "../styles/globals.css";
import { api } from "../utils/api";

let theme = createTheme({
  typography: {
    button: {
      textTransform: "none",
    },
  },
  palette: {
    mode: "dark",
    primary: {
      main: "#DA127D",
      "50": "#FFE3EC",
      "100": "#FFB8D2",
      "200": "#FF8CBA",
      "300": "#F364A2",
      "400": "#E8368F",
      "500": "#DA127D",
      "600": "#BC0A6F",
      "700": "#A30664",
      "800": "#870557",
      "900": "#620042",
    },
    grey: {
      "50": "#F6F6F9",
      "100": "#EDEDF3",
      "200": "#DBDBE6",
      "300": "#B6BBC8",
      "400": "#8691A2",
      "500": "#616E7C",
      "600": "#4D5860",
      "700": "#3C4348",
      "800": "#282C2F",
      "900": "#1C1F21",
    },
    background: {
      default: "#1F2933",
      paper: "#1F2933",
    },
    text: {
      primary: "#F5F7FA",
    },
  },
});
theme = responsiveFontSizes(theme);

type ExtendedAppProps<P> = AppProps<P> & {
  Component: NextComponentType & {
    auth?: boolean;
  };
  pageProps: P & {
    session: Session | null;
  };
};

function MyApp<P>({
  Component,
  pageProps: { session, ...pageProps },
}: ExtendedAppProps<P>) {
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <SessionProvider session={session}>
          <MainLayout>
            {Component.auth ? (
              <Auth>
                <Component {...pageProps} />
              </Auth>
            ) : (
              <Component {...pageProps} />
            )}
          </MainLayout>
        </SessionProvider>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

function Auth({ children }: { children: React.ReactElement }) {
  const { status } = useSession({ required: true });

  if (status === "loading") {
    return <></>;
  }

  return children;
}

export default api.withTRPC(MyApp);
