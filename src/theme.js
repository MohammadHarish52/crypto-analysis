import { createTheme } from "@mui/material";

export const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#6366F1", // Modern indigo
      light: "#818CF8",
      dark: "#4F46E5",
    },
    secondary: {
      main: "#10B981", // Emerald green
      light: "#34D399",
      dark: "#059669",
    },
    background: {
      default: "#000000", // Pure black background
      paper: "#1E1E1E", // Dark gray for cards
    },
    text: {
      primary: "#FFFFFF",
      secondary: "rgba(255, 255, 255, 0.7)",
    },
  },
  typography: {
    fontFamily: "'Poppins', sans-serif",
    h1: {
      fontFamily: "'Poppins', sans-serif",
      fontWeight: 700,
      letterSpacing: "-0.02em",
    },
    h2: {
      fontFamily: "'Poppins', sans-serif",
      fontWeight: 700,
      letterSpacing: "-0.01em",
    },
    h3: {
      fontFamily: "'Poppins', sans-serif",
      fontWeight: 600,
    },
    h4: {
      fontFamily: "'Poppins', sans-serif",
      fontWeight: 600,
    },
    h5: {
      fontFamily: "'Poppins', sans-serif",
      fontWeight: 500,
    },
    h6: {
      fontFamily: "'Poppins', sans-serif",
      fontWeight: 500,
    },
    subtitle1: {
      fontFamily: "'Poppins', sans-serif",
      fontWeight: 500,
    },
    subtitle2: {
      fontFamily: "'Poppins', sans-serif",
      fontWeight: 500,
    },
    body1: {
      fontFamily: "'Poppins', sans-serif",
      fontWeight: 400,
    },
    body2: {
      fontFamily: "'Poppins', sans-serif",
      fontWeight: 400,
    },
    button: {
      fontFamily: "'Poppins', sans-serif",
      fontWeight: 600,
    },
    caption: {
      fontFamily: "'Poppins', sans-serif",
      fontWeight: 400,
    },
    overline: {
      fontFamily: "'Poppins', sans-serif",
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          fontWeight: 600,
          fontFamily: "'Poppins', sans-serif",
          letterSpacing: "0.01em",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          borderRadius: 12,
        },
      },
    },
  },
});
