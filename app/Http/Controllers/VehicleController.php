<?php

namespace App\Http\Controllers;

use App\Models\Vehicle;
use App\Models\VehicleType;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class VehicleController extends Controller
{
    /**
     * Display a listing of available vehicles.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Vehicle::with('vehicleType')
            ->where('is_active', true)
            ->where('status', 'available');

        // Filtres
        if ($request->has('vehicle_type_id')) {
            $query->where('vehicle_type_id', $request->vehicle_type_id);
        }

        if ($request->has('transmission')) {
            $query->where('transmission', $request->transmission);
        }

        if ($request->has('fuel_type')) {
            $query->where('fuel_type', $request->fuel_type);
        }

        if ($request->has('min_price')) {
            $query->where('price_per_day', '>=', $request->min_price);
        }

        if ($request->has('max_price')) {
            $query->where('price_per_day', '<=', $request->max_price);
        }

        if ($request->has('seats')) {
            $query->where('seats', '>=', $request->seats);
        }

        // Vérifier la disponibilité pour des dates spécifiques
        if ($request->has('start_date') && $request->has('end_date')) {
            $startDate = $request->start_date;
            $endDate = $request->end_date;

            $query->whereDoesntHave('bookings', function ($q) use ($startDate, $endDate) {
                $q->whereIn('status', ['confirmed', 'active'])
                    ->where(function ($query) use ($startDate, $endDate) {
                        $query->whereBetween('start_date', [$startDate, $endDate])
                            ->orWhereBetween('end_date', [$startDate, $endDate])
                            ->orWhere(function ($q) use ($startDate, $endDate) {
                                $q->where('start_date', '<=', $startDate)
                                  ->where('end_date', '>=', $endDate);
                            });
                    });
            });
        }

        $vehicles = $query->orderBy('price_per_day')->paginate(12);

        return response()->json([
            'success' => true,
            'data' => $vehicles,
        ]);
    }

    /**
     * Display the specified vehicle.
     */
    public function show(Vehicle $vehicle): JsonResponse
    {
        $vehicle->load('vehicleType');

        if (!$vehicle->is_active) {
            return response()->json([
                'success' => false,
                'message' => 'Ce véhicule n\'est pas disponible.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $vehicle,
        ]);
    }

    /**
     * Get vehicle types.
     */
    public function types(): JsonResponse
    {
        $types = VehicleType::where('is_active', true)
            ->withCount('activeVehicles')
            ->orderBy('name')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $types,
        ]);
    }

    /**
     * Check vehicle availability.
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
                'vehicle' => $vehicle->only(['id', 'brand', 'model', 'price_per_day']),
            ],
        ]);
    }
}
