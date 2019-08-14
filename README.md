# Lucien

A minimal, cross-platform, graphical [Markdown](https://commonmark.org/) text editor

TODO: Screenshot

## Features

- [GitHub Flavored Markdown](https://github.github.com/gfm/)
- Smart punctuation with [SmartyPants](https://daringfireball.net/projects/smartypants/)
- Markdown/HTML split view with
  - Live-updating HTML
  - Synchronized scrolling
  - Automatic orientation (horizontal/vertical) based on window layout (portrait/landscape)
  - Programming language [syntax highlighting](https://github.com/highlightjs/highlight.js) in HTML
- Open file with dialog or drag & drop
- Export to standalone HTML file
- Way less than 1K [SLOC](https://en.wikipedia.org/wiki/Source_lines_of_code)

## Anti-features

Things that have been left out intentionally:

- No toolbar or buttons. Functionality is invoked from the app menu and through keyboard shortcuts.
- No [WYSIWYG](https://en.wikipedia.org/wiki/WYSIWYG) interface for Markdown text (buttons for bold, italics, etc)
- No syntax highlighting in Markdown text
- No file browsing
- No tags or categories. Files may be organized in filesystem directories instead.

## Installation

### Prerequisites

Lucien uses the [Hack](https://sourcefoundry.org/hack/) and [Open Sans](https://fonts.google.com/specimen/Open+Sans) fonts for the Markdown and HTML view respectively. To install them in Ubuntu/Debian Linux, issue:

```shell
sudo apt install fonts-open-sans fonts-hack-ttf
```

If the fonts are missing, it will fall back to the system's `monospace` and `sans-serif` declared fonts, but the visual end result may not be as good.

### With a built package

TODO

### Manual with Git

Clone the repository:

```shell
git clone https://github.com/agorf/lucien.git
```

Enter the checked-out directory:

```shell
cd lucien/
```

Install the dependencies:

```bash
yarn install # or npm install
```

Run the app:

```bash
yarn start # or npm start
```

## Use

TODO

### Desktop file

TODO

### From the command-line

Pass the path of a single Markdown document to the Lucien executable to edit it:

```shell
./Lucien /path/to/my-file.md
```

### Keyboard shortcuts

Pretty standard:

|Shortcut|Functionality|
|--------|-------------|
|`Ctrl+N`|new file|
|`Ctrl+O`|open file|
|`Ctrl+S`|save file|
|`Ctrl+Q`|quit app|
|`Ctrl+C`|copy selected text|
|`Ctrl+V`|paste selected text|
|`Ctrl+X`|cut selected text|
|`Ctrl+A`|select all text|
|`Ctrl+Z`|undo last change|
|`Ctrl+Shift+Z`|redo last change|

## Acknowledgements

Lucien was inspired by the following projects, resources and cats:

- [Notable](https://github.com/notable/notable) (has many of the "anti-features" and is no longer open-source)
- [Dillinger](https://dillinger.io/) (web-based)
- [Steve Kinney's "Electron Fundamentals v2" course](https://frontendmasters.com/courses/electron-v2/)
- Lucien, the cat

## License

[MIT](https://github.com/agorf/lucien/blob/master/LICENSE.txt)

## Author

[Angelos Orfanakos](https://angelos.dev)
