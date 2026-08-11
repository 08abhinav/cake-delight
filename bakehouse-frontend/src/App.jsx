import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Signup from "./pages/Signup";
import VerifyOtp from "./pages/VerifyOtp";
import Signin from "./pages/Signin";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import AddCake from "./pages/AddCake";
import MyCakes from "./pages/MyCakes";
import Checkout from "./pages/Checkout";
import EditCake from "./pages/EditCake";

function App() {
  return (
    <>
      <Navbar />

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/orders" element={<Orders />} />


          <Route path="/add-cake" element={<AddCake />} />
          <Route path="/my-cakes" element={<MyCakes />} />
          <Route path="/edit-cake/:id" element={<EditCake />}/>
          <Route path="/checkout" element={<Checkout />}/>
        </Routes>
      </main>
    </>
  );
}

export default App;