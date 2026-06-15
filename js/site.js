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

  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const canHover = matchMedia("(hover: hover)").matches;

  // count-up animation for [data-count] (e.g. "30+" → counts from 0)
  const runCount = (el) => {
    const target = parseFloat(el.getAttribute("data-count"));
    if (isNaN(target)) return;
    const suffix = el.getAttribute("data-suffix") || "";
    if (reduceMotion) { el.textContent = target + suffix; return; }
    const dur = 1100, t0 = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / dur);
      const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  // lightweight reveal-on-scroll (with staggered cascade for batches)
  const faders = document.querySelectorAll(".fade");
  if ("IntersectionObserver" in window && faders.length) {
    const io = new IntersectionObserver(
      (entries) => {
        const shown = entries.filter((e) => e.isIntersecting);
        // cascade items that enter together, in document order
        shown.sort((a, b) =>
          a.target.compareDocumentPosition(b.target) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1
        );
        shown.forEach((e, i) => {
          if (!reduceMotion) e.target.style.setProperty("--d", Math.min(i * 0.07, 0.42) + "s");
          e.target.classList.add("in");
          e.target.querySelectorAll("[data-count]").forEach(runCount);
          io.unobserve(e.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    faders.forEach((el) => io.observe(el));
  } else {
    faders.forEach((el) => {
      el.classList.add("in");
      el.querySelectorAll("[data-count]").forEach(runCount);
    });
  }

  // 3D tilt + cursor-tracked glare on cards
  if (canHover && !reduceMotion) {
    const cards = document.querySelectorAll(
      ".pcard, .pillar, .toolbox-group, .xp-card, .badge-card, .work-row"
    );
    const MAX = 7; // degrees
    cards.forEach((card) => {
      card.classList.add("tilt");
      const glare = document.createElement("span");
      glare.className = "tilt-glare";
      card.appendChild(glare);

      let raf = 0;
      const onMove = (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        if (raf) return;
        raf = requestAnimationFrame(() => {
          raf = 0;
          const ry = (px - 0.5) * 2 * MAX;
          const rx = (0.5 - py) * 2 * MAX;
          card.style.transform =
            `perspective(900px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) translateY(-6px) scale(1.012)`;
          glare.style.setProperty("--gx", (px * 100).toFixed(1) + "%");
          glare.style.setProperty("--gy", (py * 100).toFixed(1) + "%");
        });
      };
      card.addEventListener("pointerenter", () => card.classList.add("is-tilting"));
      card.addEventListener("pointermove", onMove);
      card.addEventListener("pointerleave", () => {
        card.classList.remove("is-tilting");
        card.style.transform = "";
      });
    });

    // magnetic buttons — pull gently toward the cursor
    document.querySelectorAll(".btn, .btn-nav").forEach((btn) => {
      btn.classList.add("magnetic");
      let raf = 0;
      btn.addEventListener("pointermove", (e) => {
        const r = btn.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) * 0.3;
        const dy = (e.clientY - (r.top + r.height / 2)) * 0.4;
        if (raf) return;
        raf = requestAnimationFrame(() => {
          raf = 0;
          btn.style.transform = `translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px)`;
        });
      });
      btn.addEventListener("pointerleave", () => { btn.style.transform = ""; });
    });
  }
})();
