import { FC } from "react";
import { cn } from "@/lib/utils"; // Ajuste conforme o local da função 'cn'.

interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
  change: string
  isPositive: boolean
}

const StatCard: FC<StatCardProps> = ({ title, value, description, icon, change, isPositive }) => {
  return (
    <div
      className={cn(
        "flex justify-between items-start p-4 bg-white rounded-lg shadow-none border border-gray-200 w-full"
      )}
    >
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <h2 className="text-2xl font-bold text-gray-800 helvetica-sans-serif">{value.toString().includes("AOA") ? value.toString().split("A")[2] : value}</h2>
        <hr />
        <div className="flex gap-2 mt-2">
          <p data-positive={isPositive} className="text-sm font-medium data-[positive=true]:text-green-600 data-[positive=false]:text-red-600 mt-1">
            {change}
          </p>
          <span>{description}</span>
        </div>
      </div>
      <div
        className={cn(
          "w-10 h-10 bg-[var(--black)] text-white shadow-xl flex items-center justify-center rounded-md"
        )}
      >
        {icon}
      </div>
    </div>
  );
};

export default StatCard;
