import { kw, str, fn, cmt, num } from "@/lib/syntax";

const STEPS = [
  {
    num: "1", title: "Start local nodes",
    sub: "Install the CLI and spin up a two-node local network with a funded channel. No Rust toolchain, no config files.",
    code: `npm install -g @fiber-dev-kit/cli\nfiber start --nodes 2 --channel 200\nfiber status --watch`,
    label: "bash",
  },
  {
    num: "2", title: "Inspect and debug",
    sub: "Open the local dashboard to view node health, channels, wallet funding addresses, alerts, and payment traces.",
    code: `npm install -g @fiber-dev-kit/inspector\nfiber-dev-kit-inspector`,
    label: "bash",
  },
  {
    num: "3", title: "Preflight payments in code",
    sub: "Use test-client to check route confidence before sending, then assert payment outcomes in CI or local test runs.",
    code: [
      `${kw("import")} { ${fn("FiberNetwork")} }`,
      `  ${kw("from")} ${str('"@fiber-dev-kit/test-client"')}`,
      ``,
      `${kw("const")} network = ${kw("new")} ${fn("FiberNetwork")}({`,
      `  nodes: { a: ${str('"http://127.0.0.1:8227"')},`,
      `           b: ${str('"http://127.0.0.1:8237"')} },`,
      `});`,
      `${kw("await")} network.${fn("start")}();`,
      ``,
      `${kw("const")} recipient = ${kw("await")} network.${fn("pubkeyOf")}(${str('"b"')});`,
      `${kw("const")} report = ${kw("await")} network.${fn("node")}(${str('"a"')})`,
      `  .${fn("routeConfidence")}({ to: recipient, amount: ${num("1")} });`,
    ].join("\n"),
    label: "ts",
  },
];

export default function HowItWorks() {
  return (
    <section className="section">
      <div className="wrap">
        <div className="eyebrow">Getting started</div>
        <h2 className="section-title">Try a local Fiber payment in three steps.</h2>
        <div className="steps">
          {STEPS.map(({ num, title, sub, code, label }) => (
            <div key={num} className="step">
              <div className="step-num">{num}</div>
              <div className="step-title">{title}</div>
              <div className="step-sub">{sub}</div>
              <div className="step-code">
                <pre className="code-font" dangerouslySetInnerHTML={{ __html: code }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
