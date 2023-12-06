import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ManageProducts from "./components/manage-products/ManageProducts";
import BottomNavigationMenu from "./components/generic/bottom-navigation/BottomNavigation";
import CreateProduct from "./components/create-product/CreateProduct";
import TopMenu from "./components/generic/top-menu/TopMenu";
import CompletedProducts from "./components/completed-products/CompletedProducts";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <TopMenu />
        <div className="main-section">
          <Routes>
            <Route path="/" element={<ManageProducts key="pending" />}></Route>
            <Route
              path="/completed"
              element={<CompletedProducts isCompleted key="completed" />}
            ></Route>
            <Route path="/create" element={<CreateProduct />}></Route>
          </Routes>
        </div>
        <BottomNavigationMenu />
      </div>
    </BrowserRouter>
  );
}

export default App;
