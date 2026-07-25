import Button from "@/components/ui/Button";
import { categories, featuredArticles, issues, recentArticles } from "@/content/magazine";

/** Telos magazine page with a newspaper-style layout. */
export default function MagazinePage() {
  const [leadArticle, ...secondaryArticles] = featuredArticles;
  const currentIssue = issues[0];

  return (
    <>
      {/* Masthead */}
      <section className="relative overflow-hidden border-b-4 border-primary bg-background pb-12 pt-32">
        <div
          className="pointer-events-none absolute -right-20 top-1/4 h-64 w-64 rounded-full bg-primary/10 blur-3xl"
          aria-hidden
        />
        <div className="container relative text-center animate-fade-in stagger-1">
          <p className="mb-2 font-serif text-sm italic text-primary">Est. 2023</p>
          <h1 className="mb-2 font-serif text-7xl font-bold tracking-tight text-foreground md:text-8xl">
            TEL<span className="text-primary">OS</span>
          </h1>
          <div className="mx-auto mb-4 h-1 w-24 bg-primary" />
          <p className="text-lg font-light italic text-muted-foreground">
            A Student Journal of Ethical Inquiry
          </p>
        </div>
      </section>

      {/* Newspaper grid */}
      <section className="bg-background py-12">
        <div className="container grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {/* Lead story */}
            <article className="mb-12 animate-fade-in-up stagger-1">
              <div className="mb-6 border-b-2 border-primary pb-4">
                <span className="mb-3 block font-serif text-xs font-bold italic tracking-widest text-primary">
                  FEATURED
                </span>
                <h2 className="mb-4 font-serif text-5xl font-bold leading-tight text-foreground">
                  {leadArticle.title}
                </h2>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <span>By {leadArticle.author}</span>
                  <span>•</span>
                  <span>{leadArticle.date}</span>
                  <span>•</span>
                  <span className="font-medium text-primary">{leadArticle.category}</span>
                </div>
              </div>
              <p className="mb-6 text-lg leading-relaxed text-muted-foreground">
                {leadArticle.excerpt}
              </p>
              <Button size="sm">Read Full Article →</Button>
            </article>

            {/* Secondary features */}
            <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-2">
              {secondaryArticles.map((article, index) => (
                <article
                  key={article.title}
                  className={`border border-border p-6 transition-shadow hover:shadow-md animate-fade-in-up stagger-${index + 2}`}
                >
                  <span className="mb-2 block font-serif text-xs font-bold italic tracking-widest text-primary">
                    {article.category.toUpperCase()}
                  </span>
                  <h3 className="mb-3 font-serif text-xl font-bold leading-tight text-foreground">
                    {article.title}
                  </h3>
                  <p className="mb-4 text-sm text-muted-foreground">
                    By {article.author} • {article.date}
                  </p>
                  <p className="text-sm text-muted-foreground">{article.excerpt}</p>
                </article>
              ))}
            </div>

            {/* Latest list */}
            <div className="animate-fade-in-up stagger-4">
              <h3 className="mb-6 border-b border-border pb-4 font-serif text-2xl font-bold text-foreground">
                Latest Articles
              </h3>
              <div className="space-y-6">
                {recentArticles.map((article) => (
                  <article
                    key={article.title}
                    className="border-b border-border/50 pb-6 last:border-b-0"
                  >
                    <h4 className="mb-2 cursor-pointer font-serif text-lg font-bold text-foreground transition-colors hover:text-primary">
                      {article.title}
                    </h4>
                    <p className="mb-2 text-xs font-bold tracking-widest text-primary">
                      {article.category.toUpperCase()}
                    </p>
                    <p className="mb-3 text-sm text-muted-foreground">
                      By {article.author} • {article.date}
                    </p>
                    <p className="text-sm text-muted-foreground">{article.excerpt}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="mb-8 border border-border bg-secondary/30 p-6 animate-fade-in-up stagger-2">
              <h3 className="mb-4 border-b border-border pb-3 font-serif text-xl font-bold text-foreground">
                Current Issue
              </h3>
              <p className="mb-2 text-xs font-bold tracking-widest text-primary">
                {currentIssue.volume.toUpperCase()} • {currentIssue.issue.toUpperCase()}
              </p>
              <h4 className="mb-2 font-serif text-lg font-bold text-foreground">
                {currentIssue.title}
              </h4>
              <p className="mb-4 text-sm text-muted-foreground">{currentIssue.date}</p>
              <Button size="sm" className="w-full">
                Read Issue
              </Button>
            </div>

            <div className="mb-8 border border-border bg-secondary/30 p-6 animate-fade-in-up stagger-3">
              <h3 className="mb-4 border-b border-border pb-3 font-serif text-lg font-bold text-foreground">
                Categories
              </h3>
              <ul className="space-y-2">
                {categories.map((category) => (
                  <li
                    key={category}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {category}
                  </li>
                ))}
              </ul>
            </div>

            <div className="border border-primary bg-primary/10 p-6 animate-fade-in-up stagger-4">
              <h3 className="mb-3 font-serif text-lg font-bold text-foreground">
                Submit Your Work
              </h3>
              <p className="mb-4 text-sm text-muted-foreground">
                Have an article about ethics? We'd love to read it.
              </p>
              <Button size="sm" className="w-full">
                Submit Article
              </Button>
            </div>
          </aside>
        </div>
      </section>

      {/* Archive */}
      <section className="border-t border-border bg-secondary/20 py-16">
        <div className="container">
          <h2 className="mb-12 border-b-2 border-primary pb-4 font-serif text-4xl font-bold text-foreground">
            Archive
          </h2>

          <div className="space-y-6">
            {issues.map((issue, index) => (
              <article
                key={`${issue.volume}-${issue.issue}`}
                className={`border-l-4 border-primary py-4 pl-6 transition-colors hover:bg-secondary/20 animate-fade-in-up stagger-${index + 1}`}
              >
                <p className="mb-1 text-xs font-bold tracking-widest text-primary">
                  {issue.volume.toUpperCase()} • {issue.issue.toUpperCase()}
                </p>
                <h3 className="mb-1 font-serif text-xl font-bold text-foreground">{issue.title}</h3>
                <p className="mb-3 text-sm text-muted-foreground">{issue.date}</p>
                <p className="mb-3 text-sm text-muted-foreground">{issue.description}</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 border-primary px-4 text-xs text-primary hover:bg-primary hover:text-primary-foreground"
                >
                  View Issue
                </Button>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
