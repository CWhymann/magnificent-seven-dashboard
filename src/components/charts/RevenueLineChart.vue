<script setup lang="ts">
import { computed } from "vue";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "vue-chartjs";
import {
  FIRMS,
  lastQuarterKeys,
  quarterOf,
  shortQuarter,
} from "../../data/metrics";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
);

/** The last twelve quarters, oldest first. */
const keys = lastQuarterKeys(12);

const chartData = computed(() => ({
  labels: keys.map(shortQuarter),
  datasets: FIRMS.map((firm) => ({
    label: firm.label,
    borderColor: firm.color,
    backgroundColor: firm.color,
    data: keys.map((key) => quarterOf(firm, key)?.revenue ?? null),
    spanGaps: false,
    pointRadius: 0,
    borderWidth: 1.5,
    tension: 0.3,
  })),
}));

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "right" as const,
      labels: { color: "#ffffff", boxWidth: 12, font: { size: 10 } },
    },
  },
  scales: {
    x: {
      ticks: { color: "#ffffff", font: { size: 8 } },
      grid: { color: "rgba(255,255,255,0.25)" },
    },
    y: {
      ticks: { color: "#ffffff", font: { size: 8 } },
      grid: { color: "rgba(255,255,255,0.25)" },
    },
  },
};
</script>

<template>
  <div class="relative h-full w-full">
    <Line :data="chartData" :options="options" />
  </div>
</template>
