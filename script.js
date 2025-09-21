// Create animated background
function createBackground() {
  const background = document.querySelector('.background-animation');
  if (!background) return;

  background.innerHTML = ''; // clear previous

  // Bubbles
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

  // Lines
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
// Navigation
// -----------------------------
let historyStack = [];

// Show a section
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

  // Push into history
  if (pushHistory) {
    const last = historyStack[historyStack.length - 1];
    if (last !== targetId) {
      historyStack.push(targetId);
    }
  }
}

// Go back
function goBack() {
  const popup = document.getElementById("certPopup");
  if (popup && window.getComputedStyle(popup).display !== "none") {
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

// Go next
function goNext(targetId) {
  if (!targetId) return;
  showSection(targetId, true);
}

// Nav links click
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', function (e) {
    e.preventDefault();
    const targetId = this.getAttribute('href').substring(1);
    showSection(targetId, true);

    document.getElementById('navLinks')?.classList.remove('active');
  });
});

function toggleMenu() {
  document.getElementById('navLinks')?.classList.toggle('active');
}

// -----------------------------
// Contact Form (Formspree)
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

document.getElementById("certPopup")?.addEventListener("click", function (e) {
  if (e.target === this) {
    closeCert();
  }
});

// -----------------------------
// Init
// -----------------------------
document.addEventListener('DOMContentLoaded', function () {
  createBackground();

  const activeSection = document.querySelector('.content-section.active') || document.getElementById('home');
  const startId = activeSection?.id || 'home';
  historyStack = [startId];

  setTimeout(() => {
    const activeSectionEl = document.querySelector('.content-section.active');
    if (activeSectionEl) {
      activeSectionEl.style.opacity = '1';
      activeSectionEl.style.transform = 'translateX(0)';
    }
  }, 100);
});

// -----------------------------
// Keyboard shortcuts
// -----------------------------
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    document.getElementById('navLinks')?.classList.remove('active');
    const popup = document.getElementById("certPopup");
    if (popup && window.getComputedStyle(popup).display !== "none") {
      closeCert();
    }
  } else if (e.key === 'ArrowLeft') {
    goBack();
  } else if (e.key === 'ArrowRight') {
    const order = ['home', 'about', 'skills', 'projects', 'certifications', 'contact'];
    const current = historyStack[historyStack.length - 1] || 'home';
    const idx = order.indexOf(current);
    if (idx >= 0 && idx < order.length - 1) {
      goNext(order[idx + 1]);
    } else if (idx === order.length - 1) {
      goNext('home');
    }
  }
});

// -----------------------------
// Profile image tilt
// -----------------------------
document.querySelector(".profile-img")?.addEventListener("mousemove", e => {
  const { offsetX, offsetY, target } = e;
  const x = (offsetX / target.offsetWidth) - 0.9;
  const y = (offsetY / target.offsetHeight) - 0.9;
  target.style.transform = `rotateX(${y*10}deg) rotateY(${x*10}deg) scale(1.05)`;
});
document.querySelector(".profile-img")?.addEventListener("mouseleave", e => {
  e.target.style.transform = "rotateX(0) rotateY(0) scale(1)";
});

// -----------------------------
// Lazy load animations
// -----------------------------
document.addEventListener("DOMContentLoaded", () => {
  const lazyElements = document.querySelectorAll(".lazy-load");

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add("show");
        }, index * 150);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  lazyElements.forEach(el => observer.observe(el));
});

// -----------------------------
// Typing effect
// -----------------------------
const textArray = ["Frontend Developer", "Problem Solver", "UI/UX Enthusiast"];
let i = 0, j = 0, currentText = "", isDeleting = false;

function typeEffect() {
  currentText = textArray[i];
  document.getElementById("typing-text").textContent = currentText.substring(0, j);

  if (!isDeleting && j++ === currentText.length) {
    isDeleting = true; 
    setTimeout(typeEffect, 1200);  
    return;
  } else if (isDeleting && j-- === 0) {
    isDeleting = false; 
    i = (i + 1) % textArray.length;
  }

  const speed = isDeleting ? 150 : 180;  
  setTimeout(typeEffect, speed);
}
document.addEventListener("DOMContentLoaded", typeEffect);
