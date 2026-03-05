import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import VehicleCard from '@/components/VehicleCard';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
    },
    {
        title: 'Parc de véhicules',
        href: '/vehicles',
    },
];

interface Vehicle {
    id: number;
    brand: string;
    model: string;
    type: string;
    license_plate: string;
    year: number;
    status: 'available' | 'rented' | 'maintenance';
    price_per_day: number;
    seats: number;
    doors: number;
    transmission: string;
    fuel_type: string;
    image_url?: string;
    images?: string[];
}

interface Props {
    vehicles: Vehicle[];
}

export default function VehiclesPark({ vehicles: initialVehicles }: Props) {
    const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');

    const handleDelete = async (id: number) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer ce véhicule ?')) return;
        
        try {
            await fetch(`/api/admin/vehicles/${id}`, { 
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                }
            });
            setVehicles(vehicles.filter(v => v.id !== id));
        } catch (error) {
            console.error('Error deleting vehicle:', error);
        }
    };

    const filteredVehicles = vehicles.filter(vehicle => {
        const matchesSearch = 
            vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
            vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
            vehicle.license_plate.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesType = filterType === 'all' || vehicle.type === filterType;
        const matchesStatus = filterStatus === 'all' || vehicle.status === filterStatus;
        
        return matchesSearch && matchesType && matchesStatus;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'available': return 'bg-green-100 text-green-800';
            case 'rented': return 'bg-orange-100 text-orange-800';
            case 'maintenance': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'available': return 'Disponible';
            case 'rented': return 'Loué';
            case 'maintenance': return 'Maintenance';
            default: return status;
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Parc de véhicules" />
            <div className="p-8 bg-white min-h-screen">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-serif font-bold text-[#1a1a1a]">Catalogue</h1>
                        <p className="text-sm text-[#666] mt-1">Gestion du parc de véhicules</p>
                    </div>
                    <button
                        onClick={() => router.visit('/admin/vehicles/create')}
                        className="flex items-center gap-2 px-6 py-3 bg-[#091E79] text-white rounded-xl hover:bg-[#071660] transition"
                    >
                        <Plus className="w-5 h-5" />
                        Ajouter un véhicule
                    </button>
                </div>

                {/* Filters Section */}
                <div className="bg-[#FAFAF8] rounded-2xl border border-black/5 p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Search */}
                        <div className="relative">
                            <label className="block text-xs font-semibold tracking-widest text-[#999] uppercase mb-2">
                                Recherche
                            </label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666]" />
                                <input
                                    type="text"
                                    placeholder="Clio V"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-black/10 bg-white text-sm text-[#1a1a1a] placeholder-[#999] focus:outline-none focus:border-[#091E79] focus:ring-2 focus:ring-[#091E79]/10"
                                />
                            </div>
                        </div>

                        {/* Type Filter */}
                        <div>
                            <label className="block text-xs font-semibold tracking-widest text-[#999] uppercase mb-2">
                                Type de véhicules
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {['all', 'SUV', 'Berline', 'Hybride', 'Électrique'].map((type) => (
                                    <button
                                        key={type}
                                        onClick={() => setFilterType(type)}
                                        className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                                            filterType === type
                                                ? 'bg-[#091E79] text-white'
                                                : 'bg-white text-[#666] border border-black/10 hover:border-[#091E79]'
                                        }`}
                                    >
                                        {type === 'all' ? 'Tous' : type}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Status Filter */}
                        <div>
                            <label className="block text-xs font-semibold tracking-widest text-[#999] uppercase mb-2">
                                Statut
                            </label>
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-black/10 bg-white text-sm text-[#1a1a1a] focus:outline-none focus:border-[#091E79] focus:ring-2 focus:ring-[#091E79]/10"
                            >
                                <option value="all">Tous les statuts</option>
                                <option value="available">Disponible</option>
                                <option value="rented">Loué</option>
                                <option value="maintenance">Maintenance</option>
                            </select>
                        </div>
                    </div>
                </div>

                {!loading && filteredVehicles.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-[#666] text-lg">Aucun véhicule trouvé</p>
                    </div>
                )}

                {/* Vehicles Grid with VehicleCard */}
                {!loading && filteredVehicles.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredVehicles.map((vehicle) => (
                            <div key={vehicle.id} className="relative group">
                                <VehicleCard
                                    title={`${vehicle.brand} ${vehicle.model}`}
                                    type={vehicle.type}
                                    seats={`${vehicle.seats} places`}
                                    doors={`${vehicle.doors} portes`}
                                    price={`${vehicle.price_per_day}$`}
                                    unit="/jour"
                                    img={vehicle.images?.[0] || vehicle.image_url || '/clio.png'}
                                />
                                
                                {/* Action buttons overlay */}
                                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => router.visit(`/admin/vehicles/${vehicle.id}/edit`)}
                                        className="p-2 bg-white rounded-lg shadow-lg hover:bg-[#091E79] hover:text-white transition"
                                        title="Modifier"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(vehicle.id)}
                                        className="p-2 bg-white rounded-lg shadow-lg hover:bg-red-600 hover:text-white transition"
                                        title="Supprimer"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* Status badge */}
                                <div className="absolute top-4 left-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(vehicle.status)}`}>
                                        {getStatusLabel(vehicle.status)}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
