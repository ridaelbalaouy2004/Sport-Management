<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class MatchModel extends Model
{
    protected $table = 'matches';

    protected $fillable = [
        'equipe_domicile_id',
        'equipe_exterieur_id',
        'date_match',
        'lieu',
        'score_domicile',
        'score_exterieur',
        'status',
    ];

    protected $casts = [
        'date_match' => 'datetime',
    ];

    /** Home team */
    public function equipeDomicile()
    {
        return $this->belongsTo(Equipe::class, 'equipe_domicile_id');
    }

    /** Away team */
    public function equipeExterieur()
    {
        return $this->belongsTo(Equipe::class, 'equipe_exterieur_id');
    }

    /** Match result */
    public function resultat()
    {
        return $this->hasOne(Resultat::class, 'match_model_id');
    }

    /** Helper: is this match in the past? */
    public function isFinished(): bool
    {
        return $this->status === 'finished';
    }
}