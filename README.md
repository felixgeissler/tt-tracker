# Pocketgolf

## Development (VSCode)

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
