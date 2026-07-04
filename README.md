# tree-sitter-sema

Tree-sitter grammar for [Sema](https://sema-lang.com), a Lisp with LLM primitives.

This is the canonical home for the grammar. Editor integrations (Zed, Helix, Neovim) consume it by pinning a tagged commit; the generated `src/` (parser + scanner) is committed so consumers compile it directly without running `tree-sitter generate`.

## Usage

```sh
tree-sitter generate && tree-sitter test
```

Editing `grammar.js` requires regenerating and committing `src/`:

```sh
npm install
tree-sitter generate    # updates src/parser.c etc.
tree-sitter test
```

## Node Types

The grammar produces the following node types:

- `list` — parenthesized list `(...)` 
- `vector` — square-bracket vector `[...]`
- `hash_map` — curly-brace map `{...}`
- `symbol` — identifiers and operators
- `keyword` — colon-prefixed keywords `:foo`
- `number` — integer and floating-point literals
- `string` — double-quoted string literals
- `boolean` — `#t` and `#f`
- `character` — character literals `#\a`
- `byte_vector` — byte vector literals `#u8(...)`
- `comment` — line comments `;`
- `block_comment` — block comments `#| ... |#`
- `quote` — `'expr`
- `quasiquote` — `` `expr ``
- `unquote` — `,expr`
- `unquote_splicing` — `,@expr`
- `short_lambda` — anonymous-function shorthand `#(...)`
- `regex` — regex literals `#"..."`
- `deref` — dereference `@expr`
- `shebang` — leading `#!...` line

## Consumers

Editor integrations pin a tagged commit of this grammar:

- [zed-sema](https://github.com/sema-lisp/zed-sema) — Zed extension
- [helix-sema](https://github.com/sema-lisp/helix-sema) — Helix language support
- [sema.nvim](https://github.com/sema-lisp/sema.nvim) — Neovim plugin

## Releases

Releases are tagged (`vX.Y.Z`); consumers pin a specific tag rather than tracking `main`. Current release: **v0.2.0**.

## Links

- [Sema Language](https://sema-lang.com)
- [Sema Repository](https://github.com/HelgeSverre/sema)
- [Playground](https://sema.run)

## License

MIT
