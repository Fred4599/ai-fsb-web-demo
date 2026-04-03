export function initImpactSection() {
  const section = document.getElementById("impact-section");
  if (!section) return;

  const counters = section.querySelectorAll(".stat-counter, .counter-value");
  const progressRing = section.querySelector("#progress-ring") as SVGCircleElement | null;
  const progressDot = section.querySelector("#progress-dot") as SVGCircleElement | null;

  let hasAnimated = false;

  function easeOutQuart(t: number) {
    return 1 - Math.pow(1 - t, 4);
  }

  function animateCounter(el: Element, duration: number) {
    const target = parseInt((el as HTMLElement).getAttribute("data-target") || "0", 10);
    const startTime = performance.now();

    function tick(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutQuart(progress);

      el.textContent = String(Math.floor(target * eased));

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = String(target);
      }
    }

    requestAnimationFrame(tick);
  }

  function animateProgress(targetPercent: number, duration: number) {
    if (!progressRing) return;

    const radius = 92;
    const circumference = 2 * Math.PI * radius;
    const startTime = performance.now();

    progressRing.style.strokeDasharray = String(circumference);

    function tick(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutQuart(progress);

      const currentPercent = targetPercent * eased;
      const offset = circumference * (1 - currentPercent / 100);

      progressRing.style.strokeDashoffset = String(offset);

      if (progressDot) {
        const angle = (currentPercent / 100) * Math.PI * 2 - Math.PI / 2;
        const x = 120 + radius * Math.cos(angle);
        const y = 120 + radius * Math.sin(angle);
        progressDot.setAttribute("cx", x.toFixed(2));
        progressDot.setAttribute("cy", y.toFixed(2));
        progressDot.style.opacity = "1";
      }

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    }

    requestAnimationFrame(tick);
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !hasAnimated) {
          hasAnimated = true;

          counters.forEach((el, index) => {
            animateCounter(el, 1800 + index * 120);
          });

          animateProgress(84, 2200);

          observer.unobserve(section);
        }
      });
    },
    { threshold: 0.28 }
  );

  observer.observe(section);
}
