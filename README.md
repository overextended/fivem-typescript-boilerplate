# overextended/fivem-typescript-boilerplate

A boilerplate for creating FiveM resources with TypeScript.

## Getting Started

### Node.js v18+

Download and install any LTS release of [Node.js](https://nodejs.org/) from v18.

### pnpm

```
npm install -g pnpm
```

### Setup

Initialise your own repository by using one of the options below.

- Click on the **"Use this template"** button.
- [Download](https://github.com/project-error/fivem-typescript-boilerplate/archive/refs/heads/master.zip) the template directly.
- Use the **GitHub CLI**.
  - `gh repo create <name> --template=overextended/fivem-typescript-boilerplate`

Navigate to your new directory and execute the following command to install dependencies.

```
pnpm install
```

## Development

When working on your resource, use `pnpm watch` to rebuild any changes to your `client` and `server` directories.

For web development, use `pnpm web:dev` to use start vite's webserver and watch for changes.

## Layout

- [/dist/](dist)
  - Compiled project files.
- [/locales/](locales)
  - JSON files used for translations with [ox_lib](https://overextended.dev/ox_lib/Modules/Locale/Shared).
- [/scripts/](scripts)
  - Scripts used in the development process, but not part of the compiled resource.
- [/src/](src)
  - Project source code.
- [/static/](static)
  - Files to include with the resource that aren't compiled or loaded (e.g. config).
