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
  shortQuarter,
  yoyGrowth,
} from "../../data/metrics";
import { useNarrow } from "../../composables/useNarrow";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

/** Newest four quarters, newest first. */
const keys = lastQuarterKeys(4).reverse();

/** Bright for the newest quarter, fading to darker blue for older ones. */
const shades = ["#00e5ff", "#00b0ff", "#2979ff", "#304ffe"];

const narrow = useNarrow();

const chartData = computed(() => ({
  labels: FIRMS.map((f) => f.label),
  datasets: keys.map((key, i) => ({
    label: narrow.value ? shortQuarter(key) : longQuarter(key),
    backgroundColor: shades[i],
    borderColor: "#ffffff",
    borderWidth: 1,
    data: FIRMS.map((f) => yoyGrowth(f, key)),
  })),
}));

const options = computed(() => {
  const size = narrow.value ? 12 : 14;
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: (narrow.value ? "bottom" : "right") as "bottom" | "right",
        labels: {
          color: "#ffffff",
          boxWidth: 10,
          padding: narrow.value ? 6 : 10,
          font: { size },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#ffffff",
          font: { size },
          maxRotation: narrow.value ? 45 : 0,
          minRotation: narrow.value ? 45 : 0,
          autoSkip: false,
        },
        grid: { display: false },
      },
      y: {
        ticks: { color: "#ffffff", font: { size } },
        grid: { color: "rgba(255,255,255,0.25)" },
      },
    },
  };
});
</script>

<template>
  <div class="relative h-full w-full">
    <Bar :data="chartData" :options="options" />
  </div>
</template>
