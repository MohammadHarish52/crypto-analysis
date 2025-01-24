import { useState } from "react";
import { ThemeProvider, Box, Button, ButtonGroup } from "@mui/material";
import Navbar from "./components/Navbar";
import BubbleChart from "./components/BubbleChart";
import SignalsList from "./components/SignalsList";
import { theme } from "./theme";
import "@fontsource/poppins/300.css";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";
import "./App.css";

function App() {
  const [timeFrame, setTimeFrame] = useState("short-term");
  const [marketCapRange, setMarketCapRange] = useState(100);
  const [searchQuery, setSearchQuery] = useState("");

  const handleMarketCapRangeChange = (range) => {
    setMarketCapRange(range);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: "100vh",
          width: "100vw",
          backgroundColor: "#000000",
          color: "text.primary",
        }}
      >
        <Navbar onMarketCapRangeChange={handleMarketCapRangeChange} />

        <Box sx={{ display: "flex", p: 2, gap: 2 }}>
          {/* Strategy Selector */}
          <Box
            sx={{
              display: "flex",
              gap: 1,
              alignItems: "center",
              color: "rgba(255, 255, 255, 0.7)",
            }}
          >
            Strategies:
            <ButtonGroup>
              <Button
                sx={{
                  backgroundColor: "#DC2626",
                  color: "white",
                  "&:hover": { backgroundColor: "#B91C1C" },
                }}
              >
                Short-Term
              </Button>
              <Button
                sx={{
                  backgroundColor: "#059669",
                  color: "white",
                  "&:hover": { backgroundColor: "#047857" },
                }}
              >
                Long-Term
              </Button>
            </ButtonGroup>
          </Box>

          {/* Token Selector */}
          <Box
            sx={{
              display: "flex",
              gap: 1,
              alignItems: "center",
              color: "rgba(255, 255, 255, 0.7)",
            }}
          >
            Token:
            <ButtonGroup>
              <Button
                sx={{
                  backgroundColor: "#DC2626",
                  color: "white",
                  "&:hover": { backgroundColor: "#B91C1C" },
                }}
              >
                AI Agent
              </Button>
              <Button
                sx={{
                  backgroundColor: "#059669",
                  color: "white",
                  "&:hover": { backgroundColor: "#047857" },
                }}
              >
                Binance
              </Button>
              <Button
                sx={{
                  backgroundColor: "#DC2626",
                  color: "white",
                  "&:hover": { backgroundColor: "#B91C1C" },
                }}
              >
                Bybit
              </Button>
            </ButtonGroup>
          </Box>
        </Box>

        {/* Rest of your app content */}
        <Box sx={{ display: "flex", height: "calc(100vh - 140px)" }}>
          <Box sx={{ flex: 1, p: 2 }}>
            <BubbleChart
              timeFrame={timeFrame}
              marketCapRange={marketCapRange}
              searchQuery={searchQuery}
            />
          </Box>
          <Box sx={{ width: 380, backgroundColor: "#111" }}>
            <SignalsList timeFrame={timeFrame} />
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
