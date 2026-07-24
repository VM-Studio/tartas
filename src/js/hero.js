import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const WHATSAPP_URL = 'https://wa.me/541133269400';

// ---------------------------------------------------------------------------
// Datos de los sabores
// ---------------------------------------------------------------------------
const FLAVORS = [
  {
    slug: 'pollo-y-puerro',
    name: 'Pollo y Puerro',
    desc: 'Pollo desmenuzado con puerros salteados a fuego lento y un toque de crema. La clásica que no falla nunca.',
    bg: '#7A9B4E',
    img: '/img/tarta-pollo-puerro.png',
    ing: '/img/ing-puerro.png',
  },
  {
    slug: 'calabaza-y-queso',
    name: 'Calabaza y Queso',
    desc: 'Calabaza asada, dulce y suave, con queso fundido y semillas tostadas. Reconfortante de principio a fin.',
    bg: '#D65A28',
    img: '/img/tarta-calabaza-queso.png',
    ing: '/img/ing-calabaza.png',
  },
  {
    slug: 'jamon-y-queso',
    name: 'Jamón y Queso',
    desc: 'Jamón cocido natural y mezcla de quesos que se estiran en cada porción. El sabor que une a toda la mesa.',
    // #E0A62E oscurecido para asegurar contraste con texto blanco
    bg: '#C08A1E',
    img: '/img/tarta-jamon-queso.png',
    ing: '/img/ing-jamon.png',
  },
  {
    slug: 'verduras-grilladas',
    name: 'Verduras Grilladas',
    desc: 'Morrones, zucchini y berenjenas grilladas con hierbas frescas. Liviana, sabrosa y llena de color.',
    bg: '#3A5A28',
    img: '/img/tarta-verduras-grilladas.png',
    ing: '/img/ing-morron.png',
  },
];

// Posiciones/tamaños de las 4 copias del ingrediente flotante por slide
const ING_LAYOUT = [
  { top: '12%', left: '6%', size: 110, blur: false },
  { top: '68%', left: '38%', size: 70, blur: true },
  { top: '18%', left: '58%', size: 55, blur: true },
  { top: '72%', left: '85%', size: 130, blur: false },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function preloadImages() {
  FLAVORS.forEach((f) => {
    [f.img, f.ing].forEach((src) => {
      const im = new Image();
      im.src = src;
    });
  });
}

/** Crea la imagen de la tarta con fallback a círculo de color */
function createTartImage(flavor, index) {
  const img = document.createElement('img');
  img.className = 'hero-tart';
  img.src = flavor.img;
  img.alt = `Tarta de ${flavor.name.toLowerCase()} vista desde arriba`;
  img.width = 480;
  img.height = 480;
  if (index === 0) img.setAttribute('fetchpriority', 'high');
  img.addEventListener('error', () => {
    const fb = document.createElement('div');
    fb.className = 'hero-tart hero-tart--fallback';
    fb.textContent = flavor.name;
    img.replaceWith(fb);
  });
  return img;
}

/** Crea una copia del ingrediente flotante con fallback */
function createIngredient(flavor, layout) {
  const wrap = document.createElement('div');
  wrap.className = 'hero-ing' + (layout.blur ? ' hero-ing--blur' : '');
  wrap.style.top = layout.top;
  wrap.style.left = layout.left;
  wrap.style.width = `${layout.size}px`;
  wrap.style.height = `${layout.size}px`;

  // Contenedor interno estable (el parallax lo usa aunque la img se
  // reemplace por el fallback)
  const inner = document.createElement('div');
  inner.className = 'hero-ing-inner';

  const img = document.createElement('img');
  img.src = flavor.ing;
  img.alt = '';
  img.width = layout.size;
  img.height = layout.size;
  img.loading = 'lazy';
  img.addEventListener('error', () => {
    const fb = document.createElement('div');
    fb.className = 'hero-ing-fallback';
    img.replaceWith(fb);
  });
  inner.appendChild(img);
  wrap.appendChild(inner);
  return wrap;
}

function buildSlide(flavor, index) {
  const slide = document.createElement('div');
  slide.className = 'hero-slide' + (index === 0 ? ' is-first' : '');
  slide.dataset.flavor = flavor.slug;

  // Ingredientes flotantes (4 copias)
  ING_LAYOUT.forEach((layout) => slide.appendChild(createIngredient(flavor, layout)));

  // Tarta
  const tartWrap = document.createElement('div');
  tartWrap.className = 'hero-tart-wrap';
  tartWrap.appendChild(createTartImage(flavor, index));
  slide.appendChild(tartWrap);

  // Texto — único h1 de la página en el primer slide, h2 en el resto
  const headingTag = index === 0 ? 'h1' : 'h2';
  const copy = document.createElement('div');
  copy.className = 'hero-copy';
  copy.innerHTML = `
    <span class="hero-badge">TAMAÑO FAMILIAR</span>
    <${headingTag} class="hero-title">${flavor.name}</${headingTag}>
    <p class="hero-desc">${flavor.desc}</p>
    <a class="hero-cta" href="${WHATSAPP_URL}" target="_blank" rel="noopener">Pedir por WhatsApp</a>
  `;
  slide.appendChild(copy);

  return slide;
}

// ---------------------------------------------------------------------------
// Init
// ---------------------------------------------------------------------------

export function initHero() {
  const space = document.querySelector('.hero-scroll-space');
  const stage = space?.querySelector('.hero-stage');
  const slidesRoot = stage?.querySelector('.hero-slides');
  const dotsRoot = stage?.querySelector('.hero-dots');
  const counterEl = stage?.querySelector('.hero-counter');
  if (!space || !stage || !slidesRoot) return;

  preloadImages();

  // Generar slides y dots
  const slides = FLAVORS.map((f, i) => {
    const s = buildSlide(f, i);
    slidesRoot.appendChild(s);
    return s;
  });

  FLAVORS.forEach((_, i) => {
    const dot = document.createElement('span');
    dot.className = 'hero-dot' + (i === 0 ? ' is-active' : '');
    dotsRoot.appendChild(dot);
  });
  const dots = [...dotsRoot.children];

  stage.style.backgroundColor = FLAVORS[0].bg;

  // -------------------------------------------------------------------------
  // prefers-reduced-motion: sin pin ni animación, secciones apiladas
  // -------------------------------------------------------------------------
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    space.classList.add('hero--static');
    slides.forEach((s, i) => {
      s.style.backgroundColor = FLAVORS[i].bg;
    });
    return;
  }

  // -------------------------------------------------------------------------
  // Estado inicial de los slides
  // -------------------------------------------------------------------------
  const parts = slides.map((slide) => ({
    slide,
    // Animamos el wrapper (no la <img>) porque el fallback reemplaza la <img>
    tart: slide.querySelector('.hero-tart-wrap'),
    copy: slide.querySelector('.hero-copy'),
    ings: [...slide.querySelectorAll('.hero-ing')],
    ingsSharp: [...slide.querySelectorAll('.hero-ing:not(.hero-ing--blur)')],
  }));

  parts.forEach((p, i) => {
    if (i === 0) return;
    gsap.set(p.slide, { autoAlpha: 0 });
    gsap.set(p.tart, { rotate: -120, scale: 0.6, autoAlpha: 0 });
    gsap.set(p.copy, { y: 80, autoAlpha: 0 });
    gsap.set(p.ings, { y: 60, autoAlpha: 0 });
  });

  // -------------------------------------------------------------------------
  // Timeline maestro con pin + scrub
  // -------------------------------------------------------------------------
  const setActive = (index) => {
    const i = gsap.utils.clamp(0, FLAVORS.length - 1, index);
    counterEl.textContent = String(i + 1).padStart(3, '0');
    dots.forEach((d, j) => d.classList.toggle('is-active', j === i));
    stage.dataset.flavor = FLAVORS[i].slug;
  };

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: space,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.6,
      pin: stage,
      pinSpacing: false, // el espacio ya lo da .hero-scroll-space (400vh)
      onUpdate(self) {
        // 3 transiciones repartidas en el progreso total
        const idx = Math.round(self.progress * (FLAVORS.length - 1));
        setActive(idx);
      },
    },
  });

  // Cada transición dura 1 unidad de timeline
  for (let i = 0; i < FLAVORS.length - 1; i++) {
    const out = parts[i];
    const inn = parts[i + 1];
    const pos = i; // posición en el timeline

    // Fondo interpola al color siguiente
    tl.to(stage, { backgroundColor: FLAVORS[i + 1].bg, duration: 1, ease: 'none' }, pos);

    // Slide saliente
    tl.to(out.tart, { rotate: 120, scale: 0.6, autoAlpha: 0, duration: 0.55, ease: 'power2.in' }, pos);
    tl.to(out.copy, { y: -80, autoAlpha: 0, duration: 0.45, ease: 'power2.in' }, pos);
    tl.to(out.ings, { y: -70, autoAlpha: 0, duration: 0.45, ease: 'power2.in', stagger: 0.06 }, pos);
    tl.set(out.slide, { autoAlpha: 0 }, pos + 0.55);

    // Slide entrante
    tl.set(inn.slide, { autoAlpha: 1 }, pos + 0.4);
    tl.fromTo(
      inn.tart,
      { rotate: -120, scale: 0.6, autoAlpha: 0 },
      { rotate: 0, scale: 1, autoAlpha: 1, duration: 0.6, ease: 'power2.out' },
      pos + 0.4
    );
    tl.fromTo(
      inn.copy,
      { y: 80, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.5, ease: 'power2.out' },
      pos + 0.5
    );
    tl.fromTo(
      inn.ings,
      { y: 60, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.5, ease: 'power2.out', stagger: 0.06 },
      pos + 0.5
    );
  }

  // -------------------------------------------------------------------------
  // Parallax suave en ingredientes sin blur (sobre el elemento interno para
  // no pisar las animaciones de entrada/salida del wrapper)
  // -------------------------------------------------------------------------
  const sharpInners = parts.flatMap((p) => p.ingsSharp.map((el) => el.firstElementChild));
  if (sharpInners.length) {
    gsap.to(sharpInners, {
      y: -40,
      ease: 'none',
      scrollTrigger: {
        trigger: space,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
      },
    });
  }

  setActive(0);
}
