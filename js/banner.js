document.addEventListener('DOMContentLoaded', function() {
  const bannerTrack = document.querySelector('.banner-track');
  const bannerContainer = document.querySelector('.banner-container');
  
  if (!bannerTrack || !bannerContainer) return;

  // Clone first set of images and append to container for seamless looping
  const bannerItems = document.querySelectorAll('.banner-item');
  bannerItems.forEach(item => {
    if (item.parentNode === bannerContainer) {
      const clone = item.cloneNode(true);
      bannerContainer.appendChild(clone);
    }
  });

  // Animation variables
  let position = 0;
  const speed = 1;
  let animationId;
  let isPaused = false;
  
  function animateBanner() {
    if (!isPaused) {
      position -= speed;
      
      // Reset position when one full set has scrolled
      if (position <= -bannerContainer.scrollWidth / 2) {
        position = 0;
      }
      
      bannerContainer.style.transform = `translateX(${position}px)`;
    }
    animationId = requestAnimationFrame(animateBanner);
  }
  
  // Start animation
  animateBanner();
  
  // Pause on hover
  bannerTrack.addEventListener('mouseenter', function() {
    isPaused = true;
  });
  
  bannerTrack.addEventListener('mouseleave', function() {
    isPaused = false;
  });
  
  // Clean up
  window.addEventListener('beforeunload', function() {
    cancelAnimationFrame(animationId);
  });
});