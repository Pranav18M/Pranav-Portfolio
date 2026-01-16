// ============================================
// OPTIMIZED JAVASCRIPT - REDUCED LAG
// ============================================

// -----------------------------
// Simplified Background (ONLY 4 bubbles!)
// -----------------------------
function createBackground() {
  const background = document.querySelector('.background-animation');
  if (!background) return;

  background.innerHTML = '';

  // REDUCED from 12 to 4 bubbles - MAJOR performance boost
  for (let i = 0; i < 4; i++) {
    const bubble = document.createElement('div');
    bubble.classList.add('bubble');
    const size = Math.random() * 40 + 30;
    bubble.style.width = size + 'px';
    bubble.style.height = size + 'px';
    bubble.style.left = Math.random() * 100 + '%';
    bubble.style.top = Math.random() * 100 + '%';
    bubble.style.animationDelay = i * 2 + 's';
    bubble.style.animation = 'simpleFloat 6s infinite ease-in-out';
    background.appendChild(bubble);
  }

  // REMOVED all lines - they cause lag on mobile
}

// -----------------------------
// Navigation with optimized transitions
// -----------------------------
let historyStack = [];

function showSection(targetId, pushHistory = true) {
  if (!targetId) return;
  const targetEl = document.getElementById(targetId);
  if (!targetEl) return;

  const sections = document.querySelectorAll('.content-section');
  const navLinks = document.querySelectorAll('.nav-link');

  sections.forEach(section => section.classList.remove('active'));
  navLinks.forEach(link => link.classList.remove('active'));

  // Immediate transition - no setTimeout delays
  targetEl.classList.add('active');
  const activeLink = document.querySelector(`[href="#${targetId}"]`);
  if (activeLink) activeLink.classList.add('active');

  if (pushHistory) {
    const last = historyStack[historyStack.length - 1];
    if (last !== targetId) historyStack.push(targetId);
  }

  // Close mobile menu
  const navLinksContainer = document.getElementById('navLinks');
  const menuBtn = document.getElementById('menuBtn');
  if (navLinksContainer && navLinksContainer.classList.contains('active')) {
    navLinksContainer.classList.remove('active');
    if (menuBtn) menuBtn.classList.remove('active');
  }
}

function goBack() {
  const popup = document.getElementById("certPopup");
  if (popup && popup.style.display === "flex") {
    closeCert();
    return;
  }

  if (historyStack.length > 1) {
    historyStack.pop();
    const prev = historyStack[historyStack.length - 1] || "home";
    showSection(prev, false);
  } else {
    historyStack = ["home"];
    showSection("home", false);
  }
}

function goNext(targetId) {
  if (!targetId) return;
  showSection(targetId, true);
}

// Toggle mobile menu
function toggleMenu() {
  const navLinksContainer = document.getElementById('navLinks');
  const menuBtn = document.getElementById('menuBtn');
  if (!navLinksContainer) return;
  
  navLinksContainer.classList.toggle('active');
  if (menuBtn) menuBtn.classList.toggle('active');
}

// -----------------------------
// Contact Form
// -----------------------------
function handleSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const button = form.querySelector('button');
  const originalText = button.textContent;

  button.textContent = 'Sending...';
  button.disabled = true;

  fetch("https://formspree.io/f/xwpqjlvp", {
    method: "POST",
    body: new FormData(form),
    headers: { "Accept": "application/json" }
  }).then(response => {
    if (response.ok) {
      button.textContent = "Message Sent!";
      form.reset();
    } else {
      button.textContent = "Error! Try Again";
    }
    setTimeout(() => {
      button.textContent = originalText;
      button.disabled = false;
    }, 3000);
  }).catch(() => {
    button.textContent = "Error! Try Again";
    setTimeout(() => {
      button.textContent = originalText;
      button.disabled = false;
    }, 3000);
  });
}

// -----------------------------
// Certifications popup
// -----------------------------
function openCert(imgSrc) {
  const popup = document.getElementById("certPopup");
  const certImage = document.getElementById("certImage");
  if (!popup || !certImage) return;
  certImage.src = imgSrc;
  popup.style.display = "flex";
}

function closeCert() {
  const popup = document.getElementById("certPopup");
  if (!popup) return;
  popup.style.display = "none";
}

// -----------------------------
// OPTIMIZED Lazy load - REMOVED delays!
// -----------------------------
function initLazyLoad() {
  const lazyElements = document.querySelectorAll(".lazy-load");
  
  // REMOVED setTimeout delays - instant load for better performance
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 }); // Reduced threshold for faster trigger
  
  lazyElements.forEach(el => observer.observe(el));
}

// -----------------------------
// OPTIMIZED Typing effect
// -----------------------------
const textArray = ["Full Stack Developer (MERN)", "Problem Solver", "Web Developer", "AI-assisted coding"];
let i = 0, j = 0, currentText = "", isDeleting = false;

function typeEffect() {
  const typingElement = document.getElementById("typing-text");
  if (!typingElement) return;
  
  currentText = textArray[i];
  typingElement.textContent = currentText.substring(0, j);

  if (!isDeleting && j++ === currentText.length) {
    isDeleting = true; 
    setTimeout(typeEffect, 1500);
    return;
  } else if (isDeleting && j-- === 0) {
    isDeleting = false; 
    i = (i + 1) % textArray.length;
  }

  const speed = isDeleting ? 50 : 100; // Faster typing
  setTimeout(typeEffect, speed);
}

// -----------------------------
// Keyboard shortcuts
// -----------------------------
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    const navLinks = document.getElementById('navLinks');
    const menuBtn = document.getElementById('menuBtn');
    if (navLinks) navLinks.classList.remove('active');
    if (menuBtn) menuBtn.classList.remove('active');
    
    const popup = document.getElementById("certPopup");
    if (popup && popup.style.display === "flex") closeCert();
  } else if (e.key === 'ArrowLeft') {
    goBack();
  } else if (e.key === 'ArrowRight') {
    const order = ['home', 'about', 'skills', 'projects', 'certifications', 'contact'];
    const current = historyStack[historyStack.length - 1] || 'home';
    const idx = order.indexOf(current);
    if (idx >= 0 && idx < order.length - 1) goNext(order[idx + 1]);
    else if (idx === order.length - 1) goNext('home');
  }
});

// -----------------------------
// DOM READY - All Event Listeners
// -----------------------------
document.addEventListener('DOMContentLoaded', function () {
  
  // Nav links
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href').substring(1);
      showSection(targetId, true);
    });
  });

  // Mobile menu
  const menuBtn = document.getElementById('menuBtn');
  if (menuBtn) {
    menuBtn.addEventListener('click', toggleMenu);
  }

  // Close menu on outside click
  document.addEventListener('click', function(e) {
    const navLinks = document.getElementById('navLinks');
    const menuBtn = document.getElementById('menuBtn');
    const navbar = document.querySelector('.navbar');
    
    if (navLinks && navLinks.classList.contains('active')) {
      if (!navbar.contains(e.target)) {
        navLinks.classList.remove('active');
        if (menuBtn) menuBtn.classList.remove('active');
      }
    }
  });

  // Cert popup close on background click
  const certPopup = document.getElementById("certPopup");
  if (certPopup) {
    certPopup.addEventListener("click", function (e) {
      if (e.target === this) closeCert();
    });
  }

  // REMOVED drag/swipe on projects - causes lag on mobile
  
  // Initialize
  createBackground();
  typeEffect();
  initLazyLoad();

  const activeSection = document.querySelector('.content-section.active') || document.getElementById('home');
  historyStack = [activeSection?.id || 'home'];
});
