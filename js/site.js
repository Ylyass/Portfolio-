/* Ylyas portfolio v2 — tiny enhancement layer (no scroll-jacking) */
(() => {
  "use strict";

  // mobile nav
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => nav.classList.toggle("open"));
    nav.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => nav.classList.remove("open"))
    );
  }

  // highlight current page in nav
  const here = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".site-nav a[href]").forEach((a) => {
    const target = a.getAttribute("href").split("#")[0];
    if (target === here) a.classList.add("active");
  });

  // scroll progress bar
  const prog = document.querySelector(".progress");
  if (prog) {
    let ticking = false;
    const update = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      prog.style.transform = `scaleX(${max > 0 ? h.scrollTop / max : 0})`;
      ticking = false;
    };
    addEventListener("scroll", () => {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();
  }

  // AI sidekick robot: eyes follow the cursor
  const bot = document.getElementById("bot");
  if (bot) {
    const eyes = bot.querySelectorAll(".bot__eye");
    addEventListener("pointermove", (e) => {
      const r = bot.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height * 0.38;
      const ang = Math.atan2(e.clientY - cy, e.clientX - cx);
      const dist = Math.min(3.4, Math.hypot(e.clientX - cx, e.clientY - cy) / 70);
      const dx = (Math.cos(ang) * dist).toFixed(2);
      const dy = (Math.sin(ang) * dist).toFixed(2);
      eyes.forEach((el) => el.setAttribute("transform", `translate(${dx} ${dy})`));
    }, { passive: true });

    // typing speech bubble
    const phrases = [
      "Hi! I'm Ylyas's AI sidekick 🤖",
      "He builds secure systems.",
      "Three projects, all shipped ✅",
      "Scroll down for the good stuff!",
      "Open to opportunities ✨",
    ];
    const txt = document.getElementById("botText");
    if (txt) {
      let pi = 0, ci = 0;
      (function type() {
        const p = phrases[pi];
        if (ci <= p.length) {
          txt.textContent = p.slice(0, ci++);
          setTimeout(type, 38);
        } else {
          setTimeout(() => { ci = 0; pi = (pi + 1) % phrases.length; type(); }, 2800);
        }
      })();
    }
  }

  // lightweight reveal-on-scroll
  const faders = document.querySelectorAll(".fade");
  if ("IntersectionObserver" in window && faders.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    faders.forEach((el) => io.observe(el));
  } else {
    faders.forEach((el) => el.classList.add("in"));
  }
})();
