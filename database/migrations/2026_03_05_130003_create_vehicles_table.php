<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('vehicles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vehicle_type_id')->constrained()->onDelete('cascade');
            $table->string('brand'); // Marque
            $table->string('model'); // Modèle
            $table->integer('year'); // Année
            $table->string('license_plate')->unique(); // Plaque d'immatriculation
            $table->string('color')->nullable();
            $table->integer('seats')->default(5);
            $table->enum('transmission', ['manual', 'automatic'])->default('manual');
            $table->enum('fuel_type', ['gasoline', 'diesel', 'electric', 'hybrid'])->default('gasoline');
            $table->decimal('price_per_day', 10, 2); // Prix par jour
            $table->decimal('price_per_hour', 10, 2)->nullable(); // Prix par heure (optionnel)
            $table->text('description')->nullable();
            $table->json('images')->nullable(); // URLs des images
            $table->json('features')->nullable(); // GPS, climatisation, etc.
            $table->enum('status', ['available', 'rented', 'maintenance', 'unavailable'])->default('available');
            $table->string('location')->nullable(); // Localisation du véhicule
            $table->integer('mileage')->default(0); // Kilométrage
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index(['vehicle_type_id', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vehicles');
    }
};
