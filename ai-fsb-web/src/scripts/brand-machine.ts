export function initBrandMachine() {
  const root = document.getElementById("brand-machine");
  const toggle = document.getElementById("machine-toggle");
  if (!root || !toggle) return;

  function applyState(active: boolean) {
    root.classList.toggle("is-active", active);
    root.classList.toggle("is-idle", !active);
    toggle.setAttribute("aria-pressed", active ? "true" : "false");
  }

  toggle.addEventListener("click", () => {
    applyState(!root.classList.contains("is-active"));
  });

  applyState(root.classList.contains("is-active"));
}
