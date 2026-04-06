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
        Schema::create('posts', function (Blueprint $table) {
            $table->id();

            // Le texte du commentaire
            $table->text('content');

            // L'utilisateur qui écrit le commentaire
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');

            // le post peut contenir une image
            $table->string('image_path')->nullable();

            $table->timestamps();

            // Note : Ici on ne met PAS de $table->unique car l'utilisateur 
            // a le droit de commenter plusieurs fois le même post.
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('posts');
    }
};
