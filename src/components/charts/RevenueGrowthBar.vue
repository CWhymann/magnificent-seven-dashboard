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
import {
  FIRMS,
  lastQuarterKeys,
  longQuarter,
  yoyGrowth,
} from "../../data/metrics";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

/** Newest four quarters, newest first. */
const keys = lastQuarterKeys(4).reverse();

/** Colors from the design: bright for the newest quarter, darker for older ones. */
const shades = ["#39daff", "#31bfe2", "#29a5c5", "#218aa8"];

const chartData = computed(() => ({
  labels: FIRMS.map((f) => f.label),
  datasets: keys.map((key, i) => ({
    label: longQuarter(key),
    backgroundColor: shades[i],
    borderColor: "#ffffff",
    borderWidth: 1,
    data: FIRMS.map((f) => yoyGrowth(f, key)),
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
      ticks: { color: "#ffffff", font: { size: 9 } },
      grid: { display: false },
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
    <Bar :data="chartData" :options="options" />
  </div>
</template>
