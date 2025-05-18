
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PieController,
  BarController
} from "chart.js";

export function registerCharts() {
  // Register all necessary Chart.js components
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PieController,
    BarController
  );
}

// Initialize charts on module import
registerCharts();

// Chart configuration helpers
export const defaultBarChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top" as const
    }
  }
};

export const defaultPieChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top" as const
    }
  }
};

// Common chart theme colors
export const chartColors = {
  primary: "rgba(45, 212, 191, 0.7)",
  primaryBorder: "rgb(45, 212, 191)",
  secondary: "rgba(79, 70, 229, 0.7)",
  secondaryBorder: "rgb(79, 70, 229)",
  tertiary: "rgba(249, 115, 22, 0.7)",
  tertiaryBorder: "rgb(249, 115, 22)"
};
