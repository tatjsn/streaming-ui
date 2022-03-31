
class LolSuspense extends HTMLElement {
  constructor() {
    super();
    this.observer = new MutationObserver(this.mutationCallback.bind(this));
    this.config = { attributes: false, childList: true, subtree: false };
    this.attachShadow({ mode: 'open' });
    const p = document.createElement('p');
    p.innerHTML = 'Loading...';
    this.shadowRoot.append(p);
    const match = this.getAttribute('match');
    this.matcher = new RegExp(match);
  }

  mutationCallback(mutations, observer) {
    const m = mutations[0];
    const node = m.addedNodes ? m.addedNodes[0] : null;
    if (m.type === 'childList' &&
        node &&
        node.tagName === 'TEMPLATE' &&
        this.matcher.test(node.id)) {
      const tmpl = m.addedNodes[0];
      const target = this.shadowRoot;
      while (target.firstChild) {
        target.removeChild(target.firstChild);
      }
      target.appendChild(tmpl.content.cloneNode(true));
    }
  }

  connectedCallback() {
    this.observer.observe(document.body, this.config);
  }

  disconnectedCallback() {
    this.observer.disconnect();
  }
}

customElements.define('lol-suspense', LolSuspense);
