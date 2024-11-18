A simple static site generator (site build) that outputs html files from markdown (md) files.

### Sample

```
# Hello World

This is a paragraph in **bold** and *italic*.

- Item 1
- Item 2
- Item 3

[Link to Google](https://www.google.com)
```

### Generate

```
➜  git:(master) node md-to-hmtl.js
{"level":"info","message":"HTML file written: /src/blog/dist/sample.html","timestamp":"2024-11-18T04:11:28.456Z"}
{"level":"info","message":"Processed 1 markdown files","timestamp":"2024-11-18T04:11:28.458Z"}
```

### Output

```
<h1>Hello World</h1>
<p>This is a paragraph in <strong>bold</strong> and <em>italic</em>.</p>
<ul>
<li>Item 1</li>
<li>Item 2</li>
<li>Item 3</li>
</ul>
<p><a href="https://www.google.com">Link to Google</a></p>

```
