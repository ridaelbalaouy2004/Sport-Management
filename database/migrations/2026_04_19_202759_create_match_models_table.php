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
        Schema::create('matches', function (Blueprint $table) {
        $table->id();
        $table->dateTime('date_match'); 
        $table->string('lieu'); 
        
        $table->foreignId('equipe_domicile_id')->constrained('equipes')->onDelete('cascade');
        $table->foreignId('equipe_exterieur_id')->constrained('equipes')->onDelete('cascade');
        $table->integer('score_domicile')->default(0);
        $table->integer('score_exterieur')->default(0);
        $table->timestamps();
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('matches');
    }
};
