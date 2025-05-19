import { 
  Chart as ChartJS, 
  RadialLinearScale, 
  PointElement, 
  LineElement, 
  Filler, 
  Tooltip as ChartTooltip, 
  Legend,
  CategoryScale,
  LinearScale,
  BarElement 
} from 'chart.js';

// Register ChartJS components - can be imported once in main files
export const registerChartComponents = () => {
  ChartJS.register(
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    ChartTooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement
  );
};
