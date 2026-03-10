import { Routes, Route, Link } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { useCartStore, type CartItem } from './store/cartStore';
import Menu from './pages/Menu';
import Login from './pages/Login';
import Cart from './pages/Cart';
import AdminLayout from './pages/admin/AdminLayout';
import DashboardView from './pages/admin/DashboardView';
import OrdersView from './pages/admin/OrdersView';
import MenuItemsView from './pages/admin/MenuItemsView';
import CategoriesView from './pages/admin/CategoriesView';

function App() {
  const { token, logout, user } = useAuthStore();
  const cartItems = useCartStore((state) => state.items);
  const cartCount = cartItems.reduce((acc, item: CartItem) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col font-sans bg-neutral-light">
      <header className="bg-primary text-white p-4 shadow-md flex justify-between items-center">
        <Link to="/" className="text-2xl font-extrabold tracking-tight">
          Restaurant Web App
        </Link>
        <nav className="flex gap-4 items-center font-semibold">
          <Link to="/menu" className="hover:text-primary-dark transition-colors">Menu</Link>
          <Link to="/cart" className="hover:text-primary-dark transition-colors flex items-center gap-1">
            Cart <span className="bg-white text-primary text-xs rounded-full px-2 py-0.5">{cartCount}</span>
          </Link>
          {token && user?.is_staff && (
            <Link to="/admin" className="hover:text-primary-dark transition-colors text-amber-500">Admin</Link>
          )}
          {token ? (
            <button onClick={logout} className="hover:text-primary-dark transition-colors">Logout</button>
          ) : (
            <Link to="/login" className="hover:text-primary-dark transition-colors">Login</Link>
          )}
        </nav>
      </header>
      <main className="flex-1 p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<DashboardView />} />
            <Route path="orders" element={<OrdersView />} />
            <Route path="menu" element={<MenuItemsView />} />
            <Route path="categories" element={<CategoriesView />} />
          </Route>
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <footer className="bg-neutral-dark text-white p-4 text-center">
        &copy; 2026 Restaurant Web App
      </footer>
    </div>
  );
}

function Home() {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <h1 className="text-4xl font-extrabold mb-6 text-neutral-dark">Welcome to Our Restaurant</h1>
      <p className="text-lg text-gray-600 mb-8 max-w-2xl">
        Experience the best food in town. Browse our menu and place your order online for quick pickup or delivery.
      </p>
      <Link to="/menu" className="bg-primary text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-primary-dark transition text-lg">
        View Menu
      </Link>
    </div>
  );
}

export default App;
