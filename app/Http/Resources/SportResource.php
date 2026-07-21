<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SportResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'          => $this->id,
            'name'        => $this->nom,
            'description' => $this->description,
            'teams'       => $this->equipes_count ?? 0,
            'players'     => $this->joueurs_count ?? 0,
            'category'    => 'Team', // can be extended with a real column
            'status'      => 'active',
            'image'       => $this->image,
        ];
    }
}
