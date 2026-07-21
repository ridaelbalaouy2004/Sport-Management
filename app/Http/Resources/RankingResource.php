<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RankingResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $team  = $this->equipe;
        $sport = $team?->sport;

        return [
            'id'      => $this->id,
            'rank'    => $this->rank ?? null,
            'team'    => $team?->nom ?? 'Unknown',
            'team_id' => $this->equipe_id,
            'sport'   => $sport?->nom ?? null,
            'played'  => $this->matchs_joues,
            'wins'    => $this->victoires,
            'losses'  => $this->defaites,
            'draws'   => $this->nuls,
            'points'  => $this->points,
        ];
    }
}
