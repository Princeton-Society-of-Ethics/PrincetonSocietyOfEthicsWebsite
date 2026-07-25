import { Link } from "react-router-dom";
import Button from "@/components/ui/Button";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 pt-20 text-center">
      <p className="mb-2 font-serif text-sm italic text-primary">Error 404</p>
      <h1 className="mb-4 font-serif text-6xl font-bold text-foreground">
        Page Not <span className="text-primary">Found</span>
      </h1>
      <p className="mb-8 max-w-md leading-relaxed text-muted-foreground">
        Sorry, the page you are looking for doesn't exist. It may have been moved or deleted.
      </p>
      <Link to="/">
        <Button size="lg">Go Home</Button>
      </Link>
    </div>
  );
}
