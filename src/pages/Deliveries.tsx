import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Search, AlertCircle, Eye, User, Truck, X } from 'lucide-react';
import { format } from 'date-fns';
import api from '../services/api';

interface Delivery {
    id: string;
    quote_id: string;
    customer_name: string;
    customer_phone: string;
    delivery_address: string;
    city: string;
    state: string;
    status: string;
    driver_id: string | null;
    tracking_code: string;
    created_at: string;
    updated_at: string;
}

interface Driver {
    id: string;
    name: string;
    phone: string;
    vehicle_type: string;
    is_active: boolean;
}

const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    scheduled: 'bg-blue-100 text-blue-800',
    assigned: 'bg-indigo-100 text-indigo-800',
    out_for_delivery: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
    returned: 'bg-gray-100 text-gray-800',
    cancelled: 'bg-red-100 text-red-800',
};

const Deliveries: React.FC = () => {
    const navigate = useNavigate();
    const [deliveries, setDeliveries] = useState<Delivery[]>([]);
    const [drivers, setDrivers] = useState<Driver[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState<string>('');
    const [filterDriver, setFilterDriver] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState('');
    
    const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    
    // Status update state
    const [newStatus, setNewStatus] = useState('');
    const [statusNotes, setStatusNotes] = useState('');
    
    // Assign driver state
    const [selectedDriverId, setSelectedDriverId] = useState('');

    const fetchDeliveries = async () => {
        try {
            setLoading(true);
            let url = '/api/v1/deliveries';
            const params = new URLSearchParams();
            if (filterStatus) params.append('status', filterStatus);
            if (filterDriver) params.append('driver_id', filterDriver);
            
            if (params.toString()) {
                url += `?${params.toString()}`;
            }

            const response = await api.get(url);
            if (response.data && response.data.data) {
                const mappedDeliveries = response.data.data.map((item: any) => ({
                    id: item.ID || item.id,
                    quote_id: item.QuoteID || item.quote_id,
                    customer_name: item.CustomerName || item.customer_name,
                    customer_phone: item.CustomerPhone || item.customer_phone,
                    delivery_address: item.DeliveryAddress || item.delivery_address,
                    city: item.City || item.city,
                    state: item.State || item.state,
                    status: (item.Status || item.status || 'pending').toLowerCase(),
                    driver_id: item.Driver?.ID || item.DriverID || item.driver_id || null,
                    tracking_code: item.TrackingCode || item.tracking_code,
                    created_at: item.CreatedAt || item.created_at,
                    updated_at: item.UpdatedAt || item.updated_at
                }));
                setDeliveries(mappedDeliveries);
            }
        } catch (error) {
            console.error('Error fetching deliveries:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchDrivers = async () => {
        try {
            const response = await api.get('/api/v1/drivers');
            if (response.data && response.data.data) {
                const mappedDrivers = response.data.data.map((item: any) => ({
                    id: item.ID || item.id,
                    name: item.Name || item.name,
                    phone: item.Phone || item.phone,
                    vehicle_type: item.VehicleType || item.vehicle_type,
                    is_active: item.IsActive !== undefined ? item.IsActive : item.is_active
                }));
                setDrivers(mappedDrivers);
            }
        } catch (error) {
            console.error('Error fetching drivers:', error);
        }
    };

    useEffect(() => {
        fetchDeliveries();
        fetchDrivers();
    }, [filterStatus, filterDriver]);

    const handleUpdateStatus = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedDelivery || !newStatus) return;

        try {
            await api.patch(`/api/v1/deliveries/${selectedDelivery.id}/status`, {
                status: newStatus,
                notes: statusNotes
            });
            setIsStatusModalOpen(false);
            setNewStatus('');
            setStatusNotes('');
            fetchDeliveries();
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Failed to update status');
        }
    };

    const handleAssignDriver = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedDelivery || !selectedDriverId) return;

        try {
            await api.post(`/api/v1/deliveries/${selectedDelivery.id}/assign-driver`, {
                driver_id: selectedDriverId
            });
            setIsAssignModalOpen(false);
            setSelectedDriverId('');
            fetchDeliveries();
        } catch (error) {
            console.error('Error assigning driver:', error);
            alert('Failed to assign driver');
        }
    };

    const filteredDeliveries = deliveries.filter(d => 
        (d.tracking_code?.toLowerCase().includes(searchQuery.toLowerCase()) || '') ||
        (d.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) || '') ||
        (d.delivery_address?.toLowerCase().includes(searchQuery.toLowerCase()) || '')
    );

    const getDriverName = (id: string | null) => {
        if (!id) return 'Unassigned';
        const driver = drivers.find(d => d.id === id);
        return driver ? driver.name : 'Unknown Driver';
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Delivery Management</h1>
                    <p className="text-gray-600 mt-1">Track and manage all shipments</p>
                </div>
                <button 
                    onClick={() => navigate('/dashboard/calculator')}
                    className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                >
                    <Package size={20} />
                    <span>New Delivery</span>
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search by tracking code, customer, or address..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    />
                </div>
                <div className="flex gap-4">
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-white"
                    >
                        <option value="">All Statuses</option>
                        <option value="pending">Pending</option>
                        <option value="scheduled">Scheduled</option>
                        <option value="assigned">Assigned</option>
                        <option value="out_for_delivery">Out for Delivery</option>
                        <option value="delivered">Delivered</option>
                        <option value="failed">Failed</option>
                        <option value="returned">Returned</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                    <select
                        value={filterDriver}
                        onChange={(e) => setFilterDriver(e.target.value)}
                        className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-white min-w-[150px]"
                    >
                        <option value="">All Drivers</option>
                        <option value="unassigned">Unassigned</option>
                        {drivers.map(driver => (
                            <option key={driver.id} value={driver.id}>{driver.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Deliveries List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="p-4 font-semibold text-gray-600">Tracking Code</th>
                                <th className="p-4 font-semibold text-gray-600">Customer</th>
                                <th className="p-4 font-semibold text-gray-600">Destination</th>
                                <th className="p-4 font-semibold text-gray-600">Status</th>
                                <th className="p-4 font-semibold text-gray-600">Driver</th>
                                <th className="p-4 font-semibold text-gray-600">Date Range</th>
                                <th className="p-4 font-semibold text-gray-600 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={7} className="p-8 text-center text-gray-500">
                                        Loading deliveries...
                                    </td>
                                </tr>
                            ) : filteredDeliveries.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="p-8 text-center text-gray-500">
                                        No deliveries found matching your criteria.
                                    </td>
                                </tr>
                            ) : (
                                filteredDeliveries.map((delivery) => (
                                    <tr key={delivery.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                        <td className="p-4">
                                            <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded text-gray-800">
                                                {delivery.tracking_code || 'N/A'}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="font-medium text-gray-900">{delivery.customer_name}</div>
                                            <div className="text-sm text-gray-500">{delivery.customer_phone}</div>
                                        </td>
                                        <td className="p-4">
                                            <div className="text-sm text-gray-900 truncate max-w-[200px]" title={delivery.delivery_address}>
                                                {delivery.delivery_address}
                                            </div>
                                            <div className="text-sm text-gray-500">{delivery.city}, {delivery.state}</div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${statusColors[delivery.status] || 'bg-gray-100 text-gray-800'}`}>
                                                {delivery.status.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center space-x-2 text-sm">
                                                <User size={16} className="text-gray-400" />
                                                <span className={!delivery.driver_id ? "text-gray-400 italic" : "text-gray-700"}>
                                                    {getDriverName(delivery.driver_id)}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-sm text-gray-600">
                                            {delivery.created_at ? format(new Date(delivery.created_at), 'MMM d, yyyy') : 'N/A'}
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end space-x-2">
                                                <button 
                                                    onClick={() => {
                                                        setSelectedDelivery(delivery);
                                                        setNewStatus(delivery.status);
                                                        setIsStatusModalOpen(true);
                                                    }}
                                                    className="p-2 text-gray-400 hover:text-primary hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Update Status"
                                                >
                                                    <AlertCircle size={18} />
                                                </button>
                                                <button 
                                                    onClick={() => {
                                                        setSelectedDelivery(delivery);
                                                        setSelectedDriverId(delivery.driver_id || '');
                                                        setIsAssignModalOpen(true);
                                                    }}
                                                    className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                    title="Assign Driver"
                                                >
                                                    <Truck size={18} />
                                                </button>
                                                <button className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors" title="View Details">
                                                    <Eye size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Status Update Modal */}
            {isStatusModalOpen && selectedDelivery && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden">
                        <div className="flex justify-between items-center p-6 border-b border-gray-100">
                            <h3 className="text-xl font-bold text-gray-900">Update Delivery Status</h3>
                            <button onClick={() => setIsStatusModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleUpdateStatus} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Current Status</label>
                                <div className="text-md font-medium capitalize mb-4 text-gray-900">
                                    {selectedDelivery.status.replace('_', ' ')}
                                </div>
                                
                                <label className="block text-sm font-medium text-gray-700 mb-1">New Status</label>
                                <select
                                    value={newStatus}
                                    onChange={(e) => setNewStatus(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                    required
                                >
                                    <option value="pending">Pending</option>
                                    <option value="scheduled">Scheduled</option>
                                    <option value="assigned">Assigned</option>
                                    <option value="out_for_delivery">Out for Delivery</option>
                                    <option value="delivered">Delivered</option>
                                    <option value="failed">Failed</option>
                                    <option value="returned">Returned</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
                                <textarea
                                    value={statusNotes}
                                    onChange={(e) => setStatusNotes(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none h-24 resize-none"
                                    placeholder="Add any relevant notes about this status change..."
                                ></textarea>
                            </div>
                            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={() => setIsStatusModalOpen(false)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors"
                                >
                                    Update Status
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Assign Driver Modal */}
            {isAssignModalOpen && selectedDelivery && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden">
                        <div className="flex justify-between items-center p-6 border-b border-gray-100">
                            <h3 className="text-xl font-bold text-gray-900">Assign Driver</h3>
                            <button onClick={() => setIsAssignModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleAssignDriver} className="p-6 space-y-4">
                            <div>
                                <p className="text-sm text-gray-600 mb-4">
                                    Assigning driver for delivery to <strong>{selectedDelivery.delivery_address}</strong>
                                </p>
                                
                                <label className="block text-sm font-medium text-gray-700 mb-1">Select Driver</label>
                                <select
                                    value={selectedDriverId}
                                    onChange={(e) => setSelectedDriverId(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                    required
                                >
                                    <option value="" disabled>Select a driver...</option>
                                    {drivers.map(driver => (
                                        <option key={driver.id} value={driver.id}>
                                            {driver.name} ({driver.vehicle_type})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            
                            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={() => setIsAssignModalOpen(false)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={!selectedDriverId}
                                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Assign
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Deliveries;

