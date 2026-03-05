import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';
import React, { useState, useEffect } from 'react';
import {
    Package,
    CheckCircle,
    Clock,
    FileText,
    Loader2
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
    },
];

interface Stats {
    total_vehicles: number;
    available_vehicles: number;
    rented_vehicles: number;
    maintenance_vehicles: number;
    upcoming_bookings: number;
    ongoing_bookings: number;
    total_bookings: number;
}

interface AvailabilityByType {
    name: string;
    total: number;
    available: number;
    rented: number;
}

interface Booking {
    id: number;
    booking_number: string;
    user: { name: string; email: string };
    vehicle: { name: string; license_plate: string };
    start_date: string;
    end_date: string;
    status: string;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export default function Dashboard() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [stats, setStats] = useState<Stats>({
        total_vehicles: 0,
        available_vehicles: 0,
        rented_vehicles: 0,
        maintenance_vehicles: 0,
        upcoming_bookings: 0,
        ongoing_bookings: 0,
        total_bookings: 0,
    });
    const [availabilityByType, setAvailabilityByType] = useState<AvailabilityByType[]>([]);
    const [upcomingBookings, setUpcomingBookings] = useState<Booking[]>([]);
    const [ongoingBookings, setOngoingBookings] = useState<Booking[]>([]);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(`${API_BASE_URL}/dashboard/all`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch dashboard data');
            }

            const data = await response.json();

            setStats(data.stats);
            setAvailabilityByType(data.availabilityByType);
            setUpcomingBookings(data.upcomingBookings);
            setOngoingBookings(data.ongoingBookings);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            console.error('Error fetching dashboard data:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Dashboard" />
                <div className="flex items-center justify-center min-h-screen">
                    <Loader2 className="w-8 h-8 animate-spin text-[#1a1a1a]" />
                </div>
            </AppLayout>
        );
    }

    if (error) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Dashboard" />
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <p className="text-red-600 mb-4">{error}</p>
                        <button
                            onClick={fetchDashboardData}
                            className="px-4 py-2 bg-[#1a1a1a] text-white rounded-lg hover:bg-[#333] transition"
                        >
                            Réessayer
                        </button>
                    </div>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="p-6 bg-white min-h-screen">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-serif font-bold text-[#1a1a1a]">Dashboard</h1>
                    <p className="text-sm text-[#666] mt-1">Vue d'ensemble de votre activité</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-2xl border border-black/10 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-[#666]">Véhicules Total</p>
                                <p className="text-3xl font-serif font-bold text-[#1a1a1a] mt-2">{stats.total_vehicles}</p>
                            </div>
                            <div className="w-12 h-12 bg-[#FAFAF8] rounded-xl flex items-center justify-center">
                                <Package className="w-6 h-6 text-[#1a1a1a]" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-black/10 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-[#666]">Disponibles</p>
                                <p className="text-3xl font-serif font-bold text-green-600 mt-2">{stats.available_vehicles}</p>
                            </div>
                            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                                <CheckCircle className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-black/10 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-[#666]">En Location</p>
                                <p className="text-3xl font-serif font-bold text-[#1a1a1a] mt-2">{stats.rented_vehicles}</p>
                            </div>
                            <div className="w-12 h-12 bg-[#FAFAF8] rounded-xl flex items-center justify-center">
                                <Clock className="w-6 h-6 text-[#1a1a1a]" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-black/10 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-[#666]">Réservations</p>
                                <p className="text-3xl font-serif font-bold text-[#1a1a1a] mt-2">{stats.total_bookings}</p>
                            </div>
                            <div className="w-12 h-12 bg-[#FAFAF8] rounded-xl flex items-center justify-center">
                                <FileText className="w-6 h-6 text-[#1a1a1a]" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Availability by Type */}
                <div className="bg-white rounded-2xl border border-black/10 p-6 mb-8">
                    <h2 className="text-xl font-serif font-bold text-[#1a1a1a] mb-6">Disponibilité par Type</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {availabilityByType.map((type) => (
                            <div key={type.name} className="border border-black/5 rounded-xl p-4 bg-[#FAFAF8]">
                                <h3 className="font-semibold text-[#1a1a1a] mb-3">{type.name}</h3>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-[#666]">Total:</span>
                                        <span className="font-medium text-[#1a1a1a]">{type.total}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-[#666]">Disponibles:</span>
                                        <span className="font-medium text-green-600">{type.available}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-[#666]">Loués:</span>
                                        <span className="font-medium text-[#1a1a1a]">{type.rented}</span>
                                    </div>
                                </div>
                                <div className="mt-4 bg-white rounded-full h-2 overflow-hidden">
                                    <div
                                        className="bg-[#1a1a1a] h-2 rounded-full transition-all"
                                        style={{ width: `${type.total > 0 ? (type.available / type.total) * 100 : 0}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Ongoing Bookings */}
                {ongoingBookings.length > 0 && (
                    <div className="bg-white rounded-2xl border border-black/10 p-6 mb-8">
                        <h2 className="text-xl font-serif font-bold text-[#1a1a1a] mb-6">Contrats en Cours</h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead>
                                    <tr className="border-b border-black/5">
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-[#666] uppercase">N° Réservation</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-[#666] uppercase">Client</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-[#666] uppercase">Véhicule</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-[#666] uppercase">Dates</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-[#666] uppercase">Statut</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-black/5">
                                    {ongoingBookings.map((booking) => (
                                        <tr key={booking.id} className="hover:bg-[#FAFAF8] transition">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#1a1a1a]">{booking.booking_number}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-[#666]">{booking.user.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-[#666]">{booking.vehicle.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-[#666]">{booking.start_date} - {booking.end_date}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-[#1a1a1a] text-white">En cours</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Upcoming Bookings */}
                {upcomingBookings.length > 0 && (
                    <div className="bg-white rounded-2xl border border-black/10 p-6">
                        <h2 className="text-xl font-serif font-bold text-[#1a1a1a] mb-6">Réservations à Venir</h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead>
                                    <tr className="border-b border-black/5">
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-[#666] uppercase">N° Réservation</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-[#666] uppercase">Client</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-[#666] uppercase">Véhicule</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-[#666] uppercase">Dates</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-[#666] uppercase">Statut</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-black/5">
                                    {upcomingBookings.map((booking) => (
                                        <tr key={booking.id} className="hover:bg-[#FAFAF8] transition">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#1a1a1a]">{booking.booking_number}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-[#666]">{booking.user.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-[#666]">{booking.vehicle.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-[#666]">{booking.start_date} - {booking.end_date}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">Confirmé</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
