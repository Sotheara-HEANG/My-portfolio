/* ===== Theme Toggle ===== */
const themeToggle = document.getElementById("theme-toggle");
const savedTheme = localStorage.getItem("theme") || "dark";
document.documentElement.setAttribute("data-theme", savedTheme);
themeToggle.setAttribute("aria-pressed", savedTheme === "light");

themeToggle.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    themeToggle.setAttribute("aria-pressed", next === "light");
    localStorage.setItem("theme", next);
});

/* ===== Typing Effect ===== */
const titles = ["Senior Data Science Student", "Applied Math Builder", "Computer Vision Learner", "Distributed Systems Explorer"];
let titleIdx = 0, charIdx = 0, deleting = false;
const typedEl = document.getElementById("typed-text");

function typeEffect() {
    const current = titles[titleIdx];
    typedEl.textContent = current.substring(0, charIdx);
    if (!deleting) {
        charIdx++;
        if (charIdx > current.length) { setTimeout(() => { deleting = true; typeEffect(); }, 2000); return; }
    } else {
        charIdx--;
        if (charIdx < 0) { deleting = false; titleIdx = (titleIdx + 1) % titles.length; charIdx = 0; }
    }
    setTimeout(typeEffect, deleting ? 40 : 80);
}
typeEffect();

/* ===== Scroll Animations ===== */
const observer = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
        if (e.isIntersecting) {
            setTimeout(() => e.target.classList.add("visible"), i * 100);
            observer.unobserve(e.target);
        }
    });
}, { threshold: 0.1 });
document.querySelectorAll(".animate-on-scroll").forEach(el => observer.observe(el));

/* ===== Navbar Scroll Effect ===== */
const header = document.getElementById("main-header");
window.addEventListener("scroll", () => {
    header.classList.toggle("scrolled", window.scrollY > 50);
});

/* ===== Active Nav Link ===== */
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".nav-link");
window.addEventListener("scroll", () => {
    let current = "";
    sections.forEach(s => { if (window.scrollY >= s.offsetTop - 200) current = s.id; });
    navLinks.forEach(l => {
        l.classList.toggle("active", l.getAttribute("href") === "#" + current);
    });
});

/* ===== Mobile Menu ===== */
const toggle = document.getElementById("nav-toggle");
const menu = document.getElementById("nav-menu");

function setMenu(open) {
    menu.classList.toggle("open", open);
    toggle.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", open);
}

toggle.addEventListener("click", () => setMenu(!menu.classList.contains("open")));
menu.querySelectorAll(".nav-link").forEach(l => l.addEventListener("click", () => setMenu(false)));
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setMenu(false);
});

/* ===== Counter Animation ===== */
const counters = document.querySelectorAll(".stat-number");
const counterObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            const target = +e.target.dataset.target;
            let count = 0;
            const step = Math.ceil(target / 40);
            const timer = setInterval(() => {
                count += step;
                if (count >= target) { count = target; clearInterval(timer); }
                e.target.textContent = count + "+";
            }, 40);
            counterObs.unobserve(e.target);
        }
    });
}, { threshold: 0.5 });
counters.forEach(c => counterObs.observe(c));

/* ===== Contact Form ===== */
document.getElementById("contact-form").addEventListener("submit", function (e) {
    e.preventDefault();
    const btn = document.getElementById("form-submit");
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();
    const subject = encodeURIComponent(`Portfolio contact from ${name}`);
    const body = encodeURIComponent(`${message}\n\nFrom: ${name}\nEmail: ${email}`);

    window.location.href = `mailto:sotheara.heang204@gmail.com?subject=${subject}&body=${body}`;
    btn.innerHTML = '<span>Email Draft Opened</span><i class="fa-solid fa-envelope-open-text"></i>';
    btn.style.background = "rgba(45, 212, 191, 0.2)";
    btn.style.color = "#2dd4bf";
    setTimeout(() => {
        btn.innerHTML = '<span>Send Message</span><i class="fa-solid fa-paper-plane"></i>';
        btn.style.background = ""; btn.style.color = "";
    }, 3000);
});

/* ===== Particle Canvas ===== */
const canvas = document.getElementById("particle-canvas");
const ctx = canvas.getContext("2d");
let particles = [];
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function resizeCanvas() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

for (let i = 0; i < 60 && !reduceMotion; i++) {
    particles.push({
        x: Math.random() * canvas.width, y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 1.5 + 0.5, alpha: Math.random() * 0.3 + 0.1
    });
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width; if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(45, 212, 191, ${p.alpha})`; ctx.fill();
    });
    // Draw connections
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 150) {
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.strokeStyle = `rgba(45, 212, 191, ${0.06 * (1 - dist / 150)})`;
                ctx.lineWidth = 0.5; ctx.stroke();
            }
        }
    }
    requestAnimationFrame(animateParticles);
}
if (!reduceMotion) animateParticles();
