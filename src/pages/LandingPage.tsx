import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, TrendingUp, Shield, Truck, MapPin, Package, Clock, Mail, Phone, Send } from 'lucide-react';
import heroImage from '../assets/img/hero.png';
import contactImage from '../assets/img/contact-us.png';

const LandingPage = () => {
    return (
        <div className="min-h-screen flex flex-col font-sans text-gray-900">
            {/* Navbar */}
            {/* Navbar */}
            <nav className="container mx-auto px-6 py-4 flex justify-center md:justify-between items-center">
                <div className="text-2xl font-bold text-primary">RevQuotes</div>
                <div className="hidden md:block space-x-4">
                    <Link to="/login" className="px-5 py-2.5 text-primary hover:bg-gray-100 rounded-full font-medium transition-all">
                        Login
                    </Link>
                    <Link to="/register" className="px-5 py-2.5 bg-primary text-white rounded-full font-medium hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl">
                        Get Started
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="container mx-auto px-6 py-16 md:py-24 flex flex-col-reverse md:flex-row items-center gap-12">
                <div className="md:w-1/2 space-y-6">
                    <h1 className="text-4xl md:text-6xl font-extrabold leading-tight text-primary">
                        Smart Logistics Pricing, <span className="text-primary/80">Simplified.</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600 max-w-lg">
                        Get instant quotes for your delivery needs. Seamless, transparent, and efficient logistics management at your fingertips.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <Link to="/register" className="inline-flex justify-center items-center px-8 py-3.5 bg-primary text-white text-lg font-semibold rounded-full hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
                            Start Shipping Now
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </Link>
                        <Link to="/login" className="inline-flex justify-center items-center px-8 py-3.5 bg-white text-primary border-2 border-primary/10 hover:border-primary/30 text-lg font-semibold rounded-full hover:bg-gray-50 transition-all">
                            Log In
                        </Link>
                    </div>
                    <div className="pt-8 flex items-center gap-4 text-sm text-gray-500 font-medium">
                        <div className="flex items-center gap-1">
                            <CheckCircle className="w-4 h-4 text-green-500" /> No credit card required of demo
                        </div>
                        <div className="flex items-center gap-1">
                            <CheckCircle className="w-4 h-4 text-green-500" /> Instant Setup
                        </div>
                    </div>
                </div>
                <div className="hidden md:block md:w-1/2 relative">
                    <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border border-gray-100 bg-white/50 backdrop-blur-sm p-4">
                        {/* Placeholder for the generated image */}
                        <img
                            src={heroImage}
                            alt="Logistics Dashboard"
                            className="w-full h-auto rounded-2xl"
                        />
                    </div>
                    {/* Decorative blobs */}
                    <div className="absolute -top-10 -right-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10"></div>
                    <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -z-10"></div>
                </div>
            </header>

            {/* Features Section */}
            <section className="bg-gray-50 py-20">
                <div className="container mx-auto px-6">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Why Choose RevQuotes?</h2>
                        <p className="text-gray-600 text-lg">We bring transparency and efficiency to logistics with cutting-edge technology.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <TrendingUp className="w-8 h-8 text-primary" />,
                                title: "Smart Pricing Engine",
                                description: "Get accurate, real-time delivery quotes based on distance, weight, and current market conditions."
                            },
                            {
                                icon: <Truck className="w-8 h-8 text-primary" />,
                                title: "Reliable Fleet Network",
                                description: "Access a vast network of verified carriers ready to handle shipments of any size."
                            },
                            {
                                icon: <Shield className="w-8 h-8 text-primary" />,
                                title: "Secure & Transparent",
                                description: "Track your shipments in real-time and enjoy clear, upfront pricing with no hidden fees."
                            }
                        ].map((feature, idx) => (
                            <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works (Walkthrough) Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">How RevQuotes Works</h2>
                        <p className="text-gray-600 text-lg">Simple steps to get your deliveries moving.</p>
                    </div>

                    <div className="relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gray-100 -translate-y-1/2 z-0"></div>

                        <div className="grid md:grid-cols-3 gap-12 relative z-10">
                            {[
                                {
                                    icon: <MapPin className="w-8 h-8 text-white" />,
                                    title: "1. Request a Quote",
                                    desc: "Enter the weight (kg) of your delivery and distance (km) to be covered to get your quote instantly."
                                },
                                {
                                    icon: <Package className="w-8 h-8 text-white" />,
                                    title: "2. Choose Your Fleet",
                                    desc: "Select the vehicle type that matches your delivery needs."
                                },
                                {
                                    icon: <Clock className="w-8 h-8 text-white" />,
                                    title: "3. Track & Deliver",
                                    desc: "Track your delivery in real-time until it reaches its destination safely."
                                }
                            ].map((step, idx) => (
                                <div key={idx} className="flex flex-col items-center text-center group">
                                    <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300 border-4 border-white">
                                        {step.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                                    <p className="text-gray-600 max-w-xs">{step.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 container mx-auto px-6">
                <div className="bg-primary rounded-3xl p-12 md:p-20 text-center text-white relative overflow-hidden">
                    <div className="relative z-10 max-w-2xl mx-auto space-y-8">
                        <h2 className="text-3xl md:text-5xl font-bold">Ready to streamline your logistics?</h2>
                        <p className="text-white/80 text-lg md:text-xl">Join thousands of businesses who trust RevQuotes for their shipping needs.</p>
                        <Link to="/register" className="inline-block px-10 py-4 bg-white text-primary text-lg font-bold rounded-full hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
                            Create Free Account
                        </Link>
                    </div>

                    {/* Background decorations */}
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                        <div className="absolute top-10 left-10 w-32 h-32 rounded-full border-4 border-white/20"></div>
                        <div className="absolute bottom-10 right-10 w-48 h-48 rounded-full border-4 border-white/20"></div>
                    </div>
                </div>
            </section>

            {/* Contact Us Section */}
            <section className="py-24 bg-gray-50">
                <div className="container mx-auto px-6">
                    <div className="bg-white rounded-3xl shadow-xl p-8 md:p-16 border border-gray-100">
                        <div className="flex flex-col md:flex-row items-center gap-16">
                            {/* Contact Form */}
                            <div className="md:w-1/2 w-full">
                                <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">Get in Touch</h2>
                                <p className="text-gray-600 mb-8 text-lg">Have questions or need a custom enterprise solution? Our team is here to help.</p>

                                <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                        <input type="text" className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-white" placeholder="John Doe" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                        <input type="email" className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-white" placeholder="john@company.com" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                                        <textarea rows={4} className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-white" placeholder="How can we help you?"></textarea>
                                    </div>
                                    <button className="w-full py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl flex justify-center items-center gap-2">
                                        <Send className="w-5 h-5" />
                                        Send Message
                                    </button>
                                </form>

                                <div className="mt-10 flex flex-col md:flex-row gap-4 md:gap-8 text-gray-600">
                                    <div className="flex items-center gap-3">
                                        <Mail className="w-5 h-5 text-primary" />
                                        <span>support@revquotes.com</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                                        <span className="break-all md:break-normal">+234 815 261-8099</span>
                                    </div>
                                </div>
                            </div>

                            {/* Illustration Placeholder */}
                            <div className="hidden md:block md:w-1/2 w-full">
                                <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-white p-2 border border-gray-100">
                                    <img
                                        src={contactImage}
                                        alt="Contact Support Team"
                                        className="w-full h-auto rounded-2xl"
                                    />
                                    {/* Decorative elements */}
                                    <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-primary/10 rounded-full blur-xl"></div>
                                    <div className="absolute -top-6 -left-6 w-32 h-32 bg-blue-500/5 rounded-full blur-xl"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-100 py-12">
                <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="text-primary font-bold text-xl">RevQuotes</div>
                    <div className="text-gray-500 text-sm">
                        © {new Date().getFullYear()} RevQuotes. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
