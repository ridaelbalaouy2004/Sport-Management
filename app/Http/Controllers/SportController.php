<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Sport;

class SportController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $sports = Sport::latest()->get();
        return view('sports.index', compact('sports'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('sports.create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
{
    // 1. Validation
    $validated = $request->validate([
        'nom' => 'required|unique:sports|max:255',
    ]);

    // 2. Creation
    // استعمل المتغير $validated باش تضمن بلي غير البيانات اللي تفيريفات هي اللي غاتسجل
    Sport::create($validated);

    // 3. Redirection
    return redirect()->route('sports.index')->with('success', 'Sport ajouté avec succès !');
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
    public function edit(Sport $sport)
    {
      return view('sports.edit', compact('sport'));
    }


    public function update(Request $request, Sport $sport)
    {
        $request->validate([
            'nom' => 'required|max:255'
        ]);

       $sport->update($request->all());

       return redirect()->route('sports.index')->with('success', 'Sport mis à jour avec succès !');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Sport $sport)
    {
        $sport->delete();
        return redirect()->route('sports.index')->with('success', 'Sport supprimé مع السلامة !');
    }
}
