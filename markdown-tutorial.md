# Markdown tutorial

- [Headers](#headers)
- [Emphasis](#emphasis)
- [Lists](#lists)
- [Links](#links)
- [Images](#images)
- [Code and syntax highlighting](#code-and-syntax-highlighting)
- [Blockquotes](#blockquotes)
- [Tables](#tables)
- [Horizontal rule](#horizontal-rule)
- [Line breaks](#line-breaks)
- [Inline HTML](#inline-html)
- [Additional resources](#additional-resources)

## Headings

```no-highlight
# H1
## H2
### H3
#### H4
##### H5
###### H6

H1 and H2 support underlining as well:

H1
==

H2
--
```

# H1
## H2
### H3
#### H4
##### H5
###### H6

H1 and H2 support underlining as well:

H1
==

H2
--

## Emphasis

```no-highlight
Emphasis, aka italics, with *asterisks* or _underscores_.

Strong emphasis, aka bold, with **asterisks** or __underscores__.

Combined emphasis with **asterisks and _underscores_**.

Strikethrough uses two tildes. ~~Scratch this.~~
```

Emphasis, aka italics, with *asterisks* or _underscores_.

Strong emphasis, aka bold, with **asterisks** or __underscores__.

Combined emphasis with **asterisks and _underscores_**.

Strikethrough uses two tildes. ~~Scratch this.~~

## Lists

(In this example, leading and trailing spaces are shown with middle dots: ⋅)

```no-highlight
1. First ordered list item
2. Another item
⋅⋅* Unordered sub-list.
1. Actual numbers don't matter, just that it's a number
⋅⋅1. Ordered sub-list
4. And another item.

⋅⋅⋅You can have properly indented paragraphs within list items. Notice the blank line above, and the leading spaces (at least one, but we'll use three here to also align the raw Markdown).

⋅⋅⋅To have a line break without a paragraph, you will need to use two trailing spaces.⋅⋅
⋅⋅⋅Note that this line is separate, but within the same paragraph.⋅⋅
⋅⋅⋅(This is contrary to the typical GFM line break behaviour, where trailing spaces are not required.)

* Unordered lists can use asterisks
- Or minuses
+ Or pluses
```

1. First ordered list item
2. Another item
  * Unordered sub-list.
1. Actual numbers don't matter, just that it's a number
  1. Ordered sub-list
4. And another item.

   You can have properly indented paragraphs within list items. Notice the blank line above, and the leading spaces (at least one, but we'll use three here to also align the raw Markdown).

   To have a line break without a paragraph, you will need to use two trailing spaces.  
   Note that this line is separate, but within the same paragraph.

* Unordered lists can use asterisks
- Or minuses
+ Or pluses

## Links

There are two ways to create links.

```no-highlight
[I'm an inline-style link](https://www.google.com)

[I'm an inline-style link with title](https://www.google.com "Google's Homepage")

[I'm a reference-style link][Arbitrary case-insensitive reference text]

[I'm a relative reference to a repository file](../blob/master/LICENSE)

[You can use numbers for reference-style link definitions][1]

Or leave it empty and use the [link text itself].

URLs and URLs in angle brackets will automatically get turned into links.
http://www.example.com or <http://www.example.com> and sometimes
example.com (but not on Github, for example).

Some text to show that the reference links can follow later.

[arbitrary case-insensitive reference text]: https://www.mozilla.org
[1]: http://slashdot.org
[link text itself]: http://www.reddit.com
```

[I'm an inline-style link](https://www.google.com)

[I'm an inline-style link with title](https://www.google.com "Google's Homepage")

[I'm a reference-style link][Arbitrary case-insensitive reference text]

[I'm a relative reference to a repository file](../blob/master/LICENSE)

[You can use numbers for reference-style link definitions][1]

Or leave it empty and use the [link text itself].

URLs and URLs in angle brackets will automatically get turned into links.
http://www.example.com or <http://www.example.com> and sometimes
example.com (but not on Github, for example).

Some text to show that the reference links can follow later.

[arbitrary case-insensitive reference text]: https://www.mozilla.org
[1]: http://slashdot.org
[link text itself]: http://www.reddit.com

## Images

```no-highlight
Here's an image (hover to see the title text):

Inline-style:
![thyme](https://raw.githubusercontent.com/agorf/thyme/master/thyme.jpg "Image of thyme")

Reference-style:
![thyme][]

[thyme]: https://raw.githubusercontent.com/agorf/thyme/master/thyme.jpg "Image of thyme"
```

Here's an image (hover to see the title text):

Inline-style:
![thyme](https://raw.githubusercontent.com/agorf/thyme/master/thyme.jpg "Image of thyme")

Reference-style:
![thyme][]

[thyme]: https://raw.githubusercontent.com/agorf/thyme/master/thyme.jpg "Image of thyme"

## Code and syntax highlighting

```no-highlight
Inline `code` has `back-ticks around` it.
```

Inline `code` has `back-ticks around` it.

Blocks of code are either fenced by lines with three back-ticks <code>```</code> (recommended), or are indented with four spaces.

<pre lang="no-highlight"><code>```javascript
// JavaScript
console.log([1, 2, 3, 4, 5].map(n => n*n).reduce((sum, n) => sum + n, 0));

class User
  constructor() {
    this.name = 'John';
  }
}
```</code></pre>

```javascript
// JavaScript
console.log([1, 2, 3, 4, 5].map(n => n*n).reduce((sum, n) => sum + n, 0));

class User
  constructor() {
    this.name = 'John';
  }
}
```

<pre lang="no-highlight"><code>```ruby
# Ruby
puts [1, 2, 3, 4, 5].map { |n| n*n }.reduce(:+)

class User
  def initialize
    @name = 'John'
  end
end
```</code></pre>

```ruby
# Ruby
puts [1, 2, 3, 4, 5].map { |n| n*n }.reduce(:+)

class User
  def initialize
    @name = 'John'
  end
end
```

<pre lang="no-highlight"><code>```
No language indicated, so no syntax highlighting.
But let's throw in a &lt;b&gt;tag&lt;/b&gt;.
```</code></pre>

```
No language indicated, so no syntax highlighting.
But let's throw in a <b>tag</b>.
```

## Blockquotes

```no-highlight
> Blockquotes are used to quote text.
> This line is part of the same quote.

Quote break.

> This is a very long line that will still be quoted properly when it wraps. Oh boy let's keep writing to make sure this is long enough to actually wrap for everyone. Oh, you can *put* **Markdown** into a blockquote.
```

> Blockquotes are used to quote text.
> This line is part of the same quote.

Quote break.

> This is a very long line that will still be quoted properly when it wraps. Oh boy let's keep writing to make sure this is long enough to actually wrap for everyone. Oh, you can *put* **Markdown** into a blockquote.

## Tables

```no-highlight
Colons can be used to align columns.

| Tables        | Are           | Cool  |
| ------------- |:-------------:| -----:|
| col 3 is      | right-aligned | $1600 |
| col 2 is      | centered      |   $12 |
| zebra stripes | are neat      |    $1 |

There must be at least 3 dashes separating each header cell.
The outer pipes (|) are optional, and you don't need to make the
raw Markdown line up prettily. You can also use inline Markdown.

Markdown | Less | Pretty
--- | --- | ---
*Still* | `renders` | **nicely**
1 | 2 | 3
```

Colons can be used to align columns.

| Tables        | Are           | Cool |
| ------------- |:-------------:| -----:|
| col 3 is      | right-aligned | $1600 |
| col 2 is      | centered      |   $12 |
| zebra stripes | are neat      |    $1 |

There must be at least 3 dashes separating each header cell. The outer pipes (|) are optional, and you don't need to make the raw Markdown line up prettily. You can also use inline Markdown.

Markdown | Less | Pretty
--- | --- | ---
*Still* | `renders` | **nicely**
1 | 2 | 3

## Horizontal rule

```
Three or more...

---

Hyphens

***

Asterisks

___

Underscores
```

Three or more...

---

Hyphens

***

Asterisks

___

Underscores

## Line breaks

(In this example, trailing spaces are shown with middle dots: ⋅)

```
Here's a line for us to start with.

This line is separated from the one above by two newlines, so it will be a *separate paragraph*.

This line is also a separate paragraph, but...⋅⋅
This line is only separated by a single newline, so it's a separate line in the *same paragraph*.

If you don't have to spaces at the end
then lines will join.
```

Here's a line for us to start with.

This line is separated from the one above by two newlines, so it will be a *separate paragraph*.

This line is also a separate paragraph, but...  
This line is only separated by a single newline, so it's a separate line in the *same paragraph*.

If you don't have to spaces at the end
then lines will join.

## Inline HTML

You can inline HTML in your Markdown:

```no-highlight
<dl>
  <dt>Definition list</dt>
  <dd>Is something people use sometimes.</dd>

  <dt>Mixing Markdown in HTML</dt>
  <dd>Does *not* work **very** well. Use HTML <em>tags</em>.</dd>
</dl>
```

<dl>
  <dt>Definition list</dt>
  <dd>Is something people use sometimes.</dd>

  <dt>Mixing Markdown in HTML</dt>
  <dd>Does *not* work **very** well. Use HTML <em>tags</em>.</dd>
</dl>

---

## Additional resources

* [Wikipedia article on Markdown](https://en.wikipedia.org/wiki/Markdown)
* [CommonMark Markdown tutorial](https://commonmark.org/help/tutorial/)
* [CommonMark Markdown reference](https://commonmark.org/help/)
* [Github Flavored Markdown (GFM) spec](http://github.github.com/github-flavored-markdown/)
* [John Gruber's original Markdown syntax](https://daringfireball.net/projects/markdown/syntax)

This document was based on [this GitHub wiki page](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet) licensed under the terms of [CC-BY](https://creativecommons.org/licenses/by/3.0/) and is itself licensed under the same terms.
