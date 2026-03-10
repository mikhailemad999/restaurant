import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api/client';

export default function OrdersView() {
    const queryClient = useQueryClient();
    const [statusFilter, setStatusFilter] = useState<string>('');

    const { data: orders, isLoading } = useQuery({
        queryKey: ['adminOrders', statusFilter],
        queryFn: async () => {
            const url = statusFilter ? `/orders/?status=${statusFilter}` : '/orders/';
            const { data } = await api.get(url);
            return data;
        },
    });

    const updateStatusMutation = useMutation({
        mutationFn: async ({ id, status }: { id: number, status: string }) => {
            const { data } = await api.patch(`/orders/${id}/`, { status });
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['adminOrders'] });
            queryClient.invalidateQueries({ queryKey: ['adminStats'] });
        }
    });

    if (isLoading) return <div className="text-gray-500">Loading Orders...</div>;

    const handleStatusChange = (id: number, newStatus: string) => {
        updateStatusMutation.mutate({ id, status: newStatus });
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-bold text-neutral-dark">Orders Management</h2>
                    <p className="text-sm text-gray-500 mt-1">Track and update customer orders</p>
                </div>

                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="border border-gray-200 rounded-lg px-4 py-2 bg-white text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none"
                >
                    <option value="">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="preparing">Preparing</option>
                    <option value="ready">Ready</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                </select>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-neutral-light text-neutral-dark text-sm font-semibold border-b">
                            <th className="p-4">ID</th>
                            <th className="p-4">Date</th>
                            <th className="p-4">Type</th>
                            <th className="p-4">Total</th>
                            <th className="p-4">Status</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {orders?.map((order: any) => (
                            <tr key={order.id} className="border-b hover:bg-gray-50/50 transition-colors">
                                <td className="p-4 font-mono text-gray-500">#{order.id}</td>
                                <td className="p-4 text-gray-600">{new Date(order.created_at).toLocaleString()}</td>
                                <td className="p-4">
                                    <span className="capitalize text-gray-700 bg-gray-100 px-2 py-1 rounded-md text-xs font-medium">
                                        {order.delivery_type.replace('_', ' ')}
                                    </span>
                                </td>
                                <td className="p-4 font-bold text-neutral-dark">${order.total_amount}</td>
                                <td className="p-4">
                                    <select
                                        value={order.status}
                                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                        disabled={updateStatusMutation.isPending}
                                        className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide border-0 cursor-pointer appearance-none transition-colors
                                            ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                order.status === 'preparing' ? 'bg-blue-100 text-blue-800' :
                                                    order.status === 'ready' ? 'bg-purple-100 text-purple-800' :
                                                        order.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                            'bg-red-100 text-red-800'}`}
                                        style={{ backgroundImage: 'none' }}
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="accepted">Accepted</option>
                                        <option value="preparing">Preparing</option>
                                        <option value="ready">Ready</option>
                                        <option value="completed">Completed</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                        {orders?.length === 0 && (
                            <tr>
                                <td colSpan={5} className="p-12 text-center text-gray-500">
                                    No orders found matching this filter.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
