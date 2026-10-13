<script setup lang="ts">
import { computed } from "vue";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "vue-chartjs";
import { FIRMS, longQuarter } from "../../data/metrics";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const chartData = computed(() => ({
  labels: FIRMS.map((f) => f.label),
  datasets: [
    {
      label: "Gross Margin (%)",
      data: FIRMS.map((f) => f.quarters.at(-1)?.grossMargin ?? null),
      backgroundColor: FIRMS.map((f) => f.color),
      borderColor: "#ffffff",
      borderWidth: 1,
    },
  ],
}));

const options = {
  indexAxis: "y" as const,
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (item: { dataIndex: number; parsed: { x: number | null } }) => {
          const firm = FIRMS[item.dataIndex];
          const quarter = firm.quarters.at(-1)?.quarter ?? "";
          return [
            `${firm.label}: ${item.parsed.x?.toFixed(1)} %`,
            `Quarter: ${longQuarter(quarter)}`,
          ];
        },
      },
    },
  },
  scales: {
    x: {
      ticks: { color: "#ffffff", font: { size: 14 } },
      grid: { color: "rgba(255,255,255,0.25)" },
    },
    y: {
      ticks: { color: "#ffffff", font: { size: 14 } },
      grid: { display: false },
    },
  },
};
</script>

<template>
  <div class="relative h-full w-full">
    <Bar :data="chartData" :options="options" />
  </div>
</template>
