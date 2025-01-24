import { useEffect, useRef } from "react";
import { Chart } from "chart.js/auto";
import "chartjs-adapter-date-fns";
import { styled } from "@mui/material/styles";

const ChartContainer = styled("div")({
  width: "100%",
  height: "100%",
});

const TokenPriceChart = ({ data, period }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!chartRef.current || !data) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext("2d");

    // Filter data based on selected period
    const now = Date.now();
    const periodInMs = {
      "1h": 60 * 60 * 1000,
      "24h": 24 * 60 * 60 * 1000,
      "7d": 7 * 24 * 60 * 60 * 1000,
      "30d": 30 * 24 * 60 * 60 * 1000,
      "1y": 365 * 24 * 60 * 60 * 1000,
    };

    const filteredPrices = data.prices.filter(
      ([timestamp]) => timestamp >= now - periodInMs[period]
    );

    chartInstance.current = new Chart(ctx, {
      type: "line",
      data: {
        datasets: [
          {
            data: filteredPrices.map(([time, price]) => ({
              x: new Date(time),
              y: price,
            })),
            borderColor: "#6366F1",
            borderWidth: 2,
            fill: true,
            backgroundColor: "rgba(99, 102, 241, 0.1)",
            tension: 0.4,
            pointRadius: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          x: {
            type: "time",
            time: {
              unit: "day",
            },
            grid: {
              display: false,
            },
            ticks: {
              color: "rgba(255, 255, 255, 0.5)",
            },
          },
          y: {
            grid: {
              color: "rgba(255, 255, 255, 0.05)",
            },
            ticks: {
              color: "rgba(255, 255, 255, 0.5)",
            },
          },
        },
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
        chartInstance.current = null;
      }
    };
  }, [data, period]);

  return (
    <ChartContainer>
      <canvas ref={chartRef} />
    </ChartContainer>
  );
};

export default TokenPriceChart;
