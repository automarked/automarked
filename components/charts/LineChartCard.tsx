import { FC } from "react";
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
} from "chart.js";
import { Clock } from "lucide-react";

// Registro dos componentes do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const LineChartCard: FC = () => {
  // Configuração dos dados do gráfico
  const data = {
    labels: ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Tasks Completed",
        data: [0, 200, 400, 300, 500, 400, 600, 500, 600],
        borderColor: "#FFFFFF",
        backgroundColor: "rgba(255, 255, 255, 0.5)",
        pointBackgroundColor: "#FFFFFF",
        tension: 0.4,
      },
    ],
  };

  // Configuração das opções do gráfico
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: { color: "#FFFFFF" },
        grid: { display: false },
      },
      y: {
        ticks: { color: "#FFFFFF" },
        grid: { color: "rgba(255, 255, 255, 0.2)" },
      },
    },
    plugins: {
      legend: { display: false },
    },
  };

  return (
    <div className="rounded-xl bg-white mt-10 shadow-md h-[270px] relative">
      {/* Gráfico */}
      <div className="bg-gray-800 -mt-8 p-4 rounded-xl w-[90%] mx-auto">
        <div className="relative h-40">
          <Line data={data} options={options} />
        </div>
      </div>

      {/* Informações do card */}
      <div className="p-4 0 w-full">
        <h3 className="text-lg font-semibold text-gray-800">Completed Tasks</h3>
        <p className="text-sm text-gray-500">Last Campaign Performance</p>
        <div className="flex items-center text-gray-500 text-sm mt-2">
          <Clock size={16} className="mr-2" />
          <span>Just updated</span>
        </div>
      </div>
    </div>
  );
};

export default LineChartCard;
