import { useEffect, useRef, useState } from "react";
import { Chart } from "chart.js/auto";
import { Box, Paper } from "@mui/material";
import { styled } from "@mui/material/styles";
import TokenModal from "./TokenModal";
import { coinGeckoService } from "../services/coinGeckoService";
import { cacheService } from "../services/cacheService";

const ChartContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: "#000000",
  borderRadius: theme.spacing(2),
  minHeight: "600px",
  maxWidth: "100%",
  boxSizing: "border-box",
  boxShadow: "none",
  position: "relative",
  overflowX: "hidden",
  overflowY: "auto",
  margin: "0 auto",
  [theme.breakpoints.down("sm")]: {
    minHeight: "400px",
    padding: theme.spacing(1),
  },
}));

const BubbleChart = ({ marketCapRange, searchQuery }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const logoRefs = useRef(new Map());
  const [selectedToken, setSelectedToken] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchTokens = async () => {
      setLoading(true);
      try {
        const data = await coinGeckoService.getMarkets({
          vs_currency: "usd",
          order: "market_cap_desc",
          per_page: 100,
          sparkline: false,
          price_change_percentage: "24h",
        });

        setTokens(data);
        cacheService.set("bubbleData", data);
      } catch (error) {
        console.error("Error fetching tokens:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTokens();

    const interval = setInterval(fetchTokens, 2 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!chartRef.current || loading || tokens.length === 0) return;

    const ctx = chartRef.current.getContext("2d");

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    tokens.forEach((token) => {
      const img = new Image();
      img.src = token.image;
      logoRefs.current.set(token.symbol, img);
    });

    const COLUMNS = 4;
    const containerWidth = chartRef.current.width;
    const spacing = containerWidth / COLUMNS;
    const rows = Math.ceil(tokens.length / COLUMNS);

    chartRef.current.height = rows * spacing + spacing;

    const calculateBubbleSize = (marketCapChange) => {
      const absChange = Math.abs(marketCapChange);
      const minSize = spacing * 0.6;
      const maxSize = spacing * 1.8;

      const scale = Math.pow(Math.min(absChange / 50, 1), 0.7);
      return minSize + (maxSize - minSize) * scale;
    };

    const bubbleData = tokens.map((token, index) => {
      const column = index % COLUMNS;
      const row = Math.floor(index / COLUMNS);
      const marketCapChange = token.market_cap_change_percentage_24h || 0;

      return {
        x: column * spacing + spacing / 2,
        y: row * spacing + spacing / 2,
        r: calculateBubbleSize(marketCapChange) / 2,
        token,
      };
    });

    chartInstance.current = new Chart(ctx, {
      type: "bubble",
      data: {
        datasets: [
          {
            data: bubbleData,
            backgroundColor: bubbleData.map((bubble) =>
              bubble.token.market_cap_change_percentage_24h >= 0
                ? "rgba(0, 255, 0, 0.3)"
                : "rgba(255, 0, 0, 0.3)"
            ),
            borderColor: bubbleData.map((bubble) =>
              bubble.token.market_cap_change_percentage_24h >= 0
                ? "rgba(0, 255, 0, 0.8)"
                : "rgba(255, 0, 0, 0.8)"
            ),
            borderWidth: 2,
            hoverBackgroundColor: bubbleData.map((bubble) =>
              bubble.token.market_cap_change_percentage_24h >= 0
                ? "rgba(0, 255, 0, 0.4)"
                : "rgba(255, 0, 0, 0.4)"
            ),
            hoverBorderColor: bubbleData.map((bubble) =>
              bubble.token.market_cap_change_percentage_24h >= 0
                ? "rgba(0, 255, 0, 1)"
                : "rgba(255, 0, 0, 1)"
            ),
            hoverBorderWidth: 3,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: {
            top: spacing / 4,
            bottom: spacing / 4,
          },
        },
        scales: {
          x: {
            display: false,
            min: 0,
            max: containerWidth,
            ticks: {
              stepSize: spacing,
            },
          },
          y: {
            display: false,
            min: 0,
            max: rows * spacing,
            ticks: {
              stepSize: spacing,
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            enabled: false,
          },
        },
        animation: false,
        onHover: (event, elements) => {
          const canvas = event.chart.canvas;
          canvas.style.cursor = elements.length ? "pointer" : "default";
        },
        onClick: (event, elements) => {
          if (elements.length > 0) {
            const index = elements[0].index;
            const token = bubbleData[index].token;
            console.log("Bubble Clicked:", token);
            setSelectedToken(token);
            setModalOpen(true);
          }
        },
      },
    });

    const drawLogoAndPercentage = () => {
      const ctx = chartInstance.current.ctx;
      bubbleData.forEach((bubble) => {
        const x = chartInstance.current.scales.x.getPixelForValue(bubble.x);
        const y = chartInstance.current.scales.y.getPixelForValue(bubble.y);
        const logo = logoRefs.current.get(bubble.token.symbol);
        const bubbleRadius = bubble.r;

        if (logo) {
          const logoSize = Math.min(bubbleRadius * 1.5, 45);

          ctx.save();
          ctx.beginPath();
          ctx.arc(x, y, logoSize / 2, 0, Math.PI * 2);
          ctx.clip();
          ctx.drawImage(
            logo,
            x - logoSize / 2,
            y - logoSize / 2,
            logoSize,
            logoSize
          );
          ctx.restore();

          const percentage = `${(
            bubble.token.market_cap_change_percentage_24h || 0
          ).toFixed(1)}%`;
          ctx.save();
          ctx.font = "bold 12px Arial";

          const textWidth = ctx.measureText(percentage).width;
          const textY = y + bubbleRadius + 15;

          ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
          ctx.fillRect(x - textWidth / 2 - 4, textY - 8, textWidth + 8, 20);

          ctx.fillStyle = "white";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(percentage, x, textY);
          ctx.restore();
        }
      });
    };

    const originalRender = chartInstance.current.draw;
    chartInstance.current.draw = function () {
      originalRender.apply(this, arguments);
      drawLogoAndPercentage();
    };

    chartInstance.current.update();

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [tokens, loading]);

  return (
    <Box sx={{ width: "100%", overflow: "hidden" }}>
      <ChartContainer>
        <canvas ref={chartRef} />
      </ChartContainer>
      <TokenModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        token={selectedToken}
      />
    </Box>
  );
};

export default BubbleChart;
