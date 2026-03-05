import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';
import { Calendar, Car, Clock, MapPin } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard() },
    { title: 'Mes réservations', href: '#' },
];

interface Booking {
    id: number;
    start_date: string;
    end_date: string;
    total_amount: number;
    status: string;
    vehicle: {
        brand: string;
        model: string;
        images?: string[];
    };
}

interface Props {
    bookings: Booking[];
}

export default function UserDashboard({ bookings }: Props) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'confirmed': return 'bg-green-100 text-green-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            case 'completed': return 'bg-blue-100 text-blue-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'confirmed': return 'Confirmé';
            case 'pending': return 'En attente';
            case 'cancelled': return 'Annulé';
            case 'completed': return 'Terminé';
            default: return status;
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Mes Réservations" />
            <div className="p-8 bg-gradient-to-br from-[#FAFAF8] to-[#F0F0F0] min-h-screen">
                <div className="mb-8">
                    <h1 className="text-4xl font-serif font-bold text-[#1a1a1a]">Mes Réservations</h1>
                    <p className="text-sm text-[#666] mt-2">Gérez vos locations de véhicules</p>
                </div>

                {bookings.length === 0 ? (
                    <div className="bg-white rounded-3xl border border-black/5 shadow-sm p-16 text-center">
                        <Car className="w-16 h-16 mx-auto text-[#999] mb-4" />
                        <h3 className="text-xl font-bold text-[#1a1a1a] mb-2">Aucune réservation</h3>
                        <p className="text-[#666] mb-6">Vous n'avez pas encore de réservation</p>
                        <a
                            href="/catalogue"
                            className="inline-block px-8 py-3 bg-[#091E79] text-white rounded-xl hover:bg-[#071660] transition font-semibold"
                        >
                            Explorer le catalogue
                        </a>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {bookings.map((booking) => (
                            <div key={booking.id} className="bg-white rounded-3xl border border-black/5 shadow-sm p-6 hover:shadow-lg transition">
                                <div className="flex gap-6">
                                    {/* Vehicle Image */}
                                    {booking.vehicle.images?.[0] && (
                                        <img
                                            src={booking.vehicle.images[0]}
                                            alt={`${booking.vehicle.brand} ${booking.vehicle.model}`}
                                            className="w-48 h-32 object-cover rounded-2xl"
                                        />
                                    )}

                                    {/* Booking Info */}
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <h3 className="text-2xl font-bold text-[#1a1a1a]">
                                                    {booking.vehicle.brand} {booking.vehicle.model}
                                                </h3>
                                                <p className="text-sm text-[#666] mt-1">Réservation #{booking.id}</p>
                                            </div>
                                            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(booking.status)}`}>
                                                {getStatusLabel(booking.status)}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 mb-4">
                                            <div className="flex items-center gap-2 text-[#666]">
                                                <Calendar className="w-5 h-5" />
                                                <div>
                                                    <p className="text-xs text-[#999]">Début</p>
                                                    <p className="text-sm font-semibold text-[#1a1a1a]">
                                                        {new Date(booking.start_date).toLocaleDateString('fr-FR')}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 text-[#666]">
                                                <Calendar className="w-5 h-5" />
                                                <div>
                                                    <p className="text-xs text-[#999]">Fin</p>
                                                    <p className="text-sm font-semibold text-[#1a1a1a]">
                                                        {new Date(booking.end_date).toLocaleDateString('fr-FR')}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between pt-4 border-t border-black/5">
                                            <div>
                                                <p className="text-xs text-[#999]">Total</p>
                                                <p className="text-2xl font-bold text-[#091E79]">{booking.total_amount}$</p>
                                            </div>
                                            <button className="px-6 py-2 bg-[#091E79] text-white rounded-xl hover:bg-[#071660] transition text-sm font-semibold">
                                                Voir les détails
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
