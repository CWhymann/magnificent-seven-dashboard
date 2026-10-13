<script setup lang="ts">
import { computed } from "vue";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "vue-chartjs";
import { FIRMS, longQuarter, ttm } from "../../data/metrics";
import { useNarrow } from "../../composables/useNarrow";

ChartJS.register(ArcElement, Tooltip, Legend);

const narrow = useNarrow();

const chartData = computed(() => ({
  labels: FIRMS.map((f) => f.label),
  datasets: [
    {
      data: FIRMS.map((f) => ttm(f, "revenue") ?? 0),
      backgroundColor: FIRMS.map((f) => f.color),
      borderColor: "#ffffff",
      borderWidth: 1,
    },
  ],
}));

const options = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: (narrow.value ? "bottom" : "right") as "bottom" | "right",
      labels: {
        color: "#ffffff",
        boxWidth: 10,
        font: { size: narrow.value ? 9 : 10 },
      },
    },
    tooltip: {
      callbacks: {
        label: (item: { dataIndex: number; parsed: number }) => {
          const firm = FIRMS[item.dataIndex];
          const newest = firm.quarters.at(-1)?.quarter ?? "";
          return [
            `${firm.label}: ${item.parsed.toFixed(2)} bn $ (TTM)`,
            `Latest quarter: ${longQuarter(newest)}`,
          ];
        },
      },
    },
  },
}));
</script>

<template>
  <div class="relative h-full w-full">
    <Doughnut :data="chartData" :options="options" />
  </div>
</template>
