import ShowItems from "./pages/ShowItems";
import Login from "./pages/Login";
import { BrowserRouter, Routes, Route, Router } from "react-router-dom"
import AdmPainel from "./pages/AdmPainel";

function App () {
  return (
        <BrowserRouter>
            <Routes>
                <Route index path="/" element={<ShowItems/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/admin" element={<AdmPainel/>}/>
            </Routes>
        </BrowserRouter>
  )
}

export default App