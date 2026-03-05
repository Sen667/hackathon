<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Vehicle;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReservationController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'vehicle_id' => 'required|exists:vehicles,id',
            'start_date' => 'required|date|after_or_equal:today',
            'end_date' => 'required|date|after:start_date',
        ]);

        $vehicle = Vehicle::findOrFail($validated['vehicle_id']);

        // Check availability
        $conflictingBooking = Booking::where('vehicle_id', $validated['vehicle_id'])
            ->where('status', '!=', 'cancelled')
            ->where(function ($query) use ($validated) {
                $query->whereBetween('start_date', [$validated['start_date'], $validated['end_date']])
                    ->orWhereBetween('end_date', [$validated['start_date'], $validated['end_date']])
                    ->orWhere(function ($q) use ($validated) {
                        $q->where('start_date', '<=', $validated['start_date'])
                          ->where('end_date', '>=', $validated['end_date']);
                    });
            })
            ->exists();

        if ($conflictingBooking) {
            return response()->json([
                'success' => false,
                'message' => 'Ce véhicule n\'est pas disponible pour ces dates.',
            ], 422);
        }

        // Calculate total
        $startDate = new \DateTime($validated['start_date']);
        $endDate = new \DateTime($validated['end_date']);
        $days = max(1, $endDate->diff($startDate)->days); // Au moins 1 jour
        $basePrice = $vehicle->price_per_day;
        $totalPrice = $days * $basePrice;

        // Create booking
        $booking = Booking::create([
            'user_id' => $request->user()->id,
            'vehicle_id' => $validated['vehicle_id'],
            'start_date' => $validated['start_date'],
            'end_date' => $validated['end_date'],
            'pickup_location' => 'Agence principale', // Valeur par défaut
            'return_location' => 'Agence principale', // Valeur par défaut
            'base_price' => $basePrice,
            'total_price' => $totalPrice,
            'tax_amount' => 0,
            'discount_amount' => 0,
            'insurance_amount' => 0,
            'status' => 'confirmed',
            'payment_status' => 'pending',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Réservation confirmée avec succès.',
            'data' => $booking->load('vehicle', 'user'),
        ], 201);
    }

    public function index(Request $request): JsonResponse
    {
        $bookings = Booking::with('vehicle')
            ->where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return response()->json([
            'success' => true,
            'data' => $bookings,
        ]);
    }
}
