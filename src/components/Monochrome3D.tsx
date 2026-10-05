import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { ArrowDown, ArrowUpRight, Menu, X } from 'lucide-react';
import './_group.css';
import './Monochrome3D.css';

const nameLetters = Array.from('Anderson');
const terminalFigure = [
  '                   .-=====-.',
  '              .:-+*#########*+-:.',
  '          .:=*###################*=:.',
  '       .-*###########################*-.',
  '     :*##########*+=-::--=+*############*:',
  '   :*#########*=:.          .:=*###########:',
  '  +#########*:                  :*##########+',
  ' *########*:      .:-==-.         :*#########*',
  '*########+.      :*####*:           +#########*',
  '#########-       *######*            -##########',
  '#########-       *######*            -##########',
  '*########+.      :*####*:           +#########*',
  ' *########*:      .:-==-.         :*#########*',
  '  +#########*:                  :*##########+',
  '   :*#########*=:.          .:=*###########:',
  '     :*##########*+=-::--=+*############*:',
  '       .-*###########################*-.',
  '          .:=*###################*=:.',
  '              .:-+*#########*+-:.',
  '                   `-=====-`',
];

export function Monochrome3D() {
  const [menuOpen, setMenuOpen] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const pointerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    document.title = 'Anderson — Desarrollador y Contador';
    const description = document.querySelector('meta[name="description"]');
    if (description) {
      description.setAttribute('content', 'Perfil personal de Anderson: desarrollador y contador. Una presentación de una sola página sobre sus dos áreas profesionales.');
    }
  }, []);

  useEffect(() => {
    const updateProgress = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      progressRef.current?.style.setProperty('transform', `scaleX(${scrollable > 0 ? Math.min(window.scrollY / scrollable, 1) : 0})`);
    };
    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);
    return () => {
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
    };
  }, []);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const root = heroRef.current?.closest('.mono3d-profile');
    if (!root) return;
    const targets = Array.from(root.querySelectorAll<HTMLElement>('.profile-reveal, .profile-card, .profile-closing > *'));
    targets.forEach((element, index) => {
      element.classList.add('reveal-ready');
      element.style.setProperty('--reveal-order', String(index % 4));
    });
    if (!('IntersectionObserver' in window)) {
      targets.forEach((element) => element.classList.add('is-visible'));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      }),
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    );
    targets.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const hero = heroRef.current;
    const panel = panelRef.current;
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!hero || !panel || !canHover || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let frame = 0;
    const move = (event: PointerEvent) => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const bounds = hero.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width;
        const y = (event.clientY - bounds.top) / bounds.height;
        hero.style.setProperty('--px', `${x * 100}%`);
        hero.style.setProperty('--py', `${y * 100}%`);
        hero.style.setProperty('--title-x', `${((x - 0.5) * 3).toFixed(2)}px`);
        hero.style.setProperty('--title-y', `${((y - 0.5) * 2).toFixed(2)}px`);
        hero.style.setProperty('--grid-x', `${((x - 0.5) * -5).toFixed(2)}px`);
        hero.style.setProperty('--grid-y', `${((y - 0.5) * -3).toFixed(2)}px`);
        const panelBounds = panel.getBoundingClientRect();
        const panelX = (event.clientX - panelBounds.left) / panelBounds.width;
        const panelY = (event.clientY - panelBounds.top) / panelBounds.height;
        panel.style.setProperty('--panel-rx', `${((0.5 - panelY) * 4).toFixed(2)}deg`);
        panel.style.setProperty('--panel-ry', `${((panelX - 0.5) * 5).toFixed(2)}deg`);
        panel.style.setProperty('--panel-x', `${((panelX - 0.5) * 5).toFixed(2)}px`);
        panel.style.setProperty('--panel-y', `${((panelY - 0.5) * 4).toFixed(2)}px`);
        const pointer = pointerRef.current;
        if (pointer) {
          pointer.style.setProperty('--cursor-x', `${event.clientX}px`);
          pointer.style.setProperty('--cursor-y', `${event.clientY}px`);
          pointer.classList.add('is-visible');
        }
      });
    };
    const reset = () => {
      hero.style.setProperty('--px', '68%');
      hero.style.setProperty('--py', '48%');
      hero.style.setProperty('--title-x', '0px');
      hero.style.setProperty('--title-y', '0px');
      hero.style.setProperty('--grid-x', '0px');
      hero.style.setProperty('--grid-y', '0px');
      panel.style.setProperty('--panel-rx', '0deg');
      panel.style.setProperty('--panel-ry', '0deg');
      panel.style.setProperty('--panel-x', '0px');
      panel.style.setProperty('--panel-y', '0px');
      pointerRef.current?.classList.remove('is-visible');
    };
    hero.addEventListener('pointermove', move);
    hero.addEventListener('pointerleave', reset);
    return () => {
      hero.removeEventListener('pointermove', move);
      hero.removeEventListener('pointerleave', reset);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [menuOpen]);

  return (
    <main className="site-shell mono3d-profile">
      <div className="scroll-progress" ref={progressRef} aria-hidden="true" />
      <span className="mono-pointer" ref={pointerRef} aria-hidden="true" />
      <header className="site-header">
        <a className="brand" href="#inicio" onClick={closeMenu} aria-label="Anderson, inicio" data-testid="link-home">
          <span className="brand-sigil" aria-hidden="true">A</span><span className="brand-name">Anderson / perfil</span>
        </a>
        <button className="menu-toggle" type="button" aria-expanded={menuOpen} aria-controls="site-navigation" onClick={() => setMenuOpen((open) => !open)} data-testid="button-menu">
          {menuOpen ? <X size={13} /> : <Menu size={13} />}<span>{menuOpen ? 'Cerrar' : 'Menú'}</span>
        </button>
        <nav id="site-navigation" className={`header-links${menuOpen ? ' open' : ''}`} aria-label="Navegación principal">
          <a href="#sobre-mi" onClick={closeMenu}>Sobre mí</a><a href="#areas" onClick={closeMenu}>Áreas</a><a href="#enfoque" onClick={closeMenu}>Mi enfoque</a>
          <a className="header-cta" href="#cierre" onClick={closeMenu}>El perfil <ArrowUpRight size={12} /></a>
        </nav>
      </header>
      <section className="hero profile-hero" id="inicio" aria-labelledby="hero-title" ref={heroRef}>
        <div className="hero-code-fragments" aria-hidden="true">
          <span>0x0100 / alloc</span>
          <span>&lt;signal / trace&gt;</span>
          <span>{'{ node: motion }'}</span>
          <span>01 · 10 · 01</span>
        </div>
        <div className="hero-content profile-hero-content">
          <div className="eyebrow profile-eyebrow"><span className="profile-status-dot" aria-hidden="true" />Sistema personal / en línea</div>
          <p className="profile-hello">Una presentación personal de</p>
          <h1 className="hero-title profile-name" id="hero-title" aria-label="Anderson" data-testid="text-profile-name">
            {nameLetters.map((letter, index) => <span className="profile-letter" style={{ '--letter-index': index } as CSSProperties} aria-hidden="true" key={`${letter}-${index}`}>{letter}</span>)}
            <span className="profile-cursor" aria-hidden="true">_</span>
          </h1>
          <p className="profile-role"><span>Desarrollador</span><span className="profile-role-divider" aria-hidden="true">/</span><span>Contador</span></p>
          <p className="hero-copy profile-hero-copy">Dos áreas profesionales, una misma presentación: tecnología y contabilidad en un solo perfil.</p>
          <div className="hero-actions"><a className="button-primary" href="#sobre-mi">Conóceme <ArrowDown size={13} /></a><a className="button-quiet" href="#areas">Mis áreas <ArrowUpRight size={13} /></a></div>
        </div>
        <div className="boot-panel" ref={panelRef} aria-label="Representación abstracta de datos en pantalla">
          <div className="mono-core" aria-hidden="true">
            <div className="mono-core-orbit mono-core-orbit-one"><i /></div>
            <div className="mono-core-orbit mono-core-orbit-two"><i /></div>
            <div className="mono-core-sphere"><i /><i /><i /></div>
            <span className="mono-core-particle mono-core-particle-one" />
            <span className="mono-core-particle mono-core-particle-two" />
            <span className="mono-core-particle mono-core-particle-three" />
          </div>
          <pre className="boot-art" aria-hidden="true">{terminalFigure.map((line, index) => <span key={index}>{line}</span>)}</pre>
          <div className="boot-console" aria-hidden="true"><span><strong>LOAD AI, 0x0100</strong></span><span>PERFIL / 001</span><span className="console-arrow">&gt;&gt;_</span></div>
        </div>
        <div className="scroll-mark">Desliza para conocerme</div><div className="hero-index">Anderson / Perfil 001</div>
      </section>
      <section className="section profile-section profile-about" id="sobre-mi">
        <div className="profile-heading profile-reveal"><div className="ornament" aria-hidden="true"><span>A_</span></div><div className="section-kicker">01 / Quién soy</div><h2 className="section-title">Una persona.<br /><em>Dos disciplinas.</em></h2></div>
        <div className="profile-copy profile-reveal"><p className="profile-lead">Hola, soy Anderson.</p><p>Soy desarrollador y contador. Este espacio reúne mis dos áreas profesionales en una sola presentación personal.</p><p>El desarrollo y la contabilidad forman perspectivas distintas que conviven en mi perfil: construir con tecnología y trabajar con información contable.</p><div className="profile-signature"><span className="profile-signature-line" />Anderson <span>·</span> Desarrollador y Contador</div></div>
      </section>
      <section className="section profile-focus" id="areas">
        <div className="profile-section-heading profile-reveal"><div><div className="section-kicker">02 / Mi perfil profesional</div><h2 className="section-title">Dos campos,<br /><em>una sola página.</em></h2></div><p className="section-intro">Desarrollo y contabilidad, presentados como partes de la misma identidad profesional.</p></div>
        <div className="profile-card-grid"><article className="profile-card" data-testid="card-area-developer"><span className="relic-index">ÁREA 01 — TECNOLOGÍA</span><span className="profile-card-mark" aria-hidden="true">&lt;/&gt;</span><div><h3>Desarrollador</h3><p>Soluciones digitales, lógica y construcción de software.</p></div><span className="profile-card-number" aria-hidden="true">01</span></article><article className="profile-card" data-testid="card-area-accountant"><span className="relic-index">ÁREA 02 — CONTABILIDAD</span><span className="profile-card-mark" aria-hidden="true">∑</span><div><h3>Contador</h3><p>Información financiera, organización y claridad contable.</p></div><span className="profile-card-number" aria-hidden="true">02</span></article></div>
      </section>
      <section className="section profile-bridge" id="enfoque"><div className="profile-bridge-content profile-reveal"><div className="section-kicker">03 / Una mirada integrada</div><h2 className="section-title">Código y números.<br /><em>Una mirada más amplia.</em></h2><p className="section-intro">Mi presentación reúne la perspectiva tecnológica del desarrollo y el enfoque contable en un mismo recorrido, sin separar quién soy profesionalmente.</p><div className="profile-bridge-line" aria-hidden="true"><span>DESARROLLO</span><i /><span>CONTABILIDAD</span></div></div></section>
      <section className="section profile-closing" id="cierre"><div className="section-kicker">Anderson / Perfil personal</div><h2 className="section-title">Desarrollador.<br /><em>Contador.</em></h2><p>Gracias por visitar mi presentación.</p><a className="button-primary" href="#inicio">Volver al inicio <ArrowUpRight size={13} /></a></section>
      <footer className="footer profile-footer"><a className="brand" href="#inicio"><span className="brand-sigil" aria-hidden="true">A</span><span className="brand-name">Anderson</span></a><span>Desarrollador y Contador</span><a href="#inicio">Volver arriba ↑</a></footer>
    </main>
  );
}