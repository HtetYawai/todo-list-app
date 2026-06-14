import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#8B7CF6",
    },

    background: {
      default: "#F7F5FC",
      paper: "#FFFFFF",
    },

    text: {
      primary: "#2D2A38",
      secondary: "#8C879A",
    },
  },

  shape: {
    borderRadius: 16,
  },

  typography: {
    fontFamily:
      "'Inter', sans-serif",
  },
});

export default theme;