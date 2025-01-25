import { useEffect, useRef, useState } from "react";
import { Chart } from "chart.js/auto";
import axios from "axios";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import { Box, CircularProgress } from "@mui/material";

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
        // Get days based on timeFrame
        const days = {
          hour: 1,
          day: 1,
          week: 7,
          month: 30,
          year: 365,
        }[timeFrame.toLowerCase()];

        const interval =
          days === 1 ? "5minute" : days <= 7 ? "hourly" : "daily";

        const response = await axios.get(
          `https://api.coingecko.com/api/v3/coins/${tokenId}/market_chart`,
          {
            params: {
              vs_currency: "usd",
              days: days,
              interval: interval,
            },
          }
        );

        if (chartInstance.current) {
          chartInstance.current.destroy();
        }

        const ctx = chartRef.current.getContext("2d");
        const prices = response.data.prices;

        // Format dates based on timeFrame
        const formatDate = (timestamp) => {
          const date = new Date(timestamp);
          if (timeFrame.toLowerCase() === "hour") {
            return date.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            });
          } else if (timeFrame.toLowerCase() === "day") {
            return date.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            });
          } else {
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
