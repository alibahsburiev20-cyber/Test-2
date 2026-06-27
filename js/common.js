// ---- mobile nav toggle ----
(function () {
  const burger = document.querySelector('.topbar__burger');
  const nav = document.querySelector('.topbar__nav');
  if (!burger || !nav) return;
  burger.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  nav.querySelectorAll('a').forEach((a) =>
    a.addEventListener('click', () => nav.classList.remove('is-open'))
  );
})();

// ---- survey rail: scroll progress as a measuring tape ----
(function () {
  const rail = document.querySelector('.survey-rail');
  if (!rail) return;
  const fill = rail.querySelector('.survey-rail__fill');
  const ticksWrap = rail.querySelector('.survey-rail__ticks');

  const TICK_COUNT = 20;
  for (let i = 0; i <= TICK_COUNT; i++) {
    const tick = document.createElement('div');
    tick.className = 'survey-rail__tick';
    tick.style.top = (i / TICK_COUNT) * 100 + '%';
    if (i % 2 === 0) {
      tick.textContent = String(i * 5).padStart(2, '0');
    }
    ticksWrap.appendChild(tick);
  }

  function update() {
    const doc = document.documentElement;
    const scrollTop = doc.scrollTop || document.body.scrollTop;
    const scrollHeight = doc.scrollHeight - doc.clientHeight;
    const pct = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    fill.style.height = pct + '%';
  }

  document.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
})();

// ---- scroll reveal ----
(function () {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  if (!('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  items.forEach((el) => io.observe(el));
})();

// ---- page-load sequence: stamp drops in on hero ----
(function () {
  const stamp = document.querySelector('[data-stamp-intro]');
  if (!stamp) return;
  requestAnimationFrame(() => {
    setTimeout(() => stamp.classList.add('is-stamped'), 280);
  });
})();
