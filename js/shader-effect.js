/* ======================================
   SHADER EFFECT - CSS VERSION
   ====================================== */

/* ==========================================
   1. INITIALIZE SHADER EFFECTS
   ========================================== */
function initShaderEffects() {
  // Add click effect to all gallery items
  const galleryItems = document.querySelectorAll('.gallery-item');

  galleryItems.forEach(item => {
    item.addEventListener('click', function(e) {
      e.preventDefault();
      const imgSrc = this.getAttribute('data-img') || this.querySelector('img').src;
      triggerShaderEffect(e, imgSrc);
    });
  });

  console.log('✨ Shader effects initialized');
}

/* ==========================================
   2. TRIGGER SHADER EFFECT
   ========================================== */
function triggerShaderEffect(e, imgSrc) {
  const container = document.getElementById('rippleContainer');
  const reveal = document.getElementById('shaderReveal');
  const revealImg = document.getElementById('shaderRevealImg');

  // Get click position
  const x = e.clientX || window.innerWidth / 2;
  const y = e.clientY || window.innerHeight / 2;

  // Create ripple circles
  container.innerHTML = '';
  container.classList.add('active');

  for (let i = 0; i < 5; i++) {
    const circle = document.createElement('div');
    circle.className = 'ripple-circle';
    circle.style.left = (x - 50) + 'px';
    circle.style.top = (y - 50) + 'px';
    circle.style.width = '100px';
    circle.style.height = '100px';
    circle.style.animationDelay = (i * 0.15) + 's';
    container.appendChild(circle);
  }

  // Create glow effect
  const glow = document.createElement('div');
  glow.className = 'ripple-glow';
  glow.style.setProperty('--x', (x / window.innerWidth * 100) + '%');
  glow.style.setProperty('--y', (y / window.innerHeight * 100) + '%');
  container.appendChild(glow);

  // Show image after delay
  setTimeout(() => {
    revealImg.src = imgSrc;
    reveal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }, 800);

  // Remove ripple after animation
  setTimeout(() => {
    container.classList.remove('active');
    container.innerHTML = '';
  }, 2500);
}

/* ==========================================
   3. CLOSE SHADER REVEAL
   ========================================== */
function closeShaderReveal() {
  const reveal = document.getElementById('shaderReveal');
  reveal.classList.remove('active');
  document.body.style.overflow = '';
}

/* ==========================================
   4. CLOSE ON CLICK OUTSIDE
   ========================================== */
document.addEventListener('click', function(e) {
  const reveal = document.getElementById('shaderReveal');
  if (reveal.classList.contains('active') && !e.target.closest('.shader-reveal')) {
    closeShaderReveal();
  }
});

/* ==========================================
   5. CLOSE ON ESCAPE KEY
   ========================================== */
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    closeShaderReveal();
  }
});

/* ==========================================
   6. INITIALIZE ON DOM READY
   ========================================== */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initShaderEffects);
} else {
  initShaderEffects();
}
