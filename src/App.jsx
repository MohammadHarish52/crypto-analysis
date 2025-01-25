import { useState } from "react";
import { ThemeProvider, Box, Button, ButtonGroup } from "@mui/material";
import Navbar from "./components/Navbar";
import BubbleChart from "./components/BubbleChart";
import SignalsList from "./components/SignalsList";
import Filters from "./components/Filters";
import { theme } from "./theme";
import "@fontsource/poppins/300.css";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";
import "./App.css";
import { AppWalletProvider } from "./components/AppWalletProvider";

function App() {
  const [timeFrame, setTimeFrame] = useState("short-term");
  const [marketCapRange, setMarketCapRange] = useState(100);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState([
    { name: "avoidTraps", label: "Avoid potential traps", checked: false },
    { name: "avoidBullish", label: "Avoid too bullish tokens", checked: false },
    {
      name: "avoidBreaks",
      label: "Avoid Market Structure Breaks",
      checked: false,
    },
    { name: "rsi", label: "RSI", checked: false },
  ]);

  const [anchorEl, setAnchorEl] = useState(null);

  const handleMarketCapRangeChange = (range) => {
    setMarketCapRange(range);
  };

  const handleTimeFrameChange = (value) => {
    setTimeFrame(value);
  };

  const handleFilterChange = (filterName) => {
    setFilters((prevFilters) =>
      prevFilters.map((filter) =>
        filter.name === filterName
          ? { ...filter, checked: !filter.checked }
          : filter
      )
    );
  };

  const handleButtonClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const availableFilters =
    timeFrame === "short-term" ? filters.slice(0, 3) : filters;

  return (
    <AppWalletProvider>
      <ThemeProvider theme={theme}>
        <Box
          sx={{
            minHeight: "100vh",
            width: "100vw",
            backgroundColor: "#000000",
            color: "text.primary",
            fontFamily: "Poppins",
            paddingTop: "64px",
          }}
        >
          <Navbar onMarketCapRangeChange={handleMarketCapRangeChange} />

          <Box sx={{ display: "flex", p: 2, gap: 4, alignItems: "center" }}>
            {/* Strategy Selector */}
            <Box
              sx={{
                display: "flex",
                gap: 2,
                alignItems: "center",
                color: "rgba(255, 255, 255, 0.8)",
              }}
            >
              <Box>Strategies:</Box>
              <ButtonGroup sx={{ gap: 1 }}>
                <Button
                  onClick={handleButtonClick}
                  sx={{
                    backgroundColor:
                      timeFrame === "short-term" ? "#059669" : "#333",
                    color:
                      timeFrame === "short-term"
                        ? "#fff"
                        : "rgba(255, 255, 255, 0.6)",
                    borderRadius: 1,
                    textTransform: "none",
                    px: 3,
                    fontWeight: 500,
                    display: "flex",
                    gap: 1,
                    "&:hover": {
                      backgroundColor:
                        timeFrame === "short-term" ? "#047857" : "#444",
                    },
                  }}
                >
                  Short-Term
                </Button>
                <Button
                  onClick={handleButtonClick}
                  sx={{
                    backgroundColor:
                      timeFrame === "long-term" ? "#059669" : "#333",
                    color:
                      timeFrame === "long-term"
                        ? "#fff"
                        : "rgba(255, 255, 255, 0.6)",
                    borderRadius: 1,
                    textTransform: "none",
                    px: 3,
                    fontWeight: 500,
                    "&:hover": {
                      backgroundColor:
                        timeFrame === "long-term" ? "#047857" : "#444",
                    },
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
                gap: 2,
                alignItems: "center",
                color: "rgba(255, 255, 255, 0.8)",
              }}
            >
              <Box>Token:</Box>
              <ButtonGroup sx={{ gap: 1 }}>
                <Button
                  sx={{
                    backgroundColor: "#059669",
                    color: "white",
                    borderRadius: 1,
                    textTransform: "none",
                    px: 3,
                    fontWeight: 500,
                    "&:hover": { backgroundColor: "#047857" },
                  }}
                >
                  AI Agent
                </Button>
                <Button
                  sx={{
                    backgroundColor: "#333",
                    color: "rgba(255, 255, 255, 0.6)",
                    borderRadius: 1,
                    textTransform: "none",
                    px: 3,
                    fontWeight: 500,
                    "&:hover": { backgroundColor: "#444" },
                  }}
                >
                  Binance
                </Button>
              </ButtonGroup>
            </Box>
          </Box>

          <Filters
            filters={availableFilters}
            onFilterChange={handleFilterChange}
            anchorEl={anchorEl}
            onClose={handleClose}
          />

          <Box sx={{ display: "flex", p: 2, gap: 4 }}>
            <Box sx={{ flex: 1 }}>
              <BubbleChart
                timeFrame={timeFrame}
                marketCapRange={marketCapRange}
                searchQuery={searchQuery}
              />
            </Box>
          </Box>

          <SignalsList timeFrame={timeFrame} />
        </Box>
      </ThemeProvider>
    </AppWalletProvider>
  );
}

export default App;
