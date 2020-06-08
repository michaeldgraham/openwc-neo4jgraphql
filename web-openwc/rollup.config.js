// use createSpaConfig for bundling a Single Page App
import { createSpaConfig } from '@open-wc/building-rollup';
import merge from 'deepmerge';
import fs from 'fs';
import path from 'path';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
// import typescript from 'rollup-plugin-typescript2';

const baseConfig = createSpaConfig({
  // See: https://open-wc.org/building/rollup-plugin-html.html#template
  html: {
    template() {
      return new Promise(resolve => {
        const indexPath = path.join(__dirname, 'index.html');
        fs.readFile(indexPath, 'utf-8', (err, data) => {
          resolve(data);
        });
      });
    },
  },

  // use the outputdir option to modify where files are output
  // outputDir: 'dist',

  // if you need to support older browsers, such as IE11, set the legacyBuild
  // option to generate an additional build just for this browser
  // legacyBuild: true,

  // development mode creates a non-minified build for debugging or development
  developmentMode: process.env.ROLLUP_WATCH === 'true',

  // set to true to inject the service worker registration into your index.html
  injectServiceWorker: false,
});

export default merge(baseConfig, {
  input: ['ts-out/src/openwc-neo4jgraphql.js'],
  output: [
    {
      dir: 'dist',
      format: 'es',
      sourcemap: true,
    },
    // {
    //   dir: 'dist/nomodule',
    //   format: 'system',
    //   sourcemap: true,
    // }
  ],
  plugins: [
    // typescript(),
    resolve({
      browser: true,
      jsnext: true,
      module: true,
    }),
    commonjs({
      extensions: ['.js', '.ts'],
    }),
  ],
});
