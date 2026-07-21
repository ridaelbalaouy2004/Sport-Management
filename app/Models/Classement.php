<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Classement extends Model
{
    protected $fillable = [
        'equipe_id',
        'matchs_joues',
        'victoires',
        'nuls',
        'defaites',
        'points',
    ];

    /** Ranking belongsTo Team */
    public function equipe()
    {
        return $this->belongsTo(Equipe::class);
    }

    /** Helper to recalculate a team's ranking based on all their results */
    public static function recalculateForTeam($teamId)
    {
        $matches = MatchModel::where('status', 'finished')
            ->where(function($q) use ($teamId) {
                $q->where('equipe_domicile_id', $teamId)
                  ->orWhere('equipe_exterieur_id', $teamId);
            })->get();

        $wins = 0; $losses = 0; $draws = 0;
        
        foreach ($matches as $m) {
            $isHome = $m->equipe_domicile_id == $teamId;
            $myScore = $isHome ? $m->score_domicile : $m->score_exterieur;
            $oppScore = $isHome ? $m->score_exterieur : $m->score_domicile;

            if ($myScore > $oppScore) $wins++;
            elseif ($myScore < $oppScore) $losses++;
            else $draws++;
        }

        self::updateOrCreate(
            ['equipe_id' => $teamId],
            [
                'victoires'    => $wins,
                'defaites'     => $losses,
                'nuls'         => $draws,
                'points'       => ($wins * 3) + ($draws * 1),
                'matchs_joues' => $wins + $losses + $draws,
            ]
        );
    }
}
