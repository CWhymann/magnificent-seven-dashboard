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
  longQuarter,
  quarterOf,
  shortQuarter,
} from "../../data/metrics";
import { useNarrow } from "../../composables/useNarrow";

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
const narrow = useNarrow();

const chartData = computed(() => ({
  labels: keys.map(shortQuarter),
  datasets: FIRMS.map((firm) => ({
    label: firm.label,
    borderColor: firm.color,
    backgroundColor: firm.color,
    data: keys.map((key) => quarterOf(firm, key)?.revenue ?? null),
    spanGaps: false,
    pointRadius: 0,
    pointHoverRadius: 4,
    borderWidth: 1.5,
    tension: 0.3,
  })),
}));

const options = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  interaction: { mode: "index" as const, intersect: false },
  plugins: {
    legend: {
      position: (narrow.value ? "bottom" : "right") as "bottom" | "right",
      labels: { color: "#ffffff", boxWidth: 10, font: { size: 14 } },
    },
    tooltip: {
      callbacks: {
        title: (items: { dataIndex: number }[]) =>
          items.length ? longQuarter(keys[items[0].dataIndex]) : "",
        label: (item: {
          dataset: { label?: string };
          parsed: { y: number | null };
        }) =>
          `${item.dataset.label}: ${item.parsed.y === null ? "no data" : item.parsed.y.toFixed(2) + " bn $"}`,
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
      grid: { color: "rgba(255,255,255,0.25)" },
    },
  },
}));
</script>

<template>
  <div class="relative h-full w-full">
    <Line :data="chartData" :options="options" />
  </div>
</template>
