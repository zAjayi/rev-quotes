import React, { useState } from 'react';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import api from '../api/axios';

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

const Calculator: React.FC = () => {
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

    return (
        <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Price Calculator</h1>
                <p className="text-gray-600 mt-2">
                    Calculate delivery prices instantly based on distance, weight, and vehicle type.
                </p>
            </div>

            {/* Calculator Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                {!quote ? (
                    <form onSubmit={handleCalculate} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
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

export default Calculator;
