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
import { FIRMS, ttm } from "../../data/metrics";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const chartData = computed(() => ({
  labels: FIRMS.map((f) => f.label),
  datasets: [
    {
      label: "Net Income TTM (bn $)",
      data: FIRMS.map((f) => ttm(f, "netIncome")),
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
  plugins: { legend: { display: false } },
  scales: {
    x: {
      ticks: { color: "#ffffff", font: { size: 8 } },
      grid: { color: "rgba(255,255,255,0.25)" },
    },
    y: {
      ticks: { color: "#ffffff", font: { size: 9 } },
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
