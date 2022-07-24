# Static Site Generator

This is a static site generator using Node.js and taking advantage of the NPM module ecosystem. It is being designed as a sort of minimal 'framework' where you can enable just the plugins that are needed in your project. It will support multiple templating and data languages. To enable a language you'll need only install the module to your project and start using it.

## What it does

Not a lot so far:

- A `dist` directory is created in the working directory, the website is built here.
- Files are recursively hardlinked from `public`.

## Installation

```sh
npm i github:aidlran/static-site-generator
```

## Usage

```sh
static-site-generator build [OPTIONS] DIR
```

By default, if no directory is specified, it will use the current working directory (i.e.: `./`). 
