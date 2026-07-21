<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Joueur;
use App\Http\Resources\PlayerResource;
use Illuminate\Http\Request;

class PlayerApiController extends Controller
{
    /**
     * GET /api/players
     * Supports filtering: ?name=carlos&team_id=1&sport_id=2
     */
    public function index(Request $request)
    {
        $query = Joueur::with('equipe.sport');

        if ($request->filled('name')) {
            $query->where(function ($q) use ($request) {
                $q->where('nom', 'like', '%' . $request->name . '%')
                  ->orWhere('prenom', 'like', '%' . $request->name . '%');
            });
        }
        if ($request->filled('team_id')) {
            $query->where('equipe_id', $request->team_id);
        }
        if ($request->filled('sport_id')) {
            $query->whereHas('equipe', fn($q) => $q->where('sport_id', $request->sport_id));
        }

        return PlayerResource::collection($query->get());
    }

    /**
     * POST /api/players
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'     => 'required|string|max:255',
            'age'      => 'required|integer|min:1|max:99',
            'position' => 'required|string|max:255',
            'team_id'  => 'required|exists:equipes,id',
            'image'    => 'nullable|url|max:2048',
        ]);

        $parts = explode(' ', $validated['name'], 2);

        $data = [
            'nom'      => $parts[0],
            'prenom'   => $parts[1] ?? '',
            'age'      => $validated['age'],
            'poste'    => $validated['position'],
            'equipe_id' => $validated['team_id'],
            'image'    => $validated['image'] ?? null,
        ];

        $joueur = Joueur::create($data);

        $joueur->load('equipe.sport');
        return new PlayerResource($joueur);
    }

    /**
     * GET /api/players/{player}
     */
    public function show(Joueur $player)
    {
        $player->load('equipe.sport');
        return new PlayerResource($player);
    }

    /**
     * PUT /api/players/{player}
     */
    public function update(Request $request, Joueur $player)
    {
        $validated = $request->validate([
            'name'     => 'required|string|max:255',
            'age'      => 'required|integer|min:1|max:99',
            'position' => 'required|string|max:255',
            'team_id'  => 'required|exists:equipes,id',
            'image'    => 'nullable|url|max:2048',
        ]);

        $parts = explode(' ', $validated['name'], 2);

        $data = [
            'nom'      => $parts[0],
            'prenom'   => $parts[1] ?? '',
            'age'      => $validated['age'],
            'poste'    => $validated['position'],
            'equipe_id' => $validated['team_id'],
        ];

        if (array_key_exists('image', $validated)) {
            $data['image'] = $validated['image'];
        }

        $player->update($data);

        $player->load('equipe.sport');
        return new PlayerResource($player);
    }

    /**
     * DELETE /api/players/{player}
     */
    public function destroy(Joueur $player)
    {
        $player->delete();
        return response()->json(null, 204);
    }
}
