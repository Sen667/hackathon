import { Head, router } from '@inertiajs/react';
import { useEffect, useState, useCallback } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import AppLayout from '@/layouts/app-layout';
import { vehicleApi, vehicleTypeApi } from '@/lib/api/vehicles';
import type { BreadcrumbItem, VehicleType, VehicleFormData } from '@/types';

type VehicleFormProps = {
    vehicleId?: number;
};

export default function VehicleForm({ vehicleId }: VehicleFormProps) {
    const isEdit = !!vehicleId;
    const [loading, setLoading] = useState(isEdit);
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([]);
    const [formData, setFormData] = useState<VehicleFormData>({
        vehicle_type_id: 0,
        brand: '',
        model: '',
        year: new Date().getFullYear(),
        license_plate: '',
        color: null,
        seats: 5,
        transmission: 'manual',
        fuel_type: 'gasoline',
        price_per_day: 0,
        price_per_hour: null,
        description: null,
        images: null,
        features: null,
        status: 'available',
        location: null,
        mileage: 0,
        is_active: true,
    });

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Admin',
            href: '/admin/dashboard',
        },
        {
            title: 'Véhicules',
            href: '/admin/vehicles',
        },
        {
            title: isEdit ? 'Modifier' : 'Nouveau',
            href: isEdit
                ? `/admin/vehicles/${vehicleId}/edit`
                : '/admin/vehicles/create',
        },
    ];

    const loadVehicleTypes = async () => {
        try {
            const response = await vehicleTypeApi.getAll();
            if (response.success && response.data) {
                setVehicleTypes(response.data);
            }
        } catch (err) {
            console.error('Erreur lors du chargement des types:', err);
        }
    };

    const loadVehicle = useCallback(async () => {
        if (!vehicleId) return;

        try {
            setLoading(true);
            const response = await vehicleApi.getOne(vehicleId);
            if (response.success && response.data) {
                const vehicle = response.data;
                setFormData({
                    vehicle_type_id: vehicle.vehicle_type_id,
                    brand: vehicle.brand,
                    model: vehicle.model,
                    year: vehicle.year,
                    license_plate: vehicle.license_plate,
                    color: vehicle.color,
                    seats: vehicle.seats,
                    transmission: vehicle.transmission,
                    fuel_type: vehicle.fuel_type,
                    price_per_day: vehicle.price_per_day,
                    price_per_hour: vehicle.price_per_hour,
                    description: vehicle.description,
                    images: vehicle.images,
                    features: vehicle.features,
                    status: vehicle.status,
                    location: vehicle.location,
                    mileage: vehicle.mileage,
                    is_active: vehicle.is_active,
                });
            }
        } catch (err) {
            console.error(err);
            router.visit('/admin/vehicles');
        } finally {
            setLoading(false);
        }
    }, [vehicleId]);

    useEffect(() => {
        loadVehicleTypes();
        if (vehicleId) {
            loadVehicle();
        }
    }, [vehicleId, loadVehicle]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});
        setSaving(true);

        try {
            if (isEdit && vehicleId) {
                await vehicleApi.update(vehicleId, formData);
            } else {
                await vehicleApi.create(formData);
            }
            router.visit('/admin/vehicles');
        } catch (err) {
            if (err instanceof Error) {
                setErrors({ general: err.message });
            }
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (
        field: keyof VehicleFormData,
        value: string | number | boolean | string[] | null,
    ) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => ({ ...prev, [field]: '' }));
    };

    const handleFeaturesChange = (value: string) => {
        const features = value
            .split(',')
            .map((f) => f.trim())
            .filter((f) => f);
        handleChange('features', features.length > 0 ? features : null);
    };

    const handleImagesChange = (value: string) => {
        const images = value
            .split('\n')
            .map((i) => i.trim())
            .filter((i) => i);
        handleChange('images', images.length > 0 ? images : null);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head
                title={isEdit ? 'Modifier le véhicule' : 'Nouveau véhicule'}
            />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div>
                    <h1 className="text-2xl font-bold">
                        {isEdit ? 'Modifier le véhicule' : 'Nouveau véhicule'}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        {isEdit
                            ? 'Modifiez les informations du véhicule'
                            : 'Créez un nouveau véhicule'}
                    </p>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <Spinner />
                    </div>
                ) : (
                    <Card className="max-w-4xl p-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {errors.general && (
                                <div className="rounded-lg bg-destructive/15 p-3 text-sm text-destructive">
                                    {errors.general}
                                </div>
                            )}

                            {/* Informations de base */}
                            <div className="space-y-4">
                                <h2 className="text-lg font-semibold">
                                    Informations de base
                                </h2>

                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="vehicle_type_id">
                                            Type de véhicule *
                                        </Label>
                                        <Select
                                            value={String(
                                                formData.vehicle_type_id,
                                            )}
                                            onValueChange={(value) =>
                                                handleChange(
                                                    'vehicle_type_id',
                                                    parseInt(value),
                                                )
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Sélectionner un type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {vehicleTypes.map((type) => (
                                                    <SelectItem
                                                        key={type.id}
                                                        value={String(type.id)}
                                                    >
                                                        {type.icon} {type.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.vehicle_type_id && (
                                            <InputError
                                                message={errors.vehicle_type_id}
                                            />
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="brand">Marque *</Label>
                                        <Input
                                            id="brand"
                                            value={formData.brand}
                                            onChange={(e) =>
                                                handleChange(
                                                    'brand',
                                                    e.target.value,
                                                )
                                            }
                                            required
                                            placeholder="Ex: Toyota, Peugeot..."
                                        />
                                        {errors.brand && (
                                            <InputError
                                                message={errors.brand}
                                            />
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="model">Modèle *</Label>
                                        <Input
                                            id="model"
                                            value={formData.model}
                                            onChange={(e) =>
                                                handleChange(
                                                    'model',
                                                    e.target.value,
                                                )
                                            }
                                            required
                                            placeholder="Ex: Yaris, 208..."
                                        />
                                        {errors.model && (
                                            <InputError
                                                message={errors.model}
                                            />
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="year">Année *</Label>
                                        <Input
                                            id="year"
                                            type="number"
                                            value={formData.year}
                                            onChange={(e) =>
                                                handleChange(
                                                    'year',
                                                    parseInt(e.target.value),
                                                )
                                            }
                                            required
                                            min={1900}
                                            max={new Date().getFullYear() + 1}
                                        />
                                        {errors.year && (
                                            <InputError message={errors.year} />
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="license_plate">
                                            Plaque d'immatriculation *
                                        </Label>
                                        <Input
                                            id="license_plate"
                                            value={formData.license_plate}
                                            onChange={(e) =>
                                                handleChange(
                                                    'license_plate',
                                                    e.target.value.toUpperCase(),
                                                )
                                            }
                                            required
                                            placeholder="Ex: AB-123-CD"
                                        />
                                        {errors.license_plate && (
                                            <InputError
                                                message={errors.license_plate}
                                            />
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="color">Couleur</Label>
                                        <Input
                                            id="color"
                                            value={formData.color || ''}
                                            onChange={(e) =>
                                                handleChange(
                                                    'color',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Ex: Noir, Blanc..."
                                        />
                                        {errors.color && (
                                            <InputError
                                                message={errors.color}
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Caractéristiques techniques */}
                            <div className="space-y-4">
                                <h2 className="text-lg font-semibold">
                                    Caractéristiques techniques
                                </h2>

                                <div className="grid gap-4 md:grid-cols-3">
                                    <div className="space-y-2">
                                        <Label htmlFor="seats">
                                            Nombre de places *
                                        </Label>
                                        <Input
                                            id="seats"
                                            type="number"
                                            value={formData.seats}
                                            onChange={(e) =>
                                                handleChange(
                                                    'seats',
                                                    parseInt(e.target.value),
                                                )
                                            }
                                            required
                                            min={1}
                                            max={50}
                                        />
                                        {errors.seats && (
                                            <InputError
                                                message={errors.seats}
                                            />
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="transmission">
                                            Transmission *
                                        </Label>
                                        <Select
                                            value={formData.transmission}
                                            onValueChange={(
                                                value: 'manual' | 'automatic',
                                            ) =>
                                                handleChange(
                                                    'transmission',
                                                    value,
                                                )
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="manual">
                                                    Manuelle
                                                </SelectItem>
                                                <SelectItem value="automatic">
                                                    Automatique
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.transmission && (
                                            <InputError
                                                message={errors.transmission}
                                            />
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="fuel_type">
                                            Type de carburant *
                                        </Label>
                                        <Select
                                            value={formData.fuel_type}
                                            onValueChange={(
                                                value:
                                                    | 'gasoline'
                                                    | 'diesel'
                                                    | 'electric'
                                                    | 'hybrid',
                                            ) =>
                                                handleChange('fuel_type', value)
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="gasoline">
                                                    Essence
                                                </SelectItem>
                                                <SelectItem value="diesel">
                                                    Diesel
                                                </SelectItem>
                                                <SelectItem value="electric">
                                                    Électrique
                                                </SelectItem>
                                                <SelectItem value="hybrid">
                                                    Hybride
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.fuel_type && (
                                            <InputError
                                                message={errors.fuel_type}
                                            />
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="mileage">
                                            Kilométrage
                                        </Label>
                                        <Input
                                            id="mileage"
                                            type="number"
                                            value={formData.mileage}
                                            onChange={(e) =>
                                                handleChange(
                                                    'mileage',
                                                    parseInt(e.target.value),
                                                )
                                            }
                                            min={0}
                                        />
                                        {errors.mileage && (
                                            <InputError
                                                message={errors.mileage}
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Prix et disponibilité */}
                            <div className="space-y-4">
                                <h2 className="text-lg font-semibold">
                                    Prix et disponibilité
                                </h2>

                                <div className="grid gap-4 md:grid-cols-3">
                                    <div className="space-y-2">
                                        <Label htmlFor="price_per_day">
                                            Prix par jour (€) *
                                        </Label>
                                        <Input
                                            id="price_per_day"
                                            type="number"
                                            step="0.01"
                                            value={formData.price_per_day}
                                            onChange={(e) =>
                                                handleChange(
                                                    'price_per_day',
                                                    parseFloat(e.target.value),
                                                )
                                            }
                                            required
                                            min={0}
                                        />
                                        {errors.price_per_day && (
                                            <InputError
                                                message={errors.price_per_day}
                                            />
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="price_per_hour">
                                            Prix par heure (€)
                                        </Label>
                                        <Input
                                            id="price_per_hour"
                                            type="number"
                                            step="0.01"
                                            value={
                                                formData.price_per_hour || ''
                                            }
                                            onChange={(e) =>
                                                handleChange(
                                                    'price_per_hour',
                                                    e.target.value
                                                        ? parseFloat(
                                                              e.target.value,
                                                          )
                                                        : null,
                                                )
                                            }
                                            min={0}
                                        />
                                        {errors.price_per_hour && (
                                            <InputError
                                                message={errors.price_per_hour}
                                            />
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="status">Statut *</Label>
                                        <Select
                                            value={formData.status}
                                            onValueChange={(
                                                value:
                                                    | 'available'
                                                    | 'rented'
                                                    | 'maintenance'
                                                    | 'unavailable',
                                            ) => handleChange('status', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="available">
                                                    Disponible
                                                </SelectItem>
                                                <SelectItem value="rented">
                                                    Loué
                                                </SelectItem>
                                                <SelectItem value="maintenance">
                                                    Maintenance
                                                </SelectItem>
                                                <SelectItem value="unavailable">
                                                    Indisponible
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.status && (
                                            <InputError
                                                message={errors.status}
                                            />
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="location">
                                            Localisation
                                        </Label>
                                        <Input
                                            id="location"
                                            value={formData.location || ''}
                                            onChange={(e) =>
                                                handleChange(
                                                    'location',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Ex: Paris, Agence Nord..."
                                        />
                                        {errors.location && (
                                            <InputError
                                                message={errors.location}
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Description et détails */}
                            <div className="space-y-4">
                                <h2 className="text-lg font-semibold">
                                    Description et détails
                                </h2>

                                <div className="space-y-2">
                                    <Label htmlFor="description">
                                        Description
                                    </Label>
                                    <textarea
                                        id="description"
                                        className="flex min-h-25 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                        value={formData.description || ''}
                                        onChange={(e) =>
                                            handleChange(
                                                'description',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Description détaillée du véhicule..."
                                    />
                                    {errors.description && (
                                        <InputError
                                            message={errors.description}
                                        />
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="features">
                                        Équipements (séparés par des virgules)
                                    </Label>
                                    <Input
                                        id="features"
                                        value={
                                            formData.features?.join(', ') || ''
                                        }
                                        onChange={(e) =>
                                            handleFeaturesChange(e.target.value)
                                        }
                                        placeholder="Ex: Climatisation, GPS, Bluetooth..."
                                    />
                                    {errors.features && (
                                        <InputError message={errors.features} />
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="images">
                                        URLs des images (une par ligne)
                                    </Label>
                                    <textarea
                                        id="images"
                                        className="flex min-h-25 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                        value={
                                            formData.images?.join('\n') || ''
                                        }
                                        onChange={(e) =>
                                            handleImagesChange(e.target.value)
                                        }
                                        placeholder="https://example.com/image1.jpg"
                                    />
                                    {errors.images && (
                                        <InputError message={errors.images} />
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="is_active"
                                    checked={formData.is_active}
                                    onCheckedChange={(checked) =>
                                        handleChange('is_active', !!checked)
                                    }
                                />
                                <Label
                                    htmlFor="is_active"
                                    className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    Véhicule actif
                                </Label>
                            </div>

                            <div className="flex gap-2 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() =>
                                        router.visit('/admin/vehicles')
                                    }
                                    disabled={saving}
                                >
                                    Annuler
                                </Button>
                                <Button type="submit" disabled={saving}>
                                    {saving && <Spinner className="mr-2" />}
                                    {isEdit ? 'Enregistrer' : 'Créer'}
                                </Button>
                            </div>
                        </form>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
