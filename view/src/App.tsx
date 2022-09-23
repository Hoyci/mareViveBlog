import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import GlobalStyles from "./components/GlobalStyles";
import NavBar from "./components/NavBar"

function App() {
  return (
    <Router>
      <GlobalStyles />
      <NavBar />
      <Routes>
        {/* <Route path="/" element={<Home />} */}
      </Routes>
      {/* <Footer /> */}
      
    </Router>
  )
}

export default App
