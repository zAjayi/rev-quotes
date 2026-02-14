import React from 'react';
import { Truck } from 'lucide-react';

const Shipping: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                <div className="mx-auto w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mb-6">
                    <Truck className="text-yellow-600" size={48} />
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-4">Shipping Management</h1>

                <div className="inline-flex items-center px-4 py-2 bg-yellow-50 text-yellow-700 rounded-full mb-6">
                    <span className="text-sm font-medium">Coming Soon</span>
                </div>

                <p className="text-gray-600 max-w-md mx-auto mb-8">
                    We're working on bringing you advanced shipping management features.
                    Stay tuned for route optimization, fleet management, and real-time tracking.
                </p>

                <div className="bg-gray-50 rounded-xl p-6 max-w-lg mx-auto">
                    <h3 className="font-semibold text-gray-900 mb-3">Upcoming Features:</h3>
                    <ul className="text-left space-y-2 text-gray-600">
                        <li className="flex items-center">
                            <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Route Optimization
                        </li>
                        <li className="flex items-center">
                            <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Fleet Management
                        </li>
                        <li className="flex items-center">
                            <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Live GPS Tracking
                        </li>
                        <li className="flex items-center">
                            <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Batch Processing
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Shipping;
