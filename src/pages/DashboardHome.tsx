import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Calculator, Package, TrendingUp, Clock } from 'lucide-react';

const DashboardHome: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 18) return 'Good Afternoon';
        return 'Good Evening';
    };

    const quickActions = [
        {
            icon: Calculator,
            label: 'Calculate Price',
            description: 'Get instant delivery quotes',
            path: '/dashboard/calculator',
            color: 'bg-blue-500',
        },
        {
            icon: Package,
            label: 'My Deliveries',
            description: 'Track your shipments',
            path: '/dashboard/deliveries',
            color: 'bg-green-500',
        },
    ];

    return (
        <div className="max-w-7xl mx-auto">
            {/* Welcome Section */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">
                    {getGreeting()}, {user ? `${user.first_name}` : 'Guest'}!
                </h1>
                <p className="text-gray-600 mt-2">
                    Welcome to your RevQuotes dashboard. Here's what you can do today.
                </p>
            </div>

            {/* Quick Actions */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {quickActions.map((action) => {
                        const Icon = action.icon;
                        return (
                            <button
                                key={action.path}
                                onClick={() => navigate(action.path)}
                                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all text-left group"
                            >
                                <div className="flex items-start space-x-4">
                                    <div className={`${action.color} p-3 rounded-lg text-white group-hover:scale-110 transition-transform`}>
                                        <Icon size={24} />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary transition-colors">
                                            {action.label}
                                        </h3>
                                        <p className="text-gray-600 text-sm mt-1">
                                            {action.description}
                                        </p>
                                    </div>
                                    <svg
                                        className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M9 5l7 7-7 7"
                                        />
                                    </svg>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Stats Overview */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm">Total Quotes</p>
                                <p className="text-3xl font-bold text-gray-900 mt-1">--</p>
                            </div>
                            <div className="bg-purple-100 p-3 rounded-lg">
                                <TrendingUp className="text-purple-600" size={24} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm">Active Deliveries</p>
                                <p className="text-3xl font-bold text-gray-900 mt-1">--</p>
                            </div>
                            <div className="bg-green-100 p-3 rounded-lg">
                                <Package className="text-green-600" size={24} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm">Pending</p>
                                <p className="text-3xl font-bold text-gray-900 mt-1">--</p>
                            </div>
                            <div className="bg-orange-100 p-3 rounded-lg">
                                <Clock className="text-orange-600" size={24} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <p className="text-gray-500 text-center py-8">
                        No recent activity to display
                    </p>
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;
