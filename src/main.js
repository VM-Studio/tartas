import './style.css';
import './css/hero.css';
import './css/sections.css';
import './css/header.css';
import { initHero } from './js/hero.js';
import { initSections } from './js/sections.js';
import { initHeader } from './js/header.js';

// Punto de entrada: acá vamos a importar los módulos de src/js/
// a medida que construyamos las secciones (header, hero, precios, etc.)

initHero();
initSections();
initHeader();
