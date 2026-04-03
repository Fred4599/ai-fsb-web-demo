export async function initHeroReceiptChart(canvasId: string) {
  const canvas = document.getElementById(canvasId) as HTMLCanvasElement | null;
  if (!canvas) return;

  const { default: Chart } = await import("chart.js/auto");
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const gradient = ctx.createLinearGradient(0, 0, 0, 64);
  gradient.addColorStop(0, "rgba(99, 102, 241, 0.2)");
  gradient.addColorStop(1, "rgba(99, 102, 241, 0.0)");

  const config = {
    type: "line",
    data: {
      labels: ["1", "2", "3", "4", "5", "6", "7"],
      datasets: [
        {
          data: [4200, 5800, 5100, 8400, 7900, 10500, 12450],
          borderColor: "#6366f1",
          borderWidth: 2,
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: 0,
          fill: true,
          backgroundColor: gradient,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 1500,
        easing: "easeOutQuart",
      },
      layout: {
        padding: { top: 5, bottom: 0, left: 0, right: 0 },
      },
      plugins: { legend: { display: false }, tooltip: { enabled: false } },
      scales: {
        x: { display: false, grid: { display: false } },
        y: { display: false, min: 3000, grid: { display: false } },
      },
      interaction: { intersect: false, mode: "index" },
    },
  };

  new Chart(ctx, config);
}
