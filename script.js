// Create animated background
function createBackground() {
  const background = document.querySelector('.background-animation');
  if (!background) return;

  // Clear previous elements (prevents duplicates if function re-runs)
  background.innerHTML = '';

  // Create bubbles
  for (let i = 0; i < 15; i++) {
    const bubble = document.createElement('div');
    bubble.classList.add('bubble');
    bubble.style.width = Math.random() * 60 + 20 + 'px';
    bubble.style.height = bubble.style.width;
    bubble.style.left = Math.random() * 100 + '%';
    bubble.style.top = Math.random() * 100 + '%';
    bubble.style.animationDelay = Math.random() * 8 + 's';
    bubble.style.animationDuration = (Math.random() * 3 + 5) + 's';
    background.appendChild(bubble);
  }

  // Create lines
  for (let i = 0; i < 10; i++) {
    const line = document.createElement('div');
    line.classList.add('line');
    line.style.height = Math.random() * 100 + 50 + 'px';
    line.style.top = Math.random() * 100 + '%';
    line.style.animationDelay = Math.random() * 10 + 's';
    line.style.animationDuration = (Math.random() * 5 + 8) + 's';
    background.appendChild(line);
  }
}

// -----------------------------
// Navigation history handling
// -----------------------------
let historyStack = [];

/**
 * Show a section by id.
 * @param {string} targetId - id of section to show
 * @param {boolean} pushHistory - whether to push this navigation into history (default true)
 */
function showSection(targetId, pushHistory = true) {
  if (!targetId) return;
  const targetEl = document.getElementById(targetId);
  if (!targetEl) return;

  const sections = document.querySelectorAll('.content-section');
  const navLinks = document.querySelectorAll('.nav-link');

  sections.forEach(section => section.classList.remove('active'));
  navLinks.forEach(link => link.classList.remove('active'));

  targetEl.classList.add('active');
  const activeLink = document.querySelector(`[href="#${targetId}"]`);
  if (activeLink) activeLink.classList.add('active');

  // Blur effect toggle
  if (targetId !== "home") {
    document.body.classList.add("blur-active");
  } else {
    document.body.classList.remove("blur-active");
  }

  // Push into history only if allowed and not a duplicate
  if (pushHistory) {
    const last = historyStack[historyStack.length - 1];
    if (last !== targetId) {
      historyStack.push(targetId);
    }
  }
}

/**
 * Go to previous view:
 * 1) if cert popup open -> close it
 * 2) else if history has previous -> go to it
 * 3) else fallback to home
 */
function goBack() {
  const popup = document.getElementById("certPopup");

  // If popup is open, close it first (don't change section history)
  if (popup && window.getComputedStyle(popup).display !== "none") {
    closeCert();
    return;
  }

  // If there is a previous entry in history, go back
  if (historyStack.length > 1) {
    // remove current
    historyStack.pop();
    // peek previous
    const prev = historyStack[historyStack.length - 1] || "home";
    // show previous WITHOUT pushing it again into history
    showSection(prev, false);
  } else {
    // fallback to home (reset history to only home)
    historyStack = ["home"];
    showSection("home", false);
  }
}

/**
 * Next button navigation (also pushes into history)
 * @param {string} targetId
 */
function goNext(targetId) {
  if (!targetId) return;
  showSection(targetId, true);
}

// -----------------------------
// Nav link handlers & mobile menu
// -----------------------------
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', function (e) {
    e.preventDefault();
    const targetId = this.getAttribute('href').substring(1);
    showSection(targetId, true);

    // Close mobile menu if open
    const navLinks = document.getElementById('navLinks');
    if (navLinks) navLinks.classList.remove('active');
  });
});

function toggleMenu() {
  const navLinks = document.getElementById('navLinks');
  if (navLinks) navLinks.classList.toggle('active');
}

// -----------------------------
// Contact form (Formspree)
// -----------------------------
function handleSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const button = form.querySelector('button');
  if (!button) return;
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
      button.style.background = "linear-gradient(135deg, #4CAF50, #45a049)";
      form.reset();
    } else {
      button.textContent = "Error! Try Again";
      button.style.background = "linear-gradient(135deg, #e63946, #d62828)";
    }
    setTimeout(() => {
      button.textContent = originalText;
      button.style.background = "linear-gradient(135deg, #667eea, #764ba2)";
      button.disabled = false;
    }, 3000);
  }).catch(() => {
    button.textContent = "Error! Try Again";
    button.style.background = "linear-gradient(135deg, #e63946, #d62828)";
    setTimeout(() => {
      button.textContent = originalText;
      button.style.background = "linear-gradient(135deg, #667eea, #764ba2)";
      button.disabled = false;
    }, 3000);
  });
}

// -----------------------------
// Certification popup
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

// close popup when clicking outside image area
document.getElementById("certPopup")?.addEventListener("click", function (e) {
  if (e.target === this) {
    closeCert();
  }
});

// -----------------------------
// Misc: init, keyboard, outside click
// -----------------------------
document.addEventListener('DOMContentLoaded', function () {
  createBackground();

  // Initialize history with the currently active section (if any)
  const activeSection = document.querySelector('.content-section.active') || document.getElementById('home');
  const startId = activeSection?.id || 'home';
  historyStack = [startId];

  // Ensure entrance animation is applied
  setTimeout(() => {
    const activeSectionEl = document.querySelector('.content-section.active');
    if (activeSectionEl) {
      activeSectionEl.style.opacity = '1';
      activeSectionEl.style.transform = 'translateX(0)';
    }
  }, 100);
});

// Keyboard shortcuts (Escape closes mobile/certs; Left = back, Right = next)
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    // close mobile menu and cert popup (if open)
    document.getElementById('navLinks')?.classList.remove('active');
    const popup = document.getElementById("certPopup");
    if (popup && window.getComputedStyle(popup).display !== "none") {
      closeCert();
    }
  } else if (e.key === 'ArrowLeft') {
    goBack();
  } else if (e.key === 'ArrowRight') {
    // attempt to move to next based on known order
    const order = ['home', 'about', 'projects', 'certifications', 'contact'];
    const current = historyStack[historyStack.length - 1] || 'home';
    const idx = order.indexOf(current);
    if (idx >= 0 && idx < order.length - 1) {
      goNext(order[idx + 1]);
    } else if (idx === order.length - 1) {
      goNext('home');
    }
  }
});

// close mobile menu when clicking outside
document.addEventListener('click', function (e) {
  const navbar = document.querySelector('.navbar');
  const navLinks = document.getElementById('navLinks');
  if (!navbar?.contains(e.target)) {
    navLinks?.classList.remove('active');
  }
});

const textArray = ["Frontend Developer", "Problem Solver", "UI/UX Enthusiast"];
let i = 0, j = 0, currentText = "", isDeleting = false;

function typeEffect() {
  currentText = textArray[i];
  document.getElementById("typing-text").textContent = 
    currentText.substring(0, j);

  if (!isDeleting && j++ === currentText.length) { 
    // finished typing → pause before deleting
    isDeleting = true; 
    setTimeout(typeEffect, 1200);  
    return;
  } else if (isDeleting && j-- === 0) {
    // finished deleting → move to next word
    isDeleting = false; 
    i = (i + 1) % textArray.length;
  }

  // adjust typing speed (slower = higher number)
  const speed = isDeleting ? 150 : 180;  
  setTimeout(typeEffect, speed);
}

document.addEventListener("DOMContentLoaded", typeEffect);

document.querySelector(".profile-img").addEventListener("mousemove", e => {
  const { offsetX, offsetY, target } = e;
  const x = (offsetX / target.offsetWidth) - 0.9;
  const y = (offsetY / target.offsetHeight) - 0.9;
  target.style.transform = `rotateX(${y*10}deg) rotateY(${x*10}deg) scale(1.05)`;
});
document.querySelector(".profile-img").addEventListener("mouseleave", e => {
  e.target.style.transform = "rotateX(0) rotateY(0) scale(1)";
});
