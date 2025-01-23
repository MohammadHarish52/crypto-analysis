import { useEffect, useRef, useState } from "react";
import { Chart } from "chart.js/auto";
import axios from "axios";
import { Box, Paper, Modal, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

const ChartContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.grey[900]}`,
  borderRadius: theme.spacing(2),
  height: "600px",
  [theme.breakpoints.down("sm")]: {
    height: "400px",
  },
  width: "100%",
  boxShadow: "none",
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
  "& canvas": {
    backgroundColor: "transparent",
  },
}));

const TokenModal = styled(Modal)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const ModalContent = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.grey[800]}`,
  borderRadius: theme.spacing(2),
  padding: theme.spacing(4),
  width: "90%",
  maxWidth: 800,
  maxHeight: "90vh",
  overflow: "auto",
}));

const BubbleChart = ({ timeFrame, marketCapRange, searchQuery }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [tokens, setTokens] = useState([]);
  const [images, setImages] = useState({});
  const [selectedToken, setSelectedToken] = useState(null);
  const [tokenChart, setTokenChart] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load token images
  useEffect(() => {
    const loadImages = async (tokensData) => {
      const imagePromises = tokensData.map((token) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.src = token.image;
          img.onload = () => resolve({ id: token.symbol, image: img });
          img.onerror = () => resolve({ id: token.symbol, image: null });
        });
      });

      const loadedImages = await Promise.all(imagePromises);
      const imageMap = {};
      loadedImages.forEach(({ id, image }) => {
        imageMap[id] = image;
      });
      setImages(imageMap);
    };

    if (tokens.length > 0) {
      loadImages(tokens);
    }
  }, [tokens]);

  // Fetch tokens data
  useEffect(() => {
    const fetchTokens = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${marketCapRange}&sparkline=true`
        );
        const filteredTokens = response.data.filter((token) =>
          token.symbol.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setTokens(filteredTokens);
      } catch (error) {
        console.error("Error fetching tokens:", error);
        setTokens([]); // Reset tokens on error
      } finally {
        setLoading(false);
      }
    };

    fetchTokens();
  }, [marketCapRange, searchQuery]);

  // Fetch token price history when modal opens
  useEffect(() => {
    const fetchTokenHistory = async () => {
      if (!selectedToken) return;

      try {
        const response = await axios.get(
          `https://api.coingecko.com/api/v3/coins/${selectedToken.id}/market_chart?vs_currency=usd&days=30`
        );
        setTokenChart(response.data);
      } catch (error) {
        console.error("Error fetching token history:", error);
      }
    };

    if (selectedToken) {
      fetchTokenHistory();
    }
  }, [selectedToken]);

  // Chart initialization and update
  useEffect(() => {
    if (!chartRef.current || loading) return;

    const initChart = () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const ctx = chartRef.current.getContext("2d");
      if (!ctx) return;

      const bubbleData = tokens.map((token) => ({
        x: parseFloat(token.price_change_percentage_24h) || 0,
        y: parseFloat(token.market_cap_change_percentage_24h) || 0,
        r: 20,
        label: token.symbol.toUpperCase(),
      }));

      // Only create chart if we have data
      if (bubbleData.length > 0) {
        chartInstance.current = new Chart(ctx, {
          type: "bubble",
          data: {
            datasets: [
              {
                label: "Cryptocurrencies",
                data: bubbleData,
                backgroundColor: bubbleData.map((item) =>
                  item.y > 0
                    ? "rgba(52, 211, 153, 0.8)"
                    : "rgba(239, 68, 68, 0.8)"
                ),
                borderColor: bubbleData.map((item) =>
                  item.y > 0 ? "rgba(52, 211, 153, 1)" : "rgba(239, 68, 68, 1)"
                ),
                borderWidth: 2,
                hoverBackgroundColor: "rgba(99, 102, 241, 0.9)",
                hoverBorderColor: "rgba(99, 102, 241, 1)",
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: false,
            plugins: {
              tooltip: {
                enabled: true,
                backgroundColor: "rgba(0, 0, 0, 0.8)",
                titleFont: {
                  family: "Poppins",
                },
                callbacks: {
                  label: (context) => {
                    const data = context.raw;
                    return [
                      `${data.label}`,
                      `Price Change: ${data.x.toFixed(2)}%`,
                      `Market Cap Change: ${data.y.toFixed(2)}%`,
                    ];
                  },
                },
              },
            },
            scales: {
              x: {
                min: -30,
                max: 30,
                grid: {
                  color: "rgba(255, 255, 255, 0.1)",
                  borderColor: "rgba(255, 255, 255, 0.1)",
                },
                ticks: {
                  color: "rgba(255, 255, 255, 0.8)",
                  callback: (value) => `${value}%`,
                },
                title: {
                  display: true,
                  text: "Price Change 24h (%)",
                  color: "rgba(255, 255, 255, 0.8)",
                  font: {
                    size: 12,
                    family: "Poppins",
                  },
                },
              },
              y: {
                min: -30,
                max: 30,
                grid: {
                  color: "rgba(255, 255, 255, 0.1)",
                  borderColor: "rgba(255, 255, 255, 0.1)",
                },
                ticks: {
                  color: "rgba(255, 255, 255, 0.8)",
                  callback: (value) => `${value}%`,
                },
                title: {
                  display: true,
                  text: "Market Cap Change 24h (%)",
                  color: "rgba(255, 255, 255, 0.8)",
                  font: {
                    size: 12,
                    family: "Poppins",
                  },
                },
              },
            },
          },
        });
      }
    };

    // Debounce the chart initialization
    const timeoutId = setTimeout(initChart, 100);

    return () => {
      clearTimeout(timeoutId);
      if (chartInstance.current) {
        chartInstance.current.destroy();
        chartInstance.current = null;
      }
    };
  }, [tokens, loading]);

  const handleCloseModal = () => {
    setSelectedToken(null);
    setTokenChart(null);
  };

  return (
    <>
      <ChartContainer>
        {loading ? (
          <Box
            sx={{
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "text.secondary",
            }}
          >
            Loading...
          </Box>
        ) : tokens.length === 0 ? (
          <Box
            sx={{
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "text.secondary",
            }}
          >
            No data available
          </Box>
        ) : (
          <canvas
            ref={chartRef}
            style={{
              width: "100%",
              height: "100%",
              display: "block",
            }}
          />
        )}
      </ChartContainer>

      <TokenModal open={!!selectedToken} onClose={handleCloseModal}>
        <ModalContent>
          {selectedToken && (
            <Box sx={{ color: "text.primary" }}>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}
              >
                <img
                  src={selectedToken.image}
                  alt={selectedToken.name}
                  style={{ width: 40, height: 40 }}
                />
                <Typography variant="h5">
                  {selectedToken.name} ({selectedToken.symbol.toUpperCase()})
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  Price: ${selectedToken.current_price}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  Market Cap: ${selectedToken.market_cap.toLocaleString()}
                </Typography>
                <Typography variant="body1">
                  24h Change:{" "}
                  {selectedToken.price_change_percentage_24h.toFixed(2)}%
                </Typography>
              </Box>

              {tokenChart && (
                <Box sx={{ height: 300 }}>
                  {/* Add price chart here using Chart.js */}
                </Box>
              )}
            </Box>
          )}
        </ModalContent>
      </TokenModal>
    </>
  );
};

export default BubbleChart;
