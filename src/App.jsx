import { useState } from "react";
import {
  ThemeProvider,
  Box,
  Button,
  ButtonGroup,
  useTheme,
  useMediaQuery,
  Menu,
  Typography,
} from "@mui/material";
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
import { FaFilter } from "react-icons/fa";

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
  const [filterMenuAnchor, setFilterMenuAnchor] = useState(null);

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

  const handleFilterMenuOpen = (event) => {
    setFilterMenuAnchor(event.currentTarget);
  };

  const handleFilterMenuClose = () => {
    setFilterMenuAnchor(null);
  };

  const availableFilters =
    timeFrame === "short-term" ? filters.slice(0, 3) : filters;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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

          {/* Filter Button for Mobile */}
          {isMobile ? (
            <>
              <Box sx={{ p: 2 }}>
                <Button
                  onClick={handleFilterMenuOpen}
                  startIcon={<FaFilter />}
                  sx={{
                    width: "100%",
                    backgroundColor: "#333",
                    color: "white",
                    "&:hover": { backgroundColor: "#444" },
                    py: 1,
                    borderRadius: 1,
                  }}
                >
                  Filters & Options
                </Button>
              </Box>

              <Menu
                anchorEl={filterMenuAnchor}
                open={Boolean(filterMenuAnchor)}
                onClose={handleFilterMenuClose}
                PaperProps={{
                  sx: {
                    backgroundColor: "#19202F",
                    width: "calc(100% - 32px)",
                    maxWidth: "none",
                    mt: 1,
                    "& .MuiList-root": {
                      py: 2,
                    },
                  },
                }}
                transformOrigin={{ horizontal: "center", vertical: "top" }}
                anchorOrigin={{ horizontal: "center", vertical: "bottom" }}
              >
                {/* Strategy Selector */}
                <Box sx={{ px: 2, mb: 2 }}>
                  <Typography sx={{ color: "rgba(255, 255, 255, 0.8)", mb: 1 }}>
                    Strategies
                  </Typography>
                  <ButtonGroup
                    sx={{
                      width: "100%",
                      flexDirection: "column",
                      gap: 1,
                    }}
                  >
                    <Button
                      onClick={handleButtonClick}
                      sx={{
                        backgroundColor:
                          timeFrame === "short-term" ? "#059669" : "#333",
                        color:
                          timeFrame === "short-term"
                            ? "#fff"
                            : "rgba(255, 255, 255, 0.6)",
                        width: "100%",
                        justifyContent: "flex-start",
                        textTransform: "none",
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
                        width: "100%",
                        justifyContent: "flex-start",
                        textTransform: "none",
                      }}
                    >
                      Long-Term
                    </Button>
                  </ButtonGroup>
                </Box>

                {/* Token Selector */}
                <Box sx={{ px: 2 }}>
                  <Typography sx={{ color: "rgba(255, 255, 255, 0.8)", mb: 1 }}>
                    Token
                  </Typography>
                  <ButtonGroup
                    sx={{
                      width: "100%",
                      flexDirection: "column",
                      gap: 1,
                    }}
                  >
                    <Button
                      sx={{
                        backgroundColor: "#059669",
                        color: "white",
                        width: "100%",
                        justifyContent: "flex-start",
                        textTransform: "none",
                      }}
                    >
                      AI Agent
                    </Button>
                    <Button
                      sx={{
                        backgroundColor: "#333",
                        color: "rgba(255, 255, 255, 0.6)",
                        width: "100%",
                        justifyContent: "flex-start",
                        textTransform: "none",
                      }}
                    >
                      Binance
                    </Button>
                  </ButtonGroup>
                </Box>
              </Menu>
            </>
          ) : (
            // Original desktop layout
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                p: 2,
                gap: 2,
                alignItems: { xs: "stretch", sm: "center" },
              }}
            >
              {/* Strategy Selector */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  gap: 2,
                  alignItems: { xs: "flex-start", sm: "center" },
                  color: "rgba(255, 255, 255, 0.8)",
                  width: { xs: "100%", sm: "auto" },
                }}
              >
                <Box>Strategies:</Box>
                <ButtonGroup
                  sx={{
                    gap: 1,
                    width: { xs: "100%", sm: "auto" },
                    flexDirection: { xs: "column", sm: "row" },
                  }}
                >
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
                      width: { xs: "100%", sm: "auto" },
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
                      width: { xs: "100%", sm: "auto" },
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
                  flexDirection: { xs: "column", sm: "row" },
                  gap: 2,
                  alignItems: { xs: "flex-start", sm: "center" },
                  color: "rgba(255, 255, 255, 0.8)",
                  width: { xs: "100%", sm: "auto" },
                }}
              >
                <Box>Token:</Box>
                <ButtonGroup
                  sx={{
                    gap: 1,
                    width: { xs: "100%", sm: "auto" },
                    flexDirection: { xs: "column", sm: "row" },
                  }}
                >
                  <Button
                    sx={{
                      backgroundColor: "#059669",
                      color: "white",
                      borderRadius: 1,
                      textTransform: "none",
                      px: 3,
                      fontWeight: 500,
                      width: { xs: "100%", sm: "auto" },
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
                      width: { xs: "100%", sm: "auto" },
                      "&:hover": { backgroundColor: "#444" },
                    }}
                  >
                    Binance
                  </Button>
                </ButtonGroup>
              </Box>
            </Box>
          )}

          <Filters
            filters={availableFilters}
            onFilterChange={handleFilterChange}
            anchorEl={anchorEl}
            onClose={handleClose}
          />

          {/* Main Content */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" }, // Stack on mobile, row on desktop
              p: 2,
              gap: 4,
            }}
          >
            {/* Chart Section */}
            <Box
              sx={{
                flex: 1,
                width: "100%",
              }}
            >
              <BubbleChart
                timeFrame={timeFrame}
                marketCapRange={marketCapRange}
                searchQuery={searchQuery}
              />
            </Box>

            {/* Signals List - Fixed on desktop, scrollable on mobile */}
            <Box
              sx={{
                width: { xs: "100%", md: "380px" },
                position: { xs: "relative", md: "fixed" },
                right: { md: 0 },
                top: { md: 0 },
                height: { md: "100vh" },
                backgroundColor: "#000",
                overflowY: "auto",
              }}
            >
              <SignalsList timeFrame={timeFrame} />
            </Box>
          </Box>
        </Box>
      </ThemeProvider>
    </AppWalletProvider>
  );
}

export default App;
