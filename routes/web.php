<?php

use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});

// Admin routes for vehicle management
Route::middleware(['auth', 'verified', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    // Vehicle Types
    Route::get('vehicle-types', fn() => inertia('admin/vehicle-types/index'))->name('vehicle-types.index');
    Route::get('vehicle-types/create', fn() => inertia('admin/vehicle-types/form'))->name('vehicle-types.create');
    Route::get('vehicle-types/{id}/edit', fn($id) => inertia('admin/vehicle-types/form', ['vehicleTypeId' => (int)$id]))->name('vehicle-types.edit');

    // Vehicles
    Route::get('vehicles', fn() => inertia('admin/vehicles/index'))->name('vehicles.index');
    Route::get('vehicles/create', fn() => inertia('admin/vehicles/form'))->name('vehicles.create');
    Route::get('vehicles/{id}/edit', fn($id) => inertia('admin/vehicles/form', ['vehicleId' => (int)$id]))->name('vehicles.edit');
});

require __DIR__.'/settings.php';
