import { useState } from 'react';
import { useCartStore } from '../store/cartStore';
import api from '../api/client';
import { useNavigate } from 'react-router-dom';

export default function Cart() {
    const { items, removeItem, clearCart } = useCartStore();
    const [deliveryType, setDeliveryType] = useState('pickup');
    const [paymentMethod, setPaymentMethod] = useState('cash_on_delivery');
    const [address, setAddress] = useState('');
    const navigate = useNavigate();

    const total = items.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0);

    const handleCheckout = async () => {
        if (items.length === 0) return alert('Cart is empty');
        try {
            const payload = {
                delivery_type: deliveryType,
                payment_method: paymentMethod,
                delivery_address: deliveryType === 'delivery' ? address : '',
                items: items.map(i => ({ menu_item_id: i.menu_item_id, quantity: i.quantity }))
            };
            await api.post('/orders/', payload);
            clearCart();
            alert('Order placed successfully!');
            navigate('/menu');
        } catch (err) {
            alert('Failed to place order. Please make sure you are logged in or provide guest info.');
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow-sm border border-gray-100 mt-8">
            <h2 className="text-3xl font-bold mb-6 text-neutral-dark border-b pb-4">Your Cart</h2>
            {items.length === 0 ? (
                <p className="text-gray-500">Your cart is currently empty.</p>
            ) : (
                <div className="space-y-4">
                    {items.map(item => (
                        <div key={item.menu_item_id} className="flex justify-between items-center bg-neutral-light p-4 rounded-xl">
                            <div>
                                <h4 className="font-bold text-lg">{item.name}</h4>
                                <p className="text-sm text-gray-600">${item.price} x {item.quantity}</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="font-bold text-primary">${(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
                                <button onClick={() => removeItem(item.menu_item_id)} className="text-red-500 text-sm hover:underline">Remove</button>
                            </div>
                        </div>
                    ))}

                    <div className="border-t pt-4 mt-6">
                        <h3 className="text-2xl font-bold text-right mb-6">Total: ${total.toFixed(2)}</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-neutral-light p-6 rounded-xl mb-6">
                            <div>
                                <label className="block font-semibold mb-2">Delivery Type</label>
                                <select value={deliveryType} onChange={(e) => setDeliveryType(e.target.value)} className="w-full p-2 border rounded-lg focus:ring focus:ring-primary/50">
                                    <option value="pickup">Pickup</option>
                                    <option value="delivery">Delivery</option>
                                </select>
                            </div>
                            <div>
                                <label className="block font-semibold mb-2">Payment Method</label>
                                <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="w-full p-2 border rounded-lg focus:ring focus:ring-primary/50">
                                    <option value="cash_on_delivery">Cash on Delivery</option>
                                    <option value="card">Card</option>
                                </select>
                            </div>
                            {deliveryType === 'delivery' && (
                                <div className="md:col-span-2">
                                    <label className="block font-semibold mb-2">Delivery Address</label>
                                    <textarea value={address} onChange={(e) => setAddress(e.target.value)} className="w-full p-2 border rounded-lg focus:ring focus:ring-primary/50" rows={2}></textarea>
                                </div>
                            )}
                        </div>

                        <button onClick={handleCheckout} className="w-full bg-primary text-white font-bold text-lg py-4 rounded-xl shadow-md hover:bg-primary-dark transition-colors">
                            Place Order
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
