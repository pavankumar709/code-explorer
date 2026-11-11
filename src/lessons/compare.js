export default {
  id: "compare",
  title: "One program, six languages",
  blurb: "How JavaScript, Python, Java, Go, C++ and Rust differ",
  intro: "The same add(2, 3) goes through very different journeys. Here is the whole course in one view: what happens before it runs, what runs it, and who cleans memory.",
  facts: [
    ["Interpreted first", "JavaScript, Python (with JIT help in JS)"],
    ["Bytecode + VM", "Java (JVM), Python, JavaScript"],
    ["Native binary", "Go, C++, Rust"],
    ["Garbage collector", "JavaScript, Python (refcount), Java, Go"],
    ["No runtime", "C++ and Rust"],
  ],
  stage: [["lanes"], ["verdict"]],
  widgets: {
    lanes: { type: "lanes", short: "Languages", title: "Six journeys" },
    verdict: { type: "list", short: "Verdict", title: "What this means", layout: "rows" },
  },
  steps: [
    { title: "Before it runs", text: "Some languages translate nothing in advance, some make bytecode, and some make a finished native program. Rust and C++ do all their work before your program ever starts.",
      w: { lanes: { lanes: [
        { name: "JavaScript", blocks: [{ t: "parse → bytecode (at start)" }] }, { name: "Python", blocks: [{ t: "bytecode (.pyc cache)" }] }, { name: "Java", blocks: [{ t: "javac → .class", tone: "new" }] },
        { name: "Go", blocks: [{ t: "native binary + runtime", tone: "ok" }] }, { name: "C++", blocks: [{ t: "native binary", tone: "ok" }] }, { name: "Rust", blocks: [{ t: "checks, then native binary", tone: "ok" }] }] },
        verdict: { items: [{ t: "Native: fast start, a build step to wait for" }, { t: "Bytecode: portable, needs a VM installed" }] } } },
    { title: "What runs it", text: "JavaScript, Python and Java run on a virtual machine. JavaScript and Java add a JIT to get fast. Go, C++ and Rust run directly on the CPU.",
      w: { lanes: { lanes: [
        { name: "JavaScript", blocks: [{ t: "V8: interpreter + JIT", tone: "hot" }] }, { name: "Python", blocks: [{ t: "CPython bytecode loop" }] }, { name: "Java", blocks: [{ t: "JVM: interpreter + JIT", tone: "hot" }] },
        { name: "Go", blocks: [{ t: "the CPU (+ scheduler)", tone: "ok" }] }, { name: "C++", blocks: [{ t: "the CPU", tone: "ok" }] }, { name: "Rust", blocks: [{ t: "the CPU", tone: "ok" }] }] },
        verdict: { items: [{ t: "VM: flexible, slower to start, warm-up time" }, { t: "CPU directly: fast from the first instruction" }] } } },
    { title: "Who frees the memory?", text: "Four languages use a collector or reference counts and work for you. C++ trusts you. Rust makes the compiler prove, in advance, exactly when each value is freed.",
      w: { lanes: { lanes: [
        { name: "JavaScript", blocks: [{ t: "garbage collector", tone: "hot" }] }, { name: "Python", blocks: [{ t: "reference counts", tone: "hot" }] }, { name: "Java", blocks: [{ t: "garbage collector", tone: "hot" }] },
        { name: "Go", blocks: [{ t: "garbage collector", tone: "hot" }] }, { name: "C++", blocks: [{ t: "you (free / delete)", tone: "bad" }] }, { name: "Rust", blocks: [{ t: "owner at scope end", tone: "ok" }] }] },
        verdict: { items: [{ t: "Collector: easy, small pauses and extra memory" }, { t: "By hand: fast, easy to get wrong" }, { t: "Rust: fast and checked, harder to learn" }] } } },
    { title: "How events and waiting work", text: "JavaScript uses one thread and an event loop. Go and Rust spread work over many threads. Python threads take turns because of the lock. Java uses real threads.",
      w: { lanes: { lanes: [
        { name: "JavaScript", blocks: [{ t: "1 thread + event loop" }] }, { name: "Python", blocks: [{ t: "threads + GIL, asyncio" }] }, { name: "Java", blocks: [{ t: "OS threads" }] },
        { name: "Go", blocks: [{ t: "goroutines on few threads" }] }, { name: "C++", blocks: [{ t: "OS threads" }] }, { name: "Rust", blocks: [{ t: "threads or tokio tasks" }] }] },
        verdict: { items: [{ t: "Single thread: simple, never block it" }, { t: "Many threads: use all cores, need safe sharing (Rust checks this too)" }] } } },
    { title: "Choosing", text: "Pick JavaScript for the web and quick results. Python for scripts and data. Java and Go for big servers. C++ when you inherit it. Rust when you need native speed and want the compiler to guard you. None is best at everything.",
      w: { lanes: { lanes: [
        { name: "JavaScript", blocks: [{ t: "web, fast to write", tone: "ok" }] }, { name: "Python", blocks: [{ t: "scripts, data, learning", tone: "ok" }] }, { name: "Java", blocks: [{ t: "large business servers", tone: "ok" }] },
        { name: "Go", blocks: [{ t: "network services, tools", tone: "ok" }] }, { name: "C++", blocks: [{ t: "engines, existing systems", tone: "ok" }] }, { name: "Rust", blocks: [{ t: "native speed with safety", tone: "ok" }] }] },
        verdict: { items: [{ t: "Start with what you want to build" }, { t: "Everything here is just bytes on a CPU in the end" }] } } },
  ],
  artifacts: {},
  outro: { title: "Same CPU, different trade-offs", text: "Every language ends as machine code running the fetch, decode, execute loop. They differ in when they translate, who manages memory and how they wait." },
};
