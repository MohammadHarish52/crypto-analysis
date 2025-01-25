import { useEffect, useRef, useState } from "react";
import { Chart } from "chart.js/auto";
import axios from "axios";
import { Box, Paper } from "@mui/material";
import { styled } from "@mui/material/styles";

const ChartContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: "#000000",
  borderRadius: theme.spacing(2),
  height: "600px",
  width: "100%",
  boxShadow: "none",
  position: "relative",
  overflow: "hidden",
  [theme.breakpoints.down("sm")]: {
    height: "400px",
    padding: theme.spacing(1),
  },
}));

const BubbleChart = ({ marketCapRange, searchQuery }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTokens = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${marketCapRange}&sparkline=false&price_change_percentage=24h`
        );

        const processedTokens = response.data
          .map((token) => ({
            symbol: token.symbol.toUpperCase(),
            image: token.image,
            price_change_percentage_24h: token.price_change_percentage_24h || 0,
            market_cap_change_percentage_24h:
              token.market_cap_change_percentage_24h || 0,
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

  useEffect(() => {
    if (!chartRef.current || loading || !tokens.length) return;

    const ctx = chartRef.current.getContext("2d");
    if (!ctx) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const bubbleData = tokens.map((token, index) => {
      // Calculate size based on market cap change
      const change = Math.abs(token.market_cap_change_percentage_24h);
      const size = Math.max(30, Math.min(60, change)); // Size between 30 and 60

      // Create grid-like layout
      const columns = Math.ceil(Math.sqrt(tokens.length));
      const row = Math.floor(index / columns);
      const col = index % columns;
      const spacing = 80;

      return {
        x: col * spacing,
        y: row * spacing,
        r: size / 2,
        token,
      };
    });

    chartInstance.current = new Chart(ctx, {
      type: "bubble",
      data: {
        datasets: [
          {
            data: bubbleData,
            backgroundColor: bubbleData.map((item) =>
              item.token.price_change_percentage_24h > 0
                ? "rgba(52, 211, 153, 0.8)"
                : "rgba(239, 68, 68, 0.8)"
            ),
            borderWidth: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          tooltip: { enabled: false },
          legend: { display: false },
        },
        scales: {
          x: { display: false },
          y: { display: false, reverse: true },
        },
        animation: false,
        layout: {
          padding: 40,
        },
      },
    });

    // Draw logos and percentages
    bubbleData.forEach((bubble) => {
      const x = chartInstance.current.scales.x.getPixelForValue(bubble.x);
      const y = chartInstance.current.scales.y.getPixelForValue(bubble.y);

      // Draw logo
      const img = new Image();
      img.src = bubble.token.image;
      img.onload = () => {
        ctx.save();
        ctx.beginPath();
        ctx.arc(x, y, 15, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(img, x - 15, y - 15, 30, 30);
        ctx.restore();

        // Draw percentage
        ctx.save();
        ctx.font = "bold 12px Arial";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.fillText(
          `${bubble.token.price_change_percentage_24h.toFixed(1)}%`,
          x,
          y + bubble.r + 15
        );
        ctx.restore();
      };
    });
  }, [tokens, loading]);

  return (
    <ChartContainer>
      <canvas ref={chartRef} />
    </ChartContainer>
  );
};

export default BubbleChart;
