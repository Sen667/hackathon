<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Vehicle;
use App\Models\Booking;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function getStats()
    {
        $stats = [
            'total_vehicles' => Vehicle::count(),
            'available_vehicles' => Vehicle::where('status', 'available')->count(),
            'rented_vehicles' => Vehicle::where('status', 'rented')->count(),
            'maintenance_vehicles' => Vehicle::where('status', 'maintenance')->count(),
            'upcoming_bookings' => Booking::where('status', 'confirmed')
                ->where('start_date', '>', now())
                ->count(),
            'ongoing_bookings' => Booking::where('status', 'ongoing')
                ->orWhere(function ($query) {
                    $query->where('status', 'confirmed')
                        ->where('start_date', '<=', now())
                        ->where('end_date', '>=', now());
                })
                ->count(),
            'total_bookings' => Booking::count(),
        ];

        return response()->json($stats);
    }

    public function getAvailabilityByType()
    {
        try {
            $availabilityByType = DB::table('vehicles')
                ->select(
                    'type as name',
                    DB::raw('COUNT(*) as total'),
                    DB::raw('SUM(CASE WHEN status = "available" THEN 1 ELSE 0 END) as available'),
                    DB::raw('SUM(CASE WHEN status = "rented" THEN 1 ELSE 0 END) as rented')
                )
                ->groupBy('type')
                ->get();

            return response()->json($availabilityByType);
        } catch (\Exception $e) {
            return response()->json([]);
        }
    }

    public function getUpcomingBookings()
    {
        $upcomingBookings = Booking::with(['user', 'vehicle'])
            ->where('status', 'confirmed')
            ->where('start_date', '>', now())
            ->orderBy('start_date', 'asc')
            ->limit(10)
            ->get()
            ->map(function ($booking) {
                return [
                    'id' => $booking->id,
                    'booking_number' => $booking->booking_number ?? 'N/A',
                    'user' => [
                        'name' => $booking->user->name ?? 'N/A',
                        'email' => $booking->user->email ?? 'N/A',
                    ],
                    'vehicle' => [
                        'name' => ($booking->vehicle->brand ?? '') . ' ' . ($booking->vehicle->model ?? ''),
                        'license_plate' => $booking->vehicle->license_plate ?? 'N/A',
                    ],
                    'start_date' => $booking->start_date ? $booking->start_date->format('Y-m-d') : 'N/A',
                    'end_date' => $booking->end_date ? $booking->end_date->format('Y-m-d') : 'N/A',
                    'status' => $booking->status,
                ];
            });

        return response()->json($upcomingBookings);
    }

    public function getOngoingBookings()
    {
        $ongoingBookings = Booking::with(['user', 'vehicle'])
            ->where(function ($query) {
                $query->where('status', 'ongoing')
                    ->orWhere(function ($q) {
                        $q->where('status', 'confirmed')
                            ->where('start_date', '<=', now())
                            ->where('end_date', '>=', now());
                    });
            })
            ->orderBy('start_date', 'asc')
            ->get()
            ->map(function ($booking) {
                return [
                    'id' => $booking->id,
                    'booking_number' => $booking->booking_number ?? 'N/A',
                    'user' => [
                        'name' => $booking->user->name ?? 'N/A',
                        'email' => $booking->user->email ?? 'N/A',
                    ],
                    'vehicle' => [
                        'name' => ($booking->vehicle->brand ?? '') . ' ' . ($booking->vehicle->model ?? ''),
                        'license_plate' => $booking->vehicle->license_plate ?? 'N/A',
                    ],
                    'start_date' => $booking->start_date ? $booking->start_date->format('Y-m-d') : 'N/A',
                    'end_date' => $booking->end_date ? $booking->end_date->format('Y-m-d') : 'N/A',
                    'status' => $booking->status,
                ];
            });

        return response()->json($ongoingBookings);
    }

    public function getAllData()
    {
        try {
            return response()->json([
                'stats' => json_decode($this->getStats()->getContent()),
                'availabilityByType' => json_decode($this->getAvailabilityByType()->getContent()),
                'upcomingBookings' => json_decode($this->getUpcomingBookings()->getContent()),
                'ongoingBookings' => json_decode($this->getOngoingBookings()->getContent()),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage(),
                'stats' => [
                    'total_vehicles' => 0,
                    'available_vehicles' => 0,
                    'rented_vehicles' => 0,
                    'maintenance_vehicles' => 0,
                    'upcoming_bookings' => 0,
                    'ongoing_bookings' => 0,
                    'total_bookings' => 0,
                ],
                'availabilityByType' => [],
                'upcomingBookings' => [],
                'ongoingBookings' => [],
            ], 500);
        }
    }
}
