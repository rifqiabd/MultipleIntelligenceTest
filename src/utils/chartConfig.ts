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
  BarElement,
  ChartOptions,
  ChartTypeRegistry,
  ChartData,
  TooltipItem 
} from 'chart.js';

import { CHART_COLORS } from './constants';

/**
 * Register ChartJS components
 * Only needs to be called once when initializing charts
 */
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

/**
 * Default radar chart options for intelligence scores
 */
export const getRadarChartOptions = (): ChartOptions<'radar'> => {
  return {
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
        ticks: {
          stepSize: 20
        }
      }
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function(tooltipItem: TooltipItem<'radar'>) {
            return `${tooltipItem.dataset.label}: ${tooltipItem.raw}%`;
          }
        }
      }
    },
    maintainAspectRatio: false
  };
};

/**
 * Default bar chart options for intelligence type distribution
 */
export const getBarChartOptions = (): ChartOptions<'bar'> => {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top'
      },
      tooltip: {
        callbacks: {
          label: function(tooltipItem: TooltipItem<'bar'>) {
            return `${tooltipItem.dataset.label}: ${tooltipItem.raw} orang`;
          }
        }
      }
    }
  };
};
