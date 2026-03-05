<?php

use App\Http\Controllers\BookingController;
use App\Http\Controllers\SubscriptionController;
use App\Http\Controllers\VehicleController;
use App\Http\Controllers\Admin\BookingController as AdminBookingController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\SubscriptionPlanController;
use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\Admin\VehicleController as AdminVehicleController;
use App\Http\Controllers\Admin\VehicleTypeController as AdminVehicleTypeController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public Routes (pas d'authentification requise)
|--------------------------------------------------------------------------
*/

// Véhicules disponibles
Route::get('/vehicles', [VehicleController::class, 'index']);
Route::get('/vehicles/{vehicle}', [VehicleController::class, 'show']);
Route::get('/vehicles/{vehicle}/availability', [VehicleController::class, 'checkAvailability']);
Route::get('/vehicle-types', [VehicleController::class, 'types']);

// Plans d'abonnement disponibles
Route::get('/subscription-plans', [SubscriptionController::class, 'plans']);

/*
|--------------------------------------------------------------------------
| Authenticated User Routes
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->group(function () {
    // Informations de l'utilisateur
    Route::get('/user', function (Request $request) {
        return $request->user()->load('activeSubscription.plan');
    });

    // Réservations de l'utilisateur
    Route::get('/bookings', [BookingController::class, 'index']);
    Route::post('/bookings', [BookingController::class, 'store']);
    Route::get('/bookings/{booking}', [BookingController::class, 'show']);
    Route::post('/bookings/{booking}/cancel', [BookingController::class, 'cancel']);

    // Abonnements de l'utilisateur
    Route::get('/subscriptions', [SubscriptionController::class, 'index']);
    Route::get('/subscriptions/active', [SubscriptionController::class, 'active']);
    Route::post('/subscriptions/subscribe', [SubscriptionController::class, 'subscribe']);
    Route::post('/subscriptions/cancel', [SubscriptionController::class, 'cancel']);
});

/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
*/

Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index']);

    // Types de véhicules
    Route::apiResource('vehicle-types', AdminVehicleTypeController::class);

    // Véhicules
    Route::apiResource('vehicles', AdminVehicleController::class);
    Route::post('vehicles/{vehicle}/availability', [AdminVehicleController::class, 'checkAvailability']);

    // Plans d'abonnement
    Route::apiResource('subscription-plans', SubscriptionPlanController::class);

    // Réservations
    Route::get('bookings', [AdminBookingController::class, 'index']);
    Route::get('bookings/{booking}', [AdminBookingController::class, 'show']);
    Route::put('bookings/{booking}/status', [AdminBookingController::class, 'updateStatus']);
    Route::get('bookings/statistics', [AdminBookingController::class, 'statistics']);

    // Utilisateurs
    Route::apiResource('users', AdminUserController::class)->only(['index', 'show', 'update', 'destroy']);
});
