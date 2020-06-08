import {
  // See: https://lit-element.polymer-project.org/
  LitElement,
  // Template literal tags
  css,
  html,
  // Decorators
  // See: https://lit-element.polymer-project.org/guide/decorators
  // API: https://lit-element.polymer-project.org/api/modules/_lit_element_.html#customelement
  customElement,
  eventOptions,
  // internalProperty,
  property,
  // query,
  // queryAll,
  // queryAssignedNodes,
  // queryAsync
} from 'lit-element';
// See: https://www.apollographql.com/docs/react/v3.0-beta/migrating/apollo-client-3-migration/#using-apollo-client-without-react
import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  gql,
} from '@apollo/client/core';
// See: https://www.npmjs.com/package/@material/mwc-button
import '@material/mwc-button';

import { openWcLogo } from './open-wc-logo.js';

@customElement('openwc-neo4jgraphql')
export class OpenWCNeo4jGraphQL extends LitElement {
  constructor() {
    super();
    const cache = new InMemoryCache();
    const link = new HttpLink({ uri: 'http://localhost:4001/graphql' });
    const client = new ApolloClient({ cache, link });
    this.client = client;
    // Can initialize component here
    (window as any).__APOLLO_CLIENT__ = client;
  }

  // UI properties
  @property({ type: String }) page = 'main';
  @property({ type: String }) title = 'Open-WC + Neo4j-GraphQL';

  // GraphQL client, operation, and data properties
  @property({ type: Object }) client = {};
  @property({ type: Object }) handleClickQuery = gql`
    query usersPaginateQuery(
      $first: Int
      $offset: Int
      $orderBy: [_UserOrdering]
      $filter: _UserFilter
    ) {
      User(first: $first, offset: $offset, orderBy: $orderBy, filter: $filter) {
        id: userId
        name
        avgStars
        numReviews
      }
    }
  `;
  @property({ type: Array }) User = [];
  @property({ type: String }) UserPrinted = '';

  @eventOptions({ once: true })
  handleClick() {
    const client = (window as any).__APOLLO_CLIENT__;
    client.query({ query: this.handleClickQuery }).then(data => {
      data = data.data.User;
      this.User = data;
      this.UserPrinted = JSON.stringify(data, null, 2);
    });
  }

  // CSS template
  // VS Code syntax highlighting extension: es6-string-css
  static styles = css`
    :host {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      font-size: calc(10px + 2vmin);
      color: #1a2b42;
      max-width: 960px;
      margin: 0 auto;
      text-align: center;
    }

    main {
      flex-grow: 1;
    }

    .logo > svg {
      margin-top: 36px;
      animation: app-logo-spin infinite 20s linear;
    }

    @keyframes app-logo-spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }

    .app-footer {
      font-size: calc(12px + 0.5vmin);
      align-items: center;
    }

    .app-footer a {
      margin-left: 5px;
    }
  `;

  // HTML template
  // VS Code syntax highlighting extension: lit-html
  render() {
    return html`
      <main>
        <div class="logo">${openWcLogo}</div>
        <h1 style="color: blue;">${this.title}</h1>
        <p>Edit <code>src/GraphStack.ts</code> and save to reload.</p>
        <a
          class="app-link"
          href="https://open-wc.org/developing/#code-examples"
          target="_blank"
          rel="noopener noreferrer"
        >
          Code examples
        </a>
        <p>
          <mwc-button
            label="Query"
            @click=${this.handleClick}
            raised
          ></mwc-button>
        </p>
      </main>
      <pre style="width: 100%; text-align: left; margin-left: 300px;">
${this.UserPrinted ? `Data: ${this.UserPrinted}` : ''}
      </pre
      >
      <p class="app-footer">
        🚽 Made with love by
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://github.com/open-wc"
          >open-wc</a
        >.
      </p>
    `;
  }
}
