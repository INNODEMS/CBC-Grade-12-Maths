# Building and Viewing the Grade 12 Books

This repository produces **four books** from a single source:

|                  | Teacher's version   | Learner's version       |
|------------------|---------------------|-------------------------|
| **Core**         | `core-web`          | `core-student`          |
| **Essential**    | `essential-web`     | `essential-student`     |

Each name in the table is a PreTeXt **target**, defined in [`project.ptx`](project.ptx).

All commands below are run from the root of the repository (the folder containing `project.ptx`).

## Prerequisites

```bash
pip install -r requirements.txt
pretext --version     # should print 2.55.0 (or the version in requirements.txt)
```

Building PDFs also needs a LaTeX installation (see `.devcontainer/` for the packages used).

## All targets

| Target                   | Output | What it is                         |
|--------------------------|--------|------------------------------------|
| `core-web`               | HTML   | Core – Teacher's version           |
| `core-student`           | HTML   | Core – Learner's version           |
| `core-plans`             | HTML   | Core – Lesson plans                |
| `core-print`             | PDF    | Core – Teacher's version           |
| `core-plans-print`       | PDF    | Core – Lesson plans                |
| `core-latex`             | LaTeX  | Core – LaTeX source of the PDF     |
| `essential-web`          | HTML   | Essential – Teacher's version      |
| `essential-student`      | HTML   | Essential – Learner's version      |
| `essential-plans`        | HTML   | Essential – Lesson plans           |
| `essential-print`        | PDF    | Essential – Teacher's version      |
| `essential-plans-print`  | PDF    | Essential – Lesson plans           |
| `essential-latex`        | LaTeX  | Essential – LaTeX source of the PDF |

## Building

Build one target:

```bash
pretext build core-student
```

Build every target that is deployed to the website (all HTML versions):

```bash
pretext build --deploys
```

The result goes to `output/<target>/`, for example `output/core-student/` or `output/essential-print/main.pdf`.

### STACK questions

After building an HTML target, copy the custom STACK script into it, otherwise multi-line LaTeX in STACK questions will not render:

```bash
cp assets/pretext/js/pretext-stack/stackapicalls.js output/core-student/_static/pretext/js/pretext-stack/
```

(Replace `core-student` with the target you built.)

## Viewing

```bash
pretext view core-student
```

This starts a local web server and opens the book in your browser (by default at `http://localhost:8128`). Press `Ctrl+C` to stop the server.

Useful options:

| Command                                 | What it does                                   |
|-----------------------------------------|------------------------------------------------|
| `pretext view core-student -b`          | Build first, then view                         |
| `pretext view core-student --no-launch` | Start the server without opening a browser     |
| `pretext view core-student -p 8200`     | Use a different port                           |
| `pretext view --stop-server`            | Stop a server that is running in the background |

**Comparing versions side by side:** only one server is needed. With `pretext view core-web` running, run `pretext view core-student` in a second terminal. It reuses the same server and opens the learner's version in a new tab.

**Working on content:** keep `pretext view` running, edit your files, then rebuild (`pretext build core-web`) in another terminal and refresh the browser.

**PDFs** are not served. Open the file directly:

```bash
xdg-open output/core-print/main.pdf      # Linux
open output/core-print/main.pdf          # macOS
start output\core-print\main.pdf         # Windows
```

## How content ends up in each book

Content is filtered with the `component` attribute. Anything **without** a `component` appears in every book.

| Attribute                  | Appears in                                  |
|----------------------------|---------------------------------------------|
| `component="core"`         | Core books only                             |
| `component="essential"`    | Essential books only                        |
| `component="teacher"`      | Teacher's versions (and lesson plans) only  |
| `component="student"`      | Learner's versions only                     |
| `component="lesson-plan"`  | Lesson plans only                           |

For example, a section offered only in Essential Mathematics:

```xml
<section xml:id="sec-simple-interest" component="essential">
```

or a title that differs between the two books:

```xml
<title component="core">Statistics II</title>
<title component="essential">Statistics III</title>
```

An element is kept if **any** of its components is selected, so `component="core teacher"` means "core **or** teacher". To mean "core **and** teacher", nest one element inside another:

```xml
<remark component="teacher">
  <p component="core">Only teachers using the Core book see this.</p>
</remark>
```

Which components each book selects is set by the `<version include="..."/>` line in its file under [`publication/`](publication/).

## Where things are

- `source/content.ptx` – the list of parts and chapters (chapters marked `core` / `essential` are commented)
- `source/NN-chapter-name/` – one folder per chapter: `ch-*.ptx` plus one `sec-*.ptx` per section
- `source/lesson-plan-templates/` – shared lesson-plan blocks included by every section
- `publication/publication-<track>-<version>.ptx` – settings for each book
- The chapter and section structure follows the *Combined Mathematics* tab of the Grade 12 Book Structure Mapping sheet.
