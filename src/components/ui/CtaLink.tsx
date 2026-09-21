import type { ReactNode } from "react";
import { Link } from "react-router-dom";

interface CtaLinkProps {
  href: string;
  /** Render a plain `<a target="_blank">` instead of a client-side route Link
   * — required for links that aren't app routes (e.g. static files). */
  external?: boolean;
  className?: string;
  children: ReactNode;
}

/** Internal route link or external/file link, chosen by `external`. */
export default function CtaLink({ href, external, className, children }: CtaLinkProps) {
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
      </a>
    );
  }

  return (
    <Link to={href} className={className}>
      {children}
    </Link>
  );
}
