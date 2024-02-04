# Pocketgolf

## Development (VSCode)

Setup Volta to manage NodeJS version

```bash
curl https://get.volta.sh | bash
```

NodeJS Corepack feature is used to manage the Yarn package manager version.
Volta doesn't currently integrate with Corepack, as it installs its own shims which prevent the Corepack ones from being applied. You will need to run the following two commands to force the integration:

```bash
npm install -g corepack
# Specifying an explicit install-directory makes corepack overwrite volta's yarn shims, which is what we want
corepack enable --install-directory ~/.volta/bin
```

Install dependencies:

```bash
yarn install
```

Setup Yarn SDK and `.vscode/settings.json` file with:

```bash
yarn dlx @yarnpkg/sdks vscode
```

Add these default VSCode settings to `.vscode/settings.json`:

```jsonc
{
  // ...
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.codeActionsOnSave": {
      "source.organizeImports": "explicit",
      "source.fixAll.eslint": "explicit",
    },
    "editor.formatOnSave": false,
  },
  "[html]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.codeActionsOnSave": {
      "source.fixAll.eslint": "explicit",
    },
    "editor.formatOnSave": true,
  },
}
```

Start VSCode tasks:

- _Frontend: Serve_
- _Backend: Serve_

## Debugging (VSCode)

To enable debugging create a `launch.json` file in `.vscode/` with the following content:

```jsonc
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Frontend (Chrome)",
      "type": "chrome",
      "request": "launch",
      "preLaunchTask": "Frontend: Serve",
      "url": "http://localhost:4200/",
      "webRoot": "${workspaceFolder}/packages/frontend",
    },
  ],
}
```
