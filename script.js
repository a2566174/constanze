const progress = document.querySelector(".scroll-progress");
const menu = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");
const navLinks = [...document.querySelectorAll(".nav a")];
const sections = [...document.querySelectorAll("[data-section]")];

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

menu.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  menu.classList.toggle("open", isOpen);
  menu.setAttribute("aria-expanded", String(isOpen));
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    menu.classList.remove("open");
    menu.setAttribute("aria-expanded", "false");
  });
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("show");
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach((element, index) => {
  element.style.transitionDelay = `${Math.min(index % 5, 4) * 55}ms`;
  revealObserver.observe(element);
});

function updateScrollState() {
  const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  progress.style.width = `${(window.scrollY / maxScroll) * 100}%`;

  let current = "home";
  sections.forEach((section) => {
    if (window.scrollY >= section.offsetTop - 170) {
      current = section.id;
    }
  });

  navLinks.forEach((link) => {
    const target = link.getAttribute("href").slice(1);
    link.classList.toggle("active", target === current || (target === "about" && current === "home"));
  });
}

window.addEventListener("scroll", updateScrollState, { passive: true });
window.addEventListener("resize", updateScrollState);
updateScrollState();

if (!prefersReducedMotion) {
  window.addEventListener("pointermove", (event) => {
    const mx = (event.clientX / window.innerWidth) * 100;
    const my = (event.clientY / window.innerHeight) * 100;
    document.body.style.setProperty("--mx", `${mx}%`);
    document.body.style.setProperty("--my", `${my}%`);
  }, { passive: true });

  document.querySelectorAll(".magnetic").forEach((element) => {
    element.addEventListener("pointermove", (event) => {
      const rect = element.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      element.style.transform = `translate(${x * 0.1}px, ${y * 0.12}px)`;
    });

    element.addEventListener("pointerleave", () => {
      element.style.transform = "";
    });
  });

  document.querySelectorAll(".tilt-card").forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(900px) rotateX(${-y * 4}deg) rotateY(${x * 5}deg) translateY(-4px)`;
    });

    card.addEventListener("pointerleave", () => {
      card.style.transform = "";
    });
  });
}

const tabs = [...document.querySelectorAll(".course-tab")];
const panels = [...document.querySelectorAll(".course-panel")];

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const course = tab.dataset.course;

    tabs.forEach((item) => {
      const active = item === tab;
      item.classList.toggle("active", active);
      item.setAttribute("aria-selected", String(active));
    });

    panels.forEach((panel) => {
      panel.classList.toggle("active", panel.id === `course-${course}`);
    });
  });
});

const lightbox = document.querySelector(".lightbox");
const lightboxImage = lightbox.querySelector("img");
const lightboxClose = lightbox.querySelector(".lightbox-close");

function closeLightbox() {
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  lightboxImage.src = "";
}

document.querySelectorAll("[data-gallery]").forEach((button) => {
  button.addEventListener("click", () => {
    lightboxImage.src = button.dataset.gallery;
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
  });
});

lightboxClose.addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && lightbox.classList.contains("open")) {
    closeLightbox();
  }
});

const form = document.querySelector(".contact-form");
const status = document.querySelector(".form-status");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!form.checkValidity()) {
    status.textContent = "請先完成必填欄位。";
    form.reportValidity();
    return;
  }

  const button = form.querySelector("button");
  button.textContent = "已送出 Sent";
  status.textContent = "訊息已準備送出，謝謝你的聯繫。";
  form.reset();

  window.setTimeout(() => {
    button.textContent = "送出訊息 Submit";
  }, 1800);
});
