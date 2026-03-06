import React, { useState, useEffect } from 'react';
import { MapPin, CheckCircle, AlertTriangle, Navigation, Phone, Package, Map } from 'lucide-react';
import api from '../services/api';
import { useDriverLocation } from '../hooks/useDriverLocation';

interface Delivery {
    id: string;
    quote_id: string;
    customer_name: string;
    customer_phone: string;
    delivery_address: string;
    city: string;
    state: string;
    status: string;
    tracking_code: string;
}

const DriverDashboard: React.FC = () => {
    const [deliveries, setDeliveries] = useState<Delivery[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Modals
    const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
    const [selectedDeliveryId, setSelectedDeliveryId] = useState<string | null>(null);
    const [issueNotes, setIssueNotes] = useState('');

    const fetchMyDeliveries = async () => {
        try {
            setLoading(true);
            const response = await api.get('/api/v1/driver/me/deliveries');
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
                    tracking_code: item.TrackingCode || item.tracking_code
                }));
                setDeliveries(mappedDeliveries);
            }
        } catch (error) {
            console.error('Error fetching driver deliveries:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyDeliveries();
    }, []);

    const handleAction = async (id: string, action: 'start' | 'complete') => {
        try {
            await api.patch(`/api/v1/driver/deliveries/${id}/${action}`);
            fetchMyDeliveries();
        } catch (error) {
            console.error(`Error performing ${action} action:`, error);
            alert(`Failed to ${action} delivery`);
        }
    };

    const handleReportIssue = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedDeliveryId) return;

        try {
            await api.patch(`/api/v1/driver/deliveries/${selectedDeliveryId}/issue`, {
                notes: issueNotes
            });
            setIsIssueModalOpen(false);
            setIssueNotes('');
            fetchMyDeliveries();
        } catch (error) {
            console.error('Error reporting issue:', error);
            alert('Failed to report issue');
        }
    };

    const activeDeliveries = deliveries.filter((d: Delivery) => 
        d.status !== 'delivered' && d.status !== 'failed' && d.status !== 'cancelled' && d.status !== 'returned'
    );
    const completedDeliveries = deliveries.filter((d: Delivery) => 
        d.status === 'delivered' || d.status === 'failed' || d.status === 'cancelled' || d.status === 'returned'
    );

    const hasActiveDelivery = activeDeliveries.some((d: Delivery) => d.status === 'out_for_delivery');
    useDriverLocation(hasActiveDelivery);

    return (
        <div className="max-w-3xl mx-auto space-y-6 pb-20">
            {/* Header */}
            <div className="bg-primary rounded-2xl p-6 text-white shadow-md">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">Driver Portal</h1>
                    <div className="flex items-center space-x-3">
                        {hasActiveDelivery && (
                            <div className="flex items-center space-x-1 bg-green-500/20 px-2 py-1 rounded text-xs backdrop-blur-sm animate-pulse">
                                <Map size={12} />
                                <span>Tracking Live</span>
                            </div>
                        )}
                        <div className="bg-white/20 px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                            Online
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="bg-white/10 rounded-xl p-4">
                        <div className="text-white/80 text-sm mb-1">Active Deliveries</div>
                        <div className="text-3xl font-bold">{activeDeliveries.length}</div>
                    </div>
                    <div className="bg-white/10 rounded-xl p-4">
                        <div className="text-white/80 text-sm mb-1">Completed Today</div>
                        <div className="text-3xl font-bold">
                            {completedDeliveries.filter((d: Delivery) => d.status === 'delivered').length}
                        </div>
                    </div>
                </div>
            </div>

            {/* Active Deliveries */}
            <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4 px-2">Assigned Deliveries</h2>
                
                {loading ? (
                    <div className="text-center py-12 text-gray-500">Loading assignments...</div>
                ) : activeDeliveries.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
                        <div className="mx-auto w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                            <Package className="text-gray-400" size={32} />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">You're all caught up!</h3>
                        <p className="text-gray-500 text-sm">No active deliveries assigned at the moment.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {activeDeliveries.map((delivery: Delivery) => (
                            <div key={delivery.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                                {/* Status Banner */}
                                {delivery.status === 'out_for_delivery' && (
                                    <div className="bg-purple-600 text-white px-4 py-2 text-sm font-medium flex items-center justify-center">
                                        <Navigation size={16} className="mr-2" />
                                        Currently Out For Delivery
                                    </div>
                                )}
                                
                                <div className="p-5">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <div className="text-xs font-mono text-gray-500 mb-1 flex items-center">
                                                <Package className="mr-1" size={12}/> {delivery.tracking_code}
                                            </div>
                                            <h3 className="text-lg font-bold text-gray-900">{delivery.customer_name}</h3>
                                        </div>
                                        <span className={`px-2.5 py-1 rounded text-xs font-semibold uppercase tracking-wider ${
                                            delivery.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                                            delivery.status === 'assigned' ? 'bg-indigo-100 text-indigo-800' :
                                            'bg-gray-100 text-gray-800'
                                        }`}>
                                            {delivery.status.replace('_', ' ')}
                                        </span>
                                    </div>

                                    <div className="space-y-3 mb-6">
                                        <div className="flex items-start">
                                            <MapPin className="text-gray-400 mt-1 mr-3 flex-shrink-0" size={18} />
                                            <div>
                                                <div className="text-gray-900 text-sm">{delivery.delivery_address}</div>
                                                <div className="text-gray-500 text-xs">{delivery.city}, {delivery.state}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center">
                                            <Phone className="text-gray-400 mr-3 flex-shrink-0" size={18} />
                                            <a href={`tel:${delivery.customer_phone}`} className="text-primary text-sm font-medium hover:underline">
                                                {delivery.customer_phone}
                                            </a>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        {delivery.status === 'assigned' || delivery.status === 'scheduled' || delivery.status === 'pending' ? (
                                            <button 
                                                onClick={() => handleAction(delivery.id, 'start')}
                                                className="col-span-2 bg-primary hover:bg-primary-dark text-white py-3 rounded-xl font-medium transition-colors flex justify-center items-center shadow-sm"
                                            >
                                                <Navigation size={18} className="mr-2" />
                                                Start Delivery
                                            </button>
                                        ) : delivery.status === 'out_for_delivery' ? (
                                            <>
                                                <button 
                                                    onClick={() => handleAction(delivery.id, 'complete')}
                                                    className="bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-medium transition-colors flex justify-center items-center shadow-sm"
                                                >
                                                    <CheckCircle size={18} className="mr-2" />
                                                    Complete
                                                </button>
                                                <button 
                                                    onClick={() => {
                                                        setSelectedDeliveryId(delivery.id);
                                                        setIsIssueModalOpen(true);
                                                    }}
                                                    className="bg-red-50 hover:bg-red-100 text-red-700 py-3 rounded-xl font-medium transition-colors flex justify-center items-center border border-red-200"
                                                >
                                                    <AlertTriangle size={18} className="mr-2" />
                                                    Issue
                                                </button>
                                            </>
                                        ) : null}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Issue Modal */}
            {isIssueModalOpen && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 pb-0 sm:pb-4 transition-opacity">
                    <div className="bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl shadow-xl overflow-hidden transform transition-transform">
                        <div className="p-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Report Delivery Issue</h3>
                            <p className="text-sm text-gray-500 mb-6">Please describe the problem encountered during delivery.</p>
                            
                            <form onSubmit={handleReportIssue}>
                                <textarea
                                    required
                                    value={issueNotes}
                                    onChange={(e) => setIssueNotes(e.target.value)}
                                    placeholder="e.g. Customer not available, unable to locate address, package refused..."
                                    className="w-full text-sm p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none resize-none h-32 mb-6"
                                ></textarea>
                                
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsIssueModalOpen(false)}
                                        className="py-3 text-gray-700 font-medium bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="py-3 text-white font-medium bg-red-600 hover:bg-red-700 rounded-xl transition-colors"
                                    >
                                        Submit Report
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DriverDashboard;
