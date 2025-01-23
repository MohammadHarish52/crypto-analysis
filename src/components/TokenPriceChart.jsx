import { useEffect, useRef } from "react";
import { Chart } from "chart.js/auto";
import { styled } from "@mui/material/styles";

const ChartContainer = styled("div")({
  width: "100%",
  height: "100%",
});

const TokenPriceChart = ({ data }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!chartRef.current || !data) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext("2d");
    const prices = data.prices.map(([time, price]) => ({
      x: new Date(time),
      y: price,
    }));

    chartInstance.current = new Chart(ctx, {
      type: "line",
      data: {
        datasets: [
          {
            data: prices,
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
          },
          y: {
            grid: {
              color: "rgba(255, 255, 255, 0.05)",
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
  }, [data]);

  return (
    <ChartContainer>
      <canvas ref={chartRef} />
    </ChartContainer>
  );
};

export default TokenPriceChart;
