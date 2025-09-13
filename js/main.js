document.addEventListener('DOMContentLoaded', () => {
    // General animations
    const body = document.querySelector('body');
    body.classList.add('loaded');

    const serviceItems = document.querySelectorAll('.service-item');
    serviceItems.forEach((item, index) => {
        item.style.transitionDelay = `${index * 100}ms`;
    });
});