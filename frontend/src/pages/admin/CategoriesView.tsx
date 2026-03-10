import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api/client';
import { Plus, Edit2, Trash2 } from 'lucide-react';

export default function CategoriesView() {
    const queryClient = useQueryClient();
    const [isAdding, setIsAdding] = useState(false);
    const [formData, setFormData] = useState({ name: '', slug: '', sort_order: 0 });

    const { data: categories, isLoading } = useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const { data } = await api.get('/categories/');
            return data?.results || data;
        },
    });

    const createMutation = useMutation({
        mutationFn: async (newCat: any) => {
            const { data } = await api.post('/categories/', newCat);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            setIsAdding(false);
            setFormData({ name: '', slug: '', sort_order: 0 });
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            await api.delete(`/categories/${id}/`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
        }
    });

    if (isLoading) return <div className="text-gray-500">Loading Categories...</div>;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createMutation.mutate(formData);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-neutral-dark">Categories</h2>
                    <p className="text-sm text-gray-500 mt-1">Manage menu sections and classifications</p>
                </div>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors font-medium text-sm"
                >
                    <Plus size={16} />
                    {isAdding ? 'Cancel' : 'Add Category'}
                </button>
            </div>

            {isAdding && (
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
                    <h3 className="font-bold text-lg mb-4">Create New Category</h3>
                    <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 items-end">
                        <div className="flex-1 w-full">
                            <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Name</label>
                            <input
                                required placeholder="e.g. Appetizers"
                                className="border border-gray-200 p-2.5 rounded-lg w-full focus:ring-2 focus:ring-primary/20 outline-none"
                                value={formData.name} onChange={e => {
                                    setFormData({
                                        ...formData,
                                        name: e.target.value,
                                        slug: e.target.value.toLowerCase().replace(/\s+/g, '-')
                                    })
                                }}
                            />
                        </div>
                        <div className="flex-1 w-full">
                            <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Slug</label>
                            <input
                                required placeholder="appetizers"
                                className="border border-gray-200 p-2.5 rounded-lg w-full bg-gray-50 focus:ring-2 focus:ring-primary/20 outline-none"
                                value={formData.slug} onChange={e => setFormData({ ...formData, slug: e.target.value })}
                            />
                        </div>
                        <div className="w-full md:w-32">
                            <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Sort Order</label>
                            <input
                                type="number" required
                                className="border border-gray-200 p-2.5 rounded-lg w-full focus:ring-2 focus:ring-primary/20 outline-none"
                                value={formData.sort_order} onChange={e => setFormData({ ...formData, sort_order: parseInt(e.target.value) })}
                            />
                        </div>
                        <button disabled={createMutation.isPending} className="bg-accent text-white px-6 py-2.5 rounded-lg font-medium w-full md:w-auto h-fit">
                            Save
                        </button>
                    </form>
                </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-neutral-light text-neutral-dark text-sm font-semibold border-b">
                            <th className="p-4 w-16 text-center">Order</th>
                            <th className="p-4">Name</th>
                            <th className="p-4 text-gray-500 font-normal">Slug</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {categories?.map((cat: any) => (
                            <tr key={cat.id} className="border-b hover:bg-gray-50/50 transition-colors group">
                                <td className="p-4 text-center font-mono text-gray-400">{cat.sort_order}</td>
                                <td className="p-4 font-bold text-neutral-dark">{cat.name}</td>
                                <td className="p-4 text-gray-500 font-mono text-xs">{cat.slug}</td>
                                <td className="p-4 text-right">
                                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-1.5 text-gray-400 hover:text-accent rounded-lg hover:bg-gray-100">
                                            <Edit2 size={16} />
                                        </button>
                                        <button
                                            onClick={() => { if (confirm('Are you sure?')) deleteMutation.mutate(cat.id) }}
                                            className="p-1.5 text-gray-400 hover:text-danger rounded-lg hover:bg-gray-100"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
