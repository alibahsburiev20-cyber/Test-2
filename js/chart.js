(function () {
  const canvas = document.getElementById('feeChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;

  const quarters = ['Q1 2025', 'Q2 2025', 'Q3 2025', 'Q4 2025', 'Q1 2026'];
  // [держателям, резерв реестра, казна] in arbitrary fee units
  const data = [
    [11, 7, 3],
    [15, 8, 4],
    [21, 9, 5],
    [29, 10, 6],
    [38, 12, 7],
  ];
  const colors = ['#8A3324', '#3D5A4C', '#C9A227'];

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function resize() {
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function draw(progress) {
    const rect = canvas.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    ctx.clearRect(0, 0, w, h);

    const padding = { top: 14, bottom: 26, left: 8, right: 8 };
    const plotH = h - padding.top - padding.bottom;
    const maxTotal = Math.max(...data.map((d) => d[0] + d[1] + d[2]));
    const groupW = (w - padding.left - padding.right) / data.length;
    const barW = groupW * 0.46;

    data.forEach((group, i) => {
      const x = padding.left + i * groupW + (groupW - barW) / 2;
      let yCursor = h - padding.bottom;

      group.forEach((value, segIdx) => {
        const segH = (value / maxTotal) * plotH * progress;
        ctx.fillStyle = colors[segIdx];
        ctx.fillRect(x, yCursor - segH, barW, segH);
        yCursor -= segH;
      });

      ctx.fillStyle = '#1C1B19';
      ctx.font = '10px "IBM Plex Mono", monospace';
      ctx.textAlign = 'center';
      ctx.globalAlpha = 0.65;
      ctx.fillText(quarters[i], x + barW / 2, h - 8);
      ctx.globalAlpha = 1;
    });

    // baseline
    ctx.strokeStyle = '#A8A396';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding.left, h - padding.bottom);
    ctx.lineTo(w - padding.right, h - padding.bottom);
    ctx.stroke();
  }

  resize();

  if (reduceMotion) {
    draw(1);
  } else {
    let start = null;
    const duration = 900;

    function animate(ts) {
      if (!start) start = ts;
      const elapsed = ts - start;
      const progress = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      draw(eased);
      if (progress < 1) requestAnimationFrame(animate);
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            requestAnimationFrame(animate);
            io.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );
    io.observe(canvas);
  }

  window.addEventListener('resize', () => {
    resize();
    draw(1);
  });
})();
