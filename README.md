# Solid Start Cat Facts

A short demo app to try out Solid Start, which allows you to save and manage your
favorite cat facts provided from https://catfact.ninja 

Presented at [inovex Meetup Erlangen](https://www.meetup.com/inovex-meetup-erlangen/events/290422122/) ([Slides](var/20230124-inovex_meetup-solidjs_introduction.pdf))

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

Solid apps are built with _adapters_, which optimise your project for deployment to different environments.

By default, `npm run build` will generate a Node app that you can run with `npm start`. To use a different adapter, add it to the `devDependencies` in `package.json` and specify in your `vite.config.js`.
