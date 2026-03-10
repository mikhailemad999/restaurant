import { useQuery } from '@tanstack/react-query';
import { useCartStore } from '../store/cartStore';
import api from '../api/client';

export default function Menu() {
    const addItem = useCartStore((state) => state.addItem);

    const { data: menuItems, isLoading } = useQuery({
        queryKey: ['menu'],
        queryFn: async () => {
            const { data } = await api.get('/menu/');
            return data;
        },
    });

    if (isLoading) return <div className="p-8 text-center text-gray-500">Loading menu...</div>;

    return (
        <div>
            <h2 className="text-3xl font-bold mb-8 text-center text-neutral-dark">Our Menu</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {menuItems?.map((item: any) => (
                    <div key={item.id} className="border rounded-2xl p-5 shadow-sm bg-white hover:shadow-md transition-shadow">
                        {item.image && (
                            <img src={item.image} alt={item.name} className="w-full h-48 object-cover mb-4 rounded-xl" />
                        )}
                        <h3 className="text-xl font-bold text-neutral-dark mb-1">{item.name}</h3>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{item.description}</p>
                        <div className="flex justify-between items-center mt-auto border-t pt-4">
                            <span className="font-bold text-xl text-primary">${item.price}</span>
                            <button
                                onClick={() => addItem({ menu_item_id: item.id, name: item.name, price: item.price })}
                                className="bg-primary text-white py-2 px-5 rounded-lg hover:bg-primary-dark transition-colors font-semibold">
                                Add
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
