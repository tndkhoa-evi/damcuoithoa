(() => {
  "use strict";

  // ---------- nav scrolled state ----------
  const nav = document.getElementById("nav");
  const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 30);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // ---------- reveal on scroll ----------
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      }
    },
    { threshold: 0.15, rootMargin: "0px 0px -10% 0px" },
  );
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

  // ---------- countdown ----------
  const target = new Date("2026-06-28T18:00:00+07:00").getTime();
  const cd = {
    days: document.querySelector('[data-unit="days"]'),
    hours: document.querySelector('[data-unit="hours"]'),
    mins: document.querySelector('[data-unit="mins"]'),
    secs: document.querySelector('[data-unit="secs"]'),
  };
  const pad = (n) => String(n).padStart(2, "0");
  const tick = () => {
    const diff = Math.max(0, target - Date.now());
    cd.days.textContent = pad(Math.floor(diff / 86400000));
    cd.hours.textContent = pad(Math.floor((diff % 86400000) / 3600000));
    cd.mins.textContent = pad(Math.floor((diff % 3600000) / 60000));
    cd.secs.textContent = pad(Math.floor((diff % 60000) / 1000));
  };
  tick();
  setInterval(tick, 1000);

  // ---------- map tabs ----------
  const EVENTS = [
    {
      place: "Tư Gia",
      weekday: "Thứ Bảy",
      day: "20",
      address: "Ấp 3, Xã Mỹ An, Tỉnh Tây Ninh",
      times: [
        ["Đón khách", "10:00"],
        ["Khai tiệc", "11:00"],
      ],
      mapQuery: "Ấp 3, Mỹ An, Tây Ninh",
    },
    {
      place: "KDL Đại Lãnh Beach",
      weekday: "Thứ Tư",
      day: "24",
      address: "Xã Đại Lãnh, Tỉnh Khánh Hòa",
      times: [
        ["Đón khách", "17:30"],
        ["Khai tiệc", "18:30"],
      ],
      mapQuery: "Đại Lãnh Beach, Khánh Hòa",
    },
    {
      place: "Le Jardin",
      weekday: "Chủ Nhật",
      day: "28",
      address:
        "Sảnh Camellia A3 · 195 Quốc Lộ 13, Hiệp Bình Chánh, Thủ Đức, TP. HCM",
      times: [
        ["Đón khách", "18:00"],
        ["Khai tiệc", "19:00"],
      ],
      mapQuery: "Le Jardin 195 Quốc Lộ 13 Hiệp Bình Chánh Thủ Đức",
    },
  ];
  const mapPlace = document.getElementById("map-place");
  const mapWhen = document.getElementById("map-when");
  const mapAddr = document.getElementById("map-address");
  const mapTimes = document.getElementById("map-times");
  const mapCta = document.getElementById("map-cta");
  const mapIframe = document.getElementById("map-iframe");
  const tabBtns = document.querySelectorAll(".map__tab");

  const setMap = (i) => {
    const e = EVENTS[i];
    mapPlace.textContent = e.place;
    mapWhen.textContent = `${e.weekday} · ${e.day} . 06 . 2026`;
    mapAddr.textContent = e.address;
    mapTimes.innerHTML = e.times
      .map(([l, t]) => `<div>${l}: <strong>${t}</strong></div>`)
      .join("");
    const q = encodeURIComponent(e.mapQuery);
    mapCta.href = `https://www.google.com/maps/search/?api=1&query=${q}`;
    mapIframe.src = `https://www.google.com/maps?q=${q}&output=embed`;
    tabBtns.forEach((b) =>
      b.classList.toggle("active", Number(b.dataset.tab) === i),
    );
  };
  tabBtns.forEach((b) =>
    b.addEventListener("click", () => setMap(Number(b.dataset.tab))),
  );
  setMap(2); // default Báo Hỷ

  // ---------- bank copy buttons ----------
  document.querySelectorAll("[data-copy]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const val = btn.dataset.copy;
      try {
        await navigator.clipboard.writeText(val);
      } catch {}
      const original = btn.textContent;
      btn.classList.add("copied");
      btn.textContent = "Đã copy";
      setTimeout(() => {
        btn.classList.remove("copied");
        btn.textContent = original;
      }, 1500);
    });
  });

  // ---------- RSVP form ----------
  const form = document.getElementById("rsvp-form");
  const wrap = document.getElementById("rsvp-wrap");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    try {
      const all = JSON.parse(localStorage.getItem("rsvp") || "[]");
      all.push({ ...data, at: new Date().toISOString() });
      localStorage.setItem("rsvp", JSON.stringify(all));
    } catch {}
    wrap.innerHTML = `<div class="rsvp__sent">Cảm ơn ${escapeHtml(data.name || "bạn")} thật nhiều!<br />Hẹn gặp ngày vui.</div>`;
  });
  function escapeHtml(s) {
    return String(s).replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    );
  }

  // ---------- album CTA → smooth scroll to gallery ----------
  const albumCta = document.getElementById("album-cta");
  albumCta.addEventListener("click", () => {
    const el = document.getElementById("gallery");
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 60;
    window.scrollTo({ top, behavior: "smooth" });
  });

  // ---------- petals rain ----------
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduced) {
    const petals = document.getElementById("petals");
    const rand = (min, max) => min + Math.random() * (max - min);
    const COUNT = 22;
    const svgPetal = (size, opacity) => `
      <svg width="${size}" height="${size}" viewBox="-10 -10 20 20" style="opacity:${opacity};display:block">
        <g fill="currentColor">
          <ellipse cx="0" cy="-6" rx="3" ry="5"/>
          <ellipse cx="0" cy="-6" rx="3" ry="5" transform="rotate(72)"/>
          <ellipse cx="0" cy="-6" rx="3" ry="5" transform="rotate(144)"/>
          <ellipse cx="0" cy="-6" rx="3" ry="5" transform="rotate(216)"/>
          <ellipse cx="0" cy="-6" rx="3" ry="5" transform="rotate(288)"/>
        </g>
        <circle cx="0" cy="0" r="1.3" fill="#FBF6EC" opacity="0.8"/>
      </svg>`;
    const frag = document.createDocumentFragment();
    for (let i = 0; i < COUNT; i++) {
      const left = rand(0, 100);
      const size = rand(10, 22);
      const duration = rand(14, 26);
      const delay = -rand(0, 26);
      const drift = rand(-80, 80);
      const rot = (Math.random() > 0.5 ? 1 : -1) * rand(180, 540);
      const opacity = rand(0.5, 0.95);
      const swayDuration = rand(3, 6);

      const fall = document.createElement("span");
      fall.className = "petal-fall";
      fall.style.cssText = `left:${left}vw;animation-duration:${duration}s;animation-delay:${delay}s;--drift:${drift}px;--rot:${rot}deg`;

      const sway = document.createElement("span");
      sway.className = "petal-sway";
      sway.style.cssText = `animation-duration:${swayDuration}s;animation-delay:${delay / 2}s`;
      sway.innerHTML = svgPetal(size, opacity);

      fall.appendChild(sway);
      frag.appendChild(fall);
    }
    petals.appendChild(frag);
  }
})();
