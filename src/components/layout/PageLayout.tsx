import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Navigation from "./Navigation";

/** Shared shell for every page: fixed navigation, routed content, footer. */
export default function PageLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-background selection:bg-primary/20 selection:text-primary">
      <Navigation />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
