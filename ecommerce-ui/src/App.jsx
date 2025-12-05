// src/App.jsx
import Navbar from "./components/layout/Navbar.jsx";
import Footer from "./components/layout/Footer.jsx";
import AppRouter from "./routes/AppRouter.jsx";
import "./App.css"; // make sure this exists

export default function App() {
  return (
    <div className="app-root">
      <Navbar />
      <main className="app-main">
        <AppRouter />
      </main>
      <Footer />
    </div>
  );
}
