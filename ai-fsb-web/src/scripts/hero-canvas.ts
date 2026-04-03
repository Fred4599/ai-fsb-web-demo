export function initHeroCanvas() {
  const canvas = document.getElementById("canvas-aura") as HTMLCanvasElement | null;
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  let width = 0;
  let height = 0;
  let time = 0;

  function resize() {
    const parent = canvas.parentElement;
    if (!parent) return;
    width = canvas.width = parent.clientWidth;
    height = canvas.height = parent.clientHeight;
  }

  window.addEventListener("resize", resize);
  resize();

  function animate() {
    time += 0.002;
    ctx.fillStyle = "#FAFAFA";
    ctx.fillRect(0, 0, width, height);
    ctx.globalCompositeOperation = "multiply";

    const numFolds = 15;
    for (let i = 0; i < numFolds; i++) {
      const normalizedX = i / numFolds;
      const xPos = normalizedX * width + Math.sin(time * 2 + i) * (width * 0.1);
      const foldWidth = (width / numFolds) * 4;
      const waveIntensity = (Math.sin(time * 2 + i * 0.5) + 1) * 0.5;

      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, `rgba(250, 250, 250, 0)`);
      grad.addColorStop(0.5, `rgba(91, 88, 246, ${waveIntensity * 0.08})`);
      grad.addColorStop(1, `rgba(91, 88, 246, ${waveIntensity * 0.15})`);

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(xPos - foldWidth, 0);
      ctx.bezierCurveTo(xPos, height * 0.3, xPos - foldWidth, height * 0.7, xPos + foldWidth, height);
      ctx.lineTo(xPos + foldWidth * 2, height);
      ctx.bezierCurveTo(
        xPos + foldWidth,
        height * 0.7,
        xPos + foldWidth * 2,
        height * 0.3,
        xPos + foldWidth,
        0
      );
      ctx.fill();
    }

    ctx.globalCompositeOperation = "source-over";
    requestAnimationFrame(animate);
  }

  animate();
}
