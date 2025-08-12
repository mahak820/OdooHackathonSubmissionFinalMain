import React, { useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

export default function IncomeSimulationChart({ labels, dailyIncome, movingAvgIncome }) {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    if (chartInstanceRef.current) chartInstanceRef.current.destroy();

    const ctx = chartRef.current.getContext("2d");

    chartInstanceRef.current = new Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "Daily Income",
            data: dailyIncome,
            borderColor: "#FF6B35",
            backgroundColor: "rgba(255, 107, 53, 0.3)",
            fill: true,
            tension: 0.4,
            pointRadius: 3,
          },
          {
            label: "7-Day Moving Average",
            data: movingAvgIncome,
            borderColor: "#4ECDC4",
            backgroundColor: "transparent",
            borderDash: [5, 5],
            tension: 0.4,
            pointRadius: 0,
          },
        ],
      },
      options: {
        responsive: true,
        interaction: {
          mode: "nearest",
          intersect: false,
        },
        plugins: {
          legend: {
            position: "top",
            labels: { font: { size: 14, weight: "bold" } },
          },
          tooltip: {
            callbacks: {
              label: ctx => `₹${ctx.parsed.y.toLocaleString()}`,
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: val => `₹${val.toLocaleString()}`,
            },
            grid: {
              color: "#eee",
            },
          },
          x: {
            grid: { display: false },
          },
        },
      },
    });
  }, [labels, dailyIncome, movingAvgIncome]);

  return <canvas ref={chartRef} style={{ width: "100%", height: "350px" }} />;
}
