<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MatchModel;
use App\Models\Equipe;
use App\Http\Resources\MatchResource;
use App\Mail\MatchCreatedMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class MatchApiController extends Controller
{
    /**
     * GET /api/matches
     * Supports filtering: ?date=2026-05-01&team_id=2&status=upcoming
     */
    public function index(Request $request)
    {
        $query = MatchModel::with(['equipeDomicile.sport', 'equipeExterieur']);

        if ($request->filled('date')) {
            $query->whereDate('date_match', $request->date);
        }

        if ($request->filled('team_id')) {
            $query->where(function ($q) use ($request) {
                $q->where('equipe_domicile_id', $request->team_id)
                  ->orWhere('equipe_exterieur_id', $request->team_id);
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        return MatchResource::collection($query->orderByDesc('date_match')->get());
    }

    /**
     * POST /api/matches
     * Sends email notification on creation.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'home_team_id' => 'required|exists:equipes,id',
            'away_team_id' => 'required|exists:equipes,id|different:home_team_id',
            'date'         => 'required|date',
            'venue'        => 'required|string|max:255',
            'status'       => 'nullable|in:pending,ongoing,finished',
        ]);

        $match = MatchModel::create([
            'equipe_domicile_id'  => $validated['home_team_id'],
            'equipe_exterieur_id' => $validated['away_team_id'],
            'date_match'          => $validated['date'],
            'lieu'                => $validated['venue'],
            'status'              => $validated['status'] ?? 'pending',
            'score_domicile'      => 0,
            'score_exterieur'     => 0,
        ]);

        if ($match->status === 'finished') {
            \App\Models\Resultat::create([
                'match_model_id'   => $match->id,
                'score_equipe_home' => 0,
                'score_equipe_away' => 0,
            ]);
        }

        \App\Models\Classement::recalculateForTeam($match->equipe_domicile_id);
        \App\Models\Classement::recalculateForTeam($match->equipe_exterieur_id);

        $match->load('equipeDomicile.sport', 'equipeExterieur');

        // Send email notification to all admins
        try {
            $adminEmails = \App\Models\User::where('role', 'admin')
                ->pluck('email')
                ->toArray();

            if (!empty($adminEmails)) {
                Mail::to($adminEmails)->queue(new MatchCreatedMail($match));
            }
        } catch (\Exception $e) {
            // Non-blocking — log but don't fail the request
            \Log::warning('Match notification email failed: ' . $e->getMessage());
        }

        return new MatchResource($match);
    }

    /**
     * GET /api/matches/{id}
     */
    public function show($id)
    {
        $match = MatchModel::with(['equipeDomicile.sport', 'equipeExterieur'])->findOrFail($id);
        return new MatchResource($match);
    }

    /**
     * PUT /api/matches/{id}
     */
    public function update(Request $request, $id)
    {
        $match = MatchModel::findOrFail($id);

        $validated = $request->validate([
            'home_team_id' => 'required|exists:equipes,id',
            'away_team_id' => 'required|exists:equipes,id|different:home_team_id',
            'date'         => 'required|date',
            'venue'        => 'nullable|string|max:255',
            'home_score'   => 'nullable|integer|min:0',
            'away_score'   => 'nullable|integer|min:0',
            'status'       => 'nullable|in:pending,ongoing,finished',
        ]);

        $oldHomeTeamId = $match->equipe_domicile_id;
        $oldAwayTeamId = $match->equipe_exterieur_id;

        $updateData = [
            'equipe_domicile_id'  => $validated['home_team_id'],
            'equipe_exterieur_id' => $validated['away_team_id'],
            'date_match'          => $validated['date'],
            'lieu'                => $validated['venue'] ?? $match->lieu,
            'status'              => $validated['status'] ?? $match->status,
        ];

        // If status is not finished, clear results
        if ($updateData['status'] !== 'finished') {
            $updateData['score_domicile'] = 0;
            $updateData['score_exterieur'] = 0;
        } else {
            $updateData['score_domicile'] = $validated['home_score'] ?? $match->score_domicile;
            $updateData['score_exterieur'] = $validated['away_score'] ?? $match->score_exterieur;
        }

        $match->update($updateData);

        // Sync Resultat model
        if ($updateData['status'] === 'finished') {
            \App\Models\Resultat::updateOrCreate(
                ['match_model_id' => $match->id],
                [
                    'score_equipe_home' => $updateData['score_domicile'],
                    'score_equipe_away' => $updateData['score_exterieur'],
                ]
            );
        } else {
            \App\Models\Resultat::where('match_model_id', $match->id)->delete();
        }

        // Recalculate rankings for all involved teams (old and new)
        $teamsToUpdate = array_unique([
            $oldHomeTeamId, $oldAwayTeamId,
            $validated['home_team_id'], $validated['away_team_id']
        ]);

        foreach ($teamsToUpdate as $teamId) {
            \App\Models\Classement::recalculateForTeam($teamId);
        }

        $match->load('equipeDomicile.sport', 'equipeExterieur');
        return new MatchResource($match);
    }

    /**
     * DELETE /api/matches/{id}
     */
    public function destroy($id)
    {
        $match = MatchModel::findOrFail($id);
        $homeId = $match->equipe_domicile_id;
        $awayId = $match->equipe_exterieur_id;
        
        $match->delete();
        \App\Models\Resultat::where('match_model_id', $id)->delete();

        \App\Models\Classement::recalculateForTeam($homeId);
        \App\Models\Classement::recalculateForTeam($awayId);

        return response()->json(null, 204);
    }
}
