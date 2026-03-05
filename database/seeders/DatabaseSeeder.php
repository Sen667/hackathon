<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Créer un administrateur
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
            'role' => User::ROLE_ADMIN,
        ]);

        // Créer un utilisateur normal
        User::create([
            'name' => 'John Doe',
            'email' => 'user@example.com',
            'password' => Hash::make('password'),
            'role' => User::ROLE_USER,
        ]);

        // Créer quelques utilisateurs supplémentaires
        User::factory(5)->create();

        // Seeder les plans d'abonnement
        $this->call([
            SubscriptionPlanSeeder::class,
            VehicleTypeSeeder::class,
            VehicleSeeder::class,
        ]);
    }
}
