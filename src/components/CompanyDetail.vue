<script setup lang="ts">
import { computed } from "vue";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line, Bar } from "vue-chartjs";
import ChartPanel from "./ChartPanel.vue";
import { FIRMS, longQuarter, shortQuarter } from "../data/metrics";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
);

const props = defineProps<{ name: string }>();
defineEmits<{ close: [] }>();

const firm = computed(() => FIRMS.find((f) => f.label === props.name));
const color = computed(() => firm.value?.color ?? "#39daff");

/** The last twelve reported quarters of the firm, oldest first. */
const quarters = computed(() =>
  firm.value ? firm.value.quarters.slice(-12) : [],
);

/** Table rows, newest first. */
const rows = computed(() => [...quarters.value].reverse());

const axis = {
  ticks: { color: "#ffffff", font: { size: 8 } },
  grid: { color: "rgba(255, 255, 255, 0.25)" },
};

const revenueData = computed(() => ({
  labels: quarters.value.map((q) => shortQuarter(q.quarter)),
  datasets: [
    {
      label: "Revenue (bn $)",
      data: quarters.value.map((q) => q.revenue),
      borderColor: color.value,
      backgroundColor: color.value,
      pointRadius: 2,
      borderWidth: 1.5,
      tension: 0.3,
    },
  ],
}));

const revenueOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        title: (items: { dataIndex: number }[]) =>
          items.length
            ? longQuarter(quarters.value[items[0].dataIndex].quarter)
            : "",
      },
    },
  },
  scales: { x: axis, y: axis },
};

const netIncomeData = computed(() => ({
  labels: quarters.value.map((q) => shortQuarter(q.quarter)),
  datasets: [
    {
      label: "Net Income (bn $)",
      data: quarters.value.map((q) => q.netIncome),
      backgroundColor: color.value,
      borderColor: "#ffffff",
      borderWidth: 1,
    },
  ],
}));

const netIncomeOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        title: (items: { dataIndex: number }[]) =>
          items.length
            ? longQuarter(quarters.value[items[0].dataIndex].quarter)
            : "",
      },
    },
  },
  scales: { x: axis, y: axis },
};
</script>

<template>
  <section class="flex flex-col gap-6 rounded-[20px] bg-panel-wrap p-6">
    <header class="flex items-center justify-between gap-4">
      <h2 class="text-2xl font-medium text-title">{{ name }}</h2>
      <button
        type="button"
        class="rounded-full bg-accent px-4 py-1 text-sm font-medium text-panel"
        @click="$emit('close')"
      >
        Close
      </button>
    </header>

    <div class="grid grid-cols-1 gap-6 xl:grid-cols-2">
      <ChartPanel title="Revenue, last 12 quarters" class="h-72">
        <div class="relative h-full w-full">
          <Line :data="revenueData" :options="revenueOptions" />
        </div>
      </ChartPanel>
      <ChartPanel title="Net Income, last 12 quarters" class="h-72">
        <div class="relative h-full w-full">
          <Bar :data="netIncomeData" :options="netIncomeOptions" />
        </div>
      </ChartPanel>
    </div>

    <div class="overflow-x-auto rounded-2xl bg-panel p-5">
      <table class="w-full min-w-120 text-left text-sm text-white">
        <thead>
          <tr class="text-white/60">
            <th class="pb-2 font-medium">Quarter</th>
            <th class="pb-2 font-medium">Revenue (bn $)</th>
            <th class="pb-2 font-medium">Net Income (bn $)</th>
            <th class="pb-2 font-medium">Gross Margin (%)</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="row in rows"
            :key="row.quarter"
            class="border-t border-white/10"
          >
            <td class="py-2">{{ longQuarter(row.quarter) }}</td>
            <td class="py-2">{{ row.revenue.toFixed(2) }}</td>
            <td class="py-2">{{ row.netIncome.toFixed(2) }}</td>
            <td class="py-2">{{ row.grossMargin.toFixed(1) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
