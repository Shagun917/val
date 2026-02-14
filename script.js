// Tilt effect for media items
const mediaItems = document.querySelectorAll('[data-tilt]');

mediaItems.forEach(item => {
  item.addEventListener('mouseenter', function() {
    this.style.transition = 'transform 0.1s ease';
  });
  
  item.addEventListener('mousemove', function(e) {
    const rect = this.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;
    
    this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
  });
  
  item.addEventListener('mouseleave', function() {
    this.style.transition = 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    const rotation = this.classList.contains('item-1') ? 'rotate(-4deg)' :
                     this.classList.contains('item-2') ? 'rotate(3deg)' :
                     this.classList.contains('item-3') ? 'rotate(-2deg)' :
                     this.classList.contains('item-4') ? 'rotate(5deg)' :
                     this.classList.contains('item-5') ? 'rotate(-3deg)' :
                     this.classList.contains('item-6') ? 'rotate(2deg)' : 'rotate(0deg)';
    this.style.transform = rotation;
  });
});

// ===== LIGHTBOX FUNCTIONALITY =====
const lightboxOverlay = document.getElementById('lightboxOverlay');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxVideo = document.getElementById('lightboxVideo');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');

let currentMediaIndex = 0;
let allMediaItems = [];

// Collect all media items
function collectMediaItems() {
  allMediaItems = Array.from(document.querySelectorAll('.media-item')).map(item => {
    const img = item.querySelector('img');
    const video = item.querySelector('video');
    const caption = item.querySelector('.polaroid-caption').textContent;
    
    return {
      type: video ? 'video' : 'image',
      src: video ? video.querySelector('source').src : img.src,
      caption: caption,
      element: item
    };
  });
}

collectMediaItems();

// Open lightbox
function openLightbox(index) {
  currentMediaIndex = index;
  const media = allMediaItems[index];
  
  lightboxCaption.textContent = media.caption;
  
  if (media.type === 'image') {
    lightboxImage.src = media.src;
    lightboxImage.classList.add('active');
    lightboxVideo.classList.remove('active');
    lightboxVideo.pause();
  } else {
    lightboxVideo.querySelector('source').src = media.src;
    lightboxVideo.load();
    lightboxVideo.classList.add('active');
    lightboxImage.classList.remove('active');
  }
  
  lightboxOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

// Close lightbox
function closeLightbox() {
  lightboxOverlay.classList.remove('active');
  lightboxVideo.pause();
  document.body.style.overflow = '';
}

// Navigate lightbox
function navigateLightbox(direction) {
  currentMediaIndex += direction;
  
  if (currentMediaIndex < 0) {
    currentMediaIndex = allMediaItems.length - 1;
  } else if (currentMediaIndex >= allMediaItems.length) {
    currentMediaIndex = 0;
  }
  
  openLightbox(currentMediaIndex);
}

// Click on media items to open lightbox
mediaItems.forEach((item, index) => {
  item.addEventListener('click', (e) => {
    // Don't open lightbox if clicking on video controls
    if (e.target.tagName === 'VIDEO' && e.target.paused === false) {
      return;
    }
    openLightbox(index);
  });
});

// Lightbox controls
lightboxClose.addEventListener('click', closeLightbox);
lightboxPrev.addEventListener('click', () => navigateLightbox(-1));
lightboxNext.addEventListener('click', () => navigateLightbox(1));

// Close on overlay click
lightboxOverlay.addEventListener('click', (e) => {
  if (e.target === lightboxOverlay) {
    closeLightbox();
  }
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
  if (lightboxOverlay.classList.contains('active')) {
    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowLeft') {
      navigateLightbox(-1);
    } else if (e.key === 'ArrowRight') {
      navigateLightbox(1);
    }
  }
});

// Swipe support for mobile
let touchStartX = 0;
let touchEndX = 0;

lightboxOverlay.addEventListener('touchstart', (e) => {
  touchStartX = e.changedTouches[0].screenX;
});

lightboxOverlay.addEventListener('touchend', (e) => {
  touchEndX = e.changedTouches[0].screenX;
  handleSwipe();
});

function handleSwipe() {
  const swipeThreshold = 50;
  if (touchEndX < touchStartX - swipeThreshold) {
    navigateLightbox(1); // Swipe left
  }
  if (touchEndX > touchStartX + swipeThreshold) {
    navigateLightbox(-1); // Swipe right
  }
}

// Yes button functionality
const yesBtn = document.getElementById('yesBtn');
const secretMessage = document.getElementById('secretMessage');
const celebrationOverlay = document.getElementById('celebrationOverlay');
const confettiContainer = document.getElementById('confettiContainer');

yesBtn.addEventListener('click', function() {
  // Show secret message
  secretMessage.classList.add('show');
  
  // Wait a moment, then show celebration
  setTimeout(() => {
    celebrationOverlay.classList.add('active');
    createConfetti();
    
    // Play a little animation on the celebration text
    setTimeout(() => {
      createHeartBurst();
    }, 500);
  }, 1000);
});

// No button hover effect (make it run away)
const noBtn = document.getElementById('noBtn');
let noBtnMoved = false;

noBtn.addEventListener('mouseenter', function() {
  if (!noBtnMoved) {
    // Make it shrink and look even more disabled
    this.style.transform = 'scale(0.9)';
    this.style.opacity = '0.3';
    noBtnMoved = true;
  }
});

noBtn.addEventListener('mouseleave', function() {
  if (noBtnMoved) {
    this.style.transform = 'scale(1)';
    this.style.opacity = '0.5';
  }
});

// Create confetti
function createConfetti() {
  const colors = ['#ff1744', '#ffd700', '#ff6090', '#fff', '#ffe0e8'];
  const confettiCount = 100;
  
  for (let i = 0; i < confettiCount; i++) {
    setTimeout(() => {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.left = Math.random() * 100 + '%';
      confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.animationDelay = Math.random() * 0.5 + 's';
      confetti.style.animationDuration = Math.random() * 2 + 2 + 's';
      confetti.style.width = Math.random() * 10 + 5 + 'px';
      confetti.style.height = Math.random() * 10 + 5 + 'px';
      
      // Random shapes
      if (Math.random() > 0.5) {
        confetti.style.borderRadius = '50%';
      }
      
      confettiContainer.appendChild(confetti);
      
      // Remove after animation
      setTimeout(() => {
        confetti.remove();
      }, 3000);
    }, i * 20);
  }
}

// Create heart burst effect
function createHeartBurst() {
  const heartEmojis = ['❤️', '💕', '💖', '💗', '💘', '💝'];
  const burstCount = 20;
  
  for (let i = 0; i < burstCount; i++) {
    setTimeout(() => {
      const heart = document.createElement('div');
      heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
      heart.style.position = 'fixed';
      heart.style.left = '50%';
      heart.style.top = '50%';
      heart.style.fontSize = '40px';
      heart.style.pointerEvents = 'none';
      heart.style.zIndex = '10000';
      
      const angle = (Math.PI * 2 * i) / burstCount;
      const velocity = 200 + Math.random() * 100;
      const endX = Math.cos(angle) * velocity;
      const endY = Math.sin(angle) * velocity;
      
      heart.style.animation = `heartBurst 1.5s ease-out forwards`;
      heart.style.setProperty('--endX', endX + 'px');
      heart.style.setProperty('--endY', endY + 'px');
      
      document.body.appendChild(heart);
      
      setTimeout(() => heart.remove(), 1500);
    }, i * 30);
  }
}

// Add heart burst animation dynamically
const style = document.createElement('style');
style.textContent = `
  @keyframes heartBurst {
    0% {
      transform: translate(-50%, -50%) scale(0);
      opacity: 1;
    }
    100% {
      transform: translate(calc(-50% + var(--endX)), calc(-50% + var(--endY))) scale(1);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// Click celebration overlay to close
celebrationOverlay.addEventListener('click', function() {
  this.classList.remove('active');
});

// Add floating animation to random media items
function addRandomFloat() {
  mediaItems.forEach((item, index) => {
    const delay = Math.random() * 2;
    const duration = 3 + Math.random() * 2;
    item.style.animation = `popIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) ${0.1 * (index + 1)}s backwards, 
                           gentleFloat ${duration}s ease-in-out ${delay}s infinite`;
  });
}

// Add gentle float animation
const floatStyle = document.createElement('style');
floatStyle.textContent = `
  @keyframes gentleFloat {
    0%, 100% { transform: translateY(0) rotate(var(--rotation, 0deg)); }
    50% { transform: translateY(-10px) rotate(var(--rotation, 0deg)); }
  }
`;
document.head.appendChild(floatStyle);

// Set rotation custom properties
document.querySelector('.item-1')?.style.setProperty('--rotation', '-4deg');
document.querySelector('.item-2')?.style.setProperty('--rotation', '3deg');
document.querySelector('.item-3')?.style.setProperty('--rotation', '-2deg');
document.querySelector('.item-4')?.style.setProperty('--rotation', '5deg');
document.querySelector('.item-5')?.style.setProperty('--rotation', '-3deg');
document.querySelector('.item-6')?.style.setProperty('--rotation', '2deg');

addRandomFloat();

// Easter egg: Konami code for extra hearts
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
  konamiCode.push(e.key);
  konamiCode = konamiCode.slice(-10);
  
  if (konamiCode.join(',') === konamiSequence.join(',')) {
    // Extra celebration!
    createConfetti();
    createHeartBurst();
    konamiCode = [];
  }
});

// Add sparkle cursor effect
document.addEventListener('mousemove', function(e) {
  if (Math.random() > 0.8) {
    const sparkle = document.createElement('div');
    sparkle.textContent = ['✨', '💫', '⭐'][Math.floor(Math.random() * 3)];
    sparkle.style.position = 'fixed';
    sparkle.style.left = e.clientX + 'px';
    sparkle.style.top = e.clientY + 'px';
    sparkle.style.pointerEvents = 'none';
    sparkle.style.fontSize = '16px';
    sparkle.style.zIndex = '9999';
    sparkle.style.animation = 'sparkleFade 1s ease-out forwards';
    
    document.body.appendChild(sparkle);
    
    setTimeout(() => sparkle.remove(), 1000);
  }
});

const sparkleStyle = document.createElement('style');
sparkleStyle.textContent = `
  @keyframes sparkleFade {
    0% {
      transform: translate(-50%, -50%) scale(0);
      opacity: 1;
    }
    100% {
      transform: translate(-50%, -50%) translateY(-30px) scale(1);
      opacity: 0;
    }
  }
`;
document.head.appendChild(sparkleStyle);