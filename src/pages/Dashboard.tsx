import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import api from '../api/axios';
import { LogOut } from 'lucide-react';

interface Quote {
    quote_id: string;
    price: number;
    currency: string;
    details?: any;
}

interface DeliveryResponse {
    delivery_id: string;
    tracking_code: string;
    status: string;
    message: string;
}

const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [distance, setDistance] = useState<number>(0);
    const [weight, setWeight] = useState<number>(0);
    const [vehicleType, setVehicleType] = useState<string>('bike');
    const [urgency, setUrgency] = useState<string>('normal');
    const [loadingQuote, setLoadingQuote] = useState(false);
    const [quote, setQuote] = useState<Quote | null>(null);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [deliveryResult, setDeliveryResult] = useState<DeliveryResponse | null>(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [error, setError] = useState('');
    const [headline, setHeadline] = useState("Get Your Delivery Quote Instantly");
    const [fade, setFade] = useState(true);

    React.useEffect(() => {
        const messages = [
            "Get Your Delivery Quote Instantly",
            "Welcome to RevQuotes",
            "RevQuotes: Shipping Simplified"
        ];
        let currentIndex = 0;
        const interval = setInterval(() => {
            setFade(false); // Fade out

            setTimeout(() => {
                currentIndex = (currentIndex + 1) % messages.length;
                setHeadline(messages[currentIndex]);
                setFade(true); // Fade in
            }, 500); // Wait for fade out to complete

        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const handleCalculate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoadingQuote(true);
        setError('');
        setQuote(null);

        try {
            const payload = {
                distance_km: Number(distance),
                weight_kg: Number(weight),
                vehicle_type: vehicleType,
                urgency: urgency,
                weight_vol: 0.0
            };

            const response = await api.post('/api/v1/quotes/calculate', payload);
            setQuote(response.data);
        } catch (err: any) {
            console.error('Calculation error:', err);
            setError('Failed to calculate price. Please check your inputs.');
        } finally {
            setLoadingQuote(false);
        }
    };

    const handleBook = async () => {
        if (!quote) return;
        setBookingLoading(true);

        try {
            const response = await api.post('/api/v1/deliveries', {
                quote_id: quote.quote_id
            });
            setDeliveryResult(response.data);
            setShowSuccessModal(true);
        } catch (err: any) {
            console.error('Booking error:', err);
            setError('Failed to book delivery. Please try again.');
        } finally {
            setBookingLoading(false);
        }
    };

    const handleCloseModal = () => {
        setShowSuccessModal(false);
        setQuote(null);
        setDeliveryResult(null);
        setDistance(0);
        setWeight(0);
    };

    const handleLogout = () => {
        navigate('/login');
        logout();
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-6xl overflow-hidden min-h-[600px] flex flex-col lg:flex-row relative">

                {/* Logout Absolute Button */}
                <button
                    onClick={handleLogout}
                    className="absolute top-6 right-6 z-10 p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    title="Logout"
                >
                    <LogOut size={24} />
                </button>

                {/* Left Section - Context */}
                <div className="lg:w-1/2 p-12 lg:p-20 flex flex-col justify-center bg-primary text-white relative overflow-hidden">
                    {/* Abstract Background Shapes */}
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white mix-blend-overlay blur-3xl"></div>
                        <div className="absolute top-1/2 left-1/2 w-80 h-80 rounded-full bg-secondary mix-blend-overlay blur-2xl"></div>
                    </div>

                    <div className="max-w-md relative z-10">
                        <h4 className="text-lg font-medium text-white/80 mb-2">
                            {(() => {
                                const hour = new Date().getHours();
                                if (hour < 12) return 'Good Morning';
                                if (hour < 18) return 'Good Afternoon';
                                return 'Good Evening';
                            })()}, {user?.first_name || 'Guest'}
                        </h4>

                        <h1 className={`text-5xl lg:text-6xl font-bold mb-6 leading-tight tracking-tight min-h-[120px] transition-opacity duration-500 ${fade ? 'opacity-100' : 'opacity-0'}`}>
                            {headline}
                        </h1>
                    </div>
                </div>

                {/* Right Section - Form */}
                <div className="lg:w-1/2 bg-white p-8 lg:p-16 flex flex-col justify-center relative">

                    <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 p-8">
                        {!quote ? (
                            <form onSubmit={handleCalculate} className="space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <Input
                                        label="Distance (km)"
                                        type="number"
                                        min="0.1"
                                        step="0.1"
                                        required
                                        value={distance || ''}
                                        onChange={(e) => setDistance(parseFloat(e.target.value))}
                                        placeholder="e.g. 12.5"
                                    />
                                    <Input
                                        label="Weight (kg)"
                                        type="number"
                                        min="0.1"
                                        step="0.1"
                                        required
                                        value={weight || ''}
                                        onChange={(e) => setWeight(parseFloat(e.target.value))}
                                        placeholder="e.g. 5.0"
                                    />
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Type</label>
                                        <div className="grid grid-cols-4 gap-2">
                                            {['bike', 'car', 'van', 'truck'].map((type) => (
                                                <button
                                                    key={type}
                                                    type="button"
                                                    onClick={() => setVehicleType(type)}
                                                    className={`p-3 rounded-xl border text-sm capitalize transition-all ${vehicleType === type
                                                        ? 'border-primary bg-primary/5 text-primary ring-1 ring-primary'
                                                        : 'border-gray-200 hover:border-gray-300 text-gray-600'
                                                        }`}
                                                >
                                                    {type}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Urgency</label>
                                        <div className="grid grid-cols-2 gap-3">
                                            <button
                                                type="button"
                                                onClick={() => setUrgency('normal')}
                                                className={`p-3 rounded-xl border text-center text-sm transition-all ${urgency === 'normal'
                                                    ? 'border-primary bg-primary/5 text-primary ring-1 ring-primary'
                                                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                                                    }`}
                                            >
                                                Standard
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setUrgency('express')}
                                                className={`p-3 rounded-xl border text-center text-sm transition-all ${urgency === 'express'
                                                    ? 'border-primary bg-primary/5 text-primary ring-1 ring-primary'
                                                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                                                    }`}
                                            >
                                                Express
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {error && <p className="text-red-500 text-sm">{error}</p>}

                                <Button
                                    type="submit"
                                    className="w-full !rounded-full !py-3 text-lg flex items-center justify-center space-x-2"
                                    isLoading={loadingQuote}
                                >
                                    <span>Calculate Rate</span>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </Button>
                            </form>
                        ) : (
                            <div className="text-center py-6 space-y-6">
                                <div className="inline-flex items-center justify-center p-3 bg-green-50 rounded-full mb-2">
                                    <span className="text-green-600 text-sm font-medium uppercase tracking-wider">Quote Ready</span>
                                </div>

                                <div>
                                    <p className="text-5xl font-bold text-primary tracking-tight">
                                        {quote.currency} {quote.price.toLocaleString()}
                                    </p>
                                    <p className="text-gray-500 mt-2">
                                        {distance}km • {weight}kg • {vehicleType}
                                    </p>
                                </div>

                                <div className="pt-4 space-y-3">
                                    <Button
                                        onClick={handleBook}
                                        className="w-full !rounded-full !py-3 text-lg"
                                        isLoading={bookingLoading}
                                    >
                                        Book Delivery
                                    </Button>
                                    <button
                                        onClick={() => setQuote(null)}
                                        className="text-gray-500 hover:text-gray-700 text-sm font-medium"
                                    >
                                        Recalculate
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Modal
                isOpen={showSuccessModal}
                onClose={handleCloseModal}
                title=""
                footer={null}
            >
                <div className="text-center p-4">
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
                        <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h3>
                    <p className="text-gray-500 mb-8">
                        Your delivery has been successfully scheduled.
                    </p>

                    <div className="bg-gray-50 rounded-2xl p-6 text-left border border-gray-100">
                        <div className="mb-4">
                            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Tracking Code</p>
                            <p className="text-xl font-mono font-bold text-gray-900 select-all">{deliveryResult?.tracking_code}</p>
                        </div>

                        <div>
                            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Delivery ID</p>
                            <p className="text-sm font-mono text-gray-600 select-all break-all">{deliveryResult?.delivery_id}</p>
                        </div>
                    </div>

                    <div className="mt-8">
                        <Button onClick={handleCloseModal} className="w-full !rounded-full">
                            Done
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default Dashboard;
