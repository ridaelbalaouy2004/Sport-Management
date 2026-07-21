<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Resultat;
use App\Models\MatchModel;
use App\Http\Resources\ResultResource;
use Illuminate\Http\Request;

class ResultApiController extends Controller
{
    /**
     * GET /api/results
     * Supports filtering: ?match_id=...
     */
    public function index(Request $request)
    {
        $query = Resultat::with([
            'matchModel.equipeDomicile.sport',
            'matchModel.equipeExterieur',
        ]);

        if ($request->filled('match_id')) {
            $query->where('match_model_id', $request->match_id);
        }

        return ResultResource::collection($query->latest()->get());
    }

    /**
     * POST /api/results
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'match_id'   => 'required|exists:matches,id',
            'home_score' => 'required|integer|min:0',
            'away_score' => 'required|integer|min:0',
        ]);

        // Prevent duplicate results for the same match
        if (Resultat::where('match_model_id', $validated['match_id'])->exists()) {
            return response()->json([
                'message' => 'A result already exists for this match. Use PUT to update it.',
            ], 409);
        }

        $result = Resultat::create([
            'match_model_id'   => $validated['match_id'],
            'score_equipe_home' => $validated['home_score'],
            'score_equipe_away' => $validated['away_score'],
        ]);

        // Auto-update match scores
        $match = MatchModel::findOrFail($validated['match_id']);
        $match->update([
            'score_domicile'  => $validated['home_score'],
            'score_exterieur' => $validated['away_score'],
        ]);

        // Recalculate rankings based on all results
        \App\Models\Classement::recalculateForTeam($match->equipe_domicile_id);
        \App\Models\Classement::recalculateForTeam($match->equipe_exterieur_id);

        $result->load('matchModel.equipeDomicile.sport', 'matchModel.equipeExterieur');
        return new ResultResource($result);
    }

    /**
     * GET /api/results/{id}
     */
    public function show($id)
    {
        $result = Resultat::with([
            'matchModel.equipeDomicile.sport',
            'matchModel.equipeExterieur',
        ])->findOrFail($id);

        return new ResultResource($result);
    }

    /**
     * PUT /api/results/{id}
     */
    public function update(Request $request, $id)
    {
        $result = Resultat::findOrFail($id);

        $validated = $request->validate([
            'home_score' => 'required|integer|min:0',
            'away_score' => 'required|integer|min:0',
        ]);

        $result->update([
            'score_equipe_home' => $validated['home_score'],
            'score_equipe_away' => $validated['away_score'],
        ]);

        // Sync scores back to match
        $match = MatchModel::findOrFail($result->match_model_id);
        $match->update([
            'score_domicile'  => $validated['home_score'],
            'score_exterieur' => $validated['away_score'],
        ]);

        // Recalculate rankings based on all results
        \App\Models\Classement::recalculateForTeam($match->equipe_domicile_id);
        \App\Models\Classement::recalculateForTeam($match->equipe_exterieur_id);

        $result->load('matchModel.equipeDomicile.sport', 'matchModel.equipeExterieur');
        return new ResultResource($result);
    }

    /**
     * DELETE /api/results/{id}
     */
    public function destroy($id)
    {
        $result = Resultat::findOrFail($id);
        $result->delete();
        return response()->json(null, 204);
    }
}
