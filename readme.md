# `tradingview/function-url-local-root`

Allow or disallow URLs from local root.

## Options:

`"always"`, `"never"`

## `always`

```css
/* Okay: */
background: url(/foo/bar);
background-image: url('/foo/bar');
content: url("/foo/bar");

/* Error: */
background: url(foo/bar);
background-image: url('foo/bar');
content: url("foo/bar");

```

## `never`

```css
/* Okay: */
background: url(foo/bar);
background-image: url('foo/bar');
content: url("foo/bar");


/* Never: */
background: url(/foo/bar);
background-image: url('/foo/bar');
content: url("/foo/bar");
```
