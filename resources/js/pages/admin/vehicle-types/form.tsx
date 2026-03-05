import { Head, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AppLayout from '@/layouts/app-layout';
import { vehicleTypeApi } from '@/lib/api/vehicles';
import type { BreadcrumbItem, VehicleType, VehicleTypeFormData } from '@/types';

type VehicleTypeFormProps = {
    vehicleTypeId?: number;
};

export default function VehicleTypeForm({
    vehicleTypeId,
}: VehicleTypeFormProps) {
    const isEdit = !!vehicleTypeId;
    const [loading, setLoading] = useState(isEdit);
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [formData, setFormData] = useState<VehicleTypeFormData>({
        name: '',
        description: null,
        icon: null,
        is_active: true,
    });

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Admin',
            href: '/admin/dashboard',
        },
        {
            title: 'Types de véhicules',
            href: '/admin/vehicle-types',
        },
        {
            title: isEdit ? 'Modifier' : 'Nouveau',
            href: isEdit
                ? `/admin/vehicle-types/${vehicleTypeId}/edit`
                : '/admin/vehicle-types/create',
        },
    ];

    useEffect(() => {
        if (vehicleTypeId) {
            loadVehicleType();
        }
    }, [vehicleTypeId]);

    const loadVehicleType = async () => {
        if (!vehicleTypeId) return;

        try {
            setLoading(true);
            const response = await vehicleTypeApi.getOne(vehicleTypeId);
            if (response.success && response.data) {
                const type = response.data;
                setFormData({
                    name: type.name,
                    description: type.description,
                    icon: type.icon,
                    is_active: type.is_active,
                });
            }
        } catch (err) {
            console.error(err);
            router.visit('/admin/vehicle-types');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});
        setSaving(true);

        try {
            if (isEdit && vehicleTypeId) {
                await vehicleTypeApi.update(vehicleTypeId, formData);
            } else {
                await vehicleTypeApi.create(formData);
            }
            router.visit('/admin/vehicle-types');
        } catch (err) {
            if (err instanceof Error) {
                setErrors({ general: err.message });
            }
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (
        field: keyof VehicleTypeFormData,
        value: string | boolean,
    ) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => ({ ...prev, [field]: '' }));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={isEdit ? 'Modifier le type' : 'Nouveau type'} />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div>
                    <h1 className="text-2xl font-bold">
                        {isEdit
                            ? 'Modifier le type de véhicule'
                            : 'Nouveau type de véhicule'}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        {isEdit
                            ? 'Modifiez les informations du type'
                            : 'Créez un nouveau type de véhicule'}
                    </p>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <Spinner />
                    </div>
                ) : (
                    <Card className="max-w-2xl p-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {errors.general && (
                                <div className="rounded-lg bg-destructive/15 p-3 text-sm text-destructive">
                                    {errors.general}
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="name">Nom *</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) =>
                                        handleChange('name', e.target.value)
                                    }
                                    required
                                    placeholder="Ex: SUV, Berline, Citadine..."
                                />
                                {errors.name && (
                                    <InputError message={errors.name} />
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="icon">Icône (emoji)</Label>
                                <Input
                                    id="icon"
                                    value={formData.icon || ''}
                                    onChange={(e) =>
                                        handleChange('icon', e.target.value)
                                    }
                                    placeholder="Ex: 🚗, 🚙, 🏎️..."
                                    maxLength={2}
                                />
                                {errors.icon && (
                                    <InputError message={errors.icon} />
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
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
                                    placeholder="Description du type de véhicule..."
                                />
                                {errors.description && (
                                    <InputError message={errors.description} />
                                )}
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
                                    Type actif
                                </Label>
                            </div>

                            <div className="flex gap-2 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() =>
                                        router.visit('/admin/vehicle-types')
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
