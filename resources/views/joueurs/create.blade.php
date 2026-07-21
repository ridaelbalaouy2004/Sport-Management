@extends('layouts.app')

@section('content')
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-6">
            <div class="card shadow border-0">
                <div class="card-header bg-info text-white fw-bold">
                    <i class="fas fa-user-plus me-2"></i>Ajouter un Nouveau Joueur
                </div>
                <div class="card-body p-4">
                    <form action="{{ route('joueurs.store') }}" method="POST">
                        @csrf
                        
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label class="form-label fw-bold">Nom</label>
                                <input type="text" name="nom" class="form-control" placeholder="Ex: Hakimi" required>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label class="form-label fw-bold">Prénom</label>
                                <input type="text" name="prenom" class="form-control" placeholder="Ex: Achraf" required>
                            </div>
                        </div>

                        <div class="mb-3">
                            <label class="form-label fw-bold">Âge</label>
                            <input type="number" name="age" class="form-control" placeholder="Ex: 25" required>
                        </div>

                        <div class="mb-3">
                            <label class="form-label fw-bold">Position</label>
                            <select name="poste" class="form-select" required>
                                <option value="">Choisir un poste...</option>
                                <option value="Gardien">Gardien</option>
                                <option value="Défenseur">Défenseur</option>
                                <option value="Milieu">Milieu</option>
                                <option value="Attاquant">Attaquant</option>
                            </select>
                        </div>

                        <div class="mb-4">
                            <label class="form-label fw-bold">Équipe / Club</label>
                            <select name="equipe_id" class="form-select" required>
                                <option value="">Affecter à une équipe...</option>
                                @foreach($equipes as $equipe)
                                    <option value="{{ $equipe->id }}">
                                        {{ $equipe->nom }} ({{ $equipe->pays ?? $equipe->ville }})
                                    </option>
                                @endforeach
                            </select>
                        </div>

                        <div class="d-grid gap-2">
                            <button type="submit" class="btn btn-info text-white fw-bold">
                                <i class="fas fa-save me-2"></i>Enregistrer le Joueur
                            </button>
                            <a href="{{ route('joueurs.index') }}" class="btn btn-outline-secondary">Annuler</a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection