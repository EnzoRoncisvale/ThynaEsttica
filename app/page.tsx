"use client";

import React, { useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";

const BeeCanvas = dynamic(() => import("@/components/public/BeeCanvas"), { ssr: false });

export default function HomePage() {
  useEffect(() => {
    // 1. IntersectionObserver para animações de revelação (.reveal / .in)
    const sections = document.querySelectorAll<HTMLElement>("main > section");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
          }
        });
      },
      { threshold: 0.3 }
    );
    sections.forEach((sec) => observer.observe(sec));

    // 2. Parallax dos elementos florais e títulos com [data-speed]
    const parallaxEls = document.querySelectorAll<HTMLElement>("[data-speed]");

    function updateScrollEffects() {
      const h = window.innerHeight;
      const navY = h * 0.06;
      let onDark = false;

      parallaxEls.forEach((el) => {
        const sec = el.closest("section");
        if (!sec) return;
        const rect = sec.getBoundingClientRect();
        const p = -rect.top / h;
        const speed = parseFloat(el.getAttribute("data-speed") || "0");
        const rot = parseFloat(el.getAttribute("data-rot") || "0");
        el.style.transform = `translate3d(0, ${p * speed * h}px, 0) rotate(${p * rot}deg)`;
      });

      sections.forEach((sec) => {
        const rect = sec.getBoundingClientRect();
        if (rect.top <= navY && rect.bottom > navY) {
          if (sec.getAttribute("data-theme") === "dark") {
            onDark = true;
          }
        }
      });

      document.body.classList.toggle("on-dark", onDark);
    }

    window.addEventListener("scroll", updateScrollEffects, { passive: true });
    updateScrollEffects();

    // Adiciona classe de animação de entrada carregada
    const timer = setTimeout(() => {
      document.body.classList.add("loaded");
    }, 400);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
      window.removeEventListener("scroll", updateScrollEffects);
      document.body.classList.remove("on-dark", "loaded");
    };
  }, []);

  return (
    <div className="honey-root">
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap");

        :root {
          --ink: #0d0b1a;
          --muted: #4a4568;
          --lilac: #f7f3ea;
          --num: #ebdcb9;
          --num-dark: rgba(255, 215, 64, 0.45);
          --violet: #d4a017;
          --pad: clamp(18px, 3.2vw, 46px);
        }

        .honey-root {
          font-family: "Poppins", system-ui, sans-serif;
          color: var(--ink);
          background: var(--lilac);
          overflow-x: hidden;
          -webkit-font-smoothing: antialiased;
        }

        /* FIXED NAV */
        .honey-nav {
          position: fixed;
          z-index: 30;
          top: 0;
          left: 0;
          right: 0;
          display: flex;
          align-items: center;
          padding: 18px var(--pad) 0;
          pointer-events: none;
          transition: color 0.5s ease;
        }
        .honey-nav > * {
          pointer-events: auto;
        }
        .honey-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-right: clamp(28px, 5vw, 66px);
          font-weight: 800;
          font-size: 19px;
          letter-spacing: -0.02em;
          text-decoration: none;
          color: inherit;
        }
        .honey-logo-icon {
          width: 38px;
          height: 38px;
          border-radius: 14px;
          background: #111111;
          color: #ffc107;
          display: grid;
          place-items: center;
          font-size: 18px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          transition: transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
        }
        .honey-logo:hover .honey-logo-icon {
          transform: rotate(25deg) scale(1.08);
        }
        .honey-nav__links {
          display: flex;
          gap: clamp(22px, 4.5vw, 54px);
          font-size: 15px;
          font-weight: 500;
        }
        .honey-nav__links a {
          position: relative;
          text-decoration: none;
          color: inherit;
          opacity: 0.85;
          transition: opacity 0.3s;
        }
        .honey-nav__links a:hover {
          opacity: 1;
        }
        .honey-nav__links a::after {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          bottom: -3px;
          height: 2px;
          background: currentColor;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.35s ease;
        }
        .honey-nav__links a:hover::after {
          transform: scaleX(1);
        }
        .honey-nav__cta {
          margin-left: auto;
          font-weight: 700;
          font-size: 14.5px;
          padding: 8px 18px;
          border-radius: 12px;
          background: rgba(17, 17, 17, 0.08);
          border: 1px solid rgba(17, 17, 17, 0.12);
          text-decoration: none;
          color: inherit;
          transition: all 0.3s ease;
        }
        .honey-nav__cta:hover {
          background: #111111;
          color: #ffffff;
        }

        body.on-dark .honey-nav,
        body.on-dark .honey-badge {
          color: #ffffff;
        }
        body.on-dark .honey-nav__cta {
          background: rgba(255, 255, 255, 0.12);
          border-color: rgba(255, 255, 255, 0.25);
        }
        body.on-dark .honey-nav__cta:hover {
          background: #ffffff;
          color: #111111;
        }

        /* SECTIONS COM 100VH EXATO */
        main > section {
          position: relative;
          min-height: 100vh;
          height: 100vh;
          overflow: hidden;
        }
        .flower {
          position: absolute;
          pointer-events: none;
          user-select: none;
          will-change: transform;
        }

        /* HERO SECTION */
        .hero {
          background: #f7f3ea
            url("https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20261016_130303_301c35dd-e2d1-4b40-a396-2b53f884d787.png")
            center/cover no-repeat;
          overflow: visible;
          z-index: 3;
        }
        .hero h1 {
          position: absolute;
          left: 0;
          right: 0;
          top: 15vh;
          text-align: center;
          font-weight: 900;
          font-size: clamp(38px, 6vw, 105px);
          line-height: 1.05;
          letter-spacing: -0.035em;
          color: var(--ink);
          text-shadow: 0 0 40px rgba(255, 255, 255, 0.45);
          will-change: transform;
          z-index: 2;
        }
        .hero h1 .line {
          display: block;
          overflow: hidden;
          padding-bottom: 0.06em;
        }
        .hero h1 .line span {
          display: inline-block;
          transform: translateY(110%);
        }
        body.loaded .hero h1 .line span {
          animation: rise 1.1s cubic-bezier(0.2, 0.8, 0.15, 1) forwards;
        }
        .hero h1 .line:nth-child(2) span {
          animation-delay: 0.12s;
        }
        @keyframes rise {
          to {
            transform: translateY(0);
          }
        }
        .hero__side {
          position: absolute;
          right: clamp(24px, 6.5vw, 120px);
          top: 58vh;
          width: min(300px, 80vw);
          z-index: 2;
          opacity: 0;
        }
        body.loaded .hero__side {
          animation: fade 1s 0.7s ease forwards;
        }
        .hero__side p {
          font-size: clamp(14px, 1.4vw, 19px);
          line-height: 1.4;
          color: var(--muted);
          font-weight: 400;
        }
        @keyframes fade {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: none;
          }
        }
        .join {
          display: inline-flex;
          align-items: center;
          gap: 14px;
          margin-top: 26px;
          font-weight: 700;
          font-size: clamp(14px, 1.35vw, 18px);
          text-decoration: none;
          color: inherit;
          transition: transform 0.3s;
        }
        .join i {
          width: 32px;
          height: 32px;
          border: 1.8px solid currentColor;
          border-radius: 12px;
          display: grid;
          place-items: center;
          transition: transform 0.35s ease, background 0.35s;
        }
        .join i svg {
          width: 10px;
          height: 10px;
        }
        .join:hover i {
          transform: translateX(5px);
          background: rgba(212, 160, 23, 0.2);
        }
        .hero .flower--cosmos {
          width: clamp(420px, 64vw, 1100px);
          left: -14vw;
          bottom: -24vw;
          transform-origin: 60% 40%;
          filter: drop-shadow(0 30px 40px rgba(80, 50, 160, 0.18));
          z-index: 1;
        }

        /* SHARED TYPE & REVEAL */
        .num {
          font-weight: 700;
          line-height: 0.8;
          letter-spacing: -0.06em;
          font-size: clamp(110px, 15vw, 250px);
          color: var(--num);
          user-select: none;
        }
        .title {
          font-weight: 800;
          font-size: clamp(28px, 3.4vw, 54px);
          line-height: 1.12;
          letter-spacing: -0.02em;
        }
        .copy {
          margin-top: 20px;
          font-size: clamp(13.5px, 1.1vw, 16.5px);
          line-height: 1.65;
          color: var(--muted);
          max-width: 440px;
        }
        .reveal {
          opacity: 0;
          transform: translateY(40px);
          transition: opacity 1s ease, transform 1.1s cubic-bezier(0.2, 0.8, 0.15, 1);
        }
        .in .reveal {
          opacity: 1;
          transform: none;
        }
        .in .reveal.d1 {
          transition-delay: 0.1s;
        }
        .in .reveal.d2 {
          transition-delay: 0.22s;
        }
        .in .reveal.d3 {
          transition-delay: 0.34s;
        }

        /* SECTION 01 */
        .s1 {
          background: linear-gradient(180deg, #f7f3ea 0%, #faede0 100%);
          z-index: 2;
        }
        .s1 .flower--hang {
          width: clamp(380px, 46vw, 820px);
          left: -9vw;
          top: -14vw;
          transform-origin: 50% 0%;
        }
        .s1 .num {
          position: absolute;
          left: 6vw;
          top: 48vh;
        }
        .s1 .text {
          position: absolute;
          left: 50vw;
          top: 38vh;
          width: min(530px, 44vw);
        }

        /* SECTION 02 (Dark Theme) */
        .s2 {
          background: #191228
            url("https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20261017_132814_c3d2b090-c27d-49d1-8107-66d0cfa216c2.png")
            center/cover no-repeat;
          color: #ffffff;
          z-index: 3;
        }
        .s2::before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, rgba(20, 10, 40, 0.55) 0%, rgba(20, 10, 40, 0) 60%);
        }
        .s2 .num {
          color: var(--num-dark);
          position: relative;
        }
        .s2 .text {
          position: absolute;
          left: 6vw;
          top: 20vh;
          width: min(520px, 46vw);
          z-index: 2;
        }
        .s2 .title {
          margin-top: 20px;
        }
        .s2 .copy {
          color: rgba(245, 240, 255, 0.85);
        }
        .s2 .flower--iris {
          width: clamp(380px, 46vw, 820px);
          right: -8vw;
          bottom: -20vw;
          transform-origin: 30% 30%;
          filter: drop-shadow(0 40px 60px rgba(10, 0, 30, 0.55));
          z-index: 2;
        }

        /* SECTION 03 */
        .s3 {
          background: linear-gradient(180deg, #faede0 0%, #f7f3ea 100%);
          z-index: 1;
        }
        .s3 .flower--passion {
          width: clamp(360px, 42vw, 760px);
          left: -10vw;
          top: 6vh;
          transform-origin: 40% 50%;
        }
        .s3 .text {
          position: absolute;
          left: 54vw;
          top: 24vh;
          width: min(520px, 42vw);
        }
        .s3 .title {
          margin-top: 20px;
        }

        /* FOOTER SECTION */
        .foot {
          background: #f7f3ea;
          height: 100vh;
          z-index: 1;
        }
        .foot .cta {
          position: absolute;
          left: 50%;
          top: 18vh;
          transform: translateX(-50%);
          text-align: center;
          width: min(650px, 90vw);
        }
        .foot .cta .title {
          font-size: clamp(28px, 3.8vw, 62px);
        }
        .foot .brand {
          position: absolute;
          left: var(--pad);
          bottom: 70px;
        }
        .foot .brand strong {
          display: block;
          font-size: clamp(26px, 2.8vw, 42px);
          font-weight: 800;
          letter-spacing: -0.02em;
        }
        .foot .brand span {
          font-size: 13.5px;
          color: var(--muted);
        }
        .foot .cols {
          position: absolute;
          right: calc(var(--pad) + 90px);
          bottom: 70px;
          display: flex;
          gap: 56px;
          font-size: 14px;
          font-weight: 600;
        }
        .foot .cols a {
          display: block;
          line-height: 2;
          text-decoration: none;
          color: inherit;
          transition: color 0.3s;
        }
        .foot .cols a:hover {
          color: var(--violet);
        }

        /* FIXED BADGE */
        .honey-badge {
          position: fixed;
          z-index: 30;
          right: var(--pad);
          bottom: 22px;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          font-weight: 600;
          color: #2b2550;
          transition: color 0.5s ease;
          pointer-events: none;
        }
        .honey-badge b {
          font-weight: 800;
          color: var(--violet);
        }

        /* MOBILE ADJUSTMENTS */
        @media (max-width: 760px) {
          .honey-nav__links {
            display: none;
          }
          .hero h1 {
            top: 14vh;
          }
          .hero__side {
            top: auto;
            bottom: 14vh;
            right: 18px;
            width: 76vw;
          }
          .hero .flower--cosmos {
            width: 110vw;
            left: -38vw;
            bottom: -55vw;
          }
          .s1 .num {
            top: 16vh;
            left: auto;
            right: 6vw;
          }
          .s1 .text,
          .s3 .text {
            left: 18px;
            right: 18px;
            width: auto;
            top: auto;
            bottom: 10vh;
          }
          .s2 .text {
            left: 18px;
            right: 18px;
            width: auto;
            top: 14vh;
          }
          .s3 .flower--passion {
            width: 90vw;
          }
          .foot .cols {
            right: 18px;
            bottom: 150px;
            gap: 28px;
          }
          .foot .brand {
            bottom: 150px;
          }
        }
      `}</style>

      {/* FIXED NAV */}
      <nav className="honey-nav">
        <Link href="/" className="honey-logo" aria-label="Thyná Estética Início">
          <div className="honey-logo-icon">🐝</div>
          <span>Thyná Estética</span>
        </Link>
        <div className="honey-nav__links">
          <Link href="/estetica">Beleza & Estética ✨</Link>
          <Link href="/saude">Saúde Integrativa 🌿</Link>
          <a href="#sobre">O Espaço</a>
          <a href="#contato">Agendamento</a>
        </div>
      </nav>

      {/* 3D BEE CANVAS (Three.js) */}
      <BeeCanvas />

      <main>
        {/* HERO SECTION */}
        <section className="hero" id="top" data-theme="light">
          <h1 data-speed="0.55">
            <span className="line">
              <span>Realce sua beleza natural</span>
            </span>
            <span className="line">
              <span>com harmonia e ciência</span>
            </span>
          </h1>
          <img
            className="flower flower--cosmos"
            data-speed="-0.25"
            data-rot="8"
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20261017_132919_c994332b-7f9d-43b5-933d-1e94faa91dd4.png"
            alt="Floral Thyná"
          />
          <div className="hero__side">
            <p>
              Estética avançada e saúde integrativa com a profissional Thyná. Atendimento exclusivo e
              personalizado.
            </p>
            <a className="join" href="#estetica">
              <i>
                <svg viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth={1.6}>
                  <path d="M3 1l4 4-4 4" />
                </svg>
              </i>
              Conhecer o Espaço
            </a>
          </div>
        </section>

        {/* SECTION 01: BELEZA & ESTÉTICA AVANÇADA */}
        <section className="s1" id="estetica" data-theme="light">
          <img
            className="flower flower--hang"
            data-speed="0.35"
            data-rot="-6"
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20261017_132924_764b726d-d37a-44cc-8eba-662d823d9a4c.png"
            alt="Floral Elegance"
          />
          <div className="num reveal">01</div>
          <div className="text">
            <h2 className="title reveal d1">
              Beleza Facial &<br />
              Protocolos Glow
            </h2>
            <p className="copy reveal d2">
              Revitalização profunda com vapor de ozônio, extração a vácuo, Peeling de Diamante e
              Nanotecnologia Hialurônica para devolver viço e firmeza natural ao seu rosto.
            </p>
            <Link className="join reveal d3" href="/estetica">
              <i>
                <svg viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth={1.6}>
                  <path d="M3 1l4 4-4 4" />
                </svg>
              </i>
              Ver Protocolos Estéticos
            </Link>
          </div>
        </section>

        {/* SECTION 02: SAÚDE & BEM-ESTAR (DARK) */}
        <section className="s2" id="saude" data-theme="dark">
          <div className="text">
            <div className="num reveal">02</div>
            <h2 className="title reveal d1">
              Saúde &<br />
              Vitalidade Integrada
            </h2>
            <p className="copy reveal d2">
              Nutrição funcional com Bioimpedância Tetrapolar, alívio clínico de dores na coluna com
              fisioterapia e suporte humanizado para o seu equilíbrio físico e mental.
            </p>
            <Link className="join reveal d3" href="/saude">
              <i>
                <svg viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth={1.6}>
                  <path d="M3 1l4 4-4 4" />
                </svg>
              </i>
              Ver Consultas de Saúde
            </Link>
          </div>
          <img
            className="flower flower--iris"
            data-speed="-0.3"
            data-rot="10"
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20261017_132926_a7892ae5-8052-4e4b-96a8-ccbdcaaaa5ad.png"
            alt="Floral Noturno"
          />
        </section>

        {/* SECTION 03: O ESPAÇO E A FILOSOFIA */}
        <section className="s3" id="sobre" data-theme="light">
          <img
            className="flower flower--passion"
            data-speed="-0.2"
            data-rot="-10"
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20261017_132921_d71538ea-5066-4372-963a-2f2d6468374f.png"
            alt="Floral Thyná"
          />
          <div className="text">
            <div className="num reveal">03</div>
            <h2 className="title reveal d1">
              Cuidado Único &<br />
              Hora Marcada
            </h2>
            <p className="copy reveal d2">
              Sem salas cheias, sem filas e sem atendimento apressado. Cada momento no Espaço Thyná é
              uma pausa regeneradora no seu dia, com dedicação 100% individualizada e insumos de alta
              pureza.
            </p>
            <a className="join reveal d3" href="#contato">
              <i>
                <svg viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth={1.6}>
                  <path d="M3 1l4 4-4 4" />
                </svg>
              </i>
              Garantir Meu Horário
            </a>
          </div>
        </section>

        {/* FOOTER SECTION: GRAND FINALE */}
        <section className="foot" id="contato" data-theme="light">
          <div className="cta">
            <h2 className="title reveal">Pronta para florescer?</h2>
            <div
              className="reveal d1"
              style={{
                display: "flex",
                gap: "20px",
                justifyContent: "center",
                flexWrap: "wrap",
                marginTop: "28px",
              }}
            >
              <Link className="join" href="/estetica">
                <i>
                  <svg viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth={1.6}>
                    <path d="M3 1l4 4-4 4" />
                  </svg>
                </i>
                Agendar Estética ✨
              </Link>
              <Link className="join" href="/saude">
                <i>
                  <svg viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth={1.6}>
                    <path d="M3 1l4 4-4 4" />
                  </svg>
                </i>
                Agendar Saúde 🌿
              </Link>
            </div>
          </div>

          <div className="brand reveal">
            <strong>Thyná Estética</strong>
            <span>Saúde & Beleza Integrada • Atendimento com hora marcada</span>
          </div>

          <div className="cols reveal d1">
            <div>
              <Link href="/estetica">Protocolos Estéticos</Link>
              <Link href="/saude">Consultas de Saúde</Link>
            </div>
            <div>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                Instagram
              </a>
              <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_COMPANY_WHATSAPP || "5561999999999"}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp Direto
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* FIXED BADGE */}
      <div className="honey-badge">
        <svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20">
          <circle cx="6" cy="6" r="4.2" />
          <circle cx="14" cy="6" r="4.2" opacity="0.75" />
          <circle cx="6" cy="14" r="4.2" opacity="0.75" />
          <circle cx="14" cy="14" r="4.2" />
        </svg>
        Espaço <b>Thyná</b>
      </div>
    </div>
  );
}
