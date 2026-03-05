import { Head, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
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
import type { BreadcrumbItem, Vehicle, VehicleType } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin',
        href: '/admin/dashboard',
    },
    {
        title: 'Véhicules',
        href: '/admin/vehicles',
    },
];

const statusLabels: Record<string, string> = {
    available: 'Disponible',
    rented: 'Loué',
    maintenance: 'Maintenance',
    unavailable: 'Indisponible',
};

const statusColors: Record<
    string,
    'default' | 'secondary' | 'destructive' | 'outline'
> = {
    available: 'default',
    rented: 'secondary',
    maintenance: 'outline',
    unavailable: 'destructive',
};

export default function VehiclesList() {
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [deleteDialog, setDeleteDialog] = useState<{
        open: boolean;
        vehicle: Vehicle | null;
    }>({ open: false, vehicle: null });
    const [deleting, setDeleting] = useState(false);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        lastPage: 1,
        total: 0,
    });
    const [filters, setFilters] = useState({
        search: '',
        vehicle_type_id: '',
        status: '',
        is_active: '',
    });

    useEffect(() => {
        loadVehicleTypes();
    }, []);

    useEffect(() => {
        loadVehicles();
    }, [filters, pagination.currentPage]);

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

    const loadVehicles = async () => {
        try {
            setLoading(true);
            setError(null);
            const params: any = { page: pagination.currentPage };

            if (filters.search) params.search = filters.search;
            if (filters.vehicle_type_id)
                params.vehicle_type_id = parseInt(filters.vehicle_type_id);
            if (filters.status) params.status = filters.status;
            if (filters.is_active)
                params.is_active = filters.is_active === 'true';

            const response = await vehicleApi.getAll(params);
            if (response.success && response.data) {
                setVehicles(response.data.data);
                setPagination({
                    currentPage: response.data.current_page,
                    lastPage: response.data.last_page,
                    total: response.data.total,
                });
            }
        } catch (err) {
            setError(
                err instanceof Error ? err.message : 'Une erreur est survenue',
            );
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteDialog.vehicle) return;

        try {
            setDeleting(true);
            await vehicleApi.delete(deleteDialog.vehicle.id);
            setDeleteDialog({ open: false, vehicle: null });
            loadVehicles();
        } catch (err) {
            setError(
                err instanceof Error ? err.message : 'Impossible de supprimer',
            );
        } finally {
            setDeleting(false);
        }
    };

    const handleCreate = () => {
        router.visit('/admin/vehicles/create');
    };

    const handleEdit = (id: number) => {
        router.visit(`/admin/vehicles/${id}/edit`);
    };

    const handleFilterChange = (key: string, value: string) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
        setPagination((prev) => ({ ...prev, currentPage: 1 }));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Véhicules" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Véhicules</h1>
                        <p className="text-sm text-muted-foreground">
                            Gérez votre flotte de véhicules
                        </p>
                    </div>
                    <Button onClick={handleCreate}>Nouveau véhicule</Button>
                </div>

                {/* Filtres */}
                <Card className="p-4">
                    <div className="grid gap-4 md:grid-cols-4">
                        <div>
                            <Input
                                placeholder="Rechercher..."
                                value={filters.search}
                                onChange={(e) =>
                                    handleFilterChange('search', e.target.value)
                                }
                            />
                        </div>
                        <div>
                            <Select
                                value={filters.vehicle_type_id}
                                onValueChange={(value) =>
                                    handleFilterChange('vehicle_type_id', value)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Type de véhicule" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">
                                        Tous les types
                                    </SelectItem>
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
                        </div>
                        <div>
                            <Select
                                value={filters.status}
                                onValueChange={(value) =>
                                    handleFilterChange('status', value)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Statut" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">
                                        Tous les statuts
                                    </SelectItem>
                                    {Object.entries(statusLabels).map(
                                        ([value, label]) => (
                                            <SelectItem
                                                key={value}
                                                value={value}
                                            >
                                                {label}
                                            </SelectItem>
                                        ),
                                    )}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Select
                                value={filters.is_active}
                                onValueChange={(value) =>
                                    handleFilterChange('is_active', value)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="État" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">Tous</SelectItem>
                                    <SelectItem value="true">Actif</SelectItem>
                                    <SelectItem value="false">
                                        Inactif
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </Card>

                {error && (
                    <div className="rounded-lg bg-destructive/15 p-3 text-sm text-destructive">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <Spinner />
                    </div>
                ) : (
                    <>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {vehicles.map((vehicle) => (
                                <Card
                                    key={vehicle.id}
                                    className="overflow-hidden"
                                >
                                    {vehicle.images &&
                                    vehicle.images.length > 0 ? (
                                        <img
                                            src={vehicle.images[0]}
                                            alt={`${vehicle.brand} ${vehicle.model}`}
                                            className="h-48 w-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-48 items-center justify-center bg-muted">
                                            <span className="text-6xl">
                                                {vehicle.vehicle_type?.icon ||
                                                    '🚗'}
                                            </span>
                                        </div>
                                    )}
                                    <div className="p-4">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <h3 className="font-semibold">
                                                    {vehicle.brand}{' '}
                                                    {vehicle.model}
                                                </h3>
                                                <p className="text-sm text-muted-foreground">
                                                    {vehicle.year} •{' '}
                                                    {vehicle.license_plate}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="mt-2 flex flex-wrap gap-2">
                                            <Badge
                                                variant={
                                                    statusColors[vehicle.status]
                                                }
                                            >
                                                {statusLabels[vehicle.status]}
                                            </Badge>
                                            <Badge
                                                variant={
                                                    vehicle.is_active
                                                        ? 'default'
                                                        : 'secondary'
                                                }
                                            >
                                                {vehicle.is_active
                                                    ? 'Actif'
                                                    : 'Inactif'}
                                            </Badge>
                                            {vehicle.vehicle_type && (
                                                <Badge variant="outline">
                                                    {vehicle.vehicle_type.name}
                                                </Badge>
                                            )}
                                        </div>
                                        <div className="mt-3 text-sm">
                                            <span className="font-semibold">
                                                {vehicle.price_per_day}€
                                            </span>
                                            <span className="text-muted-foreground">
                                                /jour
                                            </span>
                                        </div>
                                        <div className="mt-4 flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                    handleEdit(vehicle.id)
                                                }
                                                className="flex-1"
                                            >
                                                Modifier
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() =>
                                                    setDeleteDialog({
                                                        open: true,
                                                        vehicle,
                                                    })
                                                }
                                            >
                                                Supprimer
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>

                        {/* Pagination */}
                        {pagination.lastPage > 1 && (
                            <div className="flex items-center justify-center gap-2">
                                <Button
                                    variant="outline"
                                    disabled={pagination.currentPage === 1}
                                    onClick={() =>
                                        setPagination((prev) => ({
                                            ...prev,
                                            currentPage: prev.currentPage - 1,
                                        }))
                                    }
                                >
                                    Précédent
                                </Button>
                                <span className="text-sm text-muted-foreground">
                                    Page {pagination.currentPage} sur{' '}
                                    {pagination.lastPage}
                                </span>
                                <Button
                                    variant="outline"
                                    disabled={
                                        pagination.currentPage ===
                                        pagination.lastPage
                                    }
                                    onClick={() =>
                                        setPagination((prev) => ({
                                            ...prev,
                                            currentPage: prev.currentPage + 1,
                                        }))
                                    }
                                >
                                    Suivant
                                </Button>
                            </div>
                        )}
                    </>
                )}

                {!loading && vehicles.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <p className="text-muted-foreground">
                            Aucun véhicule trouvé
                        </p>
                        <Button onClick={handleCreate} className="mt-4">
                            Créer le premier véhicule
                        </Button>
                    </div>
                )}
            </div>

            <Dialog
                open={deleteDialog.open}
                onOpenChange={(open) =>
                    !deleting && setDeleteDialog({ open, vehicle: null })
                }
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirmer la suppression</DialogTitle>
                        <DialogDescription>
                            Êtes-vous sûr de vouloir supprimer le véhicule "
                            {deleteDialog.vehicle?.brand}{' '}
                            {deleteDialog.vehicle?.model}" ? Cette action est
                            irréversible.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() =>
                                setDeleteDialog({ open: false, vehicle: null })
                            }
                            disabled={deleting}
                        >
                            Annuler
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={deleting}
                        >
                            {deleting ? <Spinner className="mr-2" /> : null}
                            Supprimer
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
