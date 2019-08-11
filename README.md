# Lucien

A minimal, cross-platform, graphical [Markdown][] text editor built with [Electron.js](https://commonmark.org/)

## Screenshot

TODO

## Features

- Support for [GitHub Flavored Markdown](https://github.github.com/gfm/) (including tables)
- Support for [SmartyPants](https://daringfireball.net/projects/smartypants/) smart punctuation
- Code syntax highlighting in HTML view
- Automatic synchronized scrolling between Markdown and HTML views
- Automatic vertical/horizontal view splitting when window layout is landscape/portrait
- Export as standalone HTML file

## Anti-features

Things that have been left out intentionally:

- No toolbar with buttons. Functionality is invoked from a menu and/or keyboard shortcuts.
- No syntax highlighting in Markdown view. Using a simple `<textarea>` instead to keep things simple and fast.
- No file browsing/picking from inside the app (only an open dialog)

## Installation

Lucien uses the [Hack](https://sourcefoundry.org/hack/) and [Open Sans](https://fonts.google.com/specimen/Open+Sans) fonts for the Markdown and HTML view respectively. To install them in Ubuntu/Debian Linux, issue:

```shell
sudo apt install fonts-open-sans fonts-hack-ttf
```

If the fonts are missing, it will fall back to the system's `monospace` and `sans-serif` declared fonts, but the visual end result may not be as good.

TODO

## Use

TODO

### Keyboard shortcuts

Are pretty standard:

- `Ctrl+N` --- new file
- `Ctrl+O` --- open file
- `Ctrl+S` --- save file
- `Ctrl+Q` --- quit app
- `Ctrl+C` --- copy selected text
- `Ctrl+V` --- paste selected text
- `Ctrl+X` --- cut selected text
- `Ctrl+A` --- select all text
- `Ctrl+Z` --- undo last change
- `Ctrl+Shift+Z` --- redo last change

### From the command-line

Pass the path of a single Markdown document to the Lucien executable to edit it:

```shell
TODO
```

## Acknowledgements

Lucien was inspired by the following projects and resources:

- [Notable](https://github.com/notable/notable)
- [Dillinger](https://dillinger.io/)
- [Steve Kinney's "Electron Fundamentals v2" course](https://frontendmasters.com/courses/electron-v2/)
- [Steve Kinney's "Electron in Action" book](https://www.manning.com/books/electron-in-action)
- Lucien, the cat

## License

[MIT](https://github.com/agorf/lucien/blob/master/LICENSE.txt)

## Author

[Angelos Orfanakos](https://angelos.dev)

[Markdown]: https://commonmark.org/