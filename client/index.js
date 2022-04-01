
class LolSuspense extends HTMLElement {
  constructor() {
    super();
    this.observer = new MutationObserver(this.mutationCallback.bind(this));
    this.config = { attributes: false, childList: true, subtree: false };
    const match = this.getAttribute('match');
    this.matcher = new RegExp(match);
  }

  mutationCallback(mutations, observer) {
    const [mutation] = mutations;
    const [node] = mutation.addedNodes || [];
    if (node && node.tagName === 'TEMPLATE' &&
        this.matcher.test(node.id)) {
      while (this.firstChild) {
        this.removeChild(this.firstChild);
      }
      this.appendChild(node.content.cloneNode(true));
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
