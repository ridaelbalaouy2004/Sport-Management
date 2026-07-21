<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Equipe;
use App\Http\Resources\TeamResource;
use Illuminate\Http\Request;

class TeamApiController extends Controller
{
    /**
     * GET /api/teams
     * Supports filtering: ?sport_id=1&name=hawks
     */
    public function index(Request $request)
    {
        $query = Equipe::with('sport')->withCount('joueurs');

        if ($request->filled('sport_id')) {
            $query->where('sport_id', $request->sport_id);
        }
        if ($request->filled('name')) {
            $query->where('nom', 'like', '%' . $request->name . '%');
        }

        return TeamResource::collection($query->get());
    }

    /**
     * POST /api/teams
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'     => 'required|string|max:255',
            'coach'    => 'nullable|string|max:255',
            'sport_id' => 'required|exists:sports,id',
            'image'    => 'nullable|url|max:2048',
        ]);

        $data = [
            'nom'      => $validated['name'],
            'ville'    => $validated['coach'] ?? 'Unknown',
            'sport_id' => $validated['sport_id'],
            'image'    => $validated['image'] ?? null,
        ];

        $equipe = Equipe::create($data);

        $equipe->load('sport');
        $equipe->loadCount('joueurs');
        return new TeamResource($equipe);
    }

    /**
     * GET /api/teams/{team}
     */
    public function show(Equipe $team)
    {
        $team->load('sport');
        $team->loadCount('joueurs');
        return new TeamResource($team);
    }

    /**
     * PUT /api/teams/{team}
     */
    public function update(Request $request, Equipe $team)
    {
        $validated = $request->validate([
            'name'     => 'required|string|max:255',
            'coach'    => 'nullable|string|max:255',
            'sport_id' => 'required|exists:sports,id',
            'image'    => 'nullable|url|max:2048',
        ]);

        $data = [
            'nom'      => $validated['name'],
            'ville'    => $validated['coach'] ?? $team->ville,
            'sport_id' => $validated['sport_id'],
        ];

        if (array_key_exists('image', $validated)) {
            $data['image'] = $validated['image'];
        }

        $team->update($data);

        $team->load('sport');
        $team->loadCount('joueurs');
        return new TeamResource($team);
    }

    /**
     * DELETE /api/teams/{team}
     */
    public function destroy(Equipe $team)
    {
        $team->delete();
        return response()->json(null, 204);
    }
}
