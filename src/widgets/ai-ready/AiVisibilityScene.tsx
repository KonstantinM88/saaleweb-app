"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties } from "react";
import { ArrowDownRight, ArrowRight, Check, FileText, Globe2, Layers3, Pause, Play, Search, Sparkles } from "lucide-react";
import { AiPlatformMark, type AiPlatform } from "./AiPlatformMark";

export type AiVisibilityCopy = {
  label: string; example: string; networkLabel: string; website: string;
  source: string; documents: string[]; queryLabel: string; query: string;
  factsLabel: string; facts: { label: string; value: string }[];
  stages: { label: string; title: string; text: string; takeaway: string }[];
  sources: string; sourceNote: string; play: string; pause: string; reduced: string;
};

const platforms: { id: AiPlatform; name: string }[] = [
  { id: "chatgpt", name: "ChatGPT" }, { id: "gemini", name: "Gemini" },
  { id: "claude", name: "Claude" }, { id: "perplexity", name: "Perplexity" },
  { id: "copilot", name: "Copilot" }, { id: "google", name: "Google AI" },
];
const desktopPaths = [
  "M300 235C230 235 185 160 96 85", "M300 235C380 235 405 160 504 85",
  "M300 235C210 235 150 255 54 254", "M300 235C390 235 450 255 546 254",
  "M300 235C260 335 210 365 162 418", "M300 235C340 335 400 365 438 418",
];
const mobilePaths = [
  "M180 115C180 215 60 215 60 294", "M180 115V294", "M180 115C180 215 300 215 300 294",
  "M180 115C95 115 25 210 60 396", "M180 115C235 185 235 330 180 396", "M180 115C265 115 335 210 300 396",
];

function subscribeMotion(onChange: () => void) {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}
const motionSnapshot = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const serverMotionSnapshot = () => true;

/** A conceptual content pathway, never a live search, endorsement, or citation feed. */
export function AiVisibilityScene({ copy }: { copy: AiVisibilityCopy }) {
  const [stage, setStage] = useState(1);
  const [playing, setPlaying] = useState(false);
  const [run, setRun] = useState(0);
  const reduced = useSyncExternalStore(subscribeMotion, motionSnapshot, serverMotionSnapshot);
  const root = useRef<HTMLDivElement>(null);
  const seen = useRef(false);

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) setPlaying(false);
      else if (!seen.current && !reduced && !document.hidden) {
        seen.current = true;
        setPlaying(true);
      }
    }, { threshold: 0.15 });
    observer.observe(element);
    const hide = () => { if (document.hidden) setPlaying(false); };
    document.addEventListener("visibilitychange", hide);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", hide); };
  }, [reduced]);

  useEffect(() => {
    if (!playing) return;
    const timeout = window.setTimeout(() => setPlaying(false), 4600);
    return () => window.clearTimeout(timeout);
  }, [playing, run]);

  function activate(index: number) {
    setStage(index);
    setRun(value => value + 1);
    setPlaying(!reduced);
  }

  return <div ref={root} className="av-experience" data-ai-visibility data-stage={stage} data-playing={playing && !reduced} data-reduced-motion={reduced}>
    <div className="av-toolbar">
      <span className="av-studio-label"><Sparkles size={15} aria-hidden />{copy.label}</span>
      <span className="av-example">{copy.example}</span>
    </div>
    <div role="group" aria-label={copy.label} className="av-stages">
      {copy.stages.map((item, index) => <button key={item.label} type="button" aria-pressed={stage === index} aria-controls={`av-panel-${index}`} onClick={() => activate(index)} className="av-stage">
        <span className="av-stage-number">0{index + 1}</span><span>{item.label}</span><ArrowRight size={15} aria-hidden />
      </button>)}
    </div>
    <div className="av-workspace">
      <figure className="av-network" aria-label={copy.networkLabel}>
        <div className="av-network-field" key={run}>
          <div className="av-field-grid" aria-hidden />
          <div className="av-halo av-halo-back" aria-hidden /><div className="av-halo av-halo-front" aria-hidden />
          <Connections paths={desktopPaths} mobile={false} />
          <Connections paths={mobilePaths} mobile />
          <div className="av-source-stack">
            <div className="av-source-plane av-source-plane-back" aria-hidden /><div className="av-source-plane av-source-plane-mid" aria-hidden />
            <div className="av-source-document">
              <div className="av-document-address"><Globe2 size={11} aria-hidden /><span>unternehmen.example</span><span className="av-address-dot" /></div>
              <span className="av-document-kicker">{copy.source}</span>
              <div className="av-document-name"><span className="av-document-symbol" aria-hidden><Layers3 size={20} /></span><strong>{copy.website}</strong></div>
              <div className="av-document-rows">{copy.documents.map((text, index) => <div key={text} className={stage === index ? "av-document-row av-document-row-active" : "av-document-row"}><FileText size={12} aria-hidden /><span>{text}</span><Check size={11} aria-hidden /></div>)}</div>
              <span className="av-document-edge" aria-hidden />
            </div>
          </div>
          {platforms.map(platform => <div key={platform.id} className={`av-node av-node-${platform.id}`}>
            <span className="av-node-tile"><AiPlatformMark platform={platform.id} /></span><span className="av-node-name">{platform.name}</span>
          </div>)}
        </div>
        <figcaption className="av-network-caption"><span>{copy.networkLabel}</span><button type="button" disabled={reduced} onClick={() => { if (playing) setPlaying(false); else activate(stage); }} className="av-play" aria-label={reduced ? copy.reduced : playing ? copy.pause : copy.play} title={reduced ? copy.reduced : undefined}>{playing && !reduced ? <Pause size={14} aria-hidden /> : <Play size={14} aria-hidden />}<span>{reduced ? copy.reduced : playing ? copy.pause : copy.play}</span></button></figcaption>
      </figure>

      <div className="av-answer-area">
        <div className="av-query"><span className="av-query-label"><Search size={13} aria-hidden />{copy.queryLabel}</span><p>{copy.query}</p><ArrowDownRight size={20} className="av-query-arrow" aria-hidden /></div>
        <div className="av-answer">
          <div className="av-answer-heading"><span className="av-answer-glyph" aria-hidden><Sparkles size={18} /></span><span>{copy.factsLabel}</span></div>
          <div className="av-panels" aria-live="polite">
            {copy.stages.map((item, index) => <div id={`av-panel-${index}`} key={item.label} hidden={stage !== index}>
              <span className="av-panel-index">0{index + 1} / {item.label}</span><h3>{item.title}</h3><p className="av-panel-text">{item.text}</p>
              <dl className="av-facts">{copy.facts.map((fact, factIndex) => <div key={fact.label} className={index === factIndex ? "av-fact av-fact-active" : "av-fact"}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>)}</dl>
              <p className="av-takeaway"><Check size={16} aria-hidden />{item.takeaway}</p>
            </div>)}
          </div>
          <div className="av-source-footer"><span className="av-source-footer-label"><FileText size={12} aria-hidden />{copy.sources}</span><p>{copy.sourceNote}</p></div>
        </div>
      </div>
    </div>
  </div>;
}

function Connections({ paths, mobile }: { paths: string[]; mobile: boolean }) {
  return <svg className={mobile ? "av-connections av-connections-mobile" : "av-connections av-connections-desktop"} viewBox={mobile ? "0 0 360 460" : "0 0 600 470"} preserveAspectRatio="none" aria-hidden>
    {paths.map((path, index) => <g key={path} style={{ "--av-delay": `${index * 0.13}s` } as CSSProperties}><path className="av-connection-base" d={path} /><path className="av-connection-light" d={path} pathLength={100} /></g>)}
  </svg>;
}
