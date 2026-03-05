export type VehicleType = {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    icon: string | null;
    is_active: boolean;
    vehicles_count?: number;
    created_at: string;
    updated_at: string;
};

export type Vehicle = {
    id: number;
    vehicle_type_id: number;
    brand: string;
    model: string;
    year: number;
    license_plate: string;
    color: string | null;
    seats: number;
    transmission: 'manual' | 'automatic';
    fuel_type: 'gasoline' | 'diesel' | 'electric' | 'hybrid';
    price_per_day: number;
    price_per_hour: number | null;
    description: string | null;
    images: string[] | null;
    features: string[] | null;
    status: 'available' | 'rented' | 'maintenance' | 'unavailable';
    location: string | null;
    mileage: number;
    is_active: boolean;
    vehicle_type?: VehicleType;
    created_at: string;
    updated_at: string;
};

export type VehicleFormData = Omit<
    Vehicle,
    'id' | 'created_at' | 'updated_at' | 'vehicle_type'
>;

export type VehicleTypeFormData = Omit<
    VehicleType,
    'id' | 'slug' | 'created_at' | 'updated_at' | 'vehicles_count'
>;

export type PaginatedResponse<T> = {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
};

export type ApiResponse<T = unknown> = {
    success: boolean;
    message?: string;
    data?: T;
};
