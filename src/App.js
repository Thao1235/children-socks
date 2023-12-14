import { Route, Routes } from 'react-router-dom';
import './App.css';
import CartPage from './pages/CartPage';
import ShoePage from './pages/MainPage';
import OrderManagementPage from './pages/dashboard/OrderManagementPage';
import ProductManagementPage from './pages/dashboard/ProductManagementPage';

function App() {
  return (
    <>
      <Routes>
            <Route path='/' element={<ShoePage />} />
            <Route path='/main' element={<ShoePage />} />
            <Route path='/cart' element={<CartPage />} />
            <Route path='/dashboard/order-list' element={<OrderManagementPage />} />
            <Route path='/dashboard/product-list' element={<ProductManagementPage/>}/>  
      </Routes>
      </>
  );
}

export default App;
