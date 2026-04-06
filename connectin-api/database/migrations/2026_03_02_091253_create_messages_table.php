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
        Schema::create('messages', function (Blueprint $table) {
            $table->id();
            // L'ID de celui qui envoie le message
            $table->foreignId('sender_id')->constrained('users')->onDelete('cascade');
            
            // L'ID de celui qui reçoit le message
            $table->foreignId('receiver_id')->constrained('users')->onDelete('cascade');
            
            // Le contenu du message
            $table->text('content');
            
            $table->timestamps(); // Crée created_at (date d'envoi) et updated_at
        });
    }
};
