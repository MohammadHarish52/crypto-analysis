import { useEffect, useRef, useState } from "react";
import { Chart } from "chart.js/auto";
import axios from "axios";
import { Box, Paper, Modal, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import TokenPriceChart from "./TokenPriceChart";

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
  position: "relative",
  overflow: "hidden",
  "&:before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "30%",
    background:
      "linear-gradient(180deg, rgba(239, 68, 68, 0.1) 0%, rgba(0, 0, 0, 0) 100%)",
    pointerEvents: "none",
  },
  "&:after": {
    content: '""',
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "30%",
    background:
      "linear-gradient(0deg, rgba(52, 211, 153, 0.1) 0%, rgba(0, 0, 0, 0) 100%)",
    pointerEvents: "none",
  },
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
  backgroundColor: "#1A1A1A",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  borderRadius: theme.spacing(2),
  padding: theme.spacing(3),
  width: "400px",
  maxWidth: "90vw",
  position: "relative",
}));

const CloseButton = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: 16,
  right: 16,
  cursor: "pointer",
  color: "rgba(255, 255, 255, 0.5)",
  "&:hover": {
    color: "rgba(255, 255, 255, 0.8)",
  },
}));

const TimePeriodButton = styled(Box)(({ theme, isActive }) => ({
  padding: "8px 16px",
  borderRadius: theme.spacing(1),
  backgroundColor: isActive
    ? theme.palette.primary.main
    : "rgba(255, 255, 255, 0.05)",
  color: isActive ? "#fff" : "rgba(255, 255, 255, 0.7)",
  cursor: "pointer",
  transition: "all 0.2s",
  "&:hover": {
    backgroundColor: isActive
      ? theme.palette.primary.main
      : "rgba(255, 255, 255, 0.1)",
  },
}));

const BubbleLabel = styled("div")({
  position: "absolute",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  color: "white",
  fontSize: "12px",
  pointerEvents: "none",
  textAlign: "center",
  "& img": {
    width: "20px",
    height: "20px",
    marginBottom: "2px",
  },
});

const BubbleChart = ({ timeFrame, marketCapRange, searchQuery }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [tokens, setTokens] = useState([]);
  const [images, setImages] = useState({});
  const [selectedToken, setSelectedToken] = useState(null);
  const [tokenChart, setTokenChart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [priceChanges, setPriceChanges] = useState({});
  const [selectedPeriod, setSelectedPeriod] = useState("24h");

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
          `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${marketCapRange}&sparkline=false&price_change_percentage=24h`
        );

        const processedTokens = response.data
          .map((token) => ({
            id: token.id,
            symbol: token.symbol.toUpperCase(),
            name: token.name,
            image: token.image,
            price_change_percentage_24h: token.price_change_percentage_24h || 0,
            market_cap_change_percentage_24h:
              token.market_cap_change_percentage_24h || 0,
            current_price: token.current_price,
            market_cap: token.market_cap,
            total_volume: token.total_volume,
            market_cap_rank: token.market_cap_rank,
          }))
          .filter((token) =>
            token.symbol
              .toLowerCase()
              .includes(searchQuery?.toLowerCase() || "")
          );

        setTokens(processedTokens);
      } catch (error) {
        console.error("Error fetching tokens:", error);
        setTokens([]);
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

  // Add new effect to fetch price changes when modal opens
  useEffect(() => {
    const fetchPriceChanges = async () => {
      if (!selectedToken) return;

      try {
        const response = await axios.get(
          `https://api.coingecko.com/api/v3/coins/${selectedToken.id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`
        );

        const marketData = response.data.market_data;
        setPriceChanges({
          "1h": marketData.price_change_percentage_1h_in_currency?.usd || 0,
          "24h": marketData.price_change_percentage_24h || 0,
          "7d": marketData.price_change_percentage_7d || 0,
          "30d": marketData.price_change_percentage_30d || 0,
          "1y": marketData.price_change_percentage_1y || 0,
        });
      } catch (error) {
        console.error("Error fetching price changes:", error);
        setPriceChanges({});
      }
    };

    if (selectedToken) {
      fetchPriceChanges();
    }
  }, [selectedToken]);

  // Update chart initialization with hover handling
  useEffect(() => {
    if (!chartRef.current || loading || !tokens.length) return;

    const loadAndDrawChart = async () => {
      // Pre-load all images before drawing
      const loadImage = (src) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = reject;
          img.src = src;
        });
      };

      try {
        // Load all images first
        const imagePromises = tokens.map((token) => loadImage(token.image));
        const loadedImages = await Promise.all(imagePromises);
        const imageMap = tokens.reduce((acc, token, index) => {
          acc[token.symbol] = loadedImages[index];
          return acc;
        }, {});

        if (chartInstance.current) {
          chartInstance.current.destroy();
        }

        const ctx = chartRef.current.getContext("2d");
        if (!ctx) return;

        const scatterData = tokens.map((token, index) => {
          const rows = Math.ceil(Math.sqrt(tokens.length));
          const cols = Math.ceil(tokens.length / rows);

          const row = Math.floor(index / cols);
          const col = index % cols;

          const jitterX = (Math.random() - 0.5) * 20;
          const jitterY = (Math.random() - 0.5) * 20;

          return {
            x: (col - cols / 2) * 60 + jitterX, // Increased spacing
            y: (row - rows / 2) * 60 + jitterY, // Increased spacing
            r: 25, // Adjusted size
            label: token.symbol,
            token: token,
            image: imageMap[token.symbol],
          };
        });

        chartInstance.current = new Chart(ctx, {
          type: "bubble",
          data: {
            datasets: [
              {
                label: "Cryptocurrencies",
                data: scatterData,
                backgroundColor: scatterData.map((item) =>
                  item.token.price_change_percentage_24h > 0
                    ? "rgba(52, 211, 153, 0.8)"
                    : "rgba(239, 68, 68, 0.8)"
                ),
                borderColor: scatterData.map((item) =>
                  item.token.price_change_percentage_24h > 0
                    ? "rgba(52, 211, 153, 1)"
                    : "rgba(239, 68, 68, 1)"
                ),
                borderWidth: 1,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: false,
            onHover: (event, elements) => {
              if (elements && elements.length > 0) {
                const dataIndex = elements[0].index;
                setSelectedToken(scatterData[dataIndex].token);
                setMousePosition({
                  x: event.native.clientX,
                  y: event.native.clientY,
                });
              } else {
                setSelectedToken(null);
              }
              event.native.target.style.cursor = elements?.length
                ? "pointer"
                : "default";
            },
            plugins: {
              tooltip: {
                enabled: false,
              },
              legend: {
                display: false,
              },
              customCanvasBackgroundColor: {
                beforeDraw: (chart) => {
                  const ctx = chart.ctx;
                  const xAxis = chart.scales.x;
                  const yAxis = chart.scales.y;

                  chart.data.datasets[0].data.forEach((point) => {
                    const token = point.token;
                    const x = xAxis.getPixelForValue(point.x);
                    const y = yAxis.getPixelForValue(point.y);

                    // Draw circle background
                    ctx.save();
                    ctx.beginPath();
                    ctx.arc(x, y, point.r, 0, Math.PI * 2);
                    ctx.fillStyle =
                      point.token.price_change_percentage_24h > 0
                        ? "rgba(52, 211, 153, 0.8)"
                        : "rgba(239, 68, 68, 0.8)";
                    ctx.fill();
                    ctx.restore();

                    // Draw crypto logo
                    if (point.image) {
                      ctx.save();
                      ctx.beginPath();
                      ctx.arc(x, y, 15, 0, Math.PI * 2);
                      ctx.clip();
                      ctx.drawImage(point.image, x - 15, y - 15, 30, 30);
                      ctx.restore();
                    }

                    // Draw symbol
                    ctx.save();
                    ctx.font = "bold 12px Arial";
                    ctx.fillStyle = "white";
                    ctx.textAlign = "center";
                    ctx.fillText(token.symbol, x, y + 5);

                    // Draw percentage
                    const percentage = `${token.price_change_percentage_24h.toFixed(
                      1
                    )}%`;
                    ctx.font = "bold 11px Arial";
                    ctx.fillStyle = "white";
                    ctx.fillText(percentage, x, y + 20);
                    ctx.restore();
                  });
                },
              },
            },
            scales: {
              x: {
                display: false,
                min: -200,
                max: 200,
              },
              y: {
                display: false,
                min: -200,
                max: 200,
                reverse: true,
              },
            },
          },
        });
      } catch (error) {
        console.error("Error loading images:", error);
      }
    };

    loadAndDrawChart();
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

      {selectedToken && (
        <Box
          sx={{
            position: "fixed",
            top: mousePosition.y,
            left: mousePosition.x,
            transform: "translate(-50%, -100%)",
            zIndex: 1000,
            pointerEvents: "none",
          }}
        >
          <ModalContent>
            <CloseButton onClick={handleCloseModal}>✕</CloseButton>

            {/* Header */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
              <img
                src={selectedToken.image}
                alt={selectedToken.name}
                style={{ width: 32, height: 32 }}
              />
              <Box>
                <Typography variant="h6">{selectedToken.name}</Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {selectedToken.symbol.toUpperCase()}
                </Typography>
              </Box>
            </Box>

            {/* Stats */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 2,
                mb: 3,
              }}
            >
              <Box>
                <Typography variant="caption" sx={{ color: "text.secondary" }}>
                  Rank
                </Typography>
                <Typography variant="body1">
                  #{selectedToken.market_cap_rank}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: "text.secondary" }}>
                  Market Cap
                </Typography>
                <Typography variant="body1">
                  ${(selectedToken.market_cap / 1e9).toFixed(1)}B
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: "text.secondary" }}>
                  24h Volume
                </Typography>
                <Typography variant="body1">
                  ${(selectedToken.total_volume / 1e9).toFixed(1)}B
                </Typography>
              </Box>
            </Box>

            {/* Links Section */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Links
              </Typography>
              <Box sx={{ display: "flex", gap: 1 }}>
                {/* Add your link icons here */}
              </Box>
            </Box>

            {/* Price Input */}
            <Box
              sx={{
                mb: 3,
                p: 1,
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                borderRadius: 1,
                display: "flex",
                alignItems: "center",
              }}
            >
              <Typography sx={{ color: "text.secondary", mr: 1 }}>1</Typography>
              <Typography>
                {selectedToken.symbol.toUpperCase()} = $
                {selectedToken.current_price}
              </Typography>
            </Box>

            {/* Updated Time Period Selector */}
            <Box sx={{ display: "flex", gap: 1, mb: 3 }}>
              {[
                { label: "Hour", value: "1h" },
                { label: "Day", value: "24h" },
                { label: "Week", value: "7d" },
                { label: "Month", value: "30d" },
                { label: "Year", value: "1y" },
              ].map(({ label, value }) => (
                <TimePeriodButton
                  key={value}
                  isActive={selectedPeriod === value}
                  onClick={() => setSelectedPeriod(value)}
                  sx={{ pointerEvents: "auto" }}
                >
                  <Typography variant="caption">{label}</Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color:
                        (priceChanges[value] || 0) > 0 ? "#4ADE80" : "#EF4444",
                    }}
                  >
                    {priceChanges[value]
                      ? `${priceChanges[value].toFixed(1)}%`
                      : "-%"}
                  </Typography>
                </TimePeriodButton>
              ))}
            </Box>

            {/* Price Chart */}
            {tokenChart && (
              <Box sx={{ height: 200 }}>
                <TokenPriceChart data={tokenChart} period={selectedPeriod} />
              </Box>
            )}
          </ModalContent>
        </Box>
      )}
    </>
  );
};

export default BubbleChart;
