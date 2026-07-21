<?php

namespace App\Http\Controllers;

use App\Models\Equipe;
use App\Models\Sport;
use Illuminate\Http\Request;

class EquipeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $equipes = Equipe::with('sport')->get(); // جلب الفرق مع نوع الرياضة الخاص بكل فريق
        $sports = Sport::all(); // جلب قائمة الرياضات لاستخدامها في القائمة المنسدلة
        return view('equipes.index', compact('equipes', 'sports'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $sports = Sport::all(); // هاد السطر ضروري باش يعمر الـ Select
        return view('equipes.create', compact('sports'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
{
    $request->validate([
        'nom' => 'required',
        'sport_id' => 'required|exists:sports,id',
        'ville' => 'required'
    ]);

    Equipe::create($request->all());

    return redirect()->route('equipes.index')->with('success', 'Équipe ajoutée !');
}
    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Equipe $equipe)
{
    $sports = Sport::all(); // كنجيبو الرياضات باش نختارو منهم في التعديل
    return view('equipes.edit', compact('equipe', 'sports'));
}

public function update(Request $request, Equipe $equipe)
{
    $request->validate([
        'nom' => 'required',
        'ville' => 'required',
        'sport_id' => 'required|exists:sports,id'
    ]);

    $equipe->update($request->all());

    return redirect()->route('equipes.index')->with('success', 'Équipe modifiée avec succès !');
}

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Equipe $equipe)
    {
        $equipe->delete();
        return redirect()->route('equipes.index')->with('success', 'Équipe supprimée !');
    }
}
