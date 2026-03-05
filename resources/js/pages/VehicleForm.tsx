import React, { useState, useEffect } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';
import { Save, X, Image as ImageIcon } from 'lucide-react';

interface Props {
    vehicleId?: number;
}

export default function VehicleForm({ vehicleId }: Props) {
    const isEditing = !!vehicleId;
    const [imagePreview, setImagePreview] = useState<string>('');
    
    const { data, setData, post, put, processing } = useForm({
        vehicle_type_id: 1,
        brand: '',
        model: '',
        license_plate: '',
        year: new Date().getFullYear(),
        status: 'available' as 'available' | 'rented' | 'maintenance',
        price_per_day: 0,
        seats: 5,
        doors: 4,
        transmission: 'manual' as 'manual' | 'automatic',
        fuel_type: 'gasoline' as 'gasoline' | 'diesel' | 'electric' | 'hybrid',
        images: [] as string[],
        is_active: true,
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Parc', href: '/vehicles-park' },
        { title: isEditing ? 'Modifier' : 'Ajouter', href: '#' },
    ];

    useEffect(() => {
        if (isEditing) {
            fetchVehicle();
        }
    }, [vehicleId]);

    const fetchVehicle = async () => {
        try {
            const response = await fetch(`/api/admin/vehicles/${vehicleId}`);
            const vehicleData = await response.json();
            if (vehicleData.success && vehicleData.data) {
                const v = vehicleData.data;
                setData({
                    vehicle_type_id: v.vehicle_type_id || 1,
                    brand: v.brand || '',
                    model: v.model || '',
                    license_plate: v.license_plate || '',
                    year: v.year || new Date().getFullYear(),
                    status: v.status || 'available',
                    price_per_day: v.price_per_day || 0,
                    seats: v.seats || 5,
                    doors: v.doors || 4,
                    transmission: v.transmission || 'manual',
                    fuel_type: v.fuel_type || 'gasoline',
                    images: v.images || [],
                    is_active: v.is_active ?? true,
                });
                if (v.images?.[0]) setImagePreview(v.images[0]);
            }
        } catch (error) {
            console.error('Error fetching vehicle:', error);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (isEditing) {
            put(`/vehicles/${vehicleId}`, {
                onSuccess: () => router.visit('/vehicles-park'),
                onError: (errors) => {
                    console.error('Erreurs:', errors);
                },
            });
        } else {
            post('/vehicles', {
                onSuccess: () => {
                    router.visit('/vehicles-park');
                },
                onError: (errors) => {
                    console.error('Erreurs:', errors);
                },
            });
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                setImagePreview(result);
                setData('images', [result]);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={isEditing ? 'Modifier le véhicule' : 'Ajouter un véhicule'} />
            <div className="p-8 bg-gradient-to-br from-[#FAFAF8] to-[#F0F0F0] min-h-screen">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-serif font-bold text-[#1a1a1a]">
                        {isEditing ? 'Modifier le véhicule' : 'Ajouter un véhicule'}
                    </h1>
                    <p className="text-sm text-[#666] mt-2">
                        Remplissez les informations du véhicule
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="max-w-5xl">
                    {/* Image Upload */}
                    <div className="bg-white rounded-3xl border border-black/5 shadow-sm p-8 mb-6">
                        <h2 className="text-xl font-serif font-bold text-[#1a1a1a] mb-6">Image du véhicule</h2>
                        
                        <div className="flex flex-col items-center">
                            <div className="relative w-full max-w-2xl h-64 rounded-2xl border-2 border-dashed border-black/10 bg-[#FAFAF8] overflow-hidden">
                                {imagePreview ? (
                                    <>
                                        <img 
                                            src={imagePreview} 
                                            alt="Preview" 
                                            className="w-full h-full object-contain"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setImagePreview('');
                                                setData('images', []);
                                            }}
                                            className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg hover:bg-red-50 hover:text-red-600 transition"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </>
                                ) : (
                                    <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer hover:bg-[#F5F5F5] transition">
                                        <ImageIcon className="w-12 h-12 text-[#999] mb-3" />
                                        <p className="text-sm text-[#666] mb-1">Cliquez pour télécharger une image</p>
                                        <p className="text-xs text-[#999]">PNG, JPG jusqu'à 5MB</p>
                                        <input 
                                            type="file" 
                                            accept="image/*" 
                                            onChange={handleImageUpload}
                                            className="hidden"
                                        />
                                    </label>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Informations principales */}
                    <div className="bg-white rounded-3xl border border-black/5 shadow-sm p-8 mb-6">
                        <h2 className="text-xl font-serif font-bold text-[#1a1a1a] mb-6">Informations principales</h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-semibold tracking-widest text-[#999] uppercase mb-2">
                                    Marque *
                                </label>
                                <input
                                    type="text"
                                    value={data.brand}
                                    onChange={(e) => setData('brand', e.target.value)}
                                    required
                                    placeholder="ex: Renault"
                                    className="w-full px-4 py-3 rounded-xl border border-black/10 bg-[#FAFAF8] text-sm text-[#1a1a1a] placeholder-[#999] focus:outline-none focus:border-[#091E79] focus:ring-2 focus:ring-[#091E79]/10"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold tracking-widest text-[#999] uppercase mb-2">
                                    Modèle *
                                </label>
                                <input
                                    type="text"
                                    value={data.model}
                                    onChange={(e) => setData('model', e.target.value)}
                                    required
                                    placeholder="ex: Clio V"
                                    className="w-full px-4 py-3 rounded-xl border border-black/10 bg-[#FAFAF8] text-sm text-[#1a1a1a] placeholder-[#999] focus:outline-none focus:border-[#091E79] focus:ring-2 focus:ring-[#091E79]/10"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold tracking-widest text-[#999] uppercase mb-2">
                                    Plaque *
                                </label>
                                <input
                                    type="text"
                                    value={data.license_plate}
                                    onChange={(e) => setData('license_plate', e.target.value)}
                                    required
                                    placeholder="ex: AB-123-CD"
                                    className="w-full px-4 py-3 rounded-xl border border-black/10 bg-[#FAFAF8] text-sm text-[#1a1a1a] placeholder-[#999] focus:outline-none focus:border-[#091E79] focus:ring-2 focus:ring-[#091E79]/10"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold tracking-widest text-[#999] uppercase mb-2">
                                    Année *
                                </label>
                                <input
                                    type="number"
                                    value={data.year}
                                    onChange={(e) => setData('year', parseInt(e.target.value))}
                                    required
                                    min="1900"
                                    max={new Date().getFullYear() + 1}
                                    className="w-full px-4 py-3 rounded-xl border border-black/10 bg-[#FAFAF8] text-sm text-[#1a1a1a] focus:outline-none focus:border-[#091E79] focus:ring-2 focus:ring-[#091E79]/10"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold tracking-widest text-[#999] uppercase mb-2">
                                    Statut *
                                </label>
                                <select
                                    value={data.status}
                                    onChange={(e) => setData('status', e.target.value as any)}
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-black/10 bg-[#FAFAF8] text-sm text-[#1a1a1a] focus:outline-none focus:border-[#091E79] focus:ring-2 focus:ring-[#091E79]/10"
                                >
                                    <option value="available">Disponible</option>
                                    <option value="rented">Loué</option>
                                    <option value="maintenance">En maintenance</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Caractéristiques */}
                    <div className="bg-white rounded-3xl border border-black/5 shadow-sm p-8 mb-6">
                        <h2 className="text-xl font-serif font-bold text-[#1a1a1a] mb-6">Caractéristiques</h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-xs font-semibold tracking-widest text-[#999] uppercase mb-2">
                                    Places *
                                </label>
                                <input
                                    type="number"
                                    value={data.seats}
                                    onChange={(e) => setData('seats', parseInt(e.target.value))}
                                    required
                                    min="2"
                                    max="9"
                                    className="w-full px-4 py-3 rounded-xl border border-black/10 bg-[#FAFAF8] text-sm text-[#1a1a1a] focus:outline-none focus:border-[#091E79] focus:ring-2 focus:ring-[#091E79]/10"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold tracking-widest text-[#999] uppercase mb-2">
                                    Portes *
                                </label>
                                <input
                                    type="number"
                                    value={data.doors}
                                    onChange={(e) => setData('doors', parseInt(e.target.value))}
                                    required
                                    min="2"
                                    max="5"
                                    className="w-full px-4 py-3 rounded-xl border border-black/10 bg-[#FAFAF8] text-sm text-[#1a1a1a] focus:outline-none focus:border-[#091E79] focus:ring-2 focus:ring-[#091E79]/10"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold tracking-widest text-[#999] uppercase mb-2">
                                    Prix/jour ($) *
                                </label>
                                <input
                                    type="number"
                                    value={data.price_per_day}
                                    onChange={(e) => setData('price_per_day', parseFloat(e.target.value))}
                                    required
                                    min="0"
                                    step="0.01"
                                    className="w-full px-4 py-3 rounded-xl border border-black/10 bg-[#FAFAF8] text-sm text-[#1a1a1a] focus:outline-none focus:border-[#091E79] focus:ring-2 focus:ring-[#091E79]/10"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold tracking-widest text-[#999] uppercase mb-2">
                                    Transmission *
                                </label>
                                <select
                                    value={data.transmission}
                                    onChange={(e) => setData('transmission', e.target.value as any)}
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-black/10 bg-[#FAFAF8] text-sm text-[#1a1a1a] focus:outline-none focus:border-[#091E79] focus:ring-2 focus:ring-[#091E79]/10"
                                >
                                    <option value="manual">Manuelle</option>
                                    <option value="automatic">Automatique</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold tracking-widest text-[#999] uppercase mb-2">
                                    Carburant *
                                </label>
                                <select
                                    value={data.fuel_type}
                                    onChange={(e) => setData('fuel_type', e.target.value as any)}
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-black/10 bg-[#FAFAF8] text-sm text-[#1a1a1a] focus:outline-none focus:border-[#091E79] focus:ring-2 focus:ring-[#091E79]/10"
                                >
                                    <option value="gasoline">Essence</option>
                                    <option value="diesel">Diesel</option>
                                    <option value="electric">Électrique</option>
                                    <option value="hybrid">Hybride</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4">
                        <button
                            type="submit"
                            disabled={processing}
                            className="flex items-center gap-2 px-8 py-3.5 bg-[#091E79] text-white rounded-xl hover:bg-[#071660] transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                        >
                            <Save className="w-5 h-5" />
                            {processing ? 'Enregistrement...' : isEditing ? 'Mettre à jour' : 'Ajouter'}
                        </button>
                        
                        <button
                            type="button"
                            onClick={() => router.visit('/vehicles-park')}
                            className="flex items-center gap-2 px-8 py-3.5 bg-white border border-black/10 text-[#1a1a1a] rounded-xl hover:bg-[#F5F5F5] transition font-medium"
                        >
                            <X className="w-5 h-5" />
                            Annuler
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
