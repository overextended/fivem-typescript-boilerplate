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

Navigate to your new directory and execute the following command to install dependencies and choose your web framework.

```
pnpm boilerplate:setup
```

## Development

When working on your resource, use `pnpm watch` to rebuild any changes to your `client` and `server` directories.

For web development, use `pnpm web:dev` to use start vite's webserver and watch for changes.
