import React, { useEffect, useRef } from "react";
import { Chart } from "chart.js/auto";

export default function LineChart({ labels, data, label }) {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const ctx = chartRef.current.getContext("2d");
    chartInstanceRef.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: label || "Data",
            data: data,
            borderColor: "rgba(75, 192, 192, 1)",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            tension: 0.3,
            fill: true,
            pointBackgroundColor: "#fff",
            pointBorderColor: "rgba(75, 192, 192, 1)",
            pointRadius: 5,
            pointHoverRadius: 7,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: "top" },
        },
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }, [labels, data, label]);

  return <canvas ref={chartRef}></canvas>;
}
