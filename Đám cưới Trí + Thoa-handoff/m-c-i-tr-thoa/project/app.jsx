/* global React, ReactDOM, Nav, Hero, Countdown, Couple, Events, Gallery, MapSection, Gift, Rsvp, Footer, AlbumInvite, useTweaks, TweaksPanel, TweakSection, TweakRadio, TweakToggle, PetalsRain */
const { useEffect } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/ {
  theme: "classic",
  showCountdown: true,
  showStamp: true,
  showHyWatermark: false,
  showPetals: true,
  petalDensity: "medium",
}; /*EDITMODE-END*/

function App() {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);

  useEffect(() => {
    document.body.dataset.theme = tweaks.theme;
  }, [tweaks.theme]);

  return (
    <React.Fragment>
      <Nav />
      <Hero />
      {tweaks.showCountdown && <Countdown />}
      <Couple />
      <Events />
      <AlbumInvite />
      <Gallery />
      <MapSection />
      <Gift />
      <Rsvp />
      <Footer />

      {tweaks.showPetals && (
        <PetalsRain
          count={
            tweaks.petalDensity === "light"
              ? 12
              : tweaks.petalDensity === "heavy"
                ? 36
                : 22
          }
        />
      )}
      {tweaks.showHyWatermark && (
        <img
          aria-hidden
          src="assets/hy-stylized.png"
          alt=""
          style={{
            position: "fixed",
            right: "-120px",
            bottom: "-140px",
            width: "600px",
            opacity: 0.06,
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
      )}

      <TweaksPanel title="Tweaks">
        <TweakSection label="Phong cách tổng thể">
          <TweakRadio
            label="Theme"
            value={tweaks.theme}
            onChange={(v) => setTweak("theme", v)}
            options={[
              { value: "classic", label: "Cổ điển" },
              { value: "modern", label: "Hiện đại" },
              { value: "romantic", label: "Lãng mạn" },
            ]}
          />
        </TweakSection>

        <TweakSection label="Hero & decor">
          <TweakToggle
            label="Hiển thị countdown"
            value={tweaks.showCountdown}
            onChange={(v) => setTweak("showCountdown", v)}
          />
          <TweakToggle
            label="Tem tròn trên ảnh"
            value={tweaks.showStamp}
            onChange={(v) => setTweak("showStamp", v)}
          />
          <TweakToggle
            label="Chữ Hỷ watermark"
            value={tweaks.showHyWatermark}
            onChange={(v) => setTweak("showHyWatermark", v)}
          />
        </TweakSection>

        <TweakSection label="Cánh hoa rơi">
          <TweakToggle
            label="Bật hiệu ứng"
            value={tweaks.showPetals}
            onChange={(v) => setTweak("showPetals", v)}
          />
          <TweakRadio
            label="Mật độ"
            value={tweaks.petalDensity}
            onChange={(v) => setTweak("petalDensity", v)}
            options={[
              { value: "light", label: "Ít" },
              { value: "medium", label: "Vừa" },
              { value: "heavy", label: "Nhiều" },
            ]}
          />
        </TweakSection>
      </TweaksPanel>

      {!tweaks.showStamp && (
        <style>{`.hero__stamp { display: none !important; }`}</style>
      )}
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
