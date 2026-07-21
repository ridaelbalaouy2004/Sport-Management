<?php

namespace App\Http\Controllers;

use App\Models\Joueur;
use App\Models\Equipe;
use Illuminate\Http\Request;

class JoueurController extends Controller
{
    public function index(Request $request)
    {
        $query = Joueur::with('equipe');

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function($q) use ($search) {
                $q->where('nom', 'like', "%{$search}%")
                  ->orWhere('prenom', 'like', "%{$search}%");
            });
        }

        if ($request->filled('equipe_id')) {
            $query->where('equipe_id', $request->input('equipe_id'));
        }

        $sortField = $request->input('sort', 'created_at');
        $sortOrder = $request->input('direction', 'desc');

        $joueurs = $query->orderBy($sortField, $sortOrder)->get();
        $equipes = Equipe::all();

        return view('joueurs.index', compact('joueurs', 'equipes'));
    }

    public function create()
    {
        $equipes = Equipe::all(); 
        return view('joueurs.create', compact('equipes'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'nom' => 'required|max:255',
            'prenom' => 'required|max:255',
            'age' => 'required|integer',
            'poste' => 'required', // تصحيح من poste لـ position
            'equipe_id' => 'required|exists:equipes,id',
        ]);

        Joueur::create($request->all());
        return redirect()->route('joueurs.index')->with('success', 'Joueur ajouté avec succès !');
    }

    public function edit(Joueur $joueur)
    {
        $equipes = Equipe::all();
        return view('joueurs.edit', compact('joueur', 'equipes'));
    }

    public function update(Request $request, Joueur $joueur)
    {
        $request->validate([
            'nom' => 'required|max:255',
            'prenom' => 'required|max:255',
            'age' => 'required|integer',
            'poste' => 'required', // تصحيح من poste لـ position
            'equipe_id' => 'required|exists:equipes,id'
        ]);

        $joueur->update($request->all());

        return redirect()->route('joueurs.index')->with('success', 'Joueur mis à jour avec succès !');
    }

    public function destroy(Joueur $joueur)
    {
        $joueur->delete();
        return redirect()->route('joueurs.index')->with('success', 'Joueur supprimé !');
    }
}