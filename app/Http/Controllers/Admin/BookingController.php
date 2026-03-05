<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BookingController extends Controller
{
    /**
     * Display a listing of all bookings.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Booking::with(['user', 'vehicle.vehicleType', 'subscription.plan']);

        // Filtres
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        if ($request->has('vehicle_id')) {
            $query->where('vehicle_id', $request->vehicle_id);
        }

        if ($request->has('date_from')) {
            $query->where('start_date', '>=', $request->date_from);
        }

        if ($request->has('date_to')) {
            $query->where('end_date', '<=', $request->date_to);
        }

        $bookings = $query->orderBy('created_at', 'desc')->paginate(15);

        return response()->json([
            'success' => true,
            'data' => $bookings,
        ]);
    }

    /**
     * Display the specified booking.
     */
    public function show(Booking $booking): JsonResponse
    {
        $booking->load(['user', 'vehicle.vehicleType', 'subscription.plan', 'payments']);

        return response()->json([
            'success' => true,
            'data' => $booking,
        ]);
    }

    /**
     * Update the booking status.
     */
    public function updateStatus(Request $request, Booking $booking): JsonResponse
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,confirmed,active,completed,cancelled',
            'notes' => 'nullable|string',
        ]);

        $booking->update($validated);

        // Si la réservation est annulée, libérer le véhicule
        if ($validated['status'] === 'cancelled') {
            $booking->update([
                'cancelled_at' => now(),
            ]);

            if ($booking->vehicle->status === 'rented') {
                $booking->vehicle->update(['status' => 'available']);
            }
        }

        // Si la réservation est confirmée ou active, marquer le véhicule comme loué
        if (in_array($validated['status'], ['confirmed', 'active']) && $booking->vehicle->status === 'available') {
            $booking->vehicle->update(['status' => 'rented']);
        }

        return response()->json([
            'success' => true,
            'message' => 'Statut de la réservation mis à jour avec succès.',
            'data' => $booking->fresh(['user', 'vehicle.vehicleType']),
        ]);
    }

    /**
     * Get booking statistics.
     */
    public function statistics(): JsonResponse
    {
        $stats = [
            'total_bookings' => Booking::count(),
            'pending_bookings' => Booking::where('status', 'pending')->count(),
            'confirmed_bookings' => Booking::where('status', 'confirmed')->count(),
            'active_bookings' => Booking::where('status', 'active')->count(),
            'completed_bookings' => Booking::where('status', 'completed')->count(),
            'cancelled_bookings' => Booking::where('status', 'cancelled')->count(),
            'total_revenue' => Booking::whereIn('status', ['completed', 'active'])->sum('total_price'),
            'monthly_revenue' => Booking::whereIn('status', ['completed', 'active'])
                ->whereMonth('created_at', now()->month)
                ->whereYear('created_at', now()->year)
                ->sum('total_price'),
        ];

        return response()->json([
            'success' => true,
            'data' => $stats,
        ]);
    }
}
