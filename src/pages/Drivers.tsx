import React, { useState, useEffect } from 'react';
import { User, Plus, Search, CheckCircle, XCircle, Truck, Package, X, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import api from '../services/api';

interface Driver {
    id: string;
    name: string;
    phone: string;
    vehicle_type: string;
    is_active: boolean;
    created_at: string;
}

interface Delivery {
    id: string;
    tracking_code: string;
    customer_name: string;
    delivery_address: string;
    status: string;
}

const Drivers: React.FC = () => {
    const [drivers, setDrivers] = useState<Driver[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    
    // Create driver modal state
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newDriverData, setNewDriverData] = useState({
        name: '',
        phone: '',
        vehicle_type: 'Motorcycle'
    });

    // View deliveries modal state
    const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
    const [driverDeliveries, setDriverDeliveries] = useState<Delivery[]>([]);
    const [loadingDeliveries, setLoadingDeliveries] = useState(false);
    const [isDeliveriesModalOpen, setIsDeliveriesModalOpen] = useState(false);

    const fetchDrivers = async () => {
        try {
            setLoading(true);
            const response = await api.get('/api/v1/drivers');
            if (response.data && response.data.data) {
                setDrivers(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching drivers:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDrivers();
    }, []);

    const handleCreateDriver = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/api/v1/drivers', newDriverData);
            setIsCreateModalOpen(false);
            setNewDriverData({ name: '', phone: '', vehicle_type: 'Motorcycle' });
            fetchDrivers();
        } catch (error) {
            console.error('Error creating driver:', error);
            alert('Failed to create driver');
        }
    };

    const fetchDriverDeliveries = async (driverId: string) => {
        try {
            setLoadingDeliveries(true);
            const response = await api.get(`/api/v1/drivers/${driverId}/deliveries`);
            if (response.data && response.data.data) {
                const mappedDeliveries = response.data.data.map((item: any) => ({
                    id: item.ID || item.id,
                    tracking_code: item.TrackingCode || item.tracking_code,
                    customer_name: item.CustomerName || item.customer_name,
                    delivery_address: item.DeliveryAddress || item.delivery_address,
                    status: (item.Status || item.status || 'pending').toLowerCase()
                }));
                setDriverDeliveries(mappedDeliveries);
            } else {
                setDriverDeliveries([]);
            }
        } catch (error) {
            console.error('Error fetching driver deliveries:', error);
            setDriverDeliveries([]);
        } finally {
            setLoadingDeliveries(false);
        }
    };

    const openDeliveriesModal = (driver: Driver) => {
        setSelectedDriver(driver);
        setIsDeliveriesModalOpen(true);
        fetchDriverDeliveries(driver.id);
    };

    const filteredDrivers = drivers.filter(d => 
        (d.name?.toLowerCase().includes(searchQuery.toLowerCase()) || '') ||
        (d.phone?.includes(searchQuery) || '')
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Drivers</h1>
                    <p className="text-gray-600 mt-1">Manage delivery personnel</p>
                </div>
                <button 
                    onClick={() => setIsCreateModalOpen(true)}
                    className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                >
                    <Plus size={20} />
                    <span>Add Driver</span>
                </button>
            </div>

            {/* Filter */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search drivers by name or phone..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    />
                </div>
            </div>

            {/* Drivers Grid */}
            {loading ? (
                <div className="text-center py-12 text-gray-500">Loading drivers...</div>
            ) : filteredDrivers.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
                    <User className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                    <h3 className="text-lg font-medium text-gray-900">No drivers found</h3>
                    <p className="text-gray-500">Add a new driver to get started.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredDrivers.map((driver) => (
                        <div key={driver.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                                            <User className="text-gray-500" size={24} />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">{driver.name}</h3>
                                            <div className="text-gray-500 text-sm flex items-center space-x-1">
                                                <span>{driver.phone}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${driver.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                        {driver.is_active ? <CheckCircle size={12} className="mr-1"/> : <XCircle size={12} className="mr-1"/>}
                                        {driver.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                                
                                <div className="space-y-2 mb-6">
                                    <div className="flex justify-between text-sm py-2 border-b border-gray-50">
                                        <span className="text-gray-500 flex items-center"><Truck size={14} className="mr-2"/> Vehicle Type</span>
                                        <span className="font-medium text-gray-900">{driver.vehicle_type}</span>
                                    </div>
                                    <div className="flex justify-between text-sm py-2 border-b border-gray-50">
                                        <span className="text-gray-500">Joined</span>
                                        <span className="text-gray-900">{driver.created_at ? format(new Date(driver.created_at), 'MMM d, yyyy') : 'N/A'}</span>
                                    </div>
                                </div>

                                <button 
                                    onClick={() => openDeliveriesModal(driver)}
                                    className="w-full py-2 bg-gray-50 hover:bg-gray-100 text-primary font-medium rounded-lg transition-colors flex justify-center items-center space-x-2"
                                >
                                    <Package size={16} />
                                    <span>View Deliveries</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Create Driver Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden">
                        <div className="flex justify-between items-center p-6 border-b border-gray-100">
                            <h3 className="text-xl font-bold text-gray-900">Add New Driver</h3>
                            <button onClick={() => setIsCreateModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleCreateDriver} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    value={newDriverData.name}
                                    onChange={(e) => setNewDriverData({...newDriverData, name: e.target.value})}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                    placeholder="e.g. John Doe"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                <input
                                    type="tel"
                                    required
                                    value={newDriverData.phone}
                                    onChange={(e) => setNewDriverData({...newDriverData, phone: e.target.value})}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                    placeholder="e.g. +1234567890"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Type</label>
                                <select
                                    value={newDriverData.vehicle_type}
                                    onChange={(e) => setNewDriverData({...newDriverData, vehicle_type: e.target.value})}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                >
                                    <option value="Motorcycle">Motorcycle</option>
                                    <option value="Car">Car</option>
                                    <option value="Van">Van</option>
                                    <option value="Truck">Truck</option>
                                    <option value="Bicycle">Bicycle</option>
                                </select>
                            </div>
                            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={() => setIsCreateModalOpen(false)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors"
                                >
                                    Add Driver
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* View Deliveries Modal */}
            {isDeliveriesModalOpen && selectedDriver && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[80vh] flex flex-col overflow-hidden">
                        <div className="flex justify-between items-center p-6 border-b border-gray-100 flex-shrink-0">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">{selectedDriver.name}'s Deliveries</h3>
                                <p className="text-sm text-gray-500 mt-1">{selectedDriver.phone} • {selectedDriver.vehicle_type}</p>
                            </div>
                            <button onClick={() => setIsDeliveriesModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>
                        
                        <div className="p-6 overflow-y-auto flex-1">
                            {loadingDeliveries ? (
                                <div className="text-center py-8 text-gray-500">Loading requested deliveries...</div>
                            ) : driverDeliveries.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    <Package className="mx-auto h-10 w-10 text-gray-300 mb-2" />
                                    No deliveries assigned to this driver.
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {driverDeliveries.map(delivery => (
                                        <div key={delivery.id} className="border border-gray-100 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                            <div>
                                                <div className="flex items-center space-x-2 mb-1">
                                                    <span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-800">
                                                        {delivery.tracking_code || 'N/A'}
                                                    </span>
                                                    <span className="text-sm font-medium text-gray-900">{delivery.customer_name}</span>
                                                </div>
                                                <div className="text-sm text-gray-500 flex items-start mt-2">
                                                    <MapPin size={14} className="mt-0.5 mr-1 flex-shrink-0" />
                                                    <span>{delivery.delivery_address}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize 
                                                    ${delivery.status === 'delivered' ? 'bg-green-100 text-green-800' : 
                                                      delivery.status === 'out_for_delivery' ? 'bg-purple-100 text-purple-800' : 
                                                      'bg-gray-100 text-gray-800'}`}>
                                                    {delivery.status.replace('_', ' ')}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Drivers;
