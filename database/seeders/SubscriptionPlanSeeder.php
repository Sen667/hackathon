<?php

namespace Database\Seeders;

use App\Models\SubscriptionPlan;
use Illuminate\Database\Seeder;

class SubscriptionPlanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $plans = [
            [
                'name' => 'Bronze',
                'slug' => 'bronze',
                'description' => 'Plan de base pour les utilisateurs occasionnels',
                'price' => 19.99,
                'max_bookings_per_month' => 3,
                'max_vehicles_access' => 0, // Tous les véhicules
                'discount_percentage' => 5.00,
                'features' => [
                    'Jusqu\'à 3 réservations par mois',
                    '5% de réduction sur toutes les locations',
                    'Support client par email',
                    'Annulation gratuite jusqu\'à 48h avant',
                ],
                'is_active' => true,
            ],
            [
                'name' => 'Argent',
                'slug' => 'argent',
                'description' => 'Plan intermédiaire pour les utilisateurs réguliers',
                'price' => 39.99,
                'max_bookings_per_month' => 10,
                'max_vehicles_access' => 0,
                'discount_percentage' => 15.00,
                'features' => [
                    'Jusqu\'à 10 réservations par mois',
                    '15% de réduction sur toutes les locations',
                    'Support client prioritaire',
                    'Annulation gratuite jusqu\'à 24h avant',
                    'Assurance de base incluse',
                ],
                'is_active' => true,
            ],
            [
                'name' => 'Or',
                'slug' => 'or',
                'description' => 'Plan premium pour les utilisateurs intensifs',
                'price' => 79.99,
                'max_bookings_per_month' => 0, // Illimité
                'max_vehicles_access' => 0,
                'discount_percentage' => 25.00,
                'features' => [
                    'Réservations illimitées',
                    '25% de réduction sur toutes les locations',
                    'Support client VIP 24/7',
                    'Annulation gratuite à tout moment',
                    'Assurance tous risques incluse',
                    'Accès prioritaire aux nouveaux véhicules',
                    'Surclassement gratuit selon disponibilité',
                ],
                'is_active' => true,
            ],
        ];

        foreach ($plans as $plan) {
            SubscriptionPlan::create($plan);
        }
    }
}
