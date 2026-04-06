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
        Schema::create('comments', function (Blueprint $table) {
            $table->id();
            
            // Le contenu du post (le texte que l'utilisateur écrit)
            $table->text('content');
            
            // Optionnel : un titre pour le post
            $table->string('title')->nullable(); 

            // LA RELATION : Lien vers l'utilisateur qui publie
            // constrained() cherche automatiquement la table 'users'
            // onDelete('cascade') supprime les posts si l'utilisateur est supprimé
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');

            // Relation vers le post commenté
            $table->foreignId('post_id')->constrained()->onDelete('cascade');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('comments');
    }
};
?>