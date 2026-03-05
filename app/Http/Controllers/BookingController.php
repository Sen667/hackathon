<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Payment;
use App\Models\Vehicle;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class BookingController extends Controller
{
    /**
     * Display a listing of the user's bookings.
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        $bookings = Booking::with(['vehicle.vehicleType', 'subscription.plan', 'payments'])
            ->where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return response()->json([
            'success' => true,
            'data' => $bookings,
        ]);
    }

    /**
     * Store a newly created booking.
     */
    public function store(Request $request): JsonResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'vehicle_id' => 'required|exists:vehicles,id',
            'start_date' => 'required|date|after_or_equal:today',
            'end_date' => 'required|date|after:start_date',
            'pickup_location' => 'required|string|max:255',
            'return_location' => 'required|string|max:255',
            'notes' => 'nullable|string',
            'extras' => 'nullable|array',
        ]);

        $vehicle = Vehicle::findOrFail($validated['vehicle_id']);

        // Vérifier la disponibilité du véhicule
        if (!$vehicle->isAvailableForDates($validated['start_date'], $validated['end_date'])) {
            return response()->json([
                'success' => false,
                'message' => 'Ce véhicule n\'est pas disponible pour les dates sélectionnées.',
            ], 422);
        }

        // Vérifier l'abonnement actif
        $subscription = $user->activeSubscription;

        // Si l'utilisateur a un abonnement, vérifier les limites
        if ($subscription) {
            if (!$subscription->canMakeBooking()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Vous avez atteint la limite de réservations pour ce mois-ci.',
                ], 422);
            }
        }

        // Calculer le prix
        $startDate = \Carbon\Carbon::parse($validated['start_date']);
        $endDate = \Carbon\Carbon::parse($validated['end_date']);
        $days = $startDate->diffInDays($endDate);

        $basePrice = $vehicle->price_per_day * $days;
        $discountAmount = 0;

        // Appliquer la remise de l'abonnement
        if ($subscription && $subscription->plan->discount_percentage > 0) {
            $discountAmount = $basePrice * ($subscription->plan->discount_percentage / 100);
        }

        $totalPrice = $basePrice - $discountAmount;

        DB::beginTransaction();

        try {
            // Créer la réservation
            $booking = Booking::create([
                'user_id' => $user->id,
                'vehicle_id' => $vehicle->id,
                'subscription_id' => $subscription?->id,
                'start_date' => $validated['start_date'],
                'end_date' => $validated['end_date'],
                'pickup_location' => $validated['pickup_location'],
                'return_location' => $validated['return_location'],
                'notes' => $validated['notes'] ?? null,
                'extras' => $validated['extras'] ?? null,
                'base_price' => $basePrice,
                'discount_amount' => $discountAmount,
                'total_price' => $totalPrice,
                'status' => 'pending',
            ]);

            // Incrémenter le compteur de réservations de l'abonnement
            if ($subscription) {
                $subscription->incrementBookingsCount();
            }

            // Créer le paiement
            $payment = Payment::create([
                'user_id' => $user->id,
                'payable_type' => Booking::class,
                'payable_id' => $booking->id,
                'amount' => $totalPrice,
                'status' => 'pending',
                'payment_method' => 'card',
            ]);

            DB::commit();

            $booking->load(['vehicle.vehicleType', 'subscription.plan', 'payments']);

            return response()->json([
                'success' => true,
                'message' => 'Réservation créée avec succès.',
                'data' => $booking,
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la création de la réservation.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Display the specified booking.
     */
    public function show(Request $request, Booking $booking): JsonResponse
    {
        $user = $request->user();

        // Vérifier que la réservation appartient à l'utilisateur
        if ($booking->user_id !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Non autorisé.',
            ], 403);
        }

        $booking->load(['vehicle.vehicleType', 'subscription.plan', 'payments']);

        return response()->json([
            'success' => true,
            'data' => $booking,
        ]);
    }

    /**
     * Cancel the specified booking.
     */
    public function cancel(Request $request, Booking $booking): JsonResponse
    {
        $user = $request->user();

        // Vérifier que la réservation appartient à l'utilisateur
        if ($booking->user_id !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Non autorisé.',
            ], 403);
        }

        // Vérifier que la réservation peut être annulée
        if (!$booking->canBeCancelled()) {
            return response()->json([
                'success' => false,
                'message' => 'Cette réservation ne peut pas être annulée.',
            ], 422);
        }

        $validated = $request->validate([
            'cancellation_reason' => 'nullable|string',
        ]);

        $booking->update([
            'status' => 'cancelled',
            'cancelled_at' => now(),
            'cancellation_reason' => $validated['cancellation_reason'] ?? null,
        ]);

        // Libérer le véhicule si nécessaire
        if ($booking->vehicle->status === 'rented') {
            $booking->vehicle->update(['status' => 'available']);
        }

        return response()->json([
            'success' => true,
            'message' => 'Réservation annulée avec succès.',
            'data' => $booking->fresh(['vehicle.vehicleType']),
        ]);
    }
}
