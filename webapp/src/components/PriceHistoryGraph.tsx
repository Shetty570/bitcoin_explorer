"use client";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  ChartOptions,
} from "chart.js";
import "chartjs-adapter-luxon";
import { DateTime } from "luxon";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

type PriceData = {
  time: string; // Time in ISO format
  price: number;
};

type PriceHistoryGraphProps = {
  data: PriceData[];
};

export function PriceHistoryGraph({ data }: PriceHistoryGraphProps) {
  // Define your desired time zone
  const timeZone = "utc";

  const chartData = {
    labels: data.map((entry) => {
      return DateTime.fromISO(entry.time, { zone: "utc" });
    }),
    datasets: [
      {
        label: "Price",
        data: data.map((entry) => entry.price), // Y-axis data
        borderColor: "#4b5ae8",
        borderWidth: 2,
        fill: false,
        tension: 0.2,
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Price History",
      },
    },
    scales: {
      x: {
        type: "time",
        time: {
          unit: "minute",
          tooltipFormat: "FF",
          displayFormats: {
            minute: "HH:mm",
          },
        },
        adapters: {
          date: {
            zone: timeZone,
          },
        },
        title: {
          display: true,
          text: "Time",
        },
      },
      y: {
        title: {
          display: true,
          text: "Price (USD)",
        },
        beginAtZero: false,
      },
    },
  };

  return (
    <div className="w-full h-[400px]">
      <Line
        data={chartData}
        options={options}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}
