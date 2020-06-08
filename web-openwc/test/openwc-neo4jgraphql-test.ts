import { html, fixture, expect } from '@open-wc/testing';

import { OpenWCNeo4jGraphQL } from '../src/openwc-neo4jgraphql.js';
import '../src/openwc-neo4jgraphql.js';

describe('OpenWCNeo4jGraphQL', () => {
  let element: OpenWCNeo4jGraphQL;
  beforeEach(async () => {
    element = await fixture(html`
      <openwc-neo4jgraphql></openwc-neo4jgraphql>
    `);
  });

  it('renders a h1', () => {
    const h1 = element.shadowRoot!.querySelector('h1')!;
    expect(h1).to.exist;
    expect(h1.textContent).to.equal('My app');
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
