import { lazy, Suspense } from "react";
import Navbar from "./components/Navbar";
import AppRoutes from "./routes/AppRoutes";

// ─── Non-critical UI — loaded after main paint ────────────────────────────
const Footer = lazy(() => import("./components/Footer"));
const FloatingSocialBar = lazy(() => import("./components/FloatingSocialBar"));
const ScrollToTopButton = lazy(() => import("./components/ScrollToTopButton"));

function App() {
    return (
        <>
            {/* Navbar stays eager — it's above the fold on every page */}
            <Navbar />

            {/* Page content */}
            <AppRoutes />

            {/* Deferred UI — user doesn't see these until after first paint */}
            <Suspense fallback={null}>
                <FloatingSocialBar />
            </Suspense>

            <Suspense fallback={null}>
                <ScrollToTopButton />
            </Suspense>

            <Suspense fallback={null}>
                <Footer />
            </Suspense>
        </>
    );
}

export default App;