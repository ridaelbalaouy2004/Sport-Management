<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TeamResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'       => $this->id,
            'name'     => $this->nom,
            'coach'    => $this->ville,     // 'ville' column stores coach name
            'sport'    => $this->sport?->nom,
            'sport_id' => $this->sport_id,
            'players'  => $this->joueurs_count ?? 0,
            'wins'     => $this->classement?->victoires ?? 0,
            'losses'   => $this->classement?->defaites ?? 0,
            'draws'    => $this->classement?->nuls ?? 0,
            'points'   => $this->classement?->points ?? 0,
            'played'   => $this->classement?->matchs_joues ?? 0,
            'status'   => 'active',
            'image'    => $this->image ? (filter_var($this->image, FILTER_VALIDATE_URL) ? $this->image : url('storage/' . $this->image)) : null,
        ];
    }
}
