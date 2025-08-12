import React, { useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

export default function PieChart({ labels, data }) {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const ctx = chartRef.current.getContext("2d");

    const backgroundColors = [
      "#4ECDC4",
      "#FF6B35",
      "#556270",
      "#C7F464",
      "#FF6F91",
      "#845EC2",
    ];

    chartInstanceRef.current = new Chart(ctx, {
      type: "pie",
      data: {
        labels,
        datasets: [
          {
            data,
            backgroundColor: backgroundColors.slice(0, labels.length),
            borderColor: "#fff",
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "right",
            labels: {
              font: { size: 14, weight: "bold" },
              color: "#374151",
            },
          },
          tooltip: {
            callbacks: {
              label: context => {
                const label = context.label || "";
                const value = context.parsed || 0;
                return `${label}: ${value}`;
              },
            },
          },
        },
        animation: {
          animateRotate: true,
          duration: 1000,
          easing: "easeOutBounce",
        },
      },
    });
  }, [labels, data]);

  return (
    <canvas
      ref={chartRef}
      style={{ width: "500px", height: "500px", display: "block", margin: "auto" }}
    />
  );
}
