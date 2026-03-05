<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Vehicle extends Model
{
    use HasFactory;

    protected $fillable = [
        'vehicle_type_id',
        'brand',
        'model',
        'year',
        'license_plate',
        'color',
        'seats',
        'transmission',
        'fuel_type',
        'price_per_day',
        'price_per_hour',
        'description',
        'images',
        'features',
        'status',
        'location',
        'mileage',
        'is_active',
    ];

    protected $casts = [
        'year' => 'integer',
        'seats' => 'integer',
        'price_per_day' => 'decimal:2',
        'price_per_hour' => 'decimal:2',
        'images' => 'array',
        'features' => 'array',
        'mileage' => 'integer',
        'is_active' => 'boolean',
    ];

    /**
     * Get the vehicle type.
     */
    public function vehicleType(): BelongsTo
    {
        return $this->belongsTo(VehicleType::class);
    }

    /**
     * Get the bookings for the vehicle.
     */
    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }

    /**
     * Get active bookings for the vehicle.
     */
    public function activeBookings(): HasMany
    {
        return $this->hasMany(Booking::class)
            ->whereIn('status', ['confirmed', 'active']);
    }

    /**
     * Check if vehicle is available for given dates.
     */
    public function isAvailableForDates($startDate, $endDate): bool
    {
        if ($this->status !== 'available' || !$this->is_active) {
            return false;
        }

        $conflictingBookings = $this->bookings()
            ->whereIn('status', ['confirmed', 'active'])
            ->where(function ($query) use ($startDate, $endDate) {
                $query->whereBetween('start_date', [$startDate, $endDate])
                    ->orWhereBetween('end_date', [$startDate, $endDate])
                    ->orWhere(function ($q) use ($startDate, $endDate) {
                        $q->where('start_date', '<=', $startDate)
                          ->where('end_date', '>=', $endDate);
                    });
            })
            ->exists();

        return !$conflictingBookings;
    }

    /**
     * Get full name of the vehicle.
     */
    public function getFullNameAttribute(): string
    {
        return "{$this->brand} {$this->model} ({$this->year})";
    }
}
