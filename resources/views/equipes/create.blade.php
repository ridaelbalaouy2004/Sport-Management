@extends('layouts.app')

@section('content')
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-6">
            <div class="card shadow border-0">
                <div class="card-header bg-success text-white fw-bold">
                    <i class="fas fa-shield-alt me-2"></i>Ajouter une Nouvelle Équipe
                </div>
                <div class="card-body p-4">
                    <form action="{{ route('equipes.store') }}" method="POST">
                        @csrf
                        
                        <div class="mb-3">
                            <label class="form-label fw-bold">Nom de l'Équipe</label>
                            <input type="text" name="nom" class="form-control" placeholder="Ex: Wydad AC" required>
                        </div>

                        <div class="mb-3">
                            <label class="form-label fw-bold">Ville</label>
                            <input type="text" name="ville" class="form-control" placeholder="Ex: Casablanca" required>
                        </div>

                        <div class="mb-4">
                            <label class="form-label fw-bold">Discipline Sportive</label>
                            <select name="sport_id" class="form-select" required>
                                <option value="">Choisir un sport...</option>
                                @foreach($sports as $sport)
                                    <option value="{{ $sport->id }}">{{ $sport->nom }}</option>
                                @endforeach
                            </select>
                        </div>

                        <div class="d-grid gap-2">
                            <button type="submit" class="btn btn-success fw-bold">
                                <i class="fas fa-check-circle me-2"></i>Enregistrer l'Équipe
                            </button>
                            <a href="{{ route('equipes.index') }}" class="btn btn-outline-secondary">Annuler</a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection