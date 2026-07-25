import { Link } from "react-router-dom";
import { footerNav, siteConfig } from "@/content/site";

export default function Footer() {
  return (
    <footer className="mt-auto bg-foreground py-16 text-background">
      <div className="container grid grid-cols-1 gap-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="mb-6 flex items-center gap-2">
            <img
              src="/images/logo.png"
              alt=""
              className="h-12 w-12 object-contain brightness-0 invert"
            />
            <div className="flex flex-col">
              <span className="font-serif text-lg font-semibold leading-none tracking-tight">
                Princeton Undergraduate
              </span>
              <span className="font-serif text-lg font-light leading-none tracking-wide opacity-80">
                Society of Ethics
              </span>
            </div>
          </div>
          <p className="max-w-md font-light leading-relaxed text-background/70">
            {siteConfig.description}
          </p>
        </div>

        {footerNav.map((column) => (
          <div key={column.heading}>
            <h3 className="mb-6 font-serif text-lg font-semibold text-primary">{column.heading}</h3>
            <ul className="space-y-4">
              {column.items.map((item) => (
                <li key={item.label}>
                  {item.external ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-background/70 transition-colors hover:text-primary"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link
                      to={item.href}
                      className="text-background/70 transition-colors hover:text-primary"
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="container mt-16 flex flex-col items-center justify-between border-t border-background/10 pt-8 text-sm text-background/50 md:flex-row">
        <p>
          &copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
        </p>
        <p className="mt-2 md:mt-0">Designed with intellectual gravity.</p>
      </div>
    </footer>
  );
}
