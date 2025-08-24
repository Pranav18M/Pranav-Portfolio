// Create animated background
function createBackground() {
    const background = document.querySelector('.background-animation');

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

// Navigation functionality
function showSection(targetId) {
    const sections = document.querySelectorAll('.content-section');
    const navLinks = document.querySelectorAll('.nav-link');

    sections.forEach(section => {
        section.classList.remove('active');
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
    });

    document.getElementById(targetId).classList.add('active');
    document.querySelector(`[href="#${targetId}"]`).classList.add('active');

    // Blur effect toggle
    if (targetId !== "home") {
        document.body.classList.add("blur-active");
    } else {
        document.body.classList.remove("blur-active");
    }
}

// Back button functionality
function goBack() {
    showSection("home");
}

// Handle navigation clicks
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        showSection(targetId);

        // Close mobile menu if open
        const navLinks = document.getElementById('navLinks');
        navLinks.classList.remove('active');
    });
});

// Mobile menu toggle
function toggleMenu() {
    const navLinks = document.getElementById('navLinks');
    navLinks.classList.toggle('active');
}

// Handle form submission with Formspree (no redirect)
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

        // Reset button after 3 seconds
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



// Initialize background animation when page loads
document.addEventListener('DOMContentLoaded', function() {
    createBackground();

    // Add entrance animation to active section
    setTimeout(() => {
        const activeSection = document.querySelector('.content-section.active');
        if (activeSection) {
            activeSection.style.opacity = '1';
            activeSection.style.transform = 'translateX(0)';
        }
    }, 100);
});

// Keyboard navigation
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const navLinks = document.getElementById('navLinks');
        navLinks.classList.remove('active');
    }
});

// Close mobile menu when clicking outside
document.addEventListener('click', function(e) {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.getElementById('navLinks');

    if (!navbar.contains(e.target)) {
        navLinks.classList.remove('active');
    }
});

// Open Certification Popup
function openCert(imgSrc) {
    const popup = document.getElementById("certPopup");
    const certImage = document.getElementById("certImage");
    certImage.src = imgSrc;
    popup.style.display = "flex";
}

// Close Certification Popup
function closeCert() {
    document.getElementById("certPopup").style.display = "none";
}

// Close popup when clicking outside image
document.getElementById("certPopup").addEventListener("click", function(e) {
    if (e.target === this) {
        closeCert();
    }
});

