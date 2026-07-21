<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Sport extends Model
{
    protected $fillable = ['nom', 'description', 'image'];

    /** Sport hasMany Teams */
    public function equipes()
    {
        return $this->hasMany(Equipe::class);
    }

    /** Sport hasMany Players (through equipes) */
    public function joueurs()
    {
        return $this->hasManyThrough(Joueur::class, Equipe::class, 'sport_id', 'equipe_id');
    }
}
