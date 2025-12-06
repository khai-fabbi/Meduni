// composables/useConfetti.ts
export const useConfetti = () => {
  const { onLoaded } = useScript({
    src: "https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.Canvas9.3/dist/confetti.browser.min.js",
  });

  return () => onLoaded(() => (window as any).confetti());
};
