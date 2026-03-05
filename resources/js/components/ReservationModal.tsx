import { useState } from 'react';
import { X, Calendar, Clock } from 'lucide-react';
import axios from 'axios';

axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;

interface ReservationModalProps {
    vehicle: {
        id: number;
        brand: string;
        model: string;
        price_per_day: number;
        image?: string;
    };
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function ReservationModal({ vehicle, isOpen, onClose, onSuccess }: ReservationModalProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [startTime, setStartTime] = useState('10:00');
    const [endTime, setEndTime] = useState('10:00');

    if (!isOpen) return null;

    const calculateTotal = () => {
        if (!startDate || !endDate) return 0;
        const start = new Date(startDate);
        const end = new Date(endDate);
        const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
        return days * vehicle.price_per_day;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await axios.post('/reservations', {
                vehicle_id: vehicle.id,
                start_date: `${startDate} ${startTime}:00`,
                end_date: `${endDate} ${endTime}:00`,
            });

            onSuccess();
            onClose();
        } catch (err: any) {
            console.error('Erreur:', err);
            
            if (err.response?.status === 401 || err.response?.status === 419) {
                setError('Vous devez être connecté pour réserver');
                setTimeout(() => window.location.href = '/login', 2000);
            } else if (err.response?.status === 422) {
                setError(err.response.data.message || 'Ce véhicule n\'est pas disponible pour ces dates');
            } else {
                setError(err.response?.data?.message || 'Erreur lors de la réservation');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-8">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-6">
                        <div>
                            <h2 className="text-3xl font-serif font-bold text-[#1a1a1a]">
                                Réserver un véhicule
                            </h2>
                            <p className="text-sm text-[#666] mt-1">
                                {vehicle.brand} {vehicle.model}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-full transition"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Vehicle Info */}
                    <div className="bg-[#FAFAF8] rounded-2xl p-6 mb-6">
                        <div className="flex items-center gap-4">
                            {vehicle.image && (
                                <img src={vehicle.image} alt={vehicle.model} className="w-32 h-24 object-cover rounded-lg" />
                            )}
                            <div>
                                <h3 className="text-xl font-bold text-[#1a1a1a]">
                                    {vehicle.brand} {vehicle.model}
                                </h3>
                                <p className="text-2xl font-bold text-[#091E79] mt-2">
                                    {vehicle.price_per_day}$ <span className="text-sm text-[#666]">/jour</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-6">
                            {/* Dates */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-[#1a1a1a] mb-2">
                                        <Calendar className="w-4 h-4 inline mr-2" />
                                        Date de début
                                    </label>
                                    <input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        min={new Date().toISOString().split('T')[0]}
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-black/10 bg-[#FAFAF8] text-sm text-[#1a1a1a] focus:outline-none focus:border-[#091E79] focus:ring-2 focus:ring-[#091E79]/10"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-[#1a1a1a] mb-2">
                                        <Clock className="w-4 h-4 inline mr-2" />
                                        Heure
                                    </label>
                                    <input
                                        type="time"
                                        value={startTime}
                                        onChange={(e) => setStartTime(e.target.value)}
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-black/10 bg-[#FAFAF8] text-sm text-[#1a1a1a] focus:outline-none focus:border-[#091E79] focus:ring-2 focus:ring-[#091E79]/10"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-[#1a1a1a] mb-2">
                                        <Calendar className="w-4 h-4 inline mr-2" />
                                        Date de fin
                                    </label>
                                    <input
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        min={startDate || new Date().toISOString().split('T')[0]}
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-black/10 bg-[#FAFAF8] text-sm text-[#1a1a1a] focus:outline-none focus:border-[#091E79] focus:ring-2 focus:ring-[#091E79]/10"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-[#1a1a1a] mb-2">
                                        <Clock className="w-4 h-4 inline mr-2" />
                                        Heure
                                    </label>
                                    <input
                                        type="time"
                                        value={endTime}
                                        onChange={(e) => setEndTime(e.target.value)}
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-black/10 bg-[#FAFAF8] text-sm text-[#1a1a1a] focus:outline-none focus:border-[#091E79] focus:ring-2 focus:ring-[#091E79]/10"
                                    />
                                </div>
                            </div>

                            {/* Total */}
                            {startDate && endDate && (
                                <div className="bg-[#091E79]/5 rounded-2xl p-6">
                                    <div className="flex items-center justify-between">
                                        <span className="text-lg font-semibold text-[#1a1a1a]">Total</span>
                                        <span className="text-3xl font-bold text-[#091E79]">
                                            {calculateTotal()}$
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* Error */}
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
                                    {error}
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex gap-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 px-8 py-4 bg-[#091E79] text-white rounded-xl hover:bg-[#071660] transition disabled:opacity-50 font-semibold text-lg"
                                >
                                    {loading ? 'Réservation...' : 'Confirmer la réservation'}
                                </button>
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-8 py-4 bg-white border border-black/10 text-[#1a1a1a] rounded-xl hover:bg-gray-50 transition font-semibold"
                                >
                                    Annuler
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
