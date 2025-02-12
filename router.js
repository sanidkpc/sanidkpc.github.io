class Router {
  constructor() {
    this.routes = {};
    this.contentElement = document.getElementById("content");
    this.extractRoutes();
    document.addEventListener("click", this.handleLinkClick.bind(this));
    window.onpopstate = this.handlePopState.bind(this);
    this.loadInitialRoute();
  }

  extractRoutes() {
    const links = document.querySelectorAll("a[href^='/']");
    links.forEach((link) => {
      const path = link.getAttribute("href");
      const templateId = link.getAttribute("data-template-id");
      if (path && templateId) {
        this.routes[path] = templateId;
      }
    });
  }
  loadRoute(path) {
    const templateId = this.routes[path];

    if (templateId) {
      const template = document.getElementById(templateId);
      if (template) {
        this.contentElement.innerHTML = template.innerHTML;
      } else {
        console.error(`Template with ID "${templateId}" not found.`);
        this.loadRoute("/");
      }
    } else {
      console.error(`Route "${path}" not found.`);
      this.loadRoute("/");
    }
  }

  handleLinkClick(e) {
    const link = e.target.closest("a[href^='/']");
    if (!link) return;

    e.preventDefault();
    const path = link.getAttribute("href");
    history.pushState({}, "", path);
    this.loadRoute(path);
  }

  handlePopState() {
    this.loadRoute(location.pathname);
  }

  loadInitialRoute() {
    const urlParams = new URLSearchParams(window.location.search);
    const routeParam = urlParams.get("route");

    if (routeParam) {
      history.replaceState({}, "", routeParam);
      this.loadRoute(routeParam);
    } else {
      this.loadRoute(location.pathname);
    }
  }
}
