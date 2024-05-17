import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { Global, css } from "@emotion/react";

const globalStyles = css`
  /* Webkit browsers */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  ::-webkit-scrollbar-track {
    background: #f1f1f1;
  }
  ::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
  /* Firefox */
  scrollbar-width: thin;
  scrollbar-color: #888 #f1f1f1;
`;

const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: "#f7fafc",
      },
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <Global styles={globalStyles} />
      <App />
    </ChakraProvider>
  </React.StrictMode>
);
