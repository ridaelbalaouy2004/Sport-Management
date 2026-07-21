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
        Schema::create('classements', function (Blueprint $table) {
        $table->id();
        // نربط الترتيب بفريق معين
        $table->foreignId('equipe_id')->constrained('equipes')->onDelete('cascade');
        $table->integer('matchs_joues')->default(0); 
        $table->integer('victoires')->default(0);   
        $table->integer('nuls')->default(0);        
        $table->integer('defaites')->default(0);     
        $table->integer('points')->default(0);       
        $table->timestamps();
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('classements');
    }
};
