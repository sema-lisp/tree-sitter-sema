// Refresh documented builtin names and prelude macros from a Sema checkout.
// Usage: node scripts/sync-builtins.mjs /path/to/sema [--check]
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const source = process.argv[2];
if (!source) throw new Error('Pass the Sema Rust repository path');
const queryPath = fileURLToPath(new URL('../queries/highlights.scm', import.meta.url));
const entries = JSON.parse(fs.readFileSync(path.join(source, 'crates/sema-docs/builtin_docs.generated.json'), 'utf8')).entries;
const prelude = fs.readFileSync(path.join(source, 'crates/sema-eval/src/prelude.rs'), 'utf8');
const symbol = /^[\p{Alphabetic}+\-*/!?<>=_&%^~.][\p{Alphabetic}+\-*/!?<>=_&%^~.#0-9]*$/u;
const macros = [...prelude.matchAll(/^\(defmacro ([^\s()]+)/gm)].map(match => match[1]).filter(name => !name.startsWith('__'));
const constants = ['pi', 'e', '*stdin*', '*stdout*', '*stderr*'];
// Bound runtime aliases and builtins omitted from the documentation index.
const runtimeAliases = ["caddr", "char->integer", "char->string", "char-alphabetic?", "char-downcase", "char-numeric?", "char-upcase", "char-upper-case?", "char-whitespace?", "i64-array/fold", "i64-array/length", "i64-array/map", "i64-array/ref", "i64-array/set!", "i64-array/sum", "i64-array?", "integer->char", "keyword->string", "path/basename", "path/dirname", "path/ext", "stream/writable?", "string->char", "string->keyword", "string->list", "string->symbol", "string->utf8", "string-append", "string-length", "string-ref", "substring", "symbol->string", "time/now-ms", "utf8->string"];
const names = [...new Set([...entries.map(entry => entry.name), ...runtimeAliases])].filter(name => symbol.test(name) && !constants.includes(name));
const rows = values => [...new Set(values)].sort().map(name => `    ${JSON.stringify(name)}`).join('\n');
const begin = '; BEGIN GENERATED BUILTINS';
const end = '; END GENERATED BUILTINS';
const generated = `${begin}
; Source: sema-docs/builtin_docs.generated.json and sema-eval/src/prelude.rs.
; Refresh with scripts/sync-builtins.mjs; definition/special-form rules below win.
(list . (symbol) @function.builtin
  (#any-of? @function.builtin
${rows(names)}))

(list . (symbol) @keyword
  (#any-of? @keyword
${rows(macros)}))

((symbol) @constant.builtin
  (#any-of? @constant.builtin
${rows(constants)}))
${end}`;
const query = fs.readFileSync(queryPath, 'utf8');
const start = query.indexOf(begin), finish = query.indexOf(end);
if ((start < 0) !== (finish < 0)) throw new Error('Incomplete generated builtin markers');
const next = start < 0
  ? query.replace('; CONDITIONALS', `${generated}\n\n; CONDITIONALS`)
  : query.slice(0, start) + generated + query.slice(finish + end.length);
if (!next.includes(begin)) throw new Error('Missing conditional query insertion point');
if (process.argv.includes('--check')) {
  if (query !== next) { console.error('Builtin query is out of date'); process.exitCode = 1; }
} else if (query !== next) {
  fs.writeFileSync(queryPath, next);
}
