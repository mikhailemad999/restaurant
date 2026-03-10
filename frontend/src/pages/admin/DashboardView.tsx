import { useQuery } from '@tanstack/react-query';
import api from '../../api/client';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

export default function DashboardView() {
    const { data: stats, isLoading } = useQuery({
        queryKey: ['adminStats'],
        queryFn: async () => {
            const { data } = await api.get('/admin/stats/');
            return data;
        },
    });

    if (isLoading) return <div className="text-gray-500">Loading Dashboard Data...</div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h2 className="text-2xl font-bold text-neutral-dark">Overview</h2>
                <p className="text-sm text-gray-500 mt-1">Key metrics for your restaurant</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Total Historic Sales</h3>
                    <p className="text-4xl font-extrabold text-neutral-dark">${stats?.total_sales || 0}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Total Orders</h3>
                    <p className="text-4xl font-extrabold text-primary">{stats?.orders_count || 0}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Avg Order Value</h3>
                    <p className="text-4xl font-extrabold text-accent">${stats?.avg_order_value || 0}</p>
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-neutral-dark mb-6">Revenue - Last 7 Days</h3>
                {stats?.revenue_chart && stats.revenue_chart.length > 0 ? (
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats.revenue_chart} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280' }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280' }} tickFormatter={(value) => `$${value}`} />
                                <Tooltip
                                    cursor={{ fill: '#F3F4F6' }}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    formatter={(value: number) => [`$${value.toFixed(2)}`, 'Revenue']}
                                />
                                <Bar dataKey="revenue" fill="#EF8354" radius={[4, 4, 0, 0]} maxBarSize={50} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <div className="h-40 flex items-center justify-center text-gray-400">
                        No recent revenue data available.
                    </div>
                )}
            </div>
        </div>
    );
}
