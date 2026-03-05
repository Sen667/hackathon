<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Payment;
use App\Models\SubscriptionPlan;
use App\Models\User;
use App\Models\Vehicle;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    /**
     * Get dashboard statistics and overview.
     */
    public function index(): JsonResponse
    {
        $stats = [
            // Statistiques des utilisateurs
            'users' => [
                'total' => User::count(),
                'new_this_month' => User::whereMonth('created_at', now()->month)
                    ->whereYear('created_at', now()->year)
                    ->count(),
                'with_active_subscription' => User::whereHas('activeSubscription')->count(),
            ],

            // Statistiques des véhicules
            'vehicles' => [
                'total' => Vehicle::count(),
                'available' => Vehicle::where('status', 'available')->where('is_active', true)->count(),
                'rented' => Vehicle::where('status', 'rented')->count(),
                'maintenance' => Vehicle::where('status', 'maintenance')->count(),
            ],

            // Statistiques des réservations
            'bookings' => [
                'total' => Booking::count(),
                'pending' => Booking::where('status', 'pending')->count(),
                'confirmed' => Booking::where('status', 'confirmed')->count(),
                'active' => Booking::where('status', 'active')->count(),
                'completed_this_month' => Booking::where('status', 'completed')
                    ->whereMonth('created_at', now()->month)
                    ->whereYear('created_at', now()->year)
                    ->count(),
            ],

            // Statistiques financières
            'revenue' => [
                'total' => Payment::where('status', 'completed')->sum('amount'),
                'this_month' => Payment::where('status', 'completed')
                    ->whereMonth('created_at', now()->month)
                    ->whereYear('created_at', now()->year)
                    ->sum('amount'),
                'this_year' => Payment::where('status', 'completed')
                    ->whereYear('created_at', now()->year)
                    ->sum('amount'),
                'pending' => Payment::where('status', 'pending')->sum('amount'),
            ],

            // Abonnements
            'subscriptions' => [
                'active' => SubscriptionPlan::withCount('activeSubscriptions')->get()->map(function ($plan) {
                    return [
                        'name' => $plan->name,
                        'count' => $plan->active_subscriptions_count,
                    ];
                }),
            ],

            // Réservations récentes
            'recent_bookings' => Booking::with(['user', 'vehicle.vehicleType'])
                ->orderBy('created_at', 'desc')
                ->limit(5)
                ->get(),

            // Véhicules les plus loués
            'popular_vehicles' => Vehicle::withCount(['bookings' => function ($query) {
                $query->whereIn('status', ['completed', 'active']);
            }])
                ->orderBy('bookings_count', 'desc')
                ->limit(5)
                ->get(),
        ];

        return response()->json([
            'success' => true,
            'data' => $stats,
        ]);
    }
}
