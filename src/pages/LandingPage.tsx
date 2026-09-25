import type { ReactNode } from "react";
import { assets } from "../assets/landing";
import circularStampInnerSvg from "../assets/landing/circular-stamp-inner.svg?raw";
import circularStampOuterSvg from "../assets/landing/circular-stamp-outer.svg?raw";
import { site } from "../content/site";
import { NotebookBackground } from "../components/NotebookBackground";
import { useVisitorClock } from "../hooks/useVisitorClock";
import "./LandingPage.css";

type RotateBoxProps = {
  className: string;
  deg: number;
  children: ReactNode;
};

/** Spin the SVG group, not the 240×240 HTML box (that box paints the white quad). */
function spinCircularStamp(svg: string) {
  return svg
    .replace(/<svg([^>]*)>/, `<svg$1><g class="circular-stamp-spin">`)
    .replace(/<\/svg>\s*$/, "</g></svg>");
}

function RotateBox({ className, deg, children }: RotateBoxProps) {
  return (
    <div className={`rotate-box ${className}`}>
      <div className="rotate-box__inner" style={{ transform: `rotate(${deg}deg)` }}>
        {children}
      </div>
    </div>
  );
}

const navIcons = {
  paperclip: assets.paperclip,
  user: assets.user,
  laptop: assets.laptop,
} as const;

const navCarets = {
  paperclip: assets.caretDown,
  user: assets.caretDownAlt,
  laptop: assets.caretDown,
} as const;

export function LandingPage() {
  const clock = useVisitorClock();

  return (
    <section className="page" aria-label="Landing">
      <div className="landing">
        <NotebookBackground />

        <div className="landing__content">
        <RotateBox className="ticket-art" deg={-3.04}>
          <div className="ticket-art__image">
            <img alt="" src={assets.ticket} />
          </div>
        </RotateBox>

        <RotateBox className="ticket-red" deg={1.31}>
          <img alt="" src={assets.ticketRedTexture} />
        </RotateBox>

        <RotateBox className="ticket-spine" deg={-3.04}>
          <div className="ticket-spine__fill" />
        </RotateBox>

        <div className="stub-top">
          <img alt="" src={assets.stubTop} />
        </div>

        <RotateBox className="intro" deg={-3.04}>
          <p className="intro__text">{site.intro}</p>
        </RotateBox>

        <RotateBox className="letter letter--a1" deg={-3.04}>
          <div className="letter--a1__image">
            <img alt="" src={assets.capitalA} />
          </div>
        </RotateBox>

        <RotateBox className="letter letter--n" deg={-3.04}>
          <div className="letter--n__image">
            <img alt="" src={assets.letterN} />
          </div>
        </RotateBox>

        <RotateBox className="letter letter--g" deg={-3.04}>
          <div className="letter--g__crop">
            <img alt="" src={assets.letterG} />
          </div>
        </RotateBox>

        <RotateBox className="letter letter--g-cover" deg={-3.04}>
          <img alt="" src={assets.gCover} />
        </RotateBox>

        <RotateBox className="letter letter--kit" deg={-3.04}>
          <div className="letter--kit__image">
            <img alt="" src={assets.kit} />
          </div>
        </RotateBox>

        <RotateBox className="letter letter--h" deg={-0.09}>
          <div className="letter--h__image">
            <img alt="" src={assets.capitalH} />
          </div>
        </RotateBox>

        <RotateBox className="letter letter--a2" deg={-3.04}>
          <div className="letter--a2__image">
            <img alt="" src={assets.lowercaseA} />
          </div>
        </RotateBox>

        <RotateBox className="letter letter--dot" deg={-3.04}>
          <img alt="" src={assets.vector1} />
        </RotateBox>

        <RotateBox className="letter letter--a3" deg={-3.04}>
          <div className="letter--a3__image">
            <img alt="" src={assets.capitalA} />
          </div>
        </RotateBox>

        <RotateBox className="letter letter--photo" deg={-3.04}>
          <div className="letter--photo__image">
            <img alt="" src={assets.namePhoto} />
          </div>
        </RotateBox>

        <RotateBox className="letter letter--mark" deg={-3.04}>
          <img alt="" src={assets.vector3} />
        </RotateBox>

        <RotateBox className="bio" deg={-3.04}>
          <p className="bio__text">{site.bio}</p>
        </RotateBox>

        <RotateBox className="bio-lines" deg={-3.04}>
          <img alt="" src={assets.bioLines} />
        </RotateBox>

        <RotateBox className="spine-copy" deg={-93.04}>
          <p className="spine-copy__text">
            {site.welcomeSpine[0]}
            <br />
            {site.welcomeSpine[1]}
          </p>
        </RotateBox>

        <RotateBox className="boarding-pass" deg={-93.04}>
          <p className="boarding-pass__text">{site.boardingPass}</p>
        </RotateBox>

        <RotateBox className="date-stamp" deg={-3.04}>
          <div className="date-stamp__stack">
            <p className="date-stamp__label">{site.dateLabel}</p>
            <div className="date-stamp__box">
              <img alt="" src={assets.dateBox} />
            </div>
            <p className="date-stamp__value">
              <span className="date-stamp__day">{clock.date}</span>
              <span className="date-stamp__time">{clock.time}</span>
            </p>
          </div>
        </RotateBox>

        <RotateBox className="code code--linkedin" deg={-3.04}>
          <a className="code__link" href={site.linkedin.href} rel="noreferrer" target="_blank">
            <span className="code__iata">{site.linkedin.code}</span>
            <span className="code__detail">
              {site.linkedin.lines[0]}
              <br />
              {site.linkedin.lines[1]}
            </span>
          </a>
        </RotateBox>

        <RotateBox className="journey-line" deg={-3.04}>
          <div className="journey-line__rule">
            <img alt="" src={assets.airplaneLine} />
          </div>
        </RotateBox>

        <RotateBox className="code code--email" deg={-3.04}>
          <a className="code__link" href={site.email.href}>
            <span className="code__iata">{site.email.code}</span>
            <span className="code__detail">
              {site.email.lines[0]}
              <br />
              {site.email.lines[1]}
            </span>
          </a>
        </RotateBox>

        <RotateBox className="divider" deg={-3.04}>
          <div className="divider__rule">
            <img alt="" src={assets.divider} />
          </div>
        </RotateBox>

        <RotateBox className="nav" deg={-3.04}>
          <nav className="nav__list" aria-label="Site">
            {site.navigation.map((item) => (
              <a className="nav__item" href={item.href} key={item.id}>
                <img alt="" src={navIcons[item.icon]} />
                <span>{item.label}</span>
                <img alt="" src={navCarets[item.icon]} />
              </a>
            ))}
          </nav>
        </RotateBox>

        <RotateBox className="now-bar" deg={-3.04}>
          <div className="now-bar__card">
            <p className="now-bar__line now-bar__line--role">
              <span className="now-bar__strong">{site.role.title}</span>
              <span className="now-bar__label"> @ </span>
              <span className="now-bar__strong">{site.role.company}</span>
            </p>
            <p className="now-bar__line">
              <span className="now-bar__label">{site.nowPlaying.listeningLabel}</span>
              {" "}
              <span className="now-bar__strong">{site.nowPlaying.track}</span>
              {" "}
              <span className="now-bar__label">by</span>
              {" "}
              <span className="now-bar__strong">{site.nowPlaying.artist}</span>
            </p>
            <p className="now-bar__line">
              <span className="now-bar__label">{site.nowPlaying.watchingLabel}</span>
              {" "}
              <span className="now-bar__strong">{site.nowPlaying.watching}</span>
            </p>
          </div>
        </RotateBox>

        <RotateBox className="qr" deg={-3.04}>
          <div className="qr__image">
            <img alt="" src={assets.qrCode} />
          </div>
        </RotateBox>

        <div className="stamp" aria-hidden="true">
          <img alt="" src={assets.stamp} />
        </div>

        <div className="circular-stamp" aria-hidden="true">
          <div
            className="circular-stamp__layer circular-stamp__layer--outer"
            dangerouslySetInnerHTML={{ __html: spinCircularStamp(circularStampOuterSvg) }}
          />
          <div
            className="circular-stamp__layer circular-stamp__layer--inner"
            dangerouslySetInnerHTML={{ __html: spinCircularStamp(circularStampInnerSvg) }}
          />
        </div>
        </div>
      </div>
    </section>
  );
}
