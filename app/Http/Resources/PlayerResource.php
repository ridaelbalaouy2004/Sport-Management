<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PlayerResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $team  = $this->equipe;
        $sport = $team?->sport;

        return [
            'id'       => $this->id,
            'name'     => trim($this->nom . ' ' . $this->prenom),
            'age'      => $this->age,
            'position' => $this->poste,
            'jersey'   => '#' . $this->id, // placeholder — add jersey column if needed
            'team'     => $team?->nom,
            'team_id'  => $this->equipe_id,
            'sport'    => $sport?->nom,
            'sport_id' => $sport?->id,
            'status'   => 'active',
            'image'    => $this->image ? (filter_var($this->image, FILTER_VALIDATE_URL) ? $this->image : url('storage/' . $this->image)) : null,
        ];
    }
}
