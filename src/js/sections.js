import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Efecto "reveal" de la maqueta (fade + subida de 22px, una sola vez),
 * reimplementado con GSAP ScrollTrigger para mantener una sola tecnología.
 * El estado inicial (opacity 0 / translateY(22px)) lo pone el CSS (.reveal).
 */
export function initSections() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  // Respetar prefers-reduced-motion: el CSS ya los deja visibles
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  reveals.forEach((el) => {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power1.out',
      scrollTrigger: {
        trigger: el,
        // equivalente al threshold .18 del IntersectionObserver de la maqueta
        start: 'top 88%',
        toggleActions: 'play none none none',
      },
    });
  });
}
