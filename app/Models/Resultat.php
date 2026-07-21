<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Resultat extends Model
{
    protected $table = 'resultats';

    protected $fillable = [
        'match_model_id',
        'score_equipe_home',
        'score_equipe_away',
    ];

    /** Result belongsTo Match */
    public function matchModel()
    {
        return $this->belongsTo(MatchModel::class, 'match_model_id');
    }

    /** Convenience alias */
    public function match()
    {
        return $this->matchModel();
    }

    /** Winner helper */
    public function getWinnerAttribute(): string
    {
        $home = $this->matchModel?->equipeDomicile?->nom ?? 'Home';
        $away = $this->matchModel?->equipeExterieur?->nom ?? 'Away';

        if ($this->score_equipe_home > $this->score_equipe_away) return $home;
        if ($this->score_equipe_away > $this->score_equipe_home) return $away;
        return 'Draw';
    }
}
