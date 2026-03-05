<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\Subscription;
use App\Models\SubscriptionPlan;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SubscriptionController extends Controller
{
    /**
     * Display a listing of subscription plans.
     */
    public function plans(): JsonResponse
    {
        $plans = SubscriptionPlan::where('is_active', true)
            ->orderBy('price')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $plans,
        ]);
    }

    /**
     * Display the user's subscriptions.
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        $subscriptions = Subscription::with('plan')
            ->where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $subscriptions,
        ]);
    }

    /**
     * Get the user's active subscription.
     */
    public function active(Request $request): JsonResponse
    {
        $user = $request->user();
        $subscription = $user->activeSubscription;

        if (!$subscription) {
            return response()->json([
                'success' => false,
                'message' => 'Aucun abonnement actif.',
            ], 404);
        }

        $subscription->load('plan');

        return response()->json([
            'success' => true,
            'data' => $subscription,
        ]);
    }

    /**
     * Subscribe to a plan.
     */
    public function subscribe(Request $request): JsonResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'subscription_plan_id' => 'required|exists:subscription_plans,id',
            'payment_method' => 'required|in:card,paypal,bank_transfer',
        ]);

        // Vérifier si l'utilisateur a déjà un abonnement actif
        if ($user->hasActiveSubscription()) {
            return response()->json([
                'success' => false,
                'message' => 'Vous avez déjà un abonnement actif. Veuillez l\'annuler avant d\'en souscrire un nouveau.',
            ], 422);
        }

        $plan = SubscriptionPlan::findOrFail($validated['subscription_plan_id']);

        if (!$plan->is_active) {
            return response()->json([
                'success' => false,
                'message' => 'Ce plan n\'est pas disponible.',
            ], 422);
        }

        DB::beginTransaction();

        try {
            // Créer l'abonnement
            $subscription = Subscription::create([
                'user_id' => $user->id,
                'subscription_plan_id' => $plan->id,
                'status' => 'pending',
                'starts_at' => now(),
                'ends_at' => now()->addMonth(),
            ]);

            // Créer le paiement
            $payment = Payment::create([
                'user_id' => $user->id,
                'payable_type' => Subscription::class,
                'payable_id' => $subscription->id,
                'amount' => $plan->price,
                'status' => 'pending',
                'payment_method' => $validated['payment_method'],
            ]);

            // Simuler le paiement (dans un vrai système, on intégrerait une passerelle de paiement)
            // Pour le POC, on marque directement le paiement comme complété
            $payment->markAsCompleted('TXN-' . time());

            // Activer l'abonnement
            $subscription->update(['status' => 'active']);

            DB::commit();

            $subscription->load('plan');

            return response()->json([
                'success' => true,
                'message' => 'Abonnement souscrit avec succès.',
                'data' => $subscription,
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la souscription.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Cancel the user's active subscription.
     */
    public function cancel(Request $request): JsonResponse
    {
        $user = $request->user();
        $subscription = $user->activeSubscription;

        if (!$subscription) {
            return response()->json([
                'success' => false,
                'message' => 'Aucun abonnement actif à annuler.',
            ], 404);
        }

        $subscription->update([
            'status' => 'cancelled',
            'cancelled_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Abonnement annulé avec succès.',
            'data' => $subscription->fresh('plan'),
        ]);
    }
}
