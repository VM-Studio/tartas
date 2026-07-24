import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Animaciones de entrada de las secciones de contenido.
 * Fade + subida de 40px con stagger, una sola vez, al entrar al viewport.
 */
export function initSections() {
  // Respetar prefers-reduced-motion: sin animaciones de entrada
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const groups = [
    {
      trigger: '#como-funciona',
      items: ['#como-funciona .eyebrow', '#como-funciona .section-title', '#como-funciona .step-card', '#como-funciona .como-punchline'],
    },
    {
      trigger: '#precios',
      items: ['#precios .badge-brush', '#precios .section-title', '#precios .price-card', '#precios .checks-row .check-item'],
    },
    {
      trigger: '#entregas',
      items: ['#entregas .section-title', '#entregas .entregas-text', '#entregas .btn'],
    },
  ];

  groups.forEach(({ trigger, items }) => {
    const elements = items.flatMap((sel) => [...document.querySelectorAll(sel)]);
    if (!elements.length) return;

    gsap.from(elements, {
      y: 40,
      autoAlpha: 0,
      duration: 0.7,
      ease: 'power2.out',
      stagger: 0.12,
      scrollTrigger: {
        trigger,
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
    });
  });
}
