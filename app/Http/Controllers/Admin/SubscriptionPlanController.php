<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SubscriptionPlan;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class SubscriptionPlanController extends Controller
{
    /**
     * Display a listing of the subscription plans.
     */
    public function index(): JsonResponse
    {
        $plans = SubscriptionPlan::withCount('activeSubscriptions')
            ->orderBy('price')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $plans,
        ]);
    }

    /**
     * Store a newly created subscription plan.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:subscription_plans,name',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'max_bookings_per_month' => 'integer|min:0',
            'max_vehicles_access' => 'integer|min:0',
            'discount_percentage' => 'numeric|min:0|max:100',
            'features' => 'nullable|array',
            'is_active' => 'boolean',
        ]);

        $validated['slug'] = Str::slug($validated['name']);

        $plan = SubscriptionPlan::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Plan d\'abonnement créé avec succès.',
            'data' => $plan,
        ], 201);
    }

    /**
     * Display the specified subscription plan.
     */
    public function show(SubscriptionPlan $subscriptionPlan): JsonResponse
    {
        $subscriptionPlan->loadCount(['subscriptions', 'activeSubscriptions']);

        return response()->json([
            'success' => true,
            'data' => $subscriptionPlan,
        ]);
    }

    /**
     * Update the specified subscription plan.
     */
    public function update(Request $request, SubscriptionPlan $subscriptionPlan): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['string', 'max:255', Rule::unique('subscription_plans')->ignore($subscriptionPlan->id)],
            'description' => 'nullable|string',
            'price' => 'numeric|min:0',
            'max_bookings_per_month' => 'integer|min:0',
            'max_vehicles_access' => 'integer|min:0',
            'discount_percentage' => 'numeric|min:0|max:100',
            'features' => 'nullable|array',
            'is_active' => 'boolean',
        ]);

        if (isset($validated['name'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        $subscriptionPlan->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Plan d\'abonnement mis à jour avec succès.',
            'data' => $subscriptionPlan->fresh(),
        ]);
    }

    /**
     * Remove the specified subscription plan.
     */
    public function destroy(SubscriptionPlan $subscriptionPlan): JsonResponse
    {
        if ($subscriptionPlan->activeSubscriptions()->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'Impossible de supprimer ce plan car des abonnements actifs y sont associés.',
            ], 422);
        }

        $subscriptionPlan->delete();

        return response()->json([
            'success' => true,
            'message' => 'Plan d\'abonnement supprimé avec succès.',
        ]);
    }
}
