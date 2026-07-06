# Jakefile — tree-sitter-sema grammar build (jakefile.dev).
#
# `@rooted` makes every relative path here resolve against THIS repo's dir, so a
# workspace meta-repo can `@import "tree-sitter-sema/Jakefile" as ts` and get
# `ts.generate` / `ts.test` running correctly from the workspace root.
@rooted

@group grammar
@desc "Install tree-sitter dependencies"
task setup:
    @needs npm
    npm install

# File recipe: regenerate the parser only when the grammar changes.
file src/parser.c: grammar.js
    @command -v npx >/dev/null || { echo "npx not found — install Node.js" >&2; exit 1; }
    npm install
    npx tree-sitter generate

@group grammar
@desc "Generate the tree-sitter parser (incremental)"
task generate: [src/parser.c]
    echo "tree-sitter parser generated"

@group grammar
@desc "Run the tree-sitter corpus tests"
task test: [generate]
    npx tree-sitter test

@group grammar
@desc "Build the WASM grammar + open the playground"
task playground: [generate]
    npx tree-sitter build --wasm && npx tree-sitter playground
