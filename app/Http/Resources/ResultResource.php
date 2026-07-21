<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ResultResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $match = $this->matchModel;
        $homeTeam = $match && $match->equipeDomicile ? $match->equipeDomicile->nom : 'Unknown';
        $awayTeam = $match && $match->equipeExterieur ? $match->equipeExterieur->nom : 'Unknown';
        
        $winner = 'Draw';
        if ($this->score_equipe_home > $this->score_equipe_away) {
            $winner = $homeTeam;
        } elseif ($this->score_equipe_away > $this->score_equipe_home) {
            $winner = $awayTeam;
        }

        return [
            'id' => $this->id,
            'match' => $homeTeam . ' vs ' . $awayTeam,
            'date' => $match ? $match->date_match : null,
            'sport' => ($match && $match->equipeDomicile && $match->equipeDomicile->sport) ? $match->equipeDomicile->sport->nom : null,
            'home_score' => $this->score_equipe_home,
            'away_score' => $this->score_equipe_away,
            'winner' => $winner,
            'status' => $match ? $match->status : null,
        ];
    }
}
