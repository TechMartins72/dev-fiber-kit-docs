import CodeBlock from "@/components/shared/CodeBlock";
import { kw, str, fn, cmt, num } from "@/lib/syntax";

const A = ({ id }: { id: string }) => <div id={id} style={{ scrollMarginTop: 80 }} />;

const Tbl = ({ rows, cols }: { rows: string[][], cols: string[] }) => (
  <table className="ref-table">
    <thead><tr>{cols.map(c => <th key={c}>{c}</th>)}</tr></thead>
    <tbody>{rows.map(r => <tr key={r[0]}>{r.map((c,i) => <td key={i}>{c}</td>)}</tr>)}</tbody>
  </table>
);

export default function DocsContent() {
  return (
    <div className="docs-body">

      {/* ── Installation ── */}
      <A id="install" />
      <div className="docs-h2">Installation</div>
      <p className="docs-p">All packages require Node.js ≥ 18. Install only what you need.</p>
      <CodeBlock label="bash" code={[
        `${cmt("# Node launcher — Linux x64")}`,
        `npm install -g @fiber-dev-kit/cli`,``,
        `${cmt("# Typed RPC client and diagnostics")}`,
        `npm install @fiber-dev-kit/core`,``,
        `${cmt("# Integration test harness")}`,
        `npm install @fiber-dev-kit/test-client`,``,
        `${cmt("# Local web dashboard")}`,
        `npm install -g @fiber-dev-kit/inspector`,
      ].join("\n")} />
      <div className="docs-note">⚠️ The CLI bundles Linux x64 binaries. Core, test-client, and inspector are platform-independent.</div>

      {/* ── First payment ── */}
      <A id="quickstart" />
      <div className="docs-h2">First payment</div>
      <p className="docs-p">Start two local nodes, open the inspector, then verify your first payment in code.</p>
      <CodeBlock label="bash" code={`fiber start --nodes 2 --channel 200\nfiber-dev-kit-inspector`} />
      <CodeBlock label="ts" code={[
        `${kw("import")} { ${fn("FiberNetwork")} } ${kw("from")} ${str('"@fiber-dev-kit/test-client"')}`,``,
        `${kw("const")} network = ${kw("new")} ${fn("FiberNetwork")}({`,
        `  nodes: { a: ${str('"http://127.0.0.1:8227"')}, b: ${str('"http://127.0.0.1:8237"')} },`,
        `});`,
        `${kw("await")} network.${fn("start")}();`,``,
        `${kw("const")} recipient = ${kw("await")} network.${fn("pubkeyOf")}(${str('"b"')});`,
        `${kw("const")} report    = ${kw("await")} network.${fn("node")}(${str('"a"')}).${fn("routeConfidence")}({`,
        `  to: recipient, amount: ${num("1")},`,
        `});`,
        `console.log(report.canPay, report.score, report.level);`,
      ].join("\n")} />

      {/* ── FiberClient ── */}
      <A id="core-client" />
      <div className="docs-h2">FiberClient</div>
      <p className="docs-p">Typed JSON-RPC client for a Fiber Network Node. Plain CKB amounts — hex-shannon conversion is handled internally.</p>
      <CodeBlock label="@fiber-dev-kit/core" code={[
        `${kw("import")} { ${fn("FiberClient")} } ${kw("from")} ${str('"@fiber-dev-kit/core"')}`,``,
        `${kw("const")} node = ${kw("new")} ${fn("FiberClient")}({`,
        `  nodeUrl: ${str('"http://127.0.0.1:8227"')},`,
        `  network: ${str('"devnet"')},  ${cmt("// 'devnet' | 'testnet' | 'mainnet'")}`,
        `});`,``,
        `${kw("const")} info     = ${kw("await")} node.${fn("info")}();`,
        `${kw("const")} peers    = ${kw("await")} node.${fn("listPeers")}();`,
        `${kw("const")} channels = ${kw("await")} node.${fn("listChannels")}();`,``,
        `${kw("await")} node.${fn("payInvoice")}(${str('"fibt1q..."')});`,
      ].join("\n")} />
      <div className="docs-h3">Constructor options</div>
      <Tbl cols={["Option","Type","Description"]} rows={[
        ["nodeUrl","string","RPC endpoint, e.g. http://127.0.0.1:8227"],
        ["network","string (optional)","'devnet' | 'testnet' | 'mainnet'. Mainnet blocks writes unless allowMainnetWrites is set."],
      ]} />
      <div className="docs-h3">Methods</div>
      {[
        { sig:"node.info()",              desc:"Node info: version, pubkey, channel count, peer count, announced addresses." },
        { sig:"node.listPeers()",         desc:"Connected Fiber peers with pubkey and connection address." },
        { sig:"node.listChannels()",      desc:"All channels including closing and closed ones." },
        { sig:"node.payInvoice(invoice)", desc:"Send a payment by encoded invoice string (fibt1q...)." },
      ].map(({ sig, desc }) => (
        <div key={sig} className="method-card"><div className="method-sig">{sig}</div><div className="method-desc">{desc}</div></div>
      ))}

      {/* ── FiberEventClient ── */}
      <A id="core-events" />
      <div className="docs-h2">FiberEventClient</div>
      <p className="docs-p">FNN has no server-push subscriptions. FiberEventClient polls and diffs channel and payment state to emit typed events.</p>
      <CodeBlock code={[
        `${kw("import")} { ${fn("FiberClient")}, ${fn("FiberEventClient")} } ${kw("from")} ${str('"@fiber-dev-kit/core"')}`,``,
        `${kw("const")} node   = ${kw("new")} ${fn("FiberClient")}({ nodeUrl: ${str('"http://127.0.0.1:8227"')} });`,
        `${kw("const")} events = ${kw("new")} ${fn("FiberEventClient")}({ client: node, pollIntervalMs: ${num("1000")} });`,``,
        `events.${fn("on")}(${str('"payment.succeeded"')}, ({ payment }) => console.log(${str('"paid"')}, payment.payment_hash));`,
        `events.${fn("on")}(${str('"payment.failed"')},    ({ diagnosis }) => console.error(diagnosis?.summary));`,
        `events.${fn("on")}(${str('"channel.opened"')},   ({ channel }) => { ${cmt("...")} });`,``,
        `events.${fn("start")}(); ${cmt("// later: events.stop()")}`,
      ].join("\n")} />
      <p className="docs-p">Events: <code>channel.opened</code>, <code>channel.updated</code>, <code>channel.closed</code>, <code>payment.created</code>, <code>payment.updated</code>, <code>payment.succeeded</code>, <code>payment.failed</code>.</p>

      {/* ── diagnose ── */}
      <A id="core-diagnose" />
      <div className="docs-h2">diagnose()</div>
      <p className="docs-p">Translates a raw FNN error into a structured, actionable diagnosis.</p>
      <CodeBlock code={[
        `${kw("import")} { ${fn("FiberClient")}, ${fn("diagnose")} } ${kw("from")} ${str('"@fiber-dev-kit/core"')}`,``,
        `${kw("try")} {`,
        `  ${kw("await")} node.${fn("payInvoice")}(${str('"fibt1q..."')});`,
        `} ${kw("catch")} (error) {`,
        `  ${kw("const")} d = ${fn("diagnose")}(error);`,
        `  ${cmt("// d.code:       'INSUFFICIENT_LIQUIDITY'")}`,
        `  ${cmt("// d.summary:    'Not enough usable balance in this direction.'")}`,
        `  ${cmt("// d.suggestion: 'Reduce the amount or open a larger channel.'")}`,
        `}`,
      ].join("\n")} />
      <div className="docs-h3">Diagnosis codes</div>
      <Tbl cols={["Code","When it fires"]} rows={[
        ["INSUFFICIENT_LIQUIDITY","Not enough outbound balance in the payment direction"],
        ["ROUTE_NOT_FOUND","No path exists from this node to the target"],
        ["PEER_NOT_CONNECTED","Target peer is not connected"],
        ["PEER_UNREACHABLE","Connection attempt to peer failed"],
        ["INVOICE_EXPIRED","Invoice expiry window has passed"],
        ["INVOICE_ALREADY_PAID","Invoice has already been settled"],
        ["TIMEOUT","RPC call exceeded the configured timeout"],
        ["UNKNOWN","No known pattern matched — inspect the raw error"],
      ]} />

      {/* ── evaluateAlerts ── */}
      <A id="core-alerts" />
      <div className="docs-h2">evaluateAlerts()</div>
      <p className="docs-p">Takes a snapshot of node state and returns actionable operational alerts. Used by the inspector and <code>fiber doctor</code>.</p>
      <CodeBlock code={[
        `${kw("import")} { ${fn("FiberClient")}, ${fn("evaluateAlerts")} } ${kw("from")} ${str('"@fiber-dev-kit/core"')}`,``,
        `${kw("const")} node = ${kw("new")} ${fn("FiberClient")}({ nodeUrl: ${str('"http://127.0.0.1:8227"')} });`,``,
        `${kw("const")} snapshot = {`,
        `  info:     ${kw("await")} node.${fn("info")}(),`,
        `  peers:    ${kw("await")} node.${fn("listPeers")}(),`,
        `  channels: ${kw("await")} node.${fn("listChannels")}(),`,
        `};`,``,
        `${kw("const")} alerts = ${fn("evaluateAlerts")}(snapshot);`,
        `${kw("for")} (${kw("const")} a ${kw("of")} alerts) {`,
        `  console.log(\`[\${a.severity}] \${a.code}: \${a.summary}\`);`,
        `  console.log(\`  → \${a.suggestion}\`);`,
        `}`,
      ].join("\n")} />
      <Tbl cols={["Code","When it fires"]} rows={[
        ["NODE_UNREACHABLE","RPC endpoint is not reachable"],
        ["ZERO_PEERS","Node has no connected Fiber peers"],
        ["NO_READY_CHANNELS","No channels are in ChannelReady state"],
        ["LOW_LOCAL_BALANCE","A ready channel has less than 1 CKB of outbound balance"],
        ["PAYMENT_FAILED","A recent payment ended in Failed status"],
      ]} />

      {/* ── routeConfidence ── */}
      <A id="core-confidence" />
      <div className="docs-h2">routeConfidence()</div>
      <p className="docs-p">Pre-flight check that scores whether a payment is likely to succeed before you send it.</p>
      <CodeBlock code={[
        `${kw("import")} { ${fn("FiberClient")}, ${fn("routeConfidence")} } ${kw("from")} ${str('"@fiber-dev-kit/core"')}`,``,
        `${kw("const")} node   = ${kw("new")} ${fn("FiberClient")}({ nodeUrl: ${str('"http://127.0.0.1:8227"')} });`,
        `${kw("const")} report = ${kw("await")} ${fn("routeConfidence")}({`,
        `  from:   node,`,
        `  to:     ${str('"0372e3c0b8b7a507da99f7f5e0ea9f3e46bc93c6..."')},`,
        `  amount: ${num("1")},`,
        `});`,``,
        `${cmt("// report.canPay      → true | false")}`,
        `${cmt("// report.score       → 0–100")}`,
        `${cmt("// report.level       → 'high' | 'medium' | 'low'")}`,
        `${cmt("// report.reasons     → string[]")}`,
        `${cmt("// report.suggestions → string[]")}`,
        `${cmt("// report.diagnosis   → Diagnosis | null")}`,
      ].join("\n")} />

      {/* ── amount utils ── */}
      <A id="core-utils" />
      <div className="docs-h2">Amount utilities</div>
      <CodeBlock code={[
        `${kw("import")} { ${fn("ckbToShannonHex")}, ${fn("shannonHexToCkb")}, ${fn("formatAmount")} }`,
        `  ${kw("from")} ${str('"@fiber-dev-kit/core"')}`,``,
        `${fn("ckbToShannonHex")}(${num("1")})                  ${cmt("// → '0x5f5e100'")}`,
        `${fn("shannonHexToCkb")}(${str('"0x5f5e100"')})        ${cmt("// → 1")}`,
        `${fn("formatAmount")}(${str('"0x5f5e100"')})            ${cmt("// → '1 CKB'")}`,
        `${fn("formatAmount")}(${str('"0x5f5e100"')}, ${str('"shannon"')})   ${cmt("// → '100000000 shannon'")}`,
      ].join("\n")} />

      {/* ── FiberNetwork ── */}
      <A id="tc-network" />
      <div className="docs-h2">FiberNetwork</div>
      <p className="docs-p">Local integration test harness for Fiber payment flows. Wraps one FiberClient per alias and provides helpers for health checks, route confidence pre-flights, and payment orchestration.</p>
      <CodeBlock label="@fiber-dev-kit/test-client" code={[
        `${kw("import")} { ${fn("FiberNetwork")} } ${kw("from")} ${str('"@fiber-dev-kit/test-client"')}`,``,
        `${kw("const")} network = ${kw("new")} ${fn("FiberNetwork")}({`,
        `  nodes: { a: ${str('"http://127.0.0.1:8227"')}, b: ${str('"http://127.0.0.1:8237"')} },`,
        `});`,``,
        `${kw("await")} network.${fn("start")}();`,``,
        `${kw("const")} recipient = ${kw("await")} network.${fn("pubkeyOf")}(${str('"b"')});`,
        `${kw("const")} report    = ${kw("await")} network.${fn("node")}(${str('"a"')}).${fn("routeConfidence")}({`,
        `  to: recipient, amount: ${num("1")},`,
        `});`,
        `console.log(report.canPay, report.level);`,
      ].join("\n")} />

      {/* ── Assertions ── */}
      <A id="tc-assert" />
      <div className="docs-h2">Assertions</div>
      <p className="docs-p">Test helpers that poll until a payment reaches a terminal state, then assert its outcome. Failures throw with a diagnosis summary.</p>
      <CodeBlock code={[
        `${kw("const")} nodeA = network.${fn("node")}(${str('"a"')});`,``,
        `${kw("const")} { payment_hash } = ${kw("await")} nodeA.${fn("pay")}({ invoice: ${str('"fibt1q..."')} });`,``,
        `${kw("await")} nodeA.${fn("assertPaid")}(payment_hash);`,
        `${kw("await")} nodeA.${fn("assertFailed")}(payment_hash);`,
        `${kw("await")} nodeA.${fn("assertError")}(payment_hash, ${str('"INSUFFICIENT_LIQUIDITY"')});`,
      ].join("\n")} />

      {/* ── Simulations ── */}
      <A id="tc-simulate" />
      <div className="docs-h2">Failure simulations</div>
      <p className="docs-p">Named failure scenarios for testing error-handling paths.</p>
      <CodeBlock code={[
        `${kw("const")} r1 = ${kw("await")} network.simulate.${fn("insufficientLiquidity")}(${str('"a"')}, ${str('"b"')}, channelId);`,
        `${kw("const")} r2 = ${kw("await")} network.simulate.${fn("unreachablePeer")}(${str('"a"')}, ${str('"c"')}, ${num("10")});`,
        `${kw("const")} r3 = ${kw("await")} network.simulate.${fn("expiredInvoice")}(${str('"a"')}, ${str('"b"')}, ${num("5")});`,``,
        `console.log(r1.diagnosis?.code); ${cmt("// 'INSUFFICIENT_LIQUIDITY'")}`,
      ].join("\n")} />

      {/* ── Inspector CLI ── */}
      <A id="insp-cli" />
      <div className="docs-h2">Inspector — CLI usage</div>
      <p className="docs-p">Local dashboard for development and operator diagnostics. Shows node health, peer and channel state, wallet funding addresses, active alerts, and recent payment traces.</p>
      <CodeBlock label="bash" code={[
        `${cmt("# Auto-reads from CLI state file")}`,
        `fiber-dev-kit-inspector`,``,
        `${cmt("# Explicit node URLs")}`,
        `fiber-dev-kit-inspector a=http://127.0.0.1:8227 b=http://127.0.0.1:8237`,``,
        `${cmt("# Custom port")}`,
        `fiber-dev-kit-inspector a=http://127.0.0.1:8227 --port=4000`,
      ].join("\n")} />

      {/* ── Inspector library ── */}
      <A id="insp-lib" />
      <div className="docs-h2">Inspector — as a library</div>
      <CodeBlock label="@fiber-dev-kit/inspector" code={[
        `${kw("import")} { ${fn("startInspector")} } ${kw("from")} ${str('"@fiber-dev-kit/inspector"')}`,``,
        `${kw("const")} handle = ${kw("await")} ${fn("startInspector")}({`,
        `  nodes: [`,
        `    { id: ${str('"a"')}, rpcUrl: ${str('"http://127.0.0.1:8227"')} },`,
        `    { id: ${str('"b"')}, rpcUrl: ${str('"http://127.0.0.1:8237"')} },`,
        `  ],`,
        `  port: ${num("3030")}, pollIntervalMs: ${num("1500")},`,
        `});`,
        `${cmt("// handle.stop() to shut it down")}`,
      ].join("\n")} />

      {/* ── Inspector REST ── */}
      <A id="insp-api" />
      <div className="docs-h2">Inspector — REST API</div>
      <Tbl cols={["Endpoint","Returns"]} rows={[
        ["GET /api/nodes",    "Health and info for every watched node"],
        ["GET /api/channels", "Channel list from every node"],
        ["GET /api/payments", "Recent payment history (last 50 per node)"],
        ["GET /api/alerts",   "evaluateAlerts() output for every node"],
        ["WS  /ws",           "Live event stream broadcast to connected browsers"],
      ]} />

      {/* ── CLI start ── */}
      <A id="cli-start" />
      <div className="docs-h2">fiber start</div>
      <p className="docs-p">Provides a fast local Fiber runtime for Linux x64 by bundling fnn and fnn-cli. The fastest way to start local nodes for demos, tests, and development.</p>
      <CodeBlock label="bash" code={[
        `fiber start --nodes 2 --channel 200`,
        `fiber start --background`,
        `fiber start --nodes 2 --channel 200 --dry-run`,``,
        `${cmt("# Pass raw fnn options after --")}`,
        `fiber start -- --ckb-node-rpc-url http://127.0.0.1:8114`,
        `fiber start -- --fiber-announced-node-name my-node`,
      ].join("\n")} />

      {/* ── CLI connect ── */}
      <A id="cli-connect" />
      <div className="docs-h2">fiber connect</div>
      <CodeBlock label="bash" code={[
        `fiber connect --node a --address /ip4/1.2.3.4/tcp/8228/p2p/QmPeer...`,
        `fiber connect --node a --pubkey 03abc...`,
      ].join("\n")} />

      {/* ── CLI channel ── */}
      <A id="cli-channel" />
      <div className="docs-h2">fiber channel</div>
      <CodeBlock label="bash" code={[
        `fiber channel open --node a --peer 03abc... --amount 200 --wait 180`,
        `fiber channel list --node a`,
        `fiber channel list --node a --pending --closed --json`,
      ].join("\n")} />

      {/* ── CLI pay ── */}
      <A id="cli-pay" />
      <div className="docs-h2">fiber pay</div>
      <CodeBlock label="bash" code={[
        `fiber pay --from a --to b --amount 1`,
        `fiber pay --from a --to b --amount 5 --wait 120`,
      ].join("\n")} />

      {/* ── CLI status ── */}
      <A id="cli-status" />
      <div className="docs-h2">fiber status / fiber doctor</div>
      <CodeBlock label="bash" code={[
        `fiber status          ${cmt("# node + channel snapshot")}`,
        `fiber status --watch  ${cmt("# live polling")}`,
        `fiber doctor          ${cmt("# guided diagnostic checklist")}`,
        `fiber inspect         ${cmt("# open the local inspector")}`,
        `fiber accounts        ${cmt("# wallet funding addresses")}`,
      ].join("\n")} />

      {/* ── CLI env ── */}
      <A id="cli-env" />
      <div className="docs-h2">Environment variables</div>
      <Tbl cols={["Variable","Default","Purpose"]} rows={[
        ["FIBER_DEV_KIT_HOME",       "~/.fiber-dev-kit",           "Dev-kit state and node home directories"],
        ["FIBER_HOME",               "~/.fiber-node",              "Single-node runtime directory"],
        ["FIBER_RPC_URL",            "auto-detected",              "Single-node RPC URL override"],
        ["FIBER_CONFIG_TEMPLATE",    "testnet.yml",                "testnet.yml or rpc-only.yml"],
        ["FIBER_SECRET_KEY_PASSWORD","password",                   "Dev key passphrase"],
        ["CKB_NODE_RPC_URL",         "https://testnet.ckbapp.dev/","CKB RPC for balance checks"],
        ["NO_COLOR",                 "unset",                      "Set to 1 to disable colour output"],
      ]} />
      <div className="docs-note">⚠️ The CLI generates local development CKB keys on first start. Do not use them for production funds.</div>

    </div>
  );
}
