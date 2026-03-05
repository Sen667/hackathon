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
        Schema::create('subscription_plans', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Bronze, Argent, Or
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->decimal('price', 10, 2); // Prix mensuel
            $table->integer('max_bookings_per_month')->default(0); // 0 = illimité
            $table->integer('max_vehicles_access')->default(0); // 0 = tous les véhicules
            $table->decimal('discount_percentage', 5, 2)->default(0); // Remise en %
            $table->json('features')->nullable(); // Fonctionnalités additionnelles
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('subscription_plans');
    }
};
