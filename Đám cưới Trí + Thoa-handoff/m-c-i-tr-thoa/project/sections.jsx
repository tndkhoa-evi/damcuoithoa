/* global React */
const { useState, useEffect, useRef, useMemo } = React;

// ============================================================
// REVEAL ON SCROLL HOOK
// ============================================================
function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("in");
          io.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

function Reveal({ as: As = "div", delay = 0, children, ...rest }) {
  const ref = useReveal();
  const cls = ["reveal", delay && `reveal-delay-${delay}`, rest.className]
    .filter(Boolean)
    .join(" ");
  return (
    <As ref={ref} {...rest} className={cls}>
      {children}
    </As>
  );
}

// ============================================================
// LOGO + HỶ images (provided by couple)
// ============================================================
function LogoMark({ size = 32 }) {
  return (
    <img
      src="assets/logo-tt.png"
      alt="T&T monogram"
      style={{ height: size, width: "auto", display: "block" }}
    />
  );
}

function HyMark({ height = 96, opacity = 1, className = "" }) {
  return (
    <img
      src="assets/hy-stylized.png"
      alt="囍 Song hỷ"
      className={`hy-img ${className}`}
      style={{ height, width: "auto", display: "inline-block", opacity }}
    />
  );
}

// ============================================================
// PETALS RAIN — falling plum-blossom petals matching the logo
// ============================================================
function PetalsRain({ count = 22 }) {
  const petals = useMemo(() => {
    const rand = (min, max) => min + Math.random() * (max - min);
    return Array.from({ length: count }, () => ({
      left: rand(0, 100),
      size: rand(10, 22),
      duration: rand(14, 26),
      delay: -rand(0, 26),
      drift: rand(-80, 80),
      rot: (Math.random() > 0.5 ? 1 : -1) * rand(180, 540),
      opacity: rand(0.5, 0.95),
      swayDuration: rand(3, 6),
    }));
  }, [count]);

  return (
    <div className="petals" aria-hidden>
      {petals.map((p, i) => (
        <span
          key={i}
          className="petal-fall"
          style={{
            left: p.left + "vw",
            animationDuration: p.duration + "s",
            animationDelay: p.delay + "s",
            "--drift": p.drift + "px",
            "--rot": p.rot + "deg",
          }}
        >
          <span
            className="petal-sway"
            style={{
              animationDuration: p.swayDuration + "s",
              animationDelay: p.delay / 2 + "s",
            }}
          >
            <svg
              width={p.size}
              height={p.size}
              viewBox="-10 -10 20 20"
              style={{ opacity: p.opacity, display: "block" }}
            >
              <g fill="currentColor">
                <ellipse cx="0" cy="-6" rx="3" ry="5" />
                <ellipse cx="0" cy="-6" rx="3" ry="5" transform="rotate(72)" />
                <ellipse cx="0" cy="-6" rx="3" ry="5" transform="rotate(144)" />
                <ellipse cx="0" cy="-6" rx="3" ry="5" transform="rotate(216)" />
                <ellipse cx="0" cy="-6" rx="3" ry="5" transform="rotate(288)" />
              </g>
              <circle cx="0" cy="0" r="1.3" fill="#FBF6EC" opacity="0.8" />
            </svg>
          </span>
        </span>
      ))}
    </div>
  );
}

// ============================================================
// FLOURISH separator
// ============================================================
function Flourish() {
  return (
    <div className="flourish">
      <span className="line" />
      <span className="dot" />
      <LogoMark size={24} />
      <span className="dot" />
      <span className="line" />
    </div>
  );
}

// ============================================================
// NAV
// ============================================================
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <nav className={`nav ${scrolled ? "scrolled" : ""}`}>
      <a href="#top" className="nav__logo">
        <LogoMark size={32} />
        <span className="nav__brand">Trí &amp; Thoa</span>
      </a>
      <div className="nav__links">
        <a href="#couple">Cô dâu &amp; Chú rể</a>
        <a href="#events">Sự kiện</a>
        <a href="#album-invite">Album</a>
        <a href="#map">Địa điểm</a>
        <a href="#gift">Mừng cưới</a>
        <a href="#rsvp">Xác nhận</a>
      </div>
    </nav>
  );
}

// ============================================================
// HERO / Thiệp mời
// ============================================================
function Hero() {
  return (
    <section className="hero section" id="top">
      <div className="container">
        <div className="hero__inner">
          <div className="hero__copy">
            <Reveal className="hero__hy">
              <HyMark height={140} />
            </Reveal>
            <Reveal delay={1} className="hero__sub">
              Trân trọng kính mời · Save the date
            </Reveal>
            <Reveal delay={2}>
              <div className="hero__names">
                <span className="name">Nhật Trí</span>
                <span className="amp">&amp;</span>
                <span className="name">Kim Thoa</span>
              </div>
            </Reveal>
            <Reveal delay={3}>
              <div className="hero__date">
                <span className="hero__date-label">Báo Hỷ</span>
                <span className="hero__date-value">
                  Chủ Nhật · 28 . 06 . 2026
                </span>
              </div>
              <div className="hero__date" style={{ marginTop: 8 }}>
                <span className="hero__date-label">Tại</span>
                <span className="hero__date-value">Le Jardin · TP. HCM</span>
              </div>
            </Reveal>
          </div>
          <Reveal delay={2} className="hero__visual">
            <div className="hero__photo-frame">
              <image-slot
                id="hero-photo"
                placeholder="Ảnh cưới chính — kéo thả vào đây"
              ></image-slot>
            </div>
            <div className="hero__stamp">
              <div>
                <small>The Wedding</small>
                28.06
                <br />
                2026
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// COUNTDOWN
// ============================================================
function Countdown() {
  const target = new Date("2026-06-28T18:00:00+07:00");
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, target - now);
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  const secs = Math.floor((diff % 60000) / 1000);
  const pad = (n) => String(n).padStart(2, "0");
  return (
    <section className="countdown">
      <div className="container">
        <div className="countdown__inner">
          <div className="countdown__label">Còn lại</div>
          <div className="countdown__grid">
            <div className="countdown__cell">
              <div className="countdown__num">{pad(days)}</div>
              <div className="countdown__unit">Ngày</div>
            </div>
            <div className="countdown__cell">
              <div className="countdown__num">{pad(hours)}</div>
              <div className="countdown__unit">Giờ</div>
            </div>
            <div className="countdown__cell">
              <div className="countdown__num">{pad(mins)}</div>
              <div className="countdown__unit">Phút</div>
            </div>
            <div className="countdown__cell">
              <div className="countdown__num">{pad(secs)}</div>
              <div className="countdown__unit">Giây</div>
            </div>
          </div>
          <div className="countdown__date">
            đến ngày
            <br />
            28 . 06 . 2026
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// COUPLE
// ============================================================
function Couple() {
  return (
    <section className="couple section" id="couple">
      <div className="container">
        <Reveal className="couple__head">
          <div className="couple__hy">
            <HyMark height={64} />
          </div>
          <div className="eyebrow" style={{ marginBottom: 16 }}>
            Hai Họ
          </div>
          <div className="couple__title">Trăm năm hạnh phúc</div>
          <Flourish />
        </Reveal>
        <div className="couple__grid">
          <Reveal className="person" delay={1}>
            <div className="person__photo">
              <image-slot
                id="groom-photo"
                placeholder="Ảnh chú rể"
              ></image-slot>
            </div>
            <div className="person__role">Chú Rể · Trưởng Nam</div>
            <div className="person__name">Phạm Nhật Trí</div>
            <div className="person__parents">
              <span className="label">Nhà Trai</span>
              Ông <strong>Phạm Văn Châu</strong>
              <br />
              Bà <strong>Võ Thị Thế</strong>
              <br />
              Thôn Tây Nam 1, Xã Đại Lãnh
              <br />
              Tỉnh Khánh Hòa
            </div>
          </Reveal>

          <div className="couple__divider">
            <span className="line" />
            <HyMark height={72} />
            <span className="line" />
          </div>

          <Reveal className="person" delay={2}>
            <div className="person__photo">
              <image-slot
                id="bride-photo"
                placeholder="Ảnh cô dâu"
              ></image-slot>
            </div>
            <div className="person__role">Cô Dâu · Trưởng Nữ</div>
            <div className="person__name">Trịnh Kim Thoa</div>
            <div className="person__parents">
              <span className="label">Nhà Gái</span>
              Ông <strong>Trịnh Thanh Phong</strong>
              <br />
              Bà <strong>Đỗ Thị Em</strong>
              <br />
              Ấp 3, Xã Mỹ An
              <br />
              Tỉnh Tây Ninh
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// EVENTS - 3 sự kiện
// ============================================================
const EVENTS = [
  {
    n: "I",
    name: "Lễ Vu Quy",
    sub: "Tiệc Nhà Gái",
    day: "20",
    monthyear: "tháng 06 · 2026",
    weekday: "Thứ Bảy",
    lunar: "Nhằm ngày 06 tháng 05 năm Bính Ngọ",
    times: [
      { label: "Đón khách", t: "10:00" },
      { label: "Khai tiệc", t: "11:00" },
    ],
    place: "Tư Gia",
    address: "Ấp 3, Xã Mỹ An, Tỉnh Tây Ninh",
    mapQuery: "Ấp 3, Mỹ An, Tây Ninh",
  },
  {
    n: "II",
    name: "Lễ Tân Hôn",
    sub: "Tiệc Nhà Trai",
    day: "24",
    monthyear: "tháng 06 · 2026",
    weekday: "Thứ Tư",
    lunar: "Nhằm ngày 10 tháng 05 năm Bính Ngọ",
    times: [
      { label: "Đón khách", t: "17:30" },
      { label: "Khai tiệc", t: "18:30" },
    ],
    place: "KDL Đại Lãnh Beach",
    address: "Xã Đại Lãnh, Tỉnh Khánh Hòa",
    mapQuery: "Đại Lãnh Beach, Khánh Hòa",
  },
  {
    n: "III",
    name: "Lễ Báo Hỷ",
    sub: "Tiệc Chung",
    day: "28",
    monthyear: "tháng 06 · 2026",
    weekday: "Chủ Nhật",
    lunar: "Nhằm ngày 14 tháng 05 năm Bính Ngọ",
    times: [
      { label: "Đón khách", t: "18:00" },
      { label: "Khai tiệc", t: "19:00" },
    ],
    place: "Le Jardin",
    address:
      "Sảnh Camellia A3 · 195 Quốc Lộ 13, Hiệp Bình Chánh, Thủ Đức, TP. HCM",
    mapQuery: "Le Jardin 195 Quốc Lộ 13 Hiệp Bình Chánh Thủ Đức",
  },
];

function Events() {
  return (
    <section className="events section" id="events">
      <div className="container">
        <Reveal className="events__head">
          <div className="eyebrow" style={{ marginBottom: 16 }}>
            Ba Lễ Cưới
          </div>
          <h2 className="display-lg display-italic">Sự kiện</h2>
          <Flourish />
        </Reveal>
        <div className="events__list">
          {EVENTS.map((e, i) => (
            <Reveal key={e.n} className="event-card" delay={i + 1}>
              <div className="event-card__num">— {e.n} —</div>
              <div className="event-card__name">{e.name}</div>
              <div className="event-card__sub">{e.sub}</div>
              <div className="event-card__date">
                <span className="event-card__day">{e.day}</span>
                <span className="event-card__monthyear">
                  {e.monthyear}
                  <br />
                  <em>{e.weekday}</em>
                </span>
              </div>
              <div className="event-card__lunar">{e.lunar}</div>
              <div className="event-card__time">
                {e.times.map((t) => (
                  <div key={t.label}>
                    {t.label}: <strong>{t.t}</strong>
                  </div>
                ))}
              </div>
              <div className="event-card__place">
                <strong>{e.place}</strong>
                {e.address}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// GALLERY
// ============================================================
function Gallery() {
  const slots = ["a", "b", "c", "d", "e", "f", "g"];
  const captions = {
    a: "Ảnh 01 — Pre-wedding",
    b: "Ảnh 02 — Khoảnh khắc",
    c: "Ảnh 03",
    d: "Ảnh 04",
    e: "Ảnh 05",
    f: "Ảnh 06 — Hoàng hôn",
    g: "Ảnh 07 — Chân dung",
  };
  return (
    <section className="gallery section" id="gallery">
      <div className="container">
        <Reveal className="gallery__head">
          <div className="eyebrow" style={{ marginBottom: 16 }}>
            Khoảnh khắc
          </div>
          <h2 className="display-lg display-italic">Hành trình bên nhau</h2>
          <Flourish />
        </Reveal>
        <div className="gallery__grid">
          {slots.map((s, i) => (
            <Reveal
              key={s}
              className={`gallery__item gi-${s}`}
              delay={(i % 4) + 1}
            >
              <image-slot
                id={`gallery-${s}`}
                placeholder={captions[s]}
              ></image-slot>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// MAP
// ============================================================
function MapSection() {
  const [active, setActive] = useState(2); // default to Báo Hỷ
  const cur = EVENTS[active];
  return (
    <section className="map section" id="map">
      <div className="container">
        <Reveal className="map__head">
          <div className="eyebrow" style={{ marginBottom: 16 }}>
            Địa điểm
          </div>
          <h2 className="display-lg display-italic">Hẹn gặp bạn</h2>
          <Flourish />
        </Reveal>
        <div className="map__tabs">
          {EVENTS.map((e, i) => (
            <button
              key={e.n}
              className={`map__tab ${i === active ? "active" : ""}`}
              onClick={() => setActive(i)}
            >
              {e.name}
            </button>
          ))}
        </div>
        <div className="map__panel">
          <div className="map__info">
            <h3>{cur.place}</h3>
            <div className="meta">
              <strong>
                {cur.weekday} · {cur.day} . 06 . 2026
              </strong>
              <br />
              {cur.address}
              <br />
              <br />
              {cur.times.map((t) => (
                <div key={t.label}>
                  {t.label}: <strong>{t.t}</strong>
                </div>
              ))}
            </div>
            <a
              className="map__cta"
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(cur.mapQuery)}`}
              target="_blank"
              rel="noreferrer"
            >
              Mở Google Maps →
            </a>
          </div>
          <div className="map__frame">
            <iframe
              key={cur.mapQuery}
              title={cur.place}
              src={`https://www.google.com/maps?q=${encodeURIComponent(cur.mapQuery)}&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// GIFT (bank info)
// ============================================================
function BankRow({ k, v, copyable }) {
  const [copied, setCopied] = useState(false);
  const onCopy = () => {
    navigator.clipboard?.writeText(v);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div className="bank-row">
      <span className="k">{k}</span>
      <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span className="v">{v}</span>
        {copyable && (
          <button className={copied ? "copied" : ""} onClick={onCopy}>
            {copied ? "Đã copy" : "Copy"}
          </button>
        )}
      </span>
    </div>
  );
}

function Gift() {
  return (
    <section className="gift section" id="gift">
      <div className="container-narrow">
        <Reveal className="gift__head">
          <div className="eyebrow" style={{ marginBottom: 16 }}>
            Mừng cưới
          </div>
          <h2 className="display-lg display-italic">Hộp mừng cưới</h2>
          <Flourish />
          <p className="gift__poem">
            "Nếu Quý khách ở xa không thể đến chung vui,
            <br />
            đôi uyên ương xin trân trọng đón nhận lời chúc phúc
            <br />
            qua món quà nho nhỏ này."
          </p>
        </Reveal>
        <div className="gift__grid" style={{ marginTop: 56 }}>
          <Reveal className="bank-card" delay={1}>
            <div className="bank-card__role">Chú Rể</div>
            <div className="bank-card__name">Phạm Nhật Trí</div>
            <div className="bank-card__rows">
              <BankRow k="Ngân hàng" v="PG Bank" />
              <BankRow k="Số tài khoản" v="19036398356018" copyable />
              <BankRow k="Chủ TK" v="PHAM NHAT TRI" />
            </div>
          </Reveal>
          <Reveal className="bank-card" delay={2}>
            <div className="bank-card__role">Cô Dâu</div>
            <div className="bank-card__name">Trịnh Kim Thoa</div>
            <div className="bank-card__rows">
              <BankRow k="Ngân hàng" v="OCB" />
              <BankRow k="Số tài khoản" v="0961460597" copyable />
              <BankRow k="Chủ TK" v="TRINH KIM THOA" />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// RSVP
// ============================================================
function Rsvp() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    attendance: "yes",
    event: "le-jardin",
    guests: "1",
    wishes: "",
  });
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const submit = (e) => {
    e.preventDefault();
    setSent(true);
    try {
      const all = JSON.parse(localStorage.getItem("rsvp") || "[]");
      all.push({ ...form, at: new Date().toISOString() });
      localStorage.setItem("rsvp", JSON.stringify(all));
    } catch {}
  };
  return (
    <section className="rsvp section" id="rsvp">
      <div className="container">
        <div className="rsvp__inner">
          <Reveal className="rsvp__copy">
            <div className="rsvp__hy">
              <HyMark height={84} />
            </div>
            <span className="eyebrow">R.S.V.P</span>
            <h2 className="display-lg display-italic">Xác nhận tham dự</h2>
            <p>
              Sự hiện diện của bạn là niềm vinh hạnh lớn nhất của chúng tôi. Hãy
              giúp gia đình chuẩn bị chu đáo bằng cách xác nhận trước ngày{" "}
              <strong>15 . 06 . 2026</strong>.
            </p>
          </Reveal>
          <Reveal className="rsvp__form" delay={1}>
            {sent ? (
              <div className="rsvp__sent">
                Cảm ơn {form.name || "bạn"} thật nhiều!
                <br />
                Hẹn gặp ngày vui.
              </div>
            ) : (
              <form onSubmit={submit} className="rsvp__form-grid">
                <div className="rsvp__field full">
                  <label>Họ và tên</label>
                  <input
                    required
                    value={form.name}
                    onChange={set("name")}
                    placeholder="Nguyễn Văn A"
                  />
                </div>
                <div className="rsvp__field">
                  <label>Số điện thoại</label>
                  <input
                    required
                    value={form.phone}
                    onChange={set("phone")}
                    placeholder="0901 234 567"
                  />
                </div>
                <div className="rsvp__field">
                  <label>Số người tham dự</label>
                  <select value={form.guests} onChange={set("guests")}>
                    <option value="1">1 người</option>
                    <option value="2">2 người</option>
                    <option value="3">3 người</option>
                    <option value="4">4 người</option>
                    <option value="5+">5 người trở lên</option>
                  </select>
                </div>
                <div className="rsvp__field">
                  <label>Tham dự buổi nào?</label>
                  <select value={form.event} onChange={set("event")}>
                    <option value="vu-quy">Lễ Vu Quy · Tây Ninh (20.06)</option>
                    <option value="tan-hon">
                      Lễ Tân Hôn · Đại Lãnh (24.06)
                    </option>
                    <option value="le-jardin">
                      Lễ Báo Hỷ · Le Jardin (28.06)
                    </option>
                  </select>
                </div>
                <div className="rsvp__field">
                  <label>Bạn sẽ</label>
                  <select value={form.attendance} onChange={set("attendance")}>
                    <option value="yes">Vui mừng tham dự</option>
                    <option value="no">Tiếc — không thể đến</option>
                  </select>
                </div>
                <div className="rsvp__field full">
                  <label>Lời chúc cho cô dâu chú rể</label>
                  <textarea
                    value={form.wishes}
                    onChange={set("wishes")}
                    placeholder="Chúc trăm năm hạnh phúc..."
                  />
                </div>
                <button type="submit" className="rsvp__submit">
                  Gửi xác nhận
                </button>
              </form>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// FOOTER
// ============================================================
function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__hy">
          <HyMark height={72} />
        </div>
        <div className="footer__names">Phạm Nhật Trí &amp; Trịnh Kim Thoa</div>
        <div className="footer__date">28 . 06 . 2026 · Le Jardin · TP. HCM</div>
        <Flourish />
        <div className="footer__credit">Made with love · 2026</div>
      </div>
    </footer>
  );
}

// ============================================================
// ALBUM INVITE — Lời mời xem album cưới
// ============================================================
function AlbumInvite() {
  const scrollToGallery = () => {
    const el = document.getElementById("gallery");
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 60;
    window.scrollTo({ top, behavior: "smooth" });
  };
  return (
    <section className="album-invite section" id="album-invite">
      <div className="container">
        <div className="album-invite__inner">
          <Reveal className="album-invite__copy">
            <div className="eyebrow">Lời mời</div>
            <h2 className="display-lg display-italic album-invite__title">
              Mời bạn cùng
              <br />
              xem album cưới
            </h2>
            <div className="album-invite__rule" />
            <p className="album-invite__text">
              Mỗi tấm ảnh là một mảnh ghép — kể về hành trình từ ngày đầu hai
              đứa nắm tay, cho đến những lời hẹn ước hôm nay. Hãy cùng chúng tôi
              nhìn lại những khoảnh khắc bình dị nhưng đong đầy yêu thương ấy.
            </p>
            <button className="album-invite__cta" onClick={scrollToGallery}>
              <span>Xem album cưới</span>
              <span className="arrow" aria-hidden>
                →
              </span>
            </button>
          </Reveal>
          <Reveal className="album-invite__visual" delay={1}>
            <div className="album-invite__stack">
              <div className="polaroid polaroid--3">
                <div className="polaroid__photo">
                  <image-slot
                    id="invite-photo-3"
                    placeholder="Ảnh cover 03"
                  ></image-slot>
                </div>
                <div className="polaroid__caption">Ngày ấy · 2024</div>
              </div>
              <div className="polaroid polaroid--2">
                <div className="polaroid__photo">
                  <image-slot
                    id="invite-photo-2"
                    placeholder="Ảnh cover 02"
                  ></image-slot>
                </div>
                <div className="polaroid__caption">Bên nhau · 2025</div>
              </div>
              <div className="polaroid polaroid--1">
                <div className="polaroid__photo">
                  <image-slot
                    id="invite-photo-1"
                    placeholder="Ảnh cover 01"
                  ></image-slot>
                </div>
                <div className="polaroid__caption">Hôm nay · 2026</div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// expose
Object.assign(window, {
  Nav,
  Hero,
  Countdown,
  Couple,
  Events,
  Gallery,
  MapSection,
  Gift,
  Rsvp,
  Footer,
  Reveal,
  LogoMark,
  HyMark,
  PetalsRain,
  AlbumInvite,
});
