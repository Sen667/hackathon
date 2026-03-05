<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use App\Models\Vehicle;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::get('/catalogue', function () {
    return Inertia::render('Catalogue', [
        'vehicles' => Vehicle::where('status', 'available')->where('is_active', true)->get()
    ]);
})->name('catalogue');

Route::middleware(['auth', 'verified'])->group(function () {
    // Redirect to appropriate dashboard based on role
    Route::get('dashboard', function () {
        if (auth()->user()->isAdmin()) {
            return Inertia::render('dashboard');
        }
        return redirect()->route('user.dashboard');
    })->name('dashboard');
    
    // User Dashboard
    Route::get('my-bookings', function () {
        return Inertia::render('UserDashboard', [
            'bookings' => auth()->user()->bookings()->with('vehicle')->latest()->get()
        ]);
    })->name('user.dashboard');
    
    // Reservations (WEB route, not API)
    Route::post('reservations', [\App\Http\Controllers\ReservationController::class, 'store'])->name('reservations.store');
    
    Route::get('vehicles-park', function () {
        return Inertia::render('VehiclesPark', [
            'vehicles' => Vehicle::all()
        ]);
    })->name('vehicles.park');
    
    // Routes pour ajouter/modifier des véhicules
    Route::post('vehicles', [\App\Http\Controllers\Admin\VehicleController::class, 'store'])->name('vehicles.store');
    Route::put('vehicles/{vehicle}', [\App\Http\Controllers\Admin\VehicleController::class, 'update'])->name('vehicles.update');
    Route::delete('vehicles/{vehicle}', [\App\Http\Controllers\Admin\VehicleController::class, 'destroy'])->name('vehicles.destroy');
});

// Admin routes for vehicle management
Route::middleware(['auth', 'verified', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    // Vehicle Types
    Route::get('vehicle-types', fn() => inertia('admin/vehicle-types/index'))->name('vehicle-types.index');
    Route::get('vehicle-types/create', fn() => inertia('admin/vehicle-types/form'))->name('vehicle-types.create');
    Route::get('vehicle-types/{id}/edit', fn($id) => inertia('admin/vehicle-types/form', ['vehicleTypeId' => (int)$id]))->name('vehicle-types.edit');

    // Vehicles
    Route::get('vehicles', fn() => inertia('admin/vehicles/index'))->name('vehicles.index');
    Route::get('vehicles/create', fn() => Inertia::render('VehicleForm'))->name('vehicles.create');
    Route::get('vehicles/{id}/edit', fn($id) => Inertia::render('VehicleForm', ['vehicleId' => (int)$id]))->name('vehicles.edit');
});

require __DIR__.'/settings.php';
