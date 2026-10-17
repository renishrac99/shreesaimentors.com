/**
 * SHREE SAI MENTOR - Official Website Interactions
 * Video modal, service filters, Google review tabs, form handler, animated counters
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initStatsCounter();
  initServiceFilters();
  initReviewFilters();
  initDynamicReviewDates();
  initReviewReadMore();
  initVideoModal();
  initFaqAccordion();
  initConsultationForm();
  initDynamicYears();
  initDestinationFilters();
});

/* --------------------------------------------------------------------------
   1. NAVBAR & MOBILE DRAWER
   -------------------------------------------------------------------------- */
function initNavbar() {
  const header = document.querySelector('.site-header');
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Scroll effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    highlightActiveNavLink();
  });

  // Mobile menu toggle
  const mobileOverlay = document.getElementById('mobileOverlay');

  function openMenu() {
    navMenu.classList.add('active');
    if (mobileOverlay) mobileOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    mobileToggle.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>';
  }

  function closeMenu() {
    navMenu.classList.remove('active');
    if (mobileOverlay) mobileOverlay.classList.remove('active');
    document.body.style.overflow = '';
    mobileToggle.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>';
  }

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      if (navMenu.classList.contains('active')) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    if (mobileOverlay) {
      mobileOverlay.addEventListener('click', closeMenu);
    }

    navLinks.forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    // Also close if any button inside the drawer is clicked
    const drawerButtons = navMenu.querySelectorAll('.mobile-nav-actions .btn');
    drawerButtons.forEach(btn => {
      btn.addEventListener('click', closeMenu);
    });
  }

  // Active section scroll spy
  function highlightActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 120;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');
      const correspondingLink = document.querySelector(`.nav-link[href="#${id}"]`);

      if (correspondingLink) {
        if (scrollPos >= top && scrollPos < top + height) {
          navLinks.forEach(l => l.classList.remove('active'));
          correspondingLink.classList.add('active');
        }
      }
    });
  }
}

/* --------------------------------------------------------------------------
   2. ANIMATED NUMERICAL COUNTERS
   -------------------------------------------------------------------------- */
function initStatsCounter() {
  const stats = document.querySelectorAll('.stat-number');
  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        stats.forEach(stat => {
          const target = parseFloat(stat.getAttribute('data-target'));
          const suffix = stat.getAttribute('data-suffix') || '';
          const isDecimal = target % 1 !== 0;
          let current = 0;
          const duration = 1600;
          const stepTime = 25;
          const steps = duration / stepTime;
          const increment = target / steps;

          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              current = target;
              clearInterval(timer);
            }
            stat.innerHTML = (isDecimal ? current.toFixed(1) : Math.floor(current)) + `<span>${suffix}</span>`;
          }, stepTime);
        });
      }
    });
  }, { threshold: 0.3 });

  const statsSection = document.querySelector('.stats-bar');
  if (statsSection) {
    observer.observe(statsSection);
  }
}

/* --------------------------------------------------------------------------
   3. SERVICE CATEGORY FILTER
   -------------------------------------------------------------------------- */
function initServiceFilters() {
  const tabs = document.querySelectorAll('.service-filter-tabs .filter-tab');
  const cards = document.querySelectorAll('.service-card');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.getAttribute('data-filter');

      cards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 20);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   4. GOOGLE REVIEWS FILTER & TOP-10 TOGGLE
   -------------------------------------------------------------------------- */
function initReviewFilters() {
  const tabs = document.querySelectorAll('.review-filter-tabs .filter-tab');
  const reviews = document.querySelectorAll('.review-card');
  const grid = document.querySelector('.reviews-grid');
  const toggleBtn = document.getElementById('toggleMoreReviewsBtn');

  function updateVisibility() {
    const activeTab = document.querySelector('.review-filter-tabs .filter-tab.active');
    const filter = activeTab ? activeTab.getAttribute('data-filter') : 'all';
    const isExpanded = grid && grid.classList.contains('show-all');

    reviews.forEach(card => {
      const cat = card.getAttribute('data-category');
      const isExtra = card.classList.contains('review-card-extra');

      if (filter === 'all') {
        if (!isExtra || isExpanded) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      } else {
        if (cat === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      }
    });

    if (toggleBtn) {
      toggleBtn.style.display = filter === 'all' ? 'inline-flex' : 'none';
    }
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      updateVisibility();
    });
  });

  // Run on initial load
  updateVisibility();

  if (toggleBtn && grid) {
    toggleBtn.addEventListener('click', () => {
      const isExpanded = grid.classList.toggle('show-all');
      toggleBtn.innerHTML = isExpanded
        ? `<span>Show Top 10 Reviews</span> <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="18 15 12 9 6 15"/></svg>`
        : `<span>Show All 18 on Page</span> <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>`;
      updateVisibility();
    });
  }
}

/* --------------------------------------------------------------------------
   4B. DYNAMIC GOOGLE REVIEW TIMESTAMPS
   -------------------------------------------------------------------------- */
function initReviewReadMore() {
  const reviews = document.querySelectorAll('.review-text');
  reviews.forEach(review => {
    // Add collapsed class by default
    review.classList.add('collapsed');

    // After applying collapsed, check if the actual text exceeds the visible area
    // Sometimes it's tricky to measure with line-clamp applied before layout is fully settled.
    // We can temporarily remove the class to measure full height vs clamped height.
    review.classList.remove('collapsed');
    const fullHeight = review.scrollHeight;
    review.classList.add('collapsed');
    
    // We also need the clamped height
    const clampedHeight = review.scrollHeight;

    // If text needs truncation
    if (fullHeight > clampedHeight) {
      const btn = document.createElement('button');
      btn.className = 'read-more-btn';
      btn.innerText = 'Read more...';
      btn.addEventListener('click', () => {
        if (review.classList.contains('collapsed')) {
          review.classList.remove('collapsed');
          btn.innerText = 'Show less';
        } else {
          review.classList.add('collapsed');
          btn.innerText = 'Read more...';
        }
      });
      // Insert after the review text
      review.parentNode.insertBefore(btn, review.nextSibling);
    }
  });
}

function initDynamicReviewDates() {
  const dateElements = document.querySelectorAll('.review-footer [data-days-ago]');
  dateElements.forEach(el => {
    const days = parseInt(el.getAttribute('data-days-ago'), 10);
    if (isNaN(days)) return;

    let text = '';
    if (days <= 1) {
      text = 'Yesterday';
    } else if (days < 7) {
      text = `${days} days ago`;
    } else if (days < 30) {
      const weeks = Math.round(days / 7);
      text = weeks <= 1 ? '1 week ago' : `${weeks} weeks ago`;
    } else if (days < 365) {
      const months = Math.round(days / 30);
      text = months <= 1 ? '1 month ago' : `${months} months ago`;
    } else {
      const years = Math.floor(days / 365);
      text = years <= 1 ? '1 year ago' : `${years} years ago`;
    }
    el.textContent = text;
  });
}

/* --------------------------------------------------------------------------
   5. VIDEO REVIEWS / YOUTUBE SHORTS MODAL
   -------------------------------------------------------------------------- */
function initVideoModal() {
  const modal = document.getElementById('videoModal');
  const closeBtn = document.querySelector('.modal-close-btn');
  const videoCards = document.querySelectorAll('.short-card');
  const modalTitle = document.querySelector('.modal-video-title');
  const modalDesc = document.querySelector('.modal-video-desc');
  const modalVideoContainer = document.querySelector('.modal-video-container');

  if (!modal) return;

  videoCards.forEach(card => {
    card.addEventListener('click', () => {
      const title = card.getAttribute('data-title') || 'Student Review';
      const desc = card.getAttribute('data-desc') || 'Shree Sai Mentor Success Story';
      const youtubeId = card.getAttribute('data-youtube-id');
      const posterImg = card.querySelector('img') ? card.querySelector('img').src : '';

      modalTitle.textContent = title;
      modalDesc.innerHTML = `${desc} &bull; <a href="https://www.youtube.com/shorts/${youtubeId}" target="_blank" rel="noopener" style="color: #FF0000; font-weight: 700; text-decoration: underline; margin-left: 6px;">Watch on YouTube ↗</a>`;

      // If a YouTube Shorts ID is provided, embed responsive player; otherwise render a simulated reel player
      if (youtubeId && youtubeId !== 'SAMPLE_ID') {
        modalVideoContainer.innerHTML = `
          <iframe class="modal-video-player" 
            src="https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1" 
            title="${title}" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowfullscreen>
          </iframe>
        `;
      } else {
        // High fidelity interactive simulated video reel
        modalVideoContainer.innerHTML = `
          <div style="width:100%;height:100%;position:relative;background:#000;display:flex;flex-direction:column;justify-content:center;align-items:center;">
            <img src="${posterImg}" style="width:100%;height:100%;object-fit:cover;opacity:0.85;filter:brightness(0.9);" alt="${title}">
            <div style="position:absolute;inset:0;background:radial-gradient(circle, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.7) 100%);"></div>
            <div style="position:absolute;display:flex;flex-direction:column;align-items:center;gap:12px;z-index:2;text-align:center;padding:1rem;">
              <div style="width:64px;height:64px;border-radius:50%;background:#C52838;display:flex;align-items:center;justify-content:center;box-shadow:0 0 25px rgba(197,40,56,0.8);color:#fff;font-size:1.8rem;">
                ▶
              </div>
              <p style="color:#fff;font-weight:700;font-size:1rem;margin:0;">Playing Student Success Short</p>
              <p style="color:#CBD5E1;font-size:0.85rem;max-width:260px;">To replace with live YouTube Shorts, insert your YouTube URL in data-youtube-id.</p>
            </div>
            <div style="position:absolute;bottom:12px;left:15px;right:15px;display:flex;align-items:center;gap:10px;z-index:3;">
              <div style="flex:1;height:4px;background:rgba(255,255,255,0.3);border-radius:2px;overflow:hidden;">
                <div style="width:65%;height:100%;background:#C52838;"></div>
              </div>
              <span style="font-size:0.75rem;color:#fff;">0:38 / 0:59</span>
            </div>
          </div>
        `;
      }

      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeModal() {
    modal.classList.remove('active');
    modalVideoContainer.innerHTML = '';
    document.body.style.overflow = '';
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

/* --------------------------------------------------------------------------
   6. FAQ ACCORDION
   -------------------------------------------------------------------------- */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all others
      faqItems.forEach(other => {
        other.classList.remove('active');
      });

      // Toggle clicked
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

/* --------------------------------------------------------------------------
   7. CONSULTATION BOOKING & WHATSAPP FORM
   -------------------------------------------------------------------------- */
function initConsultationForm() {
  const form = document.getElementById('consultationForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.querySelector('[name="fullName"]').value.trim();
    const phone = form.querySelector('[name="phone"]').value.trim();
    const email = form.querySelector('[name="email"]').value.trim();
    const grade = form.querySelector('[name="currentGrade"]').value;
    const service = form.querySelector('[name="service"]').value;
    const country = form.querySelector('[name="targetCountry"]').value;
    const notes = form.querySelector('[name="notes"]').value.trim();

    if (!name || !phone) {
      alert('Please provide your name and phone/WhatsApp number so we can reach you.');
      return;
    }

    // Compose formatted WhatsApp inquiry
    let waMsg = `Hello Ekta Ma'am, I would like to book a consultation with Shree Sai Mentor.%0A%0A`;
    waMsg += `*Name:* ${encodeURIComponent(name)}%0A`;
    waMsg += `*Phone:* ${encodeURIComponent(phone)}%0A`;
    if (email) waMsg += `*Email:* ${encodeURIComponent(email)}%0A`;
    if (grade) waMsg += `*Education Level:* ${encodeURIComponent(grade)}%0A`;
    if (service) waMsg += `*Service Required:* ${encodeURIComponent(service)}%0A`;
    if (country) waMsg += `*Target Destination:* ${encodeURIComponent(country)}%0A`;
    if (notes) waMsg += `*Message:* ${encodeURIComponent(notes)}%0A`;

    const waUrl = `https://wa.me/919429515919?text=${waMsg}`;

    // Show instant success feedback
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    btn.innerHTML = `<span>✓ Connecting to WhatsApp...</span>`;
    btn.style.background = '#25D366';

    setTimeout(() => {
      window.open(waUrl, '_blank');
      btn.innerHTML = originalText;
      btn.style.background = '';
      form.reset();
      alert('Thank you, ' + name + '! We are opening WhatsApp to connect you directly with Ekta Ma\'am.');
    }, 800);
  });
}

/* --------------------------------------------------------------------------
   8. DYNAMIC ADMISSIONS CYCLE & COPYRIGHT YEAR
   -------------------------------------------------------------------------- */
function initDynamicYears() {
  const now = new Date();
  const currentYear = now.getFullYear();

  // 1. Dynamic Copyright Year (updates automatically every January 1st)
  const copyrightElements = document.querySelectorAll('.dynamic-copyright-year, #copyrightYear');
  copyrightElements.forEach(el => {
    el.textContent = currentYear;
  });

  // 2. Dynamic Admissions Cycle (e.g. 2026/2027, 2027/2028, etc.)
  const nextYear = currentYear + 1;
  const admissionsCycle = `${currentYear}/${nextYear}`;
  const admissionsElements = document.querySelectorAll('.dynamic-admissions-year, #admissionsYear');
  admissionsElements.forEach(el => {
    el.textContent = admissionsCycle;
  });
}

/* --------------------------------------------------------------------------
   9. INTERACTIVE DESTINATIONS FILTER
   -------------------------------------------------------------------------- */
function initDestinationFilters() {
  const filterBtns = document.querySelectorAll('.dest-filter-btn');
  const cards = document.querySelectorAll('.destinations-grid .destination-card');
  if (!filterBtns.length || !cards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');

      cards.forEach(card => {
        if (filter === 'all') {
          card.style.display = '';
        } else {
          const regions = (card.getAttribute('data-region') || '').split(' ');
          if (regions.includes(filter)) {
            card.style.display = '';
          } else {
            card.style.display = 'none';
          }
        }
      });
    });
  });
}
