import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initHeader() {
  const header = document.getElementById('site-header');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const wspFloat = document.getElementById('wsp-float');
  const heroSpace = document.querySelector('.hero-scroll-space');

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // -------------------------------------------------------------------------
  // Estado del header: transparente sobre el hero, sólido después
  // -------------------------------------------------------------------------
  if (heroSpace) {
    ScrollTrigger.create({
      trigger: heroSpace,
      start: 'bottom top+=80',
      onEnter: () => header.classList.add('is-solid'),
      onLeaveBack: () => header.classList.remove('is-solid'),
    });
  } else {
    header.classList.add('is-solid');
  }

  // -------------------------------------------------------------------------
  // Botón flotante de WhatsApp: aparece al 30% del hero
  // -------------------------------------------------------------------------
  if (wspFloat) {
    const showFloat = () => {
      wspFloat.classList.add('is-visible');
      if (reducedMotion) {
        gsap.set(wspFloat, { scale: 1 });
      } else {
        gsap.to(wspFloat, { scale: 1, duration: 0.5, ease: 'back.out(2)' });
      }
    };
    const hideFloat = () => {
      wspFloat.classList.remove('is-visible');
      gsap.to(wspFloat, { scale: 0, duration: 0.3, ease: 'power2.in' });
    };

    if (heroSpace) {
      ScrollTrigger.create({
        trigger: heroSpace,
        start: '30% top',
        onEnter: showFloat,
        onLeaveBack: hideFloat,
      });
    } else {
      showFloat();
    }
  }

  // -------------------------------------------------------------------------
  // Menú mobile
  // -------------------------------------------------------------------------
  let menuOpen = false;

  const openMenu = () => {
    menuOpen = true;
    mobileMenu.classList.add('is-open');
    hamburger.classList.add('is-open');
    hamburger.setAttribute('aria-expanded', 'true');
    hamburger.setAttribute('aria-label', 'Cerrar menú');
    mobileMenu.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    if (!reducedMotion) {
      gsap.fromTo(mobileMenu, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.25, ease: 'power1.out' });
      gsap.fromTo(
        mobileMenu.querySelectorAll('.mobile-link, .mobile-menu-cta'),
        { y: 24, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.35, ease: 'power2.out', stagger: 0.06, delay: 0.05 }
      );
    }
  };

  const closeMenu = () => {
    menuOpen = false;
    hamburger.classList.remove('is-open');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'Abrir menú');
    document.body.style.overflow = '';

    const finish = () => {
      mobileMenu.classList.remove('is-open');
      mobileMenu.setAttribute('aria-hidden', 'true');
      gsap.set(mobileMenu, { clearProps: 'all' });
    };

    if (reducedMotion) {
      finish();
    } else {
      gsap.to(mobileMenu, { autoAlpha: 0, y: -14, duration: 0.22, ease: 'power1.in', onComplete: finish });
    }
  };

  hamburger.addEventListener('click', () => (menuOpen ? closeMenu() : openMenu()));

  mobileMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => closeMenu());
  });

  // -------------------------------------------------------------------------
  // Saltos de navegación: refrescar ScrollTrigger para no romper el pin
  // -------------------------------------------------------------------------
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', () => {
      // Esperar a que el navegador complete el salto y recalcular triggers
      requestAnimationFrame(() => ScrollTrigger.refresh());
    });
  });
}
