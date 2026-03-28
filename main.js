/* ============================================================
   LUMIÈRE RESIDENCES — main.js
   Funcionalidades:
   1. Navbar — efeito ao rolar
   2. Scroll Reveal — animações de entrada
   3. Lightbox — expandir imagens da galeria
============================================================ */

document.addEventListener('DOMContentLoaded', () => {


  /* ─── 1. NAVBAR — efeito ao rolar ─── */
  const navbar = document.getElementById('navbar');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  });


  /* ─── 2. SCROLL REVEAL — animações de entrada ─── */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, i * 80);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.stat-item, .feature-item, .reveal')
    .forEach(el => revealObserver.observe(el));


  /* ─── 3. LIGHTBOX ─── */
  const lightbox    = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCap = document.getElementById('lightboxCaption');
  const lightboxNum = document.getElementById('lightboxCounter');
  const btnClose    = document.getElementById('lightboxClose');
  const btnPrev     = document.getElementById('lightboxPrev');
  const btnNext     = document.getElementById('lightboxNext');

  // Coleta todos os itens da galeria dinamicamente
  // (funciona com qualquer quantidade de .gallery-item)
  const galleryItems = Array.from(document.querySelectorAll('#galleryGrid .gallery-item'));
  let currentIndex   = 0;

  function openLightbox(index) {
    currentIndex = index;
    const item  = galleryItems[index];
    const img   = item.querySelector('img');
    const label = item.querySelector('.gallery-label');

    lightboxImg.src         = img.src;
    lightboxImg.alt         = img.alt;
    lightboxCap.textContent = label ? label.textContent : img.alt;
    lightboxNum.textContent = `${index + 1} / ${galleryItems.length}`;

    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
    btnClose.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function navigate(direction) {
    const total = galleryItems.length;
    currentIndex = (currentIndex + direction + total) % total;

    lightboxImg.style.opacity   = '0';
    lightboxImg.style.transform = 'scale(0.97)';

    setTimeout(() => {
      const item  = galleryItems[currentIndex];
      const img   = item.querySelector('img');
      const label = item.querySelector('.gallery-label');

      lightboxImg.src         = img.src;
      lightboxImg.alt         = img.alt;
      lightboxCap.textContent = label ? label.textContent : img.alt;
      lightboxNum.textContent = `${currentIndex + 1} / ${galleryItems.length}`;

      lightboxImg.style.opacity   = '1';
      lightboxImg.style.transform = 'scale(1)';
    }, 180);
  }

  lightboxImg.style.transition = 'opacity 0.18s ease, transform 0.18s ease';

  galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => openLightbox(index));
  });

  btnClose.addEventListener('click', closeLightbox);
  btnPrev.addEventListener('click',  () => navigate(-1));
  btnNext.addEventListener('click',  () => navigate(+1));

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'ArrowLeft')  navigate(-1);
    if (e.key === 'ArrowRight') navigate(+1);
    if (e.key === 'Escape')     closeLightbox();
  });

  let touchStartX = 0;
  lightbox.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });

  lightbox.addEventListener('touchend', (e) => {
    const delta = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(delta) < 40) return;
    navigate(delta < 0 ? +1 : -1);
  }, { passive: true });


  /* ─── 4. COUNTDOWN CTA FINAL ─── */
  const countdown = document.getElementById('countdown');

  if (countdown) {
    const deadline = new Date(countdown.dataset.deadline).getTime();

    const daysEl = document.getElementById('cd-days');
    const hoursEl = document.getElementById('cd-hours');
    const minutesEl = document.getElementById('cd-minutes');
    const secondsEl = document.getElementById('cd-seconds');

    function pad(value) {
      return String(value).padStart(2, '0');
    }

    function updateCountdown() {
      const now = new Date().getTime();
      const diff = deadline - now;
    
      if (diff <= 0) {
        // Zera contador
        daysEl.textContent = '00';
        hoursEl.textContent = '00';
        minutesEl.textContent = '00';
        secondsEl.textContent = '00';
    
        // Troca texto da mensagem
        const message = countdown.previousElementSibling;
        if (message) {
          message.innerHTML = `
            ⚠️ Condição promocional encerrada.<br>
            Consulte valores atualizados com um consultor.
          `;
        }
    
        // Opcional: parar o contador
        return;
      }
    
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
    
      daysEl.textContent = pad(days);
      hoursEl.textContent = pad(hours);
      minutesEl.textContent = pad(minutes);
      secondsEl.textContent = pad(seconds);
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
  }


});
