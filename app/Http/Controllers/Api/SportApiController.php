<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Sport;
use App\Http\Resources\SportResource;
use Illuminate\Http\Request;

class SportApiController extends Controller
{
    /**
     * GET /api/sports
     * Supports filtering: ?name=football
     */
    public function index(Request $request)
    {
        $query = Sport::withCount(['equipes', 'joueurs']);

        if ($request->filled('name')) {
            $query->where('nom', 'like', '%' . $request->name . '%');
        }

        return SportResource::collection($query->get());
    }

    /**
     * POST /api/sports
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'        => 'required|string|max:255|unique:sports,nom',
            'description' => 'nullable|string',
            'image'       => 'nullable|url|max:2048',
        ]);

        $sport = Sport::create([
            'nom'         => $validated['name'],
            'description' => $validated['description'] ?? null,
            'image'       => $validated['image'] ?? null,
        ]);

        $sport->loadCount(['equipes', 'joueurs']);
        return new SportResource($sport);
    }

    /**
     * GET /api/sports/{sport}
     */
    public function show(Sport $sport)
    {
        $sport->loadCount(['equipes', 'joueurs']);
        return new SportResource($sport);
    }

    /**
     * PUT /api/sports/{sport}
     */
    public function update(Request $request, Sport $sport)
    {
        $validated = $request->validate([
            'name'        => 'required|string|max:255|unique:sports,nom,' . $sport->id,
            'description' => 'nullable|string',
            'image'       => 'nullable|url|max:2048',
        ]);

        $sport->update([
            'nom'         => $validated['name'],
            'description' => $validated['description'] ?? $sport->description,
            'image'       => $validated['image'] ?? $sport->image,
        ]);

        $sport->loadCount(['equipes', 'joueurs']);
        return new SportResource($sport);
    }

    /**
     * DELETE /api/sports/{sport}
     */
    public function destroy(Sport $sport)
    {
        $sport->delete();
        return response()->json(null, 204);
    }
}
