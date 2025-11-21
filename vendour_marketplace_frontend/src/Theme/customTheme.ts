import { createTheme } from "@mui/material";

const customTheme = (mode: "light" | "dark") =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: "#1DB954", // Spotify green
      },
      secondary: {
        main: "#EAF0F1",
      },
      ...(mode === "dark"
        ? {
          // Dark mode → use light colors
          background: {
            default: "#121212",
            paper: "#1E1E1E",
          },
          text: {
            primary: "#ffffff",
            secondary: "#b3b3b3",
          },
          success: {
            main: "#81C784", // light green
            contrastText: "#000000",
          },
          error: {
            main: "#E57373", // light red
            contrastText: "#000000",
          },
          warning: {
            main: "#FFD54F", // light amber
            contrastText: "#000000",
          },
          info: {
            main: "#4FC3F7", // light blue
            contrastText: "#000000",
          },
        }
        : {
          // Light mode → use dark colors
          background: {
            default: "#ffffff",
            paper: "#f9f9f9",
          },
          text: {
            primary: "#000000",
            secondary: "#555555",
          },
          success: {
            main: "#1B5E20", // dark green
            contrastText: "#ffffff",
          },
          error: {
            main: "#B71C1C", // dark red
            contrastText: "#ffffff",
          },
          warning: {
            main: "#E65100", // dark orange
            contrastText: "#ffffff",
          },
          info: {
            main: "#0D47A1", // dark blue
            contrastText: "#ffffff",
          },
        }),
    },
    zIndex: {
      modal: 1500,
    },
    components: {
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            backgroundColor: mode === "dark" ? "#ffffff" : "#000000",
            color: mode === "dark" ? "#000000" : "#ffffff",
            fontSize: "0.8rem",
            fontWeight: 500,
            borderRadius: 6,
            padding: "6px 10px",
          },
          arrow: {
            color: mode === "dark" ? "#ffffff" : "#000000",
          },
        },
      },
    },
  });

export default customTheme;
