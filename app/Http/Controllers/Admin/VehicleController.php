<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Vehicle;
use App\Models\VehicleType;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class VehicleController extends Controller
{
    /**
     * Display a listing of the vehicles.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Vehicle::with('vehicleType');

        // Filtres
        if ($request->has('vehicle_type_id')) {
            $query->where('vehicle_type_id', $request->vehicle_type_id);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('brand', 'like', "%{$search}%")
                    ->orWhere('model', 'like', "%{$search}%")
                    ->orWhere('license_plate', 'like', "%{$search}%");
            });
        }

        $vehicles = $query->orderBy('created_at', 'desc')->paginate(15);

        return response()->json([
            'success' => true,
            'data' => $vehicles,
        ]);
    }

    /**
     * Store a newly created vehicle.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'vehicle_type_id' => 'required|exists:vehicle_types,id',
            'brand' => 'required|string|max:255',
            'model' => 'required|string|max:255',
            'year' => 'required|integer|min:1900|max:' . (date('Y') + 1),
            'license_plate' => 'required|string|unique:vehicles,license_plate',
            'color' => 'nullable|string|max:50',
            'seats' => 'integer|min:1|max:50',
            'transmission' => 'required|in:manual,automatic',
            'fuel_type' => 'required|in:gasoline,diesel,electric,hybrid',
            'price_per_day' => 'required|numeric|min:0',
            'price_per_hour' => 'nullable|numeric|min:0',
            'description' => 'nullable|string',
            'images' => 'nullable|array',
            'images.*' => 'string',
            'features' => 'nullable|array',
            'status' => 'in:available,rented,maintenance,unavailable',
            'location' => 'nullable|string|max:255',
            'mileage' => 'integer|min:0',
            'is_active' => 'boolean',
        ]);

        $vehicle = Vehicle::create($validated);
        $vehicle->load('vehicleType');

        return response()->json([
            'success' => true,
            'message' => 'Véhicule créé avec succès.',
            'data' => $vehicle,
        ], 201);
    }

    /**
     * Display the specified vehicle.
     */
    public function show(Vehicle $vehicle): JsonResponse
    {
        $vehicle->load(['vehicleType', 'bookings' => function ($query) {
            $query->whereIn('status', ['confirmed', 'active'])
                ->orderBy('start_date');
        }]);

        return response()->json([
            'success' => true,
            'data' => $vehicle,
        ]);
    }

    /**
     * Update the specified vehicle.
     */
    public function update(Request $request, Vehicle $vehicle): JsonResponse
    {
        $validated = $request->validate([
            'vehicle_type_id' => 'exists:vehicle_types,id',
            'brand' => 'string|max:255',
            'model' => 'string|max:255',
            'year' => 'integer|min:1900|max:' . (date('Y') + 1),
            'license_plate' => ['string', Rule::unique('vehicles')->ignore($vehicle->id)],
            'color' => 'nullable|string|max:50',
            'seats' => 'integer|min:1|max:50',
            'transmission' => 'in:manual,automatic',
            'fuel_type' => 'in:gasoline,diesel,electric,hybrid',
            'price_per_day' => 'numeric|min:0',
            'price_per_hour' => 'nullable|numeric|min:0',
            'description' => 'nullable|string',
            'images' => 'nullable|array',
            'images.*' => 'string',
            'features' => 'nullable|array',
            'status' => 'in:available,rented,maintenance,unavailable',
            'location' => 'nullable|string|max:255',
            'mileage' => 'integer|min:0',
            'is_active' => 'boolean',
        ]);

        $vehicle->update($validated);
        $vehicle->load('vehicleType');

        return response()->json([
            'success' => true,
            'message' => 'Véhicule mis à jour avec succès.',
            'data' => $vehicle->fresh(['vehicleType']),
        ]);
    }

    /**
     * Remove the specified vehicle.
     */
    public function destroy(Vehicle $vehicle): JsonResponse
    {
        // Vérifier s'il y a des réservations actives
        if ($vehicle->activeBookings()->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'Impossible de supprimer ce véhicule car il a des réservations actives.',
            ], 422);
        }

        $vehicle->delete();

        return response()->json([
            'success' => true,
            'message' => 'Véhicule supprimé avec succès.',
        ]);
    }

    /**
     * Get vehicle availability for date range.
     */
    public function checkAvailability(Request $request, Vehicle $vehicle): JsonResponse
    {
        $validated = $request->validate([
            'start_date' => 'required|date|after_or_equal:today',
            'end_date' => 'required|date|after:start_date',
        ]);

        $isAvailable = $vehicle->isAvailableForDates(
            $validated['start_date'],
            $validated['end_date']
        );

        return response()->json([
            'success' => true,
            'data' => [
                'is_available' => $isAvailable,
                'vehicle_id' => $vehicle->id,
                'start_date' => $validated['start_date'],
                'end_date' => $validated['end_date'],
            ],
        ]);
    }
}
