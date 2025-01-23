import { useState } from "react";
import { ThemeProvider, Box, Typography } from "@mui/material";
import BubbleChart from "./components/BubbleChart";
import SignalsList from "./components/SignalsList";
import TimeFrameSelector from "./components/TimeFrameSelector";
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

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: "100vh",
          width: "100vw",
          backgroundColor: "#000000",
          color: "text.primary",
          p: 0,
          m: 0,
          overflowX: "hidden",
        }}
      >
        <Box
          sx={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: { xs: "column", lg: "row" },
          }}
        >
          {/* Main Content */}
          <Box
            sx={{
              flex: 1,
              p: { xs: 2, sm: 3 },
              order: { xs: 2, lg: 1 },
            }}
          >
            {/* Header */}
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                justifyContent: "space-between",
                alignItems: { xs: "stretch", sm: "center" },
                gap: 2,
                mb: 3,
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: "1.5rem", sm: "2rem" },
                }}
              >
                Crypto Analytics
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <TimeFrameSelector
                  timeFrame={timeFrame}
                  onTimeFrameChange={setTimeFrame}
                  marketCapRange={marketCapRange}
                  onMarketCapChange={setMarketCapRange}
                />
              </Box>
            </Box>

            {/* Search Bar */}
            <Box
              sx={{
                mb: 3,
                width: "100%",
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                borderRadius: 2,
                p: 1,
              }}
            >
              <input
                type="text"
                placeholder="Search cryptocurrencies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: "100%",
                  background: "none",
                  border: "none",
                  color: "white",
                  fontSize: "16px",
                  padding: "8px",
                  outline: "none",
                }}
              />
            </Box>

            {/* Chart */}
            <BubbleChart
              timeFrame={timeFrame}
              marketCapRange={marketCapRange}
              searchQuery={searchQuery}
            />
          </Box>

          {/* Right Sidebar */}
          <Box
            sx={{
              width: { xs: "100%", lg: 380 },
              backgroundColor: "#111",
              borderLeft: {
                xs: "none",
                lg: "1px solid rgba(255, 255, 255, 0.1)",
              },
              borderTop: {
                xs: "1px solid rgba(255, 255, 255, 0.1)",
                lg: "none",
              },
              p: { xs: 2, sm: 3 },
              overflowY: "auto",
              height: { xs: "auto", lg: "100vh" },
              order: { xs: 1, lg: 2 },
              "&::-webkit-scrollbar": {
                width: "8px",
              },
              "&::-webkit-scrollbar-track": {
                background: "rgba(255, 255, 255, 0.05)",
              },
              "&::-webkit-scrollbar-thumb": {
                background: "rgba(255, 255, 255, 0.1)",
                borderRadius: "4px",
              },
              "&::-webkit-scrollbar-thumb:hover": {
                background: "rgba(255, 255, 255, 0.2)",
              },
            }}
          >
            <SignalsList timeFrame={timeFrame} />
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
