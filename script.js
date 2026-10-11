// Год в футере
document.getElementById('year').textContent = new Date().getFullYear();

// Плавное появление карточек при скролле
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      entry.target.style.animation = `fadeUp 0.6s ${i * 0.05}s ease both`;
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.card').forEach((card) => {
  card.style.opacity = '0';
  observer.observe(card);
});