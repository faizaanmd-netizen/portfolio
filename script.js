const header = document.querySelector('.site-header');
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.primary-nav');
const navigationLinks = [...document.querySelectorAll('.primary-nav a[href^="#"]')];
const form = document.querySelector('#contact-form');
const formNote = document.querySelector('#form-note');

document.querySelector('#year').textContent = new Date().getFullYear();

const updateHeader = () => header.classList.toggle('scrolled', window.scrollY > 8);
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

menuButton.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
  navigation.classList.toggle('open', !isOpen);
});

navigationLinks.forEach((link) => link.addEventListener('click', () => {
  navigation.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open navigation');
}));

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navigationLinks.forEach((link) => {
      const isCurrent = link.hash === `#${entry.target.id}`;
      if (isCurrent) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
      link.classList.toggle('active', isCurrent);
    });
  });
}, { rootMargin: '-30% 0px -60% 0px' });

document.querySelectorAll('main section[id]').forEach((section) => sectionObserver.observe(section));

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('is-visible');
    observer.unobserve(entry.target);
  });
}, { threshold: 0.12 });

document.querySelectorAll('.section-heading, .about-content, .skill-group, .project-card, .experience-entry, .education-list article, .recognition-card, .credential-card, .contact-copy, .contact-form').forEach((element) => {
  element.classList.add('reveal');
  revealObserver.observe(element);
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;

  const fields = new FormData(form);
  const subject = encodeURIComponent(String(fields.get('subject')).trim());
  const body = encodeURIComponent(`From: ${String(fields.get('name')).trim()}\nReply to: ${String(fields.get('email')).trim()}\n\n${String(fields.get('message')).trim()}`);
  const mailto = `mailto:faizanmohd387590@gmail.com?subject=${subject}&body=${body}`;
  formNote.textContent = 'Your email app should open with the message ready. If it does not, email faizanmohd387590@gmail.com directly.';
  formNote.classList.remove('error');
  formNote.classList.add('success');
  window.location.href = mailto;
});