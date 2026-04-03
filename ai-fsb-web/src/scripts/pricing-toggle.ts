export function initPricingToggle() {
  const toggleContainer = document.getElementById("toggle-container");
  const toggleThumb = document.getElementById("toggle-thumb");
  const toggleIcon = document.getElementById("toggle-icon");
  const toggleText = document.getElementById("toggle-text");
  const labelMonthly = document.getElementById("label-monthly");
  const labelYearly = document.getElementById("label-yearly");
  const priceElements = document.querySelectorAll<HTMLElement>(".price-val");

  if (!toggleContainer || !toggleThumb || !toggleIcon || !toggleText || !labelMonthly || !labelYearly) return;

  let isYearly = false;

  function updateToggleUI() {
    toggleContainer.setAttribute("aria-checked", isYearly ? "true" : "false");

    const containerWidth = toggleContainer.offsetWidth;
    const thumbWidth = toggleThumb.offsetWidth;
    const padding = 6;
    const rightLeft = containerWidth - thumbWidth - padding;

    if (isYearly) {
      toggleThumb.style.left = `${rightLeft}px`;
      toggleText.innerText = "First year";
      toggleIcon.setAttribute("icon", "solar:calendar-linear");
      toggleIcon.classList.remove("text-slate-500");
      toggleIcon.classList.add("text-violet-600");

      labelMonthly.classList.remove("text-slate-900");
      labelMonthly.classList.add("text-slate-500");

      labelYearly.classList.remove("text-slate-500");
      labelYearly.classList.add("text-slate-900");

      toggleContainer.style.background =
        "repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(0,0,0,0.02) 2px, rgba(0,0,0,0.02) 4px), linear-gradient(180deg, #ede9fe 0%, #c4b5fd 100%)";
      toggleContainer.style.borderColor = "#c4b5fd";
      toggleContainer.style.boxShadow =
        "2px 2px 0px rgba(139,92,246,0.10), 4px 4px 0px rgba(139,92,246,0.08), 6px 6px 0px rgba(139,92,246,0.06), 8px 8px 0px rgba(139,92,246,0.04), 10px 10px 0px rgba(139,92,246,0.02), 20px 20px 30px rgba(139,92,246,0.22), inset 0 4px 8px rgba(0,0,0,0.08), inset 0 -2px 4px rgba(255,255,255,0.7), 0 0 0 6px rgba(245,243,255,0.8)";

      toggleThumb.style.background = "linear-gradient(180deg, #ffffff 0%, #f5f3ff 100%)";
      toggleThumb.style.boxShadow =
        "1px 1px 0px rgba(139,92,246,0.15), 2px 2px 0px rgba(139,92,246,0.10), 3px 3px 0px rgba(139,92,246,0.08), 4px 4px 0px rgba(139,92,246,0.05), 5px 5px 0px rgba(139,92,246,0.03), 12px 12px 20px -4px rgba(139,92,246,0.35), inset 0 3px 4px rgba(255,255,255,1), inset 0 -2px 4px rgba(167,139,250,0.18)";
      toggleThumb.style.borderColor = "#ddd6fe";
    } else {
      toggleThumb.style.left = `${padding}px`;
      toggleText.innerText = "Monthly";
      toggleIcon.setAttribute("icon", "solar:wallet-money-linear");
      toggleIcon.classList.remove("text-violet-600");
      toggleIcon.classList.add("text-slate-500");

      labelMonthly.classList.remove("text-slate-500");
      labelMonthly.classList.add("text-slate-900");

      labelYearly.classList.remove("text-slate-900");
      labelYearly.classList.add("text-slate-500");

      toggleContainer.style.background =
        "repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(0,0,0,0.02) 2px, rgba(0,0,0,0.02) 4px), linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)";
      toggleContainer.style.borderColor = "#cbd5e1";
      toggleContainer.style.boxShadow =
        "2px 2px 0px rgba(0,0,0,0.04), 4px 4px 0px rgba(0,0,0,0.03), 6px 6px 0px rgba(0,0,0,0.02), 8px 8px 0px rgba(0,0,0,0.01), 10px 10px 0px rgba(0,0,0,0.01), 20px 20px 30px rgba(0,0,0,0.1), inset 0 4px 8px rgba(0,0,0,0.05), inset 0 -2px 4px rgba(255,255,255,0.7), 0 0 0 6px rgba(248,250,252,0.8)";

      toggleThumb.style.background = "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)";
      toggleThumb.style.boxShadow =
        "1px 1px 0px rgba(0,0,0,0.10), 2px 2px 0px rgba(0,0,0,0.08), 3px 3px 0px rgba(0,0,0,0.06), 4px 4px 0px rgba(0,0,0,0.04), 5px 5px 0px rgba(0,0,0,0.02), 12px 12px 20px -4px rgba(0,0,0,0.15), inset 0 3px 4px rgba(255,255,255,1), inset 0 -2px 4px rgba(0,0,0,0.05)";
      toggleThumb.style.borderColor = "#e2e8f0";
    }

    priceElements.forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(4px)";
      el.style.transition = "opacity 0.2s ease, transform 0.2s ease";

      setTimeout(() => {
        const monthly = el.dataset.monthly ?? "";
        const yearly = el.dataset.yearly ?? "";
        el.innerText = "$" + (isYearly ? yearly : monthly);
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
      }, 180);
    });

    document.querySelectorAll<HTMLElement>(".price-suffix").forEach((el) => {
      el.innerText = isYearly ? " first year*" : "/mo";
    });
  }

  toggleContainer.addEventListener("click", () => {
    isYearly = !isYearly;
    updateToggleUI();
  });

  toggleContainer.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      isYearly = !isYearly;
      updateToggleUI();
    }
  });

  window.addEventListener("resize", updateToggleUI);

  updateToggleUI();
}
