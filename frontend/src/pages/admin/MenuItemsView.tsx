import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api/client';
import { Plus, Edit2, Trash2 } from 'lucide-react';

export default function MenuItemsView() {
    const queryClient = useQueryClient();
    const [isAdding, setIsAdding] = useState(false);

    // simplified state for demonstration
    const [formData, setFormData] = useState({ name: '', description: '', price: '', category_id: '', prep_time_minutes: 15 });

    const { data: menuItems, isLoading } = useQuery({
        queryKey: ['adminMenu'],
        queryFn: async () => {
            const { data } = await api.get('/menu/');
            return data;
        },
    });

    const { data: categories } = useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const { data } = await api.get('/categories/');
            return data?.results || data;
        },
    });

    const createMutation = useMutation({
        mutationFn: async (newItem: any) => {
            const { data } = await api.post('/menu/', newItem);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['adminMenu'] });
            queryClient.invalidateQueries({ queryKey: ['menu'] }); // public menu
            setIsAdding(false);
            setFormData({ name: '', description: '', price: '', category_id: '', prep_time_minutes: 15 });
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            await api.delete(`/menu/${id}/`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['adminMenu'] });
            queryClient.invalidateQueries({ queryKey: ['menu'] });
        }
    });

    if (isLoading) return <div className="text-gray-500">Loading Menu Items...</div>;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createMutation.mutate(formData);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-neutral-dark">Menu Items</h2>
                    <p className="text-sm text-gray-500 mt-1">Manage what displays on your public menu</p>
                </div>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors font-medium text-sm"
                >
                    <Plus size={16} />
                    {isAdding ? 'Cancel' : 'Add Item'}
                </button>
            </div>

            {isAdding && (
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
                    <h3 className="font-bold text-lg mb-4">Create New Item</h3>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            required placeholder="Item Name"
                            className="border p-2 rounded-lg"
                            value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                        />
                        <input
                            required type="number" step="0.01" placeholder="Price ($)"
                            className="border p-2 rounded-lg"
                            value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })}
                        />
                        <select
                            required className="border p-2 rounded-lg"
                            value={formData.category_id} onChange={e => setFormData({ ...formData, category_id: e.target.value })}
                        >
                            <option value="">Select Category</option>
                            {categories?.map((cat: any) => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                        <input
                            required type="number" placeholder="Prep Time (mins)"
                            className="border p-2 rounded-lg"
                            value={formData.prep_time_minutes} onChange={e => setFormData({ ...formData, prep_time_minutes: parseInt(e.target.value) })}
                        />
                        <textarea
                            required placeholder="Description" rows={3}
                            className="border p-2 rounded-lg md:col-span-2"
                            value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}
                        />
                        <div className="md:col-span-2 flex justify-end">
                            <button disabled={createMutation.isPending} className="bg-accent text-white px-6 py-2 rounded-lg font-medium">
                                Save Item
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {menuItems?.map((item: any) => (
                    <div key={item.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col group">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-lg text-neutral-dark">{item.name}</h3>
                            <span className="font-bold text-primary">${item.price}</span>
                        </div>
                        <span className="text-xs font-semibold text-accent bg-accent/10 w-fit px-2 py-1 rounded-md mb-2">
                            {item.category?.name}
                        </span>
                        <p className="text-sm text-gray-600 line-clamp-2 mb-4 flex-1">{item.description}</p>

                        <div className="flex justify-end gap-2 pt-4 border-t border-gray-50 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-2 text-gray-400 hover:text-accent rounded-lg hover:bg-gray-50">
                                <Edit2 size={16} />
                            </button>
                            <button
                                onClick={() => { if (confirm('Are you sure?')) deleteMutation.mutate(item.id) }}
                                className="p-2 text-gray-400 hover:text-danger rounded-lg hover:bg-gray-50"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
