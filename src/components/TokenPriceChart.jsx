import { useEffect, useRef, useState } from "react";
import { Chart } from "chart.js/auto";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import { Box, CircularProgress } from "@mui/material";
import { coinGeckoService } from "../services/coinGeckoService";

const ChartContainer = styled("div")({
  width: "100%",
  height: "100%",
  position: "relative",
});

const LoadingContainer = styled(Box)({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

const TokenPriceChart = ({ tokenId, timeFrame }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPriceData = async () => {
      if (!tokenId) return;

      setLoading(true);
      setError(null);

      try {
        // Map timeframe to days and interval
        const timeFrameConfig = {
          hour: { days: 1, interval: "minutely" },
          day: { days: 1, interval: "hourly" },
          week: { days: 7, interval: "hourly" },
          month: { days: 30, interval: "daily" },
          year: { days: 365, interval: "daily" },
        };

        const config = timeFrameConfig[timeFrame.toLowerCase()];
        if (!config) {
          throw new Error(`Invalid timeframe: ${timeFrame}`);
        }

        const data = await coinGeckoService.getMarketChart(tokenId, {
          vs_currency: "usd",
          days: config.days,
          interval: config.interval,
        });

        if (chartInstance.current) {
          chartInstance.current.destroy();
        }

        const ctx = chartRef.current.getContext("2d");
        const prices = data.prices;

        // Format dates based on timeFrame
        const formatDate = (timestamp) => {
          const date = new Date(timestamp);
          switch (timeFrame.toLowerCase()) {
            case "hour":
              return date.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              });
            case "day":
              return date.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              });
            case "week":
              return date.toLocaleDateString([], { weekday: "short" });
            case "month":
              return date.toLocaleDateString([], {
                month: "short",
                day: "numeric",
              });
            case "year":
              return date.toLocaleDateString([], {
                month: "short",
                year: "2-digit",
              });
            default:
              return date.toLocaleDateString();
          }
        };

        chartInstance.current = new Chart(ctx, {
          type: "line",
          data: {
            labels: prices.map((price) => formatDate(price[0])),
            datasets: [
              {
                label: "Price",
                data: prices.map((price) => price[1]),
                borderColor: "#2563EB",
                backgroundColor: "rgba(37, 99, 235, 0.1)",
                fill: true,
                tension: 0.4,
                pointRadius: 0,
                borderWidth: 2,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
              intersect: false,
              mode: "index",
            },
            scales: {
              x: {
                display: true,
                grid: {
                  display: false,
                  drawBorder: false,
                },
                ticks: {
                  color: "rgba(255, 255, 255, 0.5)",
                  maxTicksLimit: 6,
                  font: {
                    size: 10,
                  },
                },
              },
              y: {
                display: true,
                position: "right",
                grid: {
                  color: "rgba(255, 255, 255, 0.1)",
                  drawBorder: false,
                },
                ticks: {
                  color: "rgba(255, 255, 255, 0.5)",
                  callback: (value) => `$${value.toLocaleString()}`,
                  font: {
                    size: 10,
                  },
                },
              },
            },
            plugins: {
              legend: {
                display: false,
              },
              tooltip: {
                backgroundColor: "rgba(0, 0, 0, 0.8)",
                titleColor: "rgba(255, 255, 255, 0.8)",
                bodyColor: "rgba(255, 255, 255, 0.8)",
                displayColors: false,
                callbacks: {
                  label: (context) => `$${context.parsed.y.toLocaleString()}`,
                },
              },
            },
          },
        });

        setLoading(false);
      } catch (error) {
        console.error("Error fetching price data:", error);
        setError(error);
        setLoading(false);
      }
    };

    fetchPriceData();

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [tokenId, timeFrame]);

  if (error) return <div>Error loading chart data</div>;

  return (
    <ChartContainer>
      <canvas ref={chartRef} />
      {loading && (
        <LoadingContainer>
          <CircularProgress size={24} />
        </LoadingContainer>
      )}
    </ChartContainer>
  );
};

TokenPriceChart.propTypes = {
  tokenId: PropTypes.string.isRequired,
  timeFrame: PropTypes.string.isRequired,
};

export default TokenPriceChart;
