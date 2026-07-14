import CopyBtn from "@/components/shared/CopyBtn";

const PKGS = [
  {
    name: "@fiber-dev-kit/cli", ver: "0.1.0",
    accent: { background:"rgba(255,255,255,.05)", color:"#7880A4" },
    tags: ["CLI","Linux x64","global"],
    desc: "Start and manage local Fiber nodes using bundled Linux x64 fnn and fnn-cli binaries. It guides funding, peer connection, channel opening, payments, diagnostics, and inspection.",
    install: "npm install -g @fiber-dev-kit/cli@0.1.0",
    href: "https://www.npmjs.com/package/@fiber-dev-kit/cli",
  },
  {
    name: "@fiber-dev-kit/core", ver: "0.1.0",
    accent: { background:"rgba(124,92,246,.12)", color:"#A594F9" },
    tags: ["TypeScript","RPC client","diagnostics"],
    desc: "Typed Fiber RPC client with CKB amount conversion, mainnet write guards, diagnostics, event polling, and alert rules.",
    install: "npm install @fiber-dev-kit/core@0.1.0",
    href: "https://www.npmjs.com/package/@fiber-dev-kit/core",
  },
  {
    name: "@fiber-dev-kit/test-client", ver: "0.1.0",
    accent: { background:"rgba(16,204,170,.10)", color:"#10CCAA" },
    tags: ["testing","CI","multi-node"],
    desc: "Integration test helpers for already-running Fiber nodes. Wrap nodes by alias, check route confidence, assert payment outcomes, and simulate common failures.",
    install: "npm install @fiber-dev-kit/test-client@0.1.0",
    href: "https://www.npmjs.com/package/@fiber-dev-kit/test-client",
  },
  {
    name: "@fiber-dev-kit/inspector", ver: "0.1.0",
    accent: { background:"rgba(240,162,67,.10)", color:"#F0A243" },
    tags: ["dashboard","diagnostics","global"],
    desc: "Local dashboard for development and operator diagnostics. Shows node health, peer and channel state, wallet funding addresses, active alerts, and recent payment traces.",
    install: "npm install -g @fiber-dev-kit/inspector@0.1.0",
    href: "https://www.npmjs.com/package/@fiber-dev-kit/inspector",
  },
];

export default function Packages() {
  return (
    <section className="section">
      <div className="wrap">
        <div className="eyebrow">Packages</div>
        <h2 className="section-title">Four packages, one local Fiber workflow.</h2>
        <p className="section-sub">
          Focused packages for local Fiber development. The packages are independent but
          designed to work together: CLI starts nodes, core speaks RPC, test-client verifies
          flows, and inspector visualizes node state.
        </p>
        <div className="pkg-grid">
          {PKGS.map(({ name, ver, accent, tags, desc, install, href }) => (
            <div key={name} className="pkg-card">
              <div>
                <span className="tag" style={{ ...accent, marginBottom: 8, display:"inline-block" }}>{ver}</span>
                <a href={href} target="_blank" rel="noopener noreferrer" className="pkg-name" style={{display:"block"}}>{name}</a>
              </div>
              <div className="pkg-desc">{desc}</div>
              <div className="pkg-tags">{tags.map(t => <span key={t} className="tag tag-g">{t}</span>)}</div>
              <div className="pkg-install"><span>{install}</span><CopyBtn text={install} /></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
