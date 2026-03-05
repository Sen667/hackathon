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
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('vehicle_id')->constrained()->onDelete('cascade');
            $table->foreignId('subscription_id')->nullable()->constrained()->onDelete('set null');
            $table->string('booking_number')->unique();
            $table->timestamp('start_date');
            $table->timestamp('end_date');
            $table->timestamp('actual_return_date')->nullable();
            $table->enum('status', ['pending', 'confirmed', 'active', 'completed', 'cancelled'])->default('pending');
            $table->decimal('base_price', 10, 2); // Prix de base
            $table->decimal('discount_amount', 10, 2)->default(0); // Montant de la remise
            $table->decimal('total_price', 10, 2); // Prix total après remise
            $table->string('pickup_location');
            $table->string('return_location');
            $table->text('notes')->nullable();
            $table->json('extras')->nullable(); // Extras (assurance, siège bébé, etc.)
            $table->timestamp('cancelled_at')->nullable();
            $table->text('cancellation_reason')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'status']);
            $table->index(['vehicle_id', 'start_date', 'end_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};
