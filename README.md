# TT Tracker (Tischtennis Tracker)

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
  "eslint.nodePath": ".yarn/sdks",
  "prettier.prettierPath": ".yarn/sdks/prettier/index.cjs",
  "typescript.tsdk": ".yarn/sdks/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,
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

## Troubleshooting

### Yarn Plug'n'Play manifest forbids importing errors

If you get errors like these:

```
✘ [ERROR] Could not resolve "@angular/common"

    ../../.yarn/__virtual__/@angular-animations-virtual-7b2b041cfb/3/.yarn/berry/cache/@angular-animations-npm-17.3.3-9835185629-10c0.zip/node_modules/@angular/animations/fesm2022/animations.mjs:7:25:
      7 │ import { DOCUMENT } from '@angular/common';
        ╵                          ~~~~~~~~~~~~~~~~~

  The Yarn Plug'n'Play manifest forbids importing "@angular/common" here because it's not listed as
  a dependency of this package:

    ../../.pnp.cjs:441:31:
      441 │         "packageDependencies": [\
          ╵                                ~~

  You can mark the path "@angular/common" as external to exclude it from the bundle, which will
  remove this error and leave the unresolved path in the bundle.
```

Then it is likely due to third-party package missconfiguration (usually missing dependencies / peerDependencies). To fix this, link the packages in a corresponding _.yarnrc.yml_ file.

After that it is required the delete the Yarn PNP files with `rm .pnp.*` and run a `yarn install`.

If the issue still persists, make sure to run an install in the corresponding workspace, e.g. `yarn workspace frontend install`.
