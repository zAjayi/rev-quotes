import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import api from '../api/axios';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await api.post('/auth/login', { email, password });
            const token = response.data.token;

            // Placeholder user data since backend doesn't return it
            const userData = {
                id: 'user-id-placeholder',
                email: email,
                first_name: 'User',
                last_name: ''
            };

            login(token, userData);
            navigate('/');
        } catch (err: any) {
            console.error('Login error:', err);
            setError(err.response?.data?.error || 'Invalid email or password');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col lg:flex-row min-h-[600px]">

                {/* Left Section - Branding */}
                <div className="lg:w-1/2 p-12 flex flex-col justify-center bg-primary text-white relative overflow-hidden">
                    {/* Abstract Background Shapes */}
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white mix-blend-overlay blur-3xl"></div>
                        <div className="absolute top-1/2 left-1/2 w-80 h-80 rounded-full bg-secondary mix-blend-overlay blur-2xl"></div>
                    </div>

                    <div className="relative z-10 max-w-md mx-auto lg:mx-0">
                        <h1 className="text-4xl font-bold mb-4 tracking-tight">
                            Logistics <span className="text-white/80">Simplified.</span>
                        </h1>
                        <p className="text-lg text-white/70 mb-8 leading-relaxed">
                            Manage your deliveries, calculate quotes, and track shipments all in one beautiful platform.
                        </p>
                    </div>
                </div>

                {/* Right Section - Login Form */}
                <div className="lg:w-1/2 bg-white p-12 lg:p-16 flex flex-col justify-center">
                    <div className="max-w-md w-full mx-auto">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
                        <p className="text-gray-500 mb-8">Please enter your details to sign in.</p>

                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <Input
                                label="Email address"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@example.com"
                            />

                            <div>
                                <Input
                                    label="Password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                />
                                <div className="flex justify-end mt-1">
                                    <a href="#" className="text-sm font-medium text-primary hover:text-primary/80">
                                        Forgot password?
                                    </a>
                                </div>
                            </div>

                            {error && (
                                <div className="rounded-xl bg-red-50 p-4 border border-red-100">
                                    <div className="flex">
                                        <div className="ml-3">
                                            <h3 className="text-sm font-medium text-red-800">{error}</h3>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div>
                                <Button
                                    type="submit"
                                    className="w-full !rounded-xl !py-3 text-base shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all"
                                    isLoading={isLoading}
                                >
                                    Sign in
                                </Button>
                            </div>
                        </form>

                        <div className="mt-8 text-center text-sm text-gray-500">
                            Don't have an account?{' '}
                            <Link to="/register" className="font-semibold text-primary hover:text-primary/80 transition-colors">
                                Create an account
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
