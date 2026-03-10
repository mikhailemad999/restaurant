import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import api from '../api/client';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const setAuth = useAuthStore((state) => state.setAuth);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const { data } = await api.post('/auth/token/', { username, password });
            setAuth(data.access, data.user);
            navigate('/menu');
        } catch (err) {
            alert('Login failed. Please check your credentials.');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-16 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-3xl font-extrabold mb-8 text-center text-primary">Welcome Back</h2>
            <form onSubmit={handleLogin} className="space-y-5">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Username</label>
                    <input
                        type="text"
                        className="block w-full rounded-xl border-gray-300 shadow-sm p-3 border focus:ring-primary focus:border-primary"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        placeholder="Enter your username"
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
                    <input
                        type="password"
                        className="block w-full rounded-xl border-gray-300 shadow-sm p-3 border focus:ring-primary focus:border-primary"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="Enter your password"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-accent text-white py-3 px-4 rounded-xl hover:bg-teal-700 transition-colors font-bold text-lg mt-4"
                >
                    Sign In
                </button>
            </form>
        </div>
    );
}
