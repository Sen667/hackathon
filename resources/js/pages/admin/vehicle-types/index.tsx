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
import { Spinner } from '@/components/ui/spinner';
import AppLayout from '@/layouts/app-layout';
import { vehicleTypeApi } from '@/lib/api/vehicles';
import type { BreadcrumbItem, VehicleType } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin',
        href: '/admin/dashboard',
    },
    {
        title: 'Types de véhicules',
        href: '/admin/vehicle-types',
    },
];

export default function VehicleTypesList() {
    const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [deleteDialog, setDeleteDialog] = useState<{
        open: boolean;
        vehicleType: VehicleType | null;
    }>({ open: false, vehicleType: null });
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        loadVehicleTypes();
    }, []);

    const loadVehicleTypes = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await vehicleTypeApi.getAll();
            if (response.success && response.data) {
                setVehicleTypes(response.data);
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
        if (!deleteDialog.vehicleType) return;

        try {
            setDeleting(true);
            await vehicleTypeApi.delete(deleteDialog.vehicleType.id);
            setDeleteDialog({ open: false, vehicleType: null });
            loadVehicleTypes();
        } catch (err) {
            setError(
                err instanceof Error ? err.message : 'Impossible de supprimer',
            );
        } finally {
            setDeleting(false);
        }
    };

    const handleCreate = () => {
        router.visit('/admin/vehicle-types/create');
    };

    const handleEdit = (id: number) => {
        router.visit(`/admin/vehicle-types/${id}/edit`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Types de véhicules" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">
                            Types de véhicules
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Gérez les différents types de véhicules disponibles
                        </p>
                    </div>
                    <Button onClick={handleCreate}>Nouveau type</Button>
                </div>

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
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {vehicleTypes.map((type) => (
                            <Card key={type.id} className="p-4">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            {type.icon && (
                                                <span className="text-2xl">
                                                    {type.icon}
                                                </span>
                                            )}
                                            <h3 className="font-semibold">
                                                {type.name}
                                            </h3>
                                        </div>
                                        {type.description && (
                                            <p className="mt-1 text-sm text-muted-foreground">
                                                {type.description}
                                            </p>
                                        )}
                                        <div className="mt-2 flex items-center gap-2">
                                            <Badge
                                                variant={
                                                    type.is_active
                                                        ? 'default'
                                                        : 'secondary'
                                                }
                                            >
                                                {type.is_active
                                                    ? 'Actif'
                                                    : 'Inactif'}
                                            </Badge>
                                            {type.vehicles_count !==
                                                undefined && (
                                                <Badge variant="outline">
                                                    {type.vehicles_count}{' '}
                                                    véhicule
                                                    {type.vehicles_count > 1
                                                        ? 's'
                                                        : ''}
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-4 flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleEdit(type.id)}
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
                                                vehicleType: type,
                                            })
                                        }
                                    >
                                        Supprimer
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}

                {!loading && vehicleTypes.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <p className="text-muted-foreground">
                            Aucun type de véhicule trouvé
                        </p>
                        <Button onClick={handleCreate} className="mt-4">
                            Créer le premier type
                        </Button>
                    </div>
                )}
            </div>

            <Dialog
                open={deleteDialog.open}
                onOpenChange={(open) =>
                    !deleting && setDeleteDialog({ open, vehicleType: null })
                }
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirmer la suppression</DialogTitle>
                        <DialogDescription>
                            Êtes-vous sûr de vouloir supprimer le type "
                            {deleteDialog.vehicleType?.name}" ? Cette action est
                            irréversible.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() =>
                                setDeleteDialog({
                                    open: false,
                                    vehicleType: null,
                                })
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
