<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MatchResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $home  = $this->equipeDomicile;
        $away  = $this->equipeExterieur;
        $sport = $home?->sport;

        return [
            'id'           => $this->id,
            'home_team'    => $home?->nom   ?? 'Unknown',
            'home_team_id' => $this->equipe_domicile_id,
            'away_team'    => $away?->nom   ?? 'Unknown',
            'away_team_id' => $this->equipe_exterieur_id,
            'sport'        => $sport?->nom,
            'date'         => $this->date_match,
            'venue'        => $this->lieu,
            'status'       => $this->status,
            'home_score'   => $this->score_domicile,
            'away_score'   => $this->score_exterieur,
        ];
    }
}
