// Год в футере
document.getElementById('year').textContent = new Date().getFullYear();

// Анимация появления секции при скролле
const revealEls = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.15,
  rootMargin: '0px 0px -10% 0px'
});

revealEls.forEach((el) => observer.observe(el));