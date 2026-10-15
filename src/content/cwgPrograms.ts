/**
 * The CWG programs the demo can run, ordered so each one adds exactly one
 * idea. Together they are the language reference — a visitor who steps
 * through all six has seen every construct CWG has.
 *
 * These are real programs, executed by the real `cwg` package in the browser
 * (see [CwgDemo](../components/demos/CwgDemo.tsx)), not transcripts. `source`
 * is the git-command form CWG calls a `.cwg` file, which is what makes the
 * language demonstrable at all: a program is a dozen readable lines rather
 * than a repository you have to clone.
 *
 * `knobs` are the interaction. Writing CWG is genuinely hard and asking a
 * visitor to do it would end in a syntax error, so instead a couple of values
 * per program are dialable: `{{key}}` in `source` and `python` is replaced
 * with the knob's value and the program re-runs. Pyodide is already warm by
 * then, so it is live, not a lookup table of precomputed answers.
 *
 * `python` is the same program written the ordinary way, line-matched against
 * the CWG version while it steps. It is the fastest way to answer "what am I
 * actually looking at", and the revert example — where it becomes
 * `try`/`except` — is the one that makes the language click.
 */
export type CwgKnob = {
  key: string;
  label: string;
  min: number;
  max: number;
  value: number;
};

export type CwgProgram = {
  slug: string;
  title: string;
  /** The single idea this program exists to show. */
  teaches: string;
  source: string;
  python: string;
  knobs: CwgKnob[];
};

export const cwgPrograms: CwgProgram[] = [
  {
    slug: "statements",
    title: "Statements",
    teaches: "Every commit on main is one Python statement, run oldest first.",
    source: `git init
git commit -m "x = {{x}}"
git commit -m "y = x * 21"
git commit -m "print('the answer is', y)"`,
    python: `x = {{x}}
y = x * 21
print('the answer is', y)`,
    knobs: [{ key: "x", label: "x", min: 0, max: 9, value: 2 }],
  },
  {
    slug: "if",
    title: "If / else",
    teaches:
      "A branch is a block. The condition is its first commit, and the merge decides what comes back.",
    source: `git init
git commit -m "n = {{n}}"
git branch if/big
git checkout if/big
git commit -m "if n > 5:"
git commit -m "label = 'big'"
git checkout main
git branch else/big
git checkout else/big
git commit -m "label = 'small'"
git checkout main
git merge if/big -m "return label"
git merge else/big -m "return label"
git commit -m "print(n, 'is', label)"`,
    python: `n = {{n}}
if n > 5:
    label = 'big'
else:
    label = 'small'
print(n, 'is', label)`,
    knobs: [{ key: "n", label: "n", min: 0, max: 10, value: 7 }],
  },
  {
    slug: "while",
    title: "While",
    teaches:
      "A while/ branch loops until its condition fails. Variables it changes are discarded unless the merge returns them.",
    source: `git init
git commit -m "i = {{i}}"
git branch while/countdown
git checkout while/countdown
git commit -m "while i > 0:"
git commit -m "print('tick', i)"
git commit -m "i = i - 1"
git checkout main
git merge while/countdown -m "return i"
git commit -m "print('liftoff, i =', i)"`,
    python: `i = {{i}}
while i > 0:
    print('tick', i)
    i = i - 1
print('liftoff, i =', i)`,
    knobs: [{ key: "i", label: "i", min: 1, max: 6, value: 3 }],
  },
  {
    slug: "for",
    title: "For",
    teaches: "A for/ branch takes its header from the first commit.",
    source: `git init
git commit -m "total = 0"
git branch for/nums
git checkout for/nums
git commit -m "for n in range(1, {{k}} + 1):"
git commit -m "total = total + n"
git checkout main
git merge for/nums -m "return total"
git commit -m "print('sum of 1..{{k}} =', total)"`,
    python: `total = 0
for n in range(1, {{k}} + 1):
    total = total + n
print('sum of 1..{{k}} =', total)`,
    knobs: [{ key: "k", label: "count to", min: 1, max: 9, value: 4 }],
  },
  {
    slug: "revert",
    title: "Revert",
    teaches:
      "git revert is exception handling: the handler runs only if the commit it reverts raised.",
    source: `git init
git commit -m "x = {{x}}"
git commit -m "result = 10 / x"
git revert HEAD -m "result = float('inf')"
git commit -m "print('result =', result)"`,
    python: `x = {{x}}
try:
    result = 10 / x
except Exception:
    result = float('inf')
print('result =', result)`,
    knobs: [{ key: "x", label: "x", min: 0, max: 5, value: 0 }],
  },
  {
    slug: "fn",
    title: "Functions",
    teaches: "An fn/ branch is a function body; cherry-picking it is the call.",
    source: `git init
git commit -m "base = {{base}}"
git branch fn/double
git checkout fn/double
git commit -m "base = base * 2"
git checkout main
git cherry-pick fn/double
git cherry-pick fn/double
git commit -m "print('doubled twice to', base)"`,
    python: `base = {{base}}

def double():
    global base
    base = base * 2

double()
double()
print('doubled twice to', base)`,
    knobs: [{ key: "base", label: "base", min: 1, max: 9, value: 5 }],
  },
];

/** Substitutes `{{key}}` placeholders with the knobs' current values. */
export function fillProgram(text: string, knobs: Record<string, number>) {
  return text.replace(/\{\{(\w+)\}\}/g, (whole, key) =>
    key in knobs ? String(knobs[key]) : whole,
  );
}
