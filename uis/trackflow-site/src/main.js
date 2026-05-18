/**
 * Main entry point for TrackFlow public site
 * Imports global styles and initializes form validation
 */

import './styles.css';
import './form-validation.js';

const menuToggle = document.getElementById('menu-toggle');
const primaryNavigation = document.getElementById('primary-navigation');
const navList = primaryNavigation?.querySelector('ul');

if (menuToggle && navList) {
  const updateAriaLabel = (expanded) => {
    menuToggle.setAttribute('aria-label', expanded ? 'Cerrar menú de navegación' : 'Abrir menú de navegación');
  };

  const closeMenu = () => {
    menuToggle.setAttribute('aria-expanded', 'false');
    updateAriaLabel(false);
    navList.classList.add('hidden');
    navList.classList.remove('flex');
  };

  menuToggle.addEventListener('click', () => {
    const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
    const newState = !isExpanded;
    menuToggle.setAttribute('aria-expanded', String(newState));
    updateAriaLabel(newState);
    navList.classList.toggle('hidden');
    navList.classList.toggle('flex');
  });

  primaryNavigation?.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', () => {
      if (window.innerWidth < 768) {
        closeMenu();
      }
    });
  });
}

console.log('TrackFlow site initialized');
