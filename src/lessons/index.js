import cpu from "./cpu.js";
import interpreter from "./interpreter.js";
import compiler from "./compiler.js";
import binary from "./binary.js";
import jit from "./jit.js";
import v8 from "./v8.js";
import object from "./object.js";
import stack from "./stack.js";
import gc from "./gc.js";
import browser from "./browser.js";
import asyncL from "./async.js";
import node from "./node.js";
import rustc from "./rustc.js";
import ownership from "./ownership.js";
import borrow from "./borrow.js";
import rvalue from "./rvalue.js";
import tokio from "./tokio.js";
import python from "./python.js";
import java from "./java.js";
import go from "./go.js";
import c from "./c.js";
import compare from "./compare.js";

const defs = [
  { name: "Foundations", tone: "blue", items: [cpu, interpreter, compiler, binary, jit] },
  { name: "JavaScript", tone: "amber", items: [v8, object, stack, gc, browser, asyncL, node] },
  { name: "Rust", tone: "violet", items: [rustc, ownership, borrow, rvalue, tokio] },
  { name: "Other languages", tone: "teal", items: [python, java, go, c] },
  { name: "Compare", tone: "slate", items: [compare] },
];

export const groups = defs.map((g) => ({ name: g.name, tone: g.tone, ids: g.items.map((l) => l.id) }));
export const lessons = defs.flatMap((g) => g.items.map((l) => ({ ...l, group: g.name })));
export const byId = Object.fromEntries(lessons.map((l) => [l.id, l]));
