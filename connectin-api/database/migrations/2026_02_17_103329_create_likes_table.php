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
        Schema::create('likes', function (Blueprint $table) {
            $table->id();
            
            // L'utilisateur qui donne le like
            // clef étranger
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            
            // Le post qui reçoit le like
            $table->foreignId('post_id')->constrained()->onDelete('cascade');
            
            $table->timestamps();

            // CETTE LIGNE : Empêche de liker plus d'une fois le même post
            $table->unique(['user_id', 'post_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('likes');
    }
};
?>