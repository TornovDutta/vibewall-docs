import './App.css'
import Navbar from './componenet/Navbar'
import Footer from './componenet/Footer'
import AllRouter from "./router/AllRouter"

function App() {
  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-x-hidden bg-black font-sans text-slate-100">
      {/* Subtle background */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.15),_transparent_45%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(14,165,233,0.08),_transparent_40%)]" />

      <Navbar />

      <div className="relative z-10 flex-1">
        <AllRouter />
      </div>

      <Footer />
    </div>
  )
}

export default App