import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { LayoutDashboard, ShoppingBag, UtensilsCrossed, Tags } from 'lucide-react';

export default function AdminLayout() {
    const { user, token } = useAuthStore();
    const location = useLocation();

    if (!token || !user?.is_staff) {
        return <Navigate to="/login" replace />;
    }

    const navItems = [
        { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/admin/orders', label: 'Orders', icon: ShoppingBag },
        { path: '/admin/menu', label: 'Menu Items', icon: UtensilsCrossed },
        { path: '/admin/categories', label: 'Categories', icon: Tags },
    ];

    return (
        <div className="flex h-[calc(100vh-136px)] bg-neutral-light overflow-hidden rounded-xl border border-gray-200 mt-4 mx-4">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-neutral-dark">Admin Panel</h2>
                    <p className="text-sm text-gray-500">Manage your restaurant</p>
                </div>
                <nav className="flex-1 overflow-y-auto py-4">
                    <ul className="space-y-1 px-3">
                        {navItems.map((item) => {
                            const isActive = location.pathname === item.path ||
                                (item.path !== '/admin' && location.pathname.startsWith(item.path));
                            const Icon = item.icon;

                            return (
                                <li key={item.path}>
                                    <Link
                                        to={item.path}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${isActive
                                                ? 'bg-primary/10 text-primary'
                                                : 'text-gray-600 hover:bg-gray-50 hover:text-neutral-dark'
                                            }`}
                                    >
                                        <Icon size={20} className={isActive ? 'text-primary' : 'text-gray-400'} />
                                        {item.label}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto bg-gray-50/50 p-8">
                <Outlet />
            </main>
        </div>
    );
}
