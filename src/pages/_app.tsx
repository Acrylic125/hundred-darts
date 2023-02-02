import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { CacheProvider } from "@emotion/react";
import {
  createTheme,
  responsiveFontSizes,
  StyledEngineProvider,
} from "@mui/material/styles";
import { Box, Container, ThemeProvider } from "@mui/material";
import { api } from "../utils/api";
import "../styles/globals.css";

// function createEmotionCache() {
//   return createCache({ key: "css", prepend: true });
// }

// const clientSideEmotionCache = createEmotionCache();

let theme = createTheme({
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

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <Box className="h-screen w-screen" bgcolor="grey.900" color="grey.50">
          <SessionProvider session={session}>
            <Component {...pageProps} />
          </SessionProvider>
        </Box>
        {/* <CacheProvider value={clientSideEmotionCache}></CacheProvider> */}
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default api.withTRPC(MyApp);
