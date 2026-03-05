import { useState, useEffect, useRef } from 'react';
import { Head } from '@inertiajs/react';
import VehicleCard from '@/components/VehicleCard';
import ReservationModal from '@/components/ReservationModal';
import Footer from '@/components/Footer';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const LilyIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="22px"
        height="22px"
        viewBox="0 0 24 24"
    >
        <path
            fill="currentColor"
            d="M4.5 17.27q-.213 0-.356-.145T4 16.768t.144-.356t.356-.143h15q.213 0 .356.144q.144.144.144.357t-.144.356t-.356.143zm0-4.77q-.213 0-.356-.144T4 11.999t.144-.356t.356-.143h15q.213 0 .356.144t.144.357t-.144.356t-.356.143zm0-4.77q-.213 0-.356-.143Q4 7.443 4 7.23t.144-.356t.356-.143h15q.213 0 .356.144T20 7.23t-.144.356t-.356.144z"
        />
    </svg>
);

interface Vehicle {
    id: number;
    brand: string;
    model: string;
    type: string;
    year: number;
    status: string;
    price_per_day: number;
    seats: number;
    doors: number;
    transmission: string;
    fuel_type: string;
    images?: string[];
    image_url?: string;
}

interface Props {
    vehicles: Vehicle[];
}

export default function Catalogue({ vehicles }: Props) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('Tous');
    const [filterBrand, setFilterBrand] = useState('Tous');
    const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
    const [showModal, setShowModal] = useState(false);

    // Refs pour les animations
    const sidebarRef = useRef<HTMLDivElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const vehicleGridRef = useRef<HTMLDivElement>(null);

    const navItems = ['Aide', 'À propos', 'Voitures', 'Réservation'];
    const vehicleFilters = ['Tous', 'Premium', 'SUV', 'Berline', 'Coupe', 'Électrique'];

    // Get unique brands
    const brands = ['Tous', ...Array.from(new Set(vehicles.map(v => v.brand)))];

    // Filter vehicles
    const filteredVehicles = vehicles.filter(vehicle => {
        const matchesSearch = 
            vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
            vehicle.model.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesType = filterType === 'Tous' || vehicle.type === filterType;
        const matchesBrand = filterBrand === 'Tous' || vehicle.brand === filterBrand;
        const isAvailable = vehicle.status === 'available';
        
        return matchesSearch && matchesType && matchesBrand && isAvailable;
    });

    // Animations GSAP
    useEffect(() => {
        const timer = setTimeout(() => {
            // Animation sidebar
            if (sidebarRef.current && sidebarRef.current.children.length > 0) {
                gsap.fromTo(sidebarRef.current.children,
                    { opacity: 0, x: -30 },
                    { 
                        opacity: 1, 
                        x: 0, 
                        duration: 0.6,
                        stagger: 0.1,
                        ease: 'power2.out'
                    }
                );
            }

            // Animation header
            if (headerRef.current) {
                gsap.fromTo(headerRef.current,
                    { opacity: 0, y: 20 },
                    { 
                        opacity: 1, 
                        y: 0, 
                        duration: 0.6,
                        ease: 'power2.out'
                    }
                );
            }

            // Animation vehicle cards
            if (vehicleGridRef.current && vehicleGridRef.current.children.length > 0) {
                gsap.fromTo(vehicleGridRef.current.children,
                    { opacity: 0, y: 40, scale: 0.95 },
                    {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        duration: 0.5,
                        stagger: 0.08,
                        delay: 0.2,
                        ease: 'power2.out',
                    }
                );
            }
        }, 100);

        return () => {
            clearTimeout(timer);
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    }, [filteredVehicles]);

    return (
        <div className="flex min-h-screen flex-col bg-[#FAFAF8]">
            <Head title="Catalogue - LylaMobility" />
            
            {/* Navigation */}
            <nav className="sticky top-0 z-50 flex h-[70px] items-center justify-between border-b border-black/5 bg-[#FAFAF8]/90 px-6 backdrop-blur lg:px-16">
                <div className="flex items-center gap-3">
                    <button
                        className="flex h-11 w-11 cursor-pointer items-center justify-center text-[#091E79] hover:border-[#091E79] hover:text-[#091E79]"
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label="Menu"
                    >
                        <LilyIcon />
                    </button>

                    <a
                        href="/"
                        className="font-serif text-xl font-bold tracking-tight text-[#1a1a1a]"
                    >
                        Lyla<span className="text-[#091E79]">Mobility</span>
                    </a>
                </div>

                <div className="hidden items-center gap-8 md:flex">
                    {navItems.map((item) => (
                        <a
                            key={item}
                            href="#"
                            className="text-sm tracking-wide text-[#555] transition-colors hover:text-[#091E79]"
                        >
                            {item}
                        </a>
                    ))}
                    <a
                        href="/login"
                        className="rounded-full bg-[#1a1a1a] px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-[#091E79]"
                    >
                        Connexion
                    </a>
                </div>
            </nav>

            {/* Menu déroulant */}
            <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    menuOpen ? 'max-h-[520px] opacity-100' : 'max-h-0 opacity-0'
                }`}
            >
                <div className="flex flex-col border-b border-black/5 bg-white shadow-lg">
                    {navItems.map((item) => (
                        <a
                            key={item}
                            href="#"
                            className="border-b border-black/5 px-6 py-4 text-sm text-[#333] transition-colors hover:bg-[#091E79]/5 hover:text-[#091E79] lg:px-16"
                            onClick={() => setMenuOpen(false)}
                        >
                            {item}
                        </a>
                    ))}
                    <div className="px-6 py-4 lg:px-16">
                        <a
                            href="/login"
                            className="block rounded-full bg-[#091E79] px-5 py-2.5 text-center text-sm font-medium text-white transition-colors hover:bg-[#071660]"
                            onClick={() => setMenuOpen(false)}
                        >
                            Connexion
                        </a>
                    </div>
                </div>
            </div>

            {/* Main Content with Sidebar */}
            <section className="px-6 py-8 lg:px-16">
                <div className="mx-auto max-w-7xl">
                    <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
                        {/* Left Sidebar - Filters */}
                        <aside ref={sidebarRef} className="space-y-6">
                            {/* Search */}
                            <div className="bg-white rounded-2xl border border-black/5 p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-bold text-[#1a1a1a]">Recherche</h3>
                                    <svg className="w-5 h-5 text-[#666]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Clio V"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-lg border border-black/10 bg-[#FAFAF8] text-sm text-[#1a1a1a] placeholder-[#999] focus:outline-none focus:border-[#091E79] focus:ring-2 focus:ring-[#091E79]/10"
                                />
                            </div>

                            {/* Filtre */}
                            <div className="bg-white rounded-2xl border border-black/5 p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-lg font-bold text-[#1a1a1a]">Filtre</h3>
                                    <svg className="w-5 h-5 text-[#666]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                                    </svg>
                                </div>

                                {/* Type de véhicules */}
                                <div className="mb-6">
                                    <h4 className="text-sm font-bold text-[#1a1a1a] mb-3">Type de véhicules</h4>
                                    <div className="grid grid-cols-3 gap-2">
                                        {['SUV', 'SUV', 'SUV', 'SUV', 'SUV', 'SUV'].map((type, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => setFilterType(type)}
                                                className={`px-3 py-2 rounded-lg text-xs font-medium border transition ${
                                                    filterType === type
                                                        ? 'bg-[#091E79] text-white border-[#091E79]'
                                                        : 'bg-white text-[#666] border-black/10 hover:border-[#091E79]'
                                                }`}
                                            >
                                                {type}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Motorisation */}
                                <div className="mb-6">
                                    <h4 className="text-sm font-bold text-[#1a1a1a] mb-3">Motorisation</h4>
                                    <div className="grid grid-cols-3 gap-2">
                                        {['Essence', 'Diesel', 'Hybride', 'Électrique'].map((fuel) => (
                                            <button
                                                key={fuel}
                                                className="px-3 py-2 rounded-lg text-xs font-medium border bg-white text-[#666] border-black/10 hover:border-[#091E79] transition"
                                            >
                                                {fuel}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Boite de vitesse */}
                                <div className="mb-6">
                                    <h4 className="text-sm font-bold text-[#1a1a1a] mb-3">Boite de vitesse</h4>
                                    <div className="grid grid-cols-2 gap-2">
                                        {['Manuelle', 'Automatique'].map((trans) => (
                                            <button
                                                key={trans}
                                                className="px-3 py-2 rounded-lg text-xs font-medium border bg-white text-[#666] border-black/10 hover:border-[#091E79] transition"
                                            >
                                                {trans}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Nombre de places assises */}
                                <div className="mb-6">
                                    <h4 className="text-sm font-bold text-[#1a1a1a] mb-3">Nombre de places assises</h4>
                                    <div className="grid grid-cols-5 gap-2">
                                        {[4, 5, 7, 8, 9].map((seats) => (
                                            <button
                                                key={seats}
                                                className="px-3 py-2 rounded-lg text-xs font-medium border bg-white text-[#666] border-black/10 hover:border-[#091E79] transition"
                                            >
                                                {seats}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Nombre de portes */}
                                <div className="mb-6">
                                    <h4 className="text-sm font-bold text-[#1a1a1a] mb-3">Nombre de portes</h4>
                                    <div className="grid grid-cols-5 gap-2">
                                        {[4, 5, 7, 8, 9].map((doors) => (
                                            <button
                                                key={doors}
                                                className="px-3 py-2 rounded-lg text-xs font-medium border bg-white text-[#666] border-black/10 hover:border-[#091E79] transition"
                                            >
                                                {doors}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Prix */}
                                <div>
                                    <h4 className="text-sm font-bold text-[#1a1a1a] mb-3">Prix</h4>
                                    <div className="flex items-center gap-2 text-xs text-[#666]">
                                        <span>350</span>
                                        <input type="range" min="350" max="2500" className="flex-1" />
                                        <span>2500</span>
                                    </div>
                                </div>
                            </div>
                        </aside>

                        {/* Right Content */}
                        <div>
                            {/* Header */}
                            <div ref={headerRef} className="mb-6">
                                <div className="flex items-center justify-between">
                                    <h1 className="text-3xl font-serif font-bold text-[#1a1a1a]">Catalogue</h1>
                                    <div className="flex gap-3">
                                        <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-black/10 text-sm text-[#666] hover:border-[#091E79] transition">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                                            </svg>
                                            Recommandé
                                        </button>
                                        <select className="px-4 py-2 rounded-lg border border-black/10 text-sm text-[#666] focus:outline-none focus:border-[#091E79]">
                                            <option>Marque</option>
                                            {brands.map((brand) => (
                                                <option key={brand} value={brand}>{brand}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Vehicles Grid */}
                            {filteredVehicles.length === 0 ? (
                                <div className="text-center py-16">
                                    <p className="text-lg text-[#666]">Aucun véhicule trouvé</p>
                                </div>
                            ) : (
                                <div ref={vehicleGridRef} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {filteredVehicles.map((vehicle) => (
                                        <VehicleCard
                                            key={vehicle.id}
                                            title={`${vehicle.brand} ${vehicle.model}`}
                                            type={vehicle.type}
                                            seats={`${vehicle.seats} places`}
                                            doors={`${vehicle.doors} portes`}
                                            price={`${vehicle.price_per_day}$`}
                                            unit="/jour"
                                            img={vehicle.images?.[0] || vehicle.image_url || '/clio.png'}
                                            ctaLabel="Réserver"
                                            onCtaClick={() => {
                                                setSelectedVehicle(vehicle);
                                                setShowModal(true);
                                            }}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Reservation Modal */}
            {selectedVehicle && (
                <ReservationModal
                    vehicle={{
                        id: selectedVehicle.id,
                        brand: selectedVehicle.brand,
                        model: selectedVehicle.model,
                        price_per_day: selectedVehicle.price_per_day,
                        image: selectedVehicle.images?.[0] || selectedVehicle.image_url,
                    }}
                    isOpen={showModal}
                    onClose={() => {
                        setShowModal(false);
                        setSelectedVehicle(null);
                    }}
                    onSuccess={() => {
                        alert('Réservation confirmée avec succès!');
                    }}
                />
            )}

            <Footer
                brand="LylaMobility"
                email="contact@lylamobility.fr"
                phone="06 06 06 06 06"
            />
        </div>
    );
}
