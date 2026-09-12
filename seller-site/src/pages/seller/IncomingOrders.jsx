import {useState, useEffect} from 'react';
import api from '../../utils/api';

const STATUS_OPTIONS = ['pending', 'accepted', 'preparing', 'ready', 'completed', 'rejected', 'cancelled'];

function IncomingOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    async function fetchOrders() {
        try {
            const response = await api.get('/order/stand');
            setOrders(response.data.order);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchOrders();
    }, []);

    async function handleStatusChange(orderId, newStatus) {
        try{
            await api.patch(`/order/${orderId}/status`, { status: newStatus });
            fetchOrders();
        }catch(err){
            console.error(err);
        }
    }

    if (loading) {
        return <p>Loading...</p>;
    }

    return(
        <div>
            <h1>Incoming Orders</h1>
            {orders.length === 0 && <p>No orders yet.</p>}
            {orders.map((order) => (
                <div key={order.id}>
                    <p>Order #{order.id} — {order.status} — Rp{order.total_price}</p>
                    <select value={order.status} onChange={(e) => handleStatusChange(order.id, e.target.value)}>
                        {STATUS_OPTIONS.map((status) => (
                            <option key={status} value={status}>
                                {status}
                            </option>
                        ))}
                    </select>
                </div>
            ))}
        </div>
    )
}
export default IncomingOrders;