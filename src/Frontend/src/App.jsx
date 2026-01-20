import AppRoutes from "./routes/AppRoutes";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import FloatingSocialBar from "./components/FloatingSocialBar";
import ScrollToTopButton from "./components/ScrollToTopButton";

function App() {
    return (
        <>
            <Navbar />
            <FloatingSocialBar />
            <AppRoutes />
            <Footer />
            <ScrollToTopButton />
        </>
    );
}

export default App;

