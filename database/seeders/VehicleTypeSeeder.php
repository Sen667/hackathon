<?php

namespace Database\Seeders;

use App\Models\VehicleType;
use Illuminate\Database\Seeder;

class VehicleTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $types = [
            [
                'name' => 'Berline',
                'slug' => 'berline',
                'description' => 'Voitures élégantes et confortables pour les trajets quotidiens',
                'icon' => 'car',
                'is_active' => true,
            ],
            [
                'name' => 'SUV',
                'slug' => 'suv',
                'description' => 'Véhicules spacieux et polyvalents pour toute la famille',
                'icon' => 'suv',
                'is_active' => true,
            ],
            [
                'name' => 'Citadine',
                'slug' => 'citadine',
                'description' => 'Petites voitures idéales pour la ville',
                'icon' => 'compact-car',
                'is_active' => true,
            ],
            [
                'name' => 'Sportive',
                'slug' => 'sportive',
                'description' => 'Voitures haute performance pour les amateurs de sensations',
                'icon' => 'sports-car',
                'is_active' => true,
            ],
            [
                'name' => 'Utilitaire',
                'slug' => 'utilitaire',
                'description' => 'Véhicules utilitaires pour le transport de marchandises',
                'icon' => 'van',
                'is_active' => true,
            ],
            [
                'name' => 'Électrique',
                'slug' => 'electrique',
                'description' => 'Véhicules électriques écologiques',
                'icon' => 'electric-car',
                'is_active' => true,
            ],
        ];

        foreach ($types as $type) {
            VehicleType::create($type);
        }
    }
}
