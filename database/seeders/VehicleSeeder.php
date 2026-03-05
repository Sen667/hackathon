<?php

namespace Database\Seeders;

use App\Models\Vehicle;
use App\Models\VehicleType;
use Illuminate\Database\Seeder;

class VehicleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $citadine = VehicleType::where('slug', 'citadine')->first();
        $berline = VehicleType::where('slug', 'berline')->first();
        $suv = VehicleType::where('slug', 'suv')->first();
        $sportive = VehicleType::where('slug', 'sportive')->first();
        $electrique = VehicleType::where('slug', 'electrique')->first();

        $vehicles = [
            // Citadines
            [
                'vehicle_type_id' => $citadine->id,
                'brand' => 'Renault',
                'model' => 'Clio',
                'year' => 2023,
                'license_plate' => 'AB-123-CD',
                'color' => 'Bleu',
                'seats' => 5,
                'transmission' => 'manual',
                'fuel_type' => 'gasoline',
                'price_per_day' => 35.00,
                'price_per_hour' => 5.00,
                'description' => 'Citadine économique et pratique pour vos déplacements en ville.',
                'images' => ['https://via.placeholder.com/800x600?text=Renault+Clio'],
                'features' => ['Climatisation', 'GPS', 'Bluetooth', 'Régulateur de vitesse'],
                'status' => 'available',
                'location' => 'Paris',
                'mileage' => 15000,
                'is_active' => true,
            ],
            [
                'vehicle_type_id' => $citadine->id,
                'brand' => 'Peugeot',
                'model' => '208',
                'year' => 2024,
                'license_plate' => 'EF-456-GH',
                'color' => 'Rouge',
                'seats' => 5,
                'transmission' => 'automatic',
                'fuel_type' => 'gasoline',
                'price_per_day' => 40.00,
                'price_per_hour' => 6.00,
                'description' => 'Citadine moderne avec boîte automatique.',
                'images' => ['https://via.placeholder.com/800x600?text=Peugeot+208'],
                'features' => ['Climatisation', 'GPS', 'Bluetooth', 'Caméra de recul'],
                'status' => 'available',
                'location' => 'Lyon',
                'mileage' => 8000,
                'is_active' => true,
            ],

            // Berlines
            [
                'vehicle_type_id' => $berline->id,
                'brand' => 'Audi',
                'model' => 'A4',
                'year' => 2023,
                'license_plate' => 'IJ-789-KL',
                'color' => 'Noir',
                'seats' => 5,
                'transmission' => 'automatic',
                'fuel_type' => 'diesel',
                'price_per_day' => 75.00,
                'price_per_hour' => 10.00,
                'description' => 'Berline élégante et confortable pour vos trajets professionnels.',
                'images' => ['https://via.placeholder.com/800x600?text=Audi+A4'],
                'features' => ['Climatisation bi-zone', 'GPS', 'Bluetooth', 'Sièges cuir', 'Régulateur adaptatif'],
                'status' => 'available',
                'location' => 'Paris',
                'mileage' => 25000,
                'is_active' => true,
            ],
            [
                'vehicle_type_id' => $berline->id,
                'brand' => 'BMW',
                'model' => 'Série 3',
                'year' => 2024,
                'license_plate' => 'MN-012-OP',
                'color' => 'Gris',
                'seats' => 5,
                'transmission' => 'automatic',
                'fuel_type' => 'diesel',
                'price_per_day' => 85.00,
                'price_per_hour' => 12.00,
                'description' => 'Berline premium avec finitions haut de gamme.',
                'images' => ['https://via.placeholder.com/800x600?text=BMW+Serie+3'],
                'features' => ['Climatisation automatique', 'GPS', 'Bluetooth', 'Sièges sport', 'Toit panoramique'],
                'status' => 'available',
                'location' => 'Marseille',
                'mileage' => 12000,
                'is_active' => true,
            ],

            // SUV
            [
                'vehicle_type_id' => $suv->id,
                'brand' => 'Volkswagen',
                'model' => 'Tiguan',
                'year' => 2023,
                'license_plate' => 'QR-345-ST',
                'color' => 'Blanc',
                'seats' => 7,
                'transmission' => 'automatic',
                'fuel_type' => 'diesel',
                'price_per_day' => 90.00,
                'price_per_hour' => 13.00,
                'description' => 'SUV spacieux idéal pour les familles.',
                'images' => ['https://via.placeholder.com/800x600?text=VW+Tiguan'],
                'features' => ['Climatisation tri-zone', 'GPS', 'Bluetooth', '7 places', 'Coffre spacieux'],
                'status' => 'available',
                'location' => 'Paris',
                'mileage' => 30000,
                'is_active' => true,
            ],
            [
                'vehicle_type_id' => $suv->id,
                'brand' => 'Toyota',
                'model' => 'RAV4',
                'year' => 2024,
                'license_plate' => 'UV-678-WX',
                'color' => 'Argenté',
                'seats' => 5,
                'transmission' => 'automatic',
                'fuel_type' => 'hybrid',
                'price_per_day' => 95.00,
                'price_per_hour' => 14.00,
                'description' => 'SUV hybride économique et écologique.',
                'images' => ['https://via.placeholder.com/800x600?text=Toyota+RAV4'],
                'features' => ['Climatisation automatique', 'GPS', 'Bluetooth', 'Hybrid', 'Caméra 360°'],
                'status' => 'available',
                'location' => 'Lyon',
                'mileage' => 18000,
                'is_active' => true,
            ],

            // Sportives
            [
                'vehicle_type_id' => $sportive->id,
                'brand' => 'Porsche',
                'model' => '911',
                'year' => 2023,
                'license_plate' => 'YZ-901-AB',
                'color' => 'Rouge',
                'seats' => 2,
                'transmission' => 'automatic',
                'fuel_type' => 'gasoline',
                'price_per_day' => 350.00,
                'price_per_hour' => 50.00,
                'description' => 'Voiture de sport emblématique pour des sensations uniques.',
                'images' => ['https://via.placeholder.com/800x600?text=Porsche+911'],
                'features' => ['Climatisation', 'GPS', 'Bluetooth', 'Mode Sport+', 'Échappement sport'],
                'status' => 'available',
                'location' => 'Paris',
                'mileage' => 5000,
                'is_active' => true,
            ],

            // Électriques
            [
                'vehicle_type_id' => $electrique->id,
                'brand' => 'Tesla',
                'model' => 'Model 3',
                'year' => 2024,
                'license_plate' => 'CD-234-EF',
                'color' => 'Blanc',
                'seats' => 5,
                'transmission' => 'automatic',
                'fuel_type' => 'electric',
                'price_per_day' => 120.00,
                'price_per_hour' => 18.00,
                'description' => 'Berline électrique performante avec Autopilot.',
                'images' => ['https://via.placeholder.com/800x600?text=Tesla+Model+3'],
                'features' => ['Autopilot', 'GPS', 'Écran tactile 15"', 'Superchargeur gratuit', 'Application mobile'],
                'status' => 'available',
                'location' => 'Paris',
                'mileage' => 10000,
                'is_active' => true,
            ],
            [
                'vehicle_type_id' => $electrique->id,
                'brand' => 'Renault',
                'model' => 'Zoé',
                'year' => 2023,
                'license_plate' => 'GH-567-IJ',
                'color' => 'Bleu',
                'seats' => 5,
                'transmission' => 'automatic',
                'fuel_type' => 'electric',
                'price_per_day' => 55.00,
                'price_per_hour' => 8.00,
                'description' => 'Citadine électrique économique et écologique.',
                'images' => ['https://via.placeholder.com/800x600?text=Renault+Zoe'],
                'features' => ['Climatisation', 'GPS', 'Bluetooth', 'Charge rapide', 'Régénération d\'énergie'],
                'status' => 'available',
                'location' => 'Lyon',
                'mileage' => 22000,
                'is_active' => true,
            ],
        ];

        foreach ($vehicles as $vehicle) {
            Vehicle::create($vehicle);
        }
    }
}
