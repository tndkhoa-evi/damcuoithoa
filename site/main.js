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
  const target = new Date("2026-06-24T10:00:00+07:00").getTime();
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
        ["Đón khách", "09:00"],
        ["Khai tiệc", "10:00"],
      ],
      mapQuery: "10.574100,106.352776",
    },
    {
      place: "KDL Đại Lãnh Beach",
      weekday: "Thứ Tư",
      day: "24",
      address: "Xã Đại Lãnh, Tỉnh Khánh Hòa",
      times: [
        ["Đón khách", "10:00"],
        ["Khai tiệc", "11:00"],
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
  // To enable Google Sheets, set RSVP_ENDPOINT to your Apps Script Web App URL.
  const RSVP_ENDPOINT =
    "https://script.google.com/macros/s/AKfycbwVYfPl4onf9N_OLLa3pb12f_MeZv3FyHmLRlipVT05NY_Kim63rVDp12n0_oOxX-s/exec";
  const form = document.getElementById("rsvp-form");
  const wrap = document.getElementById("rsvp-wrap");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    data.at = new Date().toISOString();
    try {
      const all = JSON.parse(localStorage.getItem("rsvp") || "[]");
      all.push(data);
      localStorage.setItem("rsvp", JSON.stringify(all));
    } catch {}
    if (RSVP_ENDPOINT) {
      try {
        await fetch(RSVP_ENDPOINT, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify(data),
        });
      } catch {}
    }
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

  // ---------- album grid + lightbox ----------
  const ALBUM_COUNT = 44;
  const albumGrid = document.getElementById("album-grid");
  const photos = [];
  for (let i = 1; i <= ALBUM_COUNT; i++) {
    const n = String(i).padStart(2, "0");
    photos.push(`images/album/photo-${n}.jpg`);
  }
  const frag2 = document.createDocumentFragment();
  photos.forEach((src, i) => {
    const item = document.createElement("button");
    item.type = "button";
    item.className = "album__item reveal";
    item.dataset.index = String(i);
    item.innerHTML = `<img src="${src}" alt="Ảnh cưới ${i + 1}" loading="lazy" />`;
    frag2.appendChild(item);
  });
  albumGrid.appendChild(frag2);
  document
    .querySelectorAll(".album__item.reveal")
    .forEach((el) => io.observe(el));

  const lb = document.getElementById("lightbox");
  const lbImg = document.getElementById("lightbox-img");
  const lbCounter = document.getElementById("lightbox-counter");
  let lbIndex = 0;
  const openLb = (i) => {
    lbIndex = (i + photos.length) % photos.length;
    lbImg.src = photos[lbIndex];
    lbCounter.textContent = `${lbIndex + 1} / ${photos.length}`;
    lb.classList.add("open");
    lb.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  };
  const closeLb = () => {
    lb.classList.remove("open");
    lb.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  };
  albumGrid.addEventListener("click", (e) => {
    const btn = e.target.closest(".album__item");
    if (!btn) return;
    openLb(Number(btn.dataset.index));
  });
  document.getElementById("lightbox-close").addEventListener("click", closeLb);
  document
    .getElementById("lightbox-prev")
    .addEventListener("click", () => openLb(lbIndex - 1));
  document
    .getElementById("lightbox-next")
    .addEventListener("click", () => openLb(lbIndex + 1));
  lb.addEventListener("click", (e) => {
    if (e.target === lb) closeLb();
  });
  document.addEventListener("keydown", (e) => {
    if (!lb.classList.contains("open")) return;
    if (e.key === "Escape") closeLb();
    if (e.key === "ArrowLeft") openLb(lbIndex - 1);
    if (e.key === "ArrowRight") openLb(lbIndex + 1);
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

  // ---------- hamburger nav ----------
  const burger = document.getElementById("nav-burger");
  const navLinks = document.getElementById("nav-links");
  if (burger && navLinks) {
    const closeNav = () => {
      burger.classList.remove("open");
      navLinks.classList.remove("open");
      burger.setAttribute("aria-expanded", "false");
    };
    burger.addEventListener("click", () => {
      const open = burger.classList.toggle("open");
      navLinks.classList.toggle("open", open);
      burger.setAttribute("aria-expanded", String(open));
    });
    navLinks
      .querySelectorAll("a")
      .forEach((a) => a.addEventListener("click", closeNav));
  }

  // ---------- per-event calendar/direction data ----------
  // Each event: ISO start (Asia/Bangkok = +07:00), title, location, address, mapUrl
  const EVENT_META = [
    {
      title: "Lễ Vu Quy · Trí & Thoa",
      start: "2026-06-20T09:00:00+07:00",
      end: "2026-06-20T13:00:00+07:00",
      location: "Tư Gia · Ấp 3, Mỹ An, Tây Ninh",
      mapUrl:
        "https://www.google.com/maps/search/?api=1&query=10.574100%2C106.352776",
    },
    {
      title: "Lễ Tân Hôn · Trí & Thoa",
      start: "2026-06-24T10:00:00+07:00",
      end: "2026-06-24T14:00:00+07:00",
      location: "KDL Đại Lãnh Beach · Đại Lãnh, Khánh Hòa",
      mapUrl:
        "https://www.google.com/maps/search/?api=1&query=" +
        encodeURIComponent("Đại Lãnh Beach, Khánh Hòa"),
    },
    {
      title: "Lễ Báo Hỷ · Trí & Thoa",
      start: "2026-06-28T18:00:00+07:00",
      end: "2026-06-28T22:00:00+07:00",
      location:
        "Le Jardin · Sảnh Camellia A3, 195 Quốc Lộ 13, Hiệp Bình Chánh, Thủ Đức, TP. HCM",
      mapUrl:
        "https://www.google.com/maps/search/?api=1&query=" +
        encodeURIComponent("Le Jardin 195 Quốc Lộ 13 Hiệp Bình Chánh Thủ Đức"),
    },
  ];

  const toIcsDate = (iso) =>
    new Date(iso)
      .toISOString()
      .replace(/[-:]/g, "")
      .replace(/\.\d{3}/, "");
  const icsEscape = (s) =>
    String(s)
      .replace(/[\\,;]/g, (c) => "\\" + c)
      .replace(/\n/g, "\\n");
  const downloadIcs = (idx) => {
    const m = EVENT_META[idx];
    const uid = `${idx}-${Date.now()}@trithoa-wedding`;
    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Tri Thoa Wedding//VI",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "BEGIN:VEVENT",
      `UID:${uid}`,
      `DTSTAMP:${toIcsDate(new Date().toISOString())}`,
      `DTSTART:${toIcsDate(m.start)}`,
      `DTEND:${toIcsDate(m.end)}`,
      `SUMMARY:${icsEscape(m.title)}`,
      `LOCATION:${icsEscape(m.location)}`,
      `DESCRIPTION:${icsEscape("Đám cưới Phạm Nhật Trí & Trịnh Kim Thoa. " + m.mapUrl)}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");
    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${m.title.replace(/[^\p{L}\d]+/gu, "-")}.ics`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  };

  // Wire event-card action buttons
  document.querySelectorAll("[data-cal-idx]").forEach((btn) => {
    btn.addEventListener("click", () =>
      downloadIcs(Number(btn.dataset.calIdx)),
    );
  });
  document.querySelectorAll("[data-dir-idx]").forEach((a) => {
    a.href = EVENT_META[Number(a.dataset.dirIdx)].mapUrl;
  });

  // ---------- calendar modal (from mobile sticky CTA) ----------
  const calModal = document.getElementById("cal-modal");
  const calList = document.getElementById("cal-list");
  const calOpen = document.getElementById("cal-open");
  const calClose = document.getElementById("cal-close");
  if (calList) {
    EVENT_META.forEach((m, i) => {
      const item = document.createElement("button");
      item.type = "button";
      item.className = "cal-item";
      const d = new Date(m.start);
      const dayStr = `${String(d.getUTCDate() + (d.getUTCHours() < 17 ? 0 : 0)).padStart(2, "0")}.06.2026`;
      item.innerHTML = `
        <span>
          <span class="cal-item__name">${m.title.split(" · ")[0]}</span><br>
          <span class="cal-item__date">${EVENTS[i].day}.06.2026 · ${EVENTS[i].times[1][1]}</span>
        </span>
        <span class="cal-item__icon">📥</span>`;
      item.addEventListener("click", () => downloadIcs(i));
      calList.appendChild(item);
    });
  }
  const openCalModal = () => {
    calModal.classList.add("open");
    calModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  };
  const closeCalModal = () => {
    calModal.classList.remove("open");
    calModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  };
  if (calOpen) calOpen.addEventListener("click", openCalModal);
  if (calClose) calClose.addEventListener("click", closeCalModal);
  if (calModal)
    calModal.addEventListener("click", (e) => {
      if (e.target === calModal) closeCalModal();
    });

  // ---------- map accordion (mobile) ----------
  const acc = document.getElementById("map-accordion");
  if (acc) {
    EVENTS.forEach((e, i) => {
      const item = document.createElement("div");
      item.className = "map__acc-item" + (i === 2 ? " open" : "");
      const q = encodeURIComponent(e.mapQuery);
      const mapUrl = `https://www.google.com/maps/search/?api=1&query=${q}`;
      item.innerHTML = `
        <button class="map__acc-head" type="button">
          <span><strong>${e.place}</strong> · ${e.day}.06.2026</span>
        </button>
        <div class="map__acc-body">
          <iframe class="map__acc-iframe" title="Map ${e.place}" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src=""></iframe>
          <div class="map__acc-addr">${e.address}</div>
          <div class="map__acc-times">${e.times.map(([l, t]) => `<div>${l}: <strong>${t}</strong></div>`).join("")}</div>
          <a class="map__acc-cta" href="${mapUrl}" target="_blank" rel="noopener">🧭 Chỉ đường</a>
        </div>`;
      acc.appendChild(item);
      const iframe = item.querySelector(".map__acc-iframe");
      // lazy-load map iframe only when first opened
      const loadIframe = () => {
        if (!iframe.src)
          iframe.src = `https://www.google.com/maps?q=${q}&output=embed`;
      };
      if (i === 2) loadIframe();
      item.querySelector(".map__acc-head").addEventListener("click", () => {
        const wasOpen = item.classList.contains("open");
        item.classList.toggle("open");
        if (!wasOpen) loadIframe();
      });
    });
  }

  // ---------- mobile sticky CTA show/hide ----------
  const mobileCta = document.getElementById("mobile-cta");
  const rsvpSection = document.getElementById("rsvp");
  if (mobileCta && rsvpSection) {
    const ctaScroll = () => {
      const scrolled = window.scrollY > 400;
      const rsvpTop = rsvpSection.getBoundingClientRect().top;
      const inRsvp = rsvpTop < window.innerHeight - 80;
      mobileCta.classList.toggle("show", scrolled && !inRsvp);
      mobileCta.setAttribute(
        "aria-hidden",
        scrolled && !inRsvp ? "false" : "true",
      );
    };
    window.addEventListener("scroll", ctaScroll, { passive: true });
    ctaScroll();
  }

  // ---------- lightbox swipe gestures ----------
  if (lb) {
    let tx = 0;
    let ty = 0;
    lb.addEventListener(
      "touchstart",
      (e) => {
        const t = e.changedTouches[0];
        tx = t.clientX;
        ty = t.clientY;
      },
      { passive: true },
    );
    lb.addEventListener(
      "touchend",
      (e) => {
        const t = e.changedTouches[0];
        const dx = t.clientX - tx;
        const dy = t.clientY - ty;
        if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
          openLb(lbIndex + (dx < 0 ? 1 : -1));
        }
      },
      { passive: true },
    );
  }
})();
