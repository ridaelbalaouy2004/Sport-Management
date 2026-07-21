<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Joueur extends Model
{
    protected $fillable = ['nom', 'prenom', 'age', 'poste', 'equipe_id', 'image'];

    /** Player belongsTo Team */
    public function equipe()
    {
        return $this->belongsTo(Equipe::class);
    }

    /** Player's sport via team */
    public function sport()
    {
        return $this->hasOneThrough(Sport::class, Equipe::class, 'id', 'id', 'equipe_id', 'sport_id');
    }
}
