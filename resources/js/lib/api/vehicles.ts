import { api } from '@/lib/api';
import type {
    ApiResponse,
    PaginatedResponse,
    Vehicle,
    VehicleFormData,
    VehicleType,
    VehicleTypeFormData,
} from '@/types';

// Vehicle Type API
export const vehicleTypeApi = {
    getAll: () => api.get<ApiResponse<VehicleType[]>>('/admin/vehicle-types'),

    getOne: (id: number) =>
        api.get<ApiResponse<VehicleType>>(`/admin/vehicle-types/${id}`),

    create: (data: VehicleTypeFormData) =>
        api.post<ApiResponse<VehicleType>>('/admin/vehicle-types', data),

    update: (id: number, data: Partial<VehicleTypeFormData>) =>
        api.put<ApiResponse<VehicleType>>(`/admin/vehicle-types/${id}`, data),

    delete: (id: number) =>
        api.delete<ApiResponse<void>>(`/admin/vehicle-types/${id}`),
};

// Vehicle API
export const vehicleApi = {
    getAll: (params?: {
        vehicle_type_id?: number;
        status?: string;
        is_active?: boolean;
        search?: string;
        page?: number;
    }) => {
        const queryString = params
            ? '?' +
              new URLSearchParams(
                  Object.entries(params)
                      .filter(([_, v]) => v !== undefined)
                      .map(([k, v]) => [k, String(v)]),
              ).toString()
            : '';
        return api.get<ApiResponse<PaginatedResponse<Vehicle>>>(
            `/admin/vehicles${queryString}`,
        );
    },

    getOne: (id: number) =>
        api.get<ApiResponse<Vehicle>>(`/admin/vehicles/${id}`),

    create: (data: VehicleFormData) =>
        api.post<ApiResponse<Vehicle>>('/admin/vehicles', data),

    update: (id: number, data: Partial<VehicleFormData>) =>
        api.put<ApiResponse<Vehicle>>(`/admin/vehicles/${id}`, data),

    delete: (id: number) =>
        api.delete<ApiResponse<void>>(`/admin/vehicles/${id}`),
};
