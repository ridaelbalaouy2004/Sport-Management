<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Classement;
use App\Models\Equipe;
use App\Http\Resources\RankingResource;
use Illuminate\Http\Request;

class RankingApiController extends Controller
{
    /**
     * GET /api/rankings
     * Supports filtering: ?sport_id=1
     */
    public function index(Request $request)
    {
        $query = Classement::with('equipe.sport')
            ->orderByDesc('points')
            ->orderByDesc('victoires');

        if ($request->filled('sport_id')) {
            $query->whereHas('equipe', fn ($q) => $q->where('sport_id', $request->sport_id));
        }

        $rankings = $query->get()->map(function ($item, $index) {
            $item->rank = $index + 1;
            return $item;
        });

        return RankingResource::collection($rankings);
    }

    /**
     * POST /api/rankings  — create or upsert a ranking row for a team
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'team_id' => 'required|exists:equipes,id',
            'points'  => 'required|integer|min:0',
            'wins'    => 'required|integer|min:0',
            'losses'  => 'required|integer|min:0',
            'draws'   => 'required|integer|min:0',
        ]);

        $ranking = Classement::updateOrCreate(
            ['equipe_id' => $validated['team_id']],
            [
                'points'        => $validated['points'],
                'victoires'     => $validated['wins'],
                'defaites'      => $validated['losses'],
                'nuls'          => $validated['draws'],
                'matchs_joues'  => $validated['wins'] + $validated['losses'] + $validated['draws'],
            ]
        );

        $ranking->load('equipe.sport');
        return new RankingResource($ranking);
    }

    /**
     * PUT /api/rankings/{id}
     */
    public function update(Request $request, $id)
    {
        $ranking = Classement::findOrFail($id);

        $validated = $request->validate([
            'points'  => 'sometimes|integer|min:0',
            'wins'    => 'sometimes|integer|min:0',
            'losses'  => 'sometimes|integer|min:0',
            'draws'   => 'sometimes|integer|min:0',
        ]);

        $data = [];
        if (isset($validated['points']))  $data['points']       = $validated['points'];
        if (isset($validated['wins']))    $data['victoires']     = $validated['wins'];
        if (isset($validated['losses']))  $data['defaites']      = $validated['losses'];
        if (isset($validated['draws']))   $data['nuls']          = $validated['draws'];

        if (!empty($data)) {
            $wins   = $data['victoires'] ?? $ranking->victoires;
            $losses = $data['defaites']  ?? $ranking->defaites;
            $draws  = $data['nuls']      ?? $ranking->nuls;
            $data['matchs_joues'] = $wins + $losses + $draws;
            $ranking->update($data);
        }

        $ranking->load('equipe.sport');
        return new RankingResource($ranking);
    }
}
