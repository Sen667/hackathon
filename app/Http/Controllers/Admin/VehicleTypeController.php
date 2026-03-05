<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\VehicleType;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class VehicleTypeController extends Controller
{
    /**
     * Display a listing of the vehicle types.
     */
    public function index(): JsonResponse
    {
        $vehicleTypes = VehicleType::withCount('vehicles')
            ->orderBy('name')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $vehicleTypes,
        ]);
    }

    /**
     * Store a newly created vehicle type.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:vehicle_types,name',
            'description' => 'nullable|string',
            'icon' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        $validated['slug'] = Str::slug($validated['name']);

        $vehicleType = VehicleType::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Type de véhicule créé avec succès.',
            'data' => $vehicleType,
        ], 201);
    }

    /**
     * Display the specified vehicle type.
     */
    public function show(VehicleType $vehicleType): JsonResponse
    {
        $vehicleType->load('vehicles');
        $vehicleType->loadCount('vehicles');

        return response()->json([
            'success' => true,
            'data' => $vehicleType,
        ]);
    }

    /**
     * Update the specified vehicle type.
     */
    public function update(Request $request, VehicleType $vehicleType): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', Rule::unique('vehicle_types')->ignore($vehicleType->id)],
            'description' => 'nullable|string',
            'icon' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        if (isset($validated['name'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        $vehicleType->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Type de véhicule mis à jour avec succès.',
            'data' => $vehicleType->fresh(),
        ]);
    }

    /**
     * Remove the specified vehicle type.
     */
    public function destroy(VehicleType $vehicleType): JsonResponse
    {
        if ($vehicleType->vehicles()->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'Impossible de supprimer ce type de véhicule car des véhicules y sont associés.',
            ], 422);
        }

        $vehicleType->delete();

        return response()->json([
            'success' => true,
            'message' => 'Type de véhicule supprimé avec succès.',
        ]);
    }
}
