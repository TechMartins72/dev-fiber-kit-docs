"use client";
import { useState } from "react";

type LT = "prompt"|"out"|"ok"|"err"|"warn";
interface Line { t: LT; v: string; }

const TABS: { id: string; label: string; lines: Line[] }[] = [
  {
    id: "start", label: "fiber start",
    lines: [
      { t:"prompt", v:"fiber start --nodes 2 --channel 200" },
      { t:"out",    v:"fiber-dev-kit 0.1.0 · Linux x64" },
      { t:"out",    v:"Starting node a → ~/.fiber-dev-kit/nodes/a" },
      { t:"out",    v:"Starting node b → ~/.fiber-dev-kit/nodes/b" },
      { t:"ok",     v:"✓ node a  RPC http://127.0.0.1:8227  P2P :8228" },
      { t:"ok",     v:"✓ node b  RPC http://127.0.0.1:8237  P2P :8238" },
      { t:"out",    v:"Connecting a → b..." },
      { t:"ok",     v:"✓ peers connected" },
      { t:"out",    v:"Opening channel a → b  200 CKB..." },
      { t:"ok",     v:"✓ ChannelReady  0x4a9b...f21c  local 200 CKB / remote 0 CKB" },
    ],
  },
  {
    id: "inspector", label: "inspector",
    lines: [
      { t:"prompt", v:"fiber-dev-kit-inspector" },
      { t:"out",    v:"Reading CLI state from ~/.fiber-dev-kit/state.json" },
      { t:"ok",     v:"✓ found nodes: a, b" },
      { t:"out",    v:"Starting inspector on http://127.0.0.1:3030" },
      { t:"ok",     v:"✓ Inspector ready" },
      { t:"out",    v:"" },
      { t:"out",    v:"node a  ✓ reachable · 1 peer · 1 channel (ChannelReady)" },
      { t:"out",    v:"        balance: local 200 CKB / remote 0 CKB" },
      { t:"out",    v:"node b  ✓ reachable · 1 peer · 1 channel (ChannelReady)" },
      { t:"ok",     v:"✓ no active alerts on either node" },
    ],
  },
  {
    id: "preflight", label: "routeConfidence",
    lines: [
      { t:"prompt", v:"node preflight.mjs" },
      { t:"out",    v:"network.start() ..." },
      { t:"ok",     v:"✓ both nodes reachable" },
      { t:"out",    v:"" },
      { t:"out",    v:"network.pubkeyOf('b') → 0372e3c0..." },
      { t:"out",    v:"network.node('a').routeConfidence({ to: '0372...', amount: 1 })" },
      { t:"out",    v:"" },
      { t:"ok",     v:"  canPay:   true" },
      { t:"ok",     v:"  score:    91 / 100" },
      { t:"ok",     v:"  level:    high" },
      { t:"out",    v:"  reasons:  peer connected, channel ready, balance sufficient" },
    ],
  },
  {
    id: "diagnose", label: "diagnose()",
    lines: [
      { t:"prompt", v:"node diagnose.mjs" },
      { t:"out",    v:"Attempting payment beyond channel capacity..." },
      { t:"err",    v:"✗ node.payInvoice() threw" },
      { t:"out",    v:"" },
      { t:"out",    v:"diagnose(error):" },
      { t:"ok",     v:"  code:       INSUFFICIENT_LIQUIDITY" },
      { t:"out",    v:"  summary:    Not enough usable balance in this direction." },
      { t:"ok",     v:"  suggestion: Reduce the amount or open a larger channel." },
    ],
  },
];

export default function DemoTerminal() {
  const [active, setActive] = useState("start");
  const tab = TABS.find(t => t.id === active)!;
  return (
    <div className="terminal">
      <div className="term-bar">
        <div className="term-dot td-r" /><div className="term-dot td-a" /><div className="term-dot td-g" />
        <span className="term-title">fiber-dev-kit — interactive demo</span>
      </div>
      <div className="term-tabs">
        {TABS.map(t => (
          <button key={t.id} className={`term-tab${active===t.id?" on":""}`} onClick={() => setActive(t.id)}>{t.label}</button>
        ))}
      </div>
      <div className="term-body">
        {tab.lines.map((line, i) => (
          <div key={i}>
            {line.t === "prompt" && <span><span className="tp">❯ </span><span className="tc">{line.v}</span></span>}
            {line.t === "out"  && <span className="to">{line.v}</span>}
            {line.t === "ok"   && <span className="tok">{line.v}</span>}
            {line.t === "err"  && <span className="te">{line.v}</span>}
            {line.t === "warn" && <span className="tw">{line.v}</span>}
          </div>
        ))}
        <div style={{marginTop:8}}><span className="tp">❯ </span><span className="cursor" /></div>
      </div>
    </div>
  );
}
