<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Equipe extends Model
{
    protected $fillable = ['nom', 'ville', 'sport_id', 'image'];

    /** Team belongsTo Sport */
    public function sport()
    {
        return $this->belongsTo(Sport::class);
    }

    /** Team hasMany Players */
    public function joueurs()
    {
        return $this->hasMany(Joueur::class);
    }

    /** Team's ranking entry */
    public function classement()
    {
        return $this->hasOne(Classement::class);
    }

    /** Home matches */
    public function matchsDomicile()
    {
        return $this->hasMany(MatchModel::class, 'equipe_domicile_id');
    }

    /** Away matches */
    public function matchsExterieur()
    {
        return $this->hasMany(MatchModel::class, 'equipe_exterieur_id');
    }
}
