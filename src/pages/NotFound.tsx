import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
    const prevTitle = document.title;
    document.title = "Page introuvable (404) — Proxitec";

    const setMeta = (selector: string, attr: string, name: string, content: string) => {
      let el = document.head.querySelector(selector) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      const prev = el.getAttribute("content");
      el.setAttribute("content", content);
      return () => { if (prev !== null) el!.setAttribute("content", prev); };
    };

    const desc = "La page demandée est introuvable. Retournez à l'accueil Proxitec pour découvrir nos solutions IT et électroniques.";
    const restore = [
      setMeta('meta[name="description"]', "name", "description", desc),
      setMeta('meta[property="og:title"]', "property", "og:title", "Page introuvable — Proxitec"),
      setMeta('meta[property="og:description"]', "property", "og:description", desc),
      setMeta('meta[name="twitter:title"]', "name", "twitter:title", "Page introuvable — Proxitec"),
      setMeta('meta[name="twitter:description"]', "name", "twitter:description", desc),
    ];

    let canonical = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    const prevCanonical = canonical?.getAttribute("href") ?? null;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", `https://proxitec-solutions-gab.lovable.app${location.pathname}`);

    const robots = document.createElement("meta");
    robots.setAttribute("name", "robots");
    robots.setAttribute("content", "noindex");
    document.head.appendChild(robots);

    return () => {
      document.title = prevTitle;
      restore.forEach((r) => r());
      if (prevCanonical !== null) canonical!.setAttribute("href", prevCanonical);
      robots.remove();
    };
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-4 text-xl text-foreground">Oops! Page not found</p>
        <a href="/" className="text-primary underline hover:text-primary/90">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
