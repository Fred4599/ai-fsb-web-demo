export function initStudioDashboard() {
  const section = document.getElementById("studio");
  const progressFill = document.getElementById("studio-progress-fill");

  if (!section || !progressFill) return;
  if (section.dataset.progressBound === "true") return;
  section.dataset.progressBound = "true";

  let hasAnimated = false;

  function animateProgressBar() {
    if (hasAnimated) return;
    hasAnimated = true;

    const targetWidth = progressFill.dataset.target || "92%";

    requestAnimationFrame(() => {
      progressFill.classList.add("is-animated");
      progressFill.style.width = targetWidth;
    });
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateProgressBar();
          observer.disconnect();
        }
      });
    },
    { threshold: 0.35 }
  );

  observer.observe(section);
}
