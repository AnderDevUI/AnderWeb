import { useEffect, useRef, type CSSProperties } from 'react';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
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
  const heroRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const pointerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    document.title = 'Anderson — Desarrollador y Contador';
    const description = document.querySelector('meta[name="description"]');
    if (description) {
      description.setAttribute('content', 'Perfil personal de Anderson: desarrollador y contador.');
    }
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

  return (
    <main className="site-shell mono3d-profile">
      <span className="mono-pointer" ref={pointerRef} aria-hidden="true" />
      <header className="site-header">
        <a className="brand" href="#inicio" aria-label="Anderson, inicio" data-testid="link-home">
          <span className="brand-sigil" aria-hidden="true">A</span><span className="brand-name">Anderson / perfil</span>
        </a>
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
        <div className="hero-index">Anderson / Perfil 001</div>
      </section>
    </main>
  );
}
