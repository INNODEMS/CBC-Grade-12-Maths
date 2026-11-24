# How the Grade 12 book was made

Ben Davies, November 2026

This pull request brings a first full draft of the Grade 12 book in both editions, Core Mathematics and Essential Mathematics. It is built on your Grade 12 skeleton and follows the conventions of your Grade 11 book. This note explains what is here, how it was made and checked, and what is left for you to decide.

## 1. What is here

- All 18 chapters, written into your skeleton's section files: 95 sections, about 145 lessons, 449 worked examples, and 877 written exercises, each with an answer or a worked solution.
- 335 STACK questions, one file each, in gitsync layout under `assets/stack/top/` (strand, chapter and section folders, each with its `gitsync_category.xml`), as in Grade 11. They are embedded 336 times in the source and 425 times across the two editions, because shared questions appear in both.
- 75 JSXGraph interactives (`assets/jsxgraph/`) and 185 TikZ figures, all with alt text.
- Lesson plans in your six templates, inside each section, as in Grade 11.
- Static renders of every STACK question in `generated-assets/stack/`, which the print builds need (Grade 11 also tracks these in git).
- A short introduction for each chapter, in the shape of the Grade 11 introductions.

Everything else is your skeleton, unchanged: `project.ptx`, `publication/`, `docinfo.ptx`, `main.ptx`, front and back matter, the lesson-plan templates, `README.md`, `BUILDING.md`, the workflows and the folder layout. Our changes are in the `sec-*.ptx` files, the chapter introductions in `ch-*.ptx`, and the three asset folders above. The draft sits on top of your `main` as it stood on 2026-11-13 (`dbcfae5`), so the pull request's diff shows exactly what changed. This note and `EDITORIAL-QUESTIONS.md` are in `docs/g12-draft/`.

A preview of the built book is published from the `gh-pages` branch of our fork with the same layout as your deployment (`/core/teachers/`, `/core/students/`, `/core/plans/`, the same three under `/essential/`, and the Core teachers' book at the root), at https://bmjdavies.github.io/CBC-Grade-12-Maths/. The PDFs of both teachers' editions are in the zip attached to the fork's release, https://github.com/BMJDavies/CBC-Grade-12-Maths/releases/tag/g12-first-draft. Once merged, your own Build and Deploy workflow publishes the book at your usual address.

| Ch | Title | Edition | Sections | STACK questions |
|---|---|---|---|---|
| 1 | Sets | Core and Essential | 6 | 18 |
| 2 | Binomial Expansions | Core | 3 | 15 |
| 3 | Compound Proportions, Rates of Work and Mixtures | Core and Essential | 4 | 17 |
| 4 | Linear Inequalities | Essential | 5 | 16 |
| 5 | Linear Programming | Core and Essential | 4 | 16 |
| 6 | Matrices and Transformations | Core | 7 | 21 |
| 7 | Area Approximations | Core and Essential | 3 | 14 |
| 8 | Loci | Core | 8 | 19 |
| 9 | Three Dimensional Geometry | Core | 6 | 18 |
| 10 | Trigonometry III | Core | 4 | 18 |
| 11 | Vectors | Essential | 7 | 17 |
| 12 | Vectors II | Core | 9 | 24 |
| 13 | Navigation | Core and Essential | 5 | 20 |
| 14 | Commercial Arithmetic III | Essential | 6 | 18 |
| 15 | Statistics II (Core), Statistics III (Essential) | Core and Essential | 4 | 23 |
| 16 | Probability III | Essential | 5 | 18 |
| 17 | Differentiation II | Core | 3 | 20 |
| 18 | Integration | Core | 6 | 23 |

In the chapters for both editions, shared material carries no component, and edition-only blocks use your `core` and `essential` components. Each STACK question names the curriculum outcome it serves, with labels such as "Core 1.3, Essential 1.2" for shared questions.

## 2. How it was made

The curriculum authority is the KICD Senior School designs for Grade 12 Core and Essential Mathematics (the March 2026 drafts you shared). They were used for reference only. Nothing from them is copied into the book: outcomes are paraphrased in our own words, and each section's lesson plan names the outcome it serves.

House style comes from your Grade 11 book. Before any writing, we studied its most complete chapters and wrote down its page anatomy, the use of teacher, learner and plan components, STACK conventions, figure style and the pattern of exercises and differentiation. The Grade 12 skeleton's planning notes (from your Book Structure Mapping sheet) shaped the content of each section.

The draft was written with AI assistance, and we want to be open about how. The work was done by Claude, Anthropic's AI model, running as a set of specialised agents under my direction. Each chapter went through the same stages:

1. Plan. A planning agent read the curriculum outcomes, the skeleton's notes and the source material, and wrote a section-by-section plan: lessons, examples, exercises, interactives, and the design of every STACK question (inputs, marking tree, feedback for each expected error, variants).
2. Author. An authoring agent wrote the PreTeXt and the STACK XML from the plan, and ran every check below before handing anything on.
3. Review. A separate agent, which had not written the chapter, checked it against the plan and the house rules, re-solved the mathematics, and looked for marking faults. Faults were fixed and re-checked before the chapter was approved.
4. Enrich. A second model (Claude Fable) went over every approved chapter again. It improved the feedback (each wrong answer it can recognise gets its own explanation, using the learner's numbers), and it hunted for answers that would be marked wrongly. It found and fixed a small number of real marking faults this way.
5. Whole-book passes: a cross-chapter audit for consistency of wording, notation, units and cross-references; a check against your house rules and Grade 11; then a final build of every target.

I made the editorial decisions: what to teach where, how marking should behave, which wording to standardise, and every question the agents raised that was a matter of judgement rather than fact. The agents did not decide these. Some decisions are yours to make, and they are listed in section 7.

This is a first draft. It has been checked by software and by independent review, as described below. It has not yet been tried in a classroom.

## 3. Sources and credit

About half the STACK questions (164) are original. The rest (169 adapted, 2 based on a source) adapt ideas from the School Mathematics Project (SMP) series, chiefly SMP AS/A2 Mathematics, SMP GCSE Mathematics and SMP Books 1 to 5 (Metric), with the written permission of the SMP licence holder, who confirmed that this use is covered and that the result may be published under your CC BY-NC licence. Adapted questions use new numbers, contexts and wording. Kenyan contexts, names and places are used throughout.

Each STACK question records where it came from, in its question description (visible in the Moodle question bank, not to learners):

- `concept`: what the question is about;
- `description`: the outcome and what the learner does;
- `edition`: Core, Essential, or both;
- `provenance`: "original to this project", or the exact source (book, chapter, section and item number) and one clause on how it was changed;
- `citation`: the book and curriculum design it belongs to.

The Maxima code of each question opens with a design note for whoever maintains it: what the question tests, how its variants are built, which wrong answers its response tree recognises, any rule a change must keep (for example "the correct option is never first"), and its source. These notes are visible in the Moodle question editor, never to learners. Each section file of the book starts with a similar comment listing the outcomes it covers and where its STACK questions are.

We keep a matching record for every worked example, exercise, activity, figure and data set in the text, and can send it on request. All data sets are invented unless the text says otherwise.

## 4. The STACK questions

The questions follow your Grade 11 conventions, with the refinements we proposed for Grade 9:

- Marking is all or nothing for each part. Each recognisable error gets its own feedback, which says what the learner did, uses their numbers and gives a method hint. Feedback does not open with "Correct" or "Incorrect", since STACK already shows that.
- Randomised questions have 10 deployed variants with distinct question notes. Fixed questions have one.
- Every question has test cases, and every variant passes all of its tests.
- Settings: `stackversion` 2026063000 (your newest exports), `questionsimplify` 1, decimal point, penalty 0.1, numerical inputs for single numbers, and `insertstars` 4 on algebraic inputs, so that `2x` is accepted and spaces are read as a learner means them (`60x + 110y <= 2000`, `3 (x+1)^2`). Inputs for sets and lists of numbers keep `insertstars` 0, so a space there never becomes a product.
- A short "how to type your answer" paragraph comes before each block of STACK exercises.

Validation was done on our own copy of the STACK API (release 2026062900, the nearest published image to your `stackversion`), so none of our development used your Cloud Run server. One smoke test was then run against your server: 9 questions, one from each of nine chapters, each rendered at a deployed variant and graded with its model answers. All 9 rendered and scored full marks (18 requests in total). The book's `<stack server>` lines name your server, as before, so the pages use it as they always have.

### Importing the questions into ecampus

Your question bank round-trips through ecampus with qbank_gitsync, so these questions must be imported into ecampus. If they are only merged into git, the next export from ecampus will not include them. `assets/stack/top/` is laid out for gitsync: import it as a new subtree in the Grade 12 course, then export as usual. The file names match the `source` paths in the PreTeXt, so the book finds each question after the round trip.

### Running without your server

To build or preview without using your server, run the STACK API locally with Docker. The release zip above contains a ready `docker-compose.yml` (STACK API 2026062900 with its Maxima service, on port 3083). Start it with `docker compose up -d`, then change the `server` attribute of the `<stack>` line in each `publication/*.ptx` to `http://localhost:3083` for the duration of the build. Change it back afterwards.

## 5. Building

Your workflows and `BUILDING.md` work unchanged. We built every target with PreTeXt 2.55.0, your pinned version:

- All six HTML targets (teachers', learners' and plans, for each edition) build with no errors. Every section page was loaded in a headless browser to check that its questions render, with no empty or broken questions. Core has 72 section pages and 265 question placements, Essential 48 and 160.
- Both teachers' PDFs build (`core-print`, `essential-print`).
- The two lesson-plan PDFs (`core-plans-print`, `essential-plans-print`) do not build. The house pattern `<solution component="lesson-plan">` inside a list item of an activity is not supported by PreTeXt 2.55's LaTeX conversion ("Exercise component mis-labeled"). Your Grade 9 to 11 repositories use the same pattern, and the plans HTML has a print button, so we have left this as it is.
- The JSXGraph interactives were tested in a headless browser.

## 6. Differences from Grade 11

These are deliberate. Each one can be changed if you prefer.

- Subsections. Many skeleton sections hold two or three lessons. We give each lesson its own subsection, with its exercises straight after it, so that learners practise each idea as soon as it is taught. Grade 11 has no subsections and one exercise block per section.
- Every chapter has an introduction. Grade 11 has one in 13 of its 17 chapters.
- In inequality, linear programming and loci graphs the unwanted region is shaded and the required region is left clear, as your Grade 12 planning notes ask, with a key on every graph. Your Grade 11 shades the wanted region; this is one of the questions for you.
- Uniform wording for typing instructions, units outside maths, "per cent", Ksh, and Title Case table titles, applied across the whole book.
- `insertstars` is on for algebraic inputs (Grade 11 mostly has it off), so `2x`, `2 x` and `60x + 110y <= 2000` are all accepted. With it off, ordinary spacing such as `60x + 110y` is rejected as invalid, which is hard on learners typing on phones. The validation line always shows the expression STACK understood before anything is marked.

## 7. Questions for you

There are five, listed in Part 1 of `EDITORIAL-QUESTIONS.md`. The most important is the missing learning outcome for Loci Involving Chords. Part 2 of that file records the conventions we chose where the designs leave room. You need not reply to it unless you want something changed.

Two of your skeleton's TODOs are left for you, because only you can fill them: the contributors list in the front matter, and the preface's mention of "animations".

The publication files' `<baseurl>` names `innodems.github.io`. We left it, so your deployment is correct once merged; the preview on our fork's Pages site carries your address in its metadata.

## 8. What we used

- PreTeXt 2.55.0 with TinyTeX for figures and PDFs.
- The STACK API (2026062900) and Maxima, in Docker.
- Claude (Anthropic): Opus for planning, writing and review, and Fable for the enrichment pass. The agents worked from the STACK Authoring Toolkit (github.com/BMJDavies/STACK-Authoring-Toolkit, GPL-3.0), adapted for PreTeXt.
- Headless Chrome for checking pages and interactives.
