/* eslint-env node */
module.exports = {
  rootDir: 'dist/',
  appIndex: 'index.html',
  port: 8000,
  // http2: true,
  nodeResolve: true,
  watch: true,
  sourceMaps: true,
  open: true,
  moduleDirs: ['node_modules'],
  responseTransformers: [
    function importJSON({ url, body }) {
      if (url.endsWith('.json')) {
        return {
          contentType: 'application/javascript',
          body: `export default ${body}`,
        };
      }
    },

    function importGraphQL({ url, body }) {
      if (url.match(/\.g(raph)?ql$/)) {
        return {
          contentType: 'application/javascript',
          body: `import gql from 'graphql-tag';export default gql\`${body}\``,
        };
      }
    },
  ],
};
