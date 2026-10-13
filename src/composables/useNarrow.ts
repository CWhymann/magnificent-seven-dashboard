import { onMounted, onUnmounted, ref } from "vue";

/**
 * Tracks whether the viewport is narrower than 640px (the Tailwind `sm` breakpoint).
 *
 * @returns A ref that is true on narrow viewports.
 */
export function useNarrow() {
  const narrow = ref(false);
  let query: MediaQueryList | null = null;

  const update = (): void => {
    narrow.value = query?.matches ?? false;
  };

  onMounted(() => {
    query = window.matchMedia("(max-width: 639px)");
    update();
    query.addEventListener("change", update);
  });

  onUnmounted(() => {
    query?.removeEventListener("change", update);
  });

  return narrow;
}
