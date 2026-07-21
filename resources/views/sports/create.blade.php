@extends('layouts.app')

@section('content')
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-6">
            <div class="card shadow border-0">
                <div class="card-header bg-primary text-white fw-bold">
                    <i class="fas fa-plus-circle me-2"></i>Ajouter une Nouvelle Discipline
                </div>
                <div class="card-body p-4">
                    <form action="{{ route('sports.store') }}" method="POST">
                        @csrf
                        
                        <div class="mb-4">
                            <label for="nom" class="form-label fw-bold">Nom du Sport</label>
                            <input type="text" name="nom" id="nom" 
                                   class="form-control @error('nom') is-invalid @enderror" 
                                   placeholder="Ex: Football, Basketball..." required>
                            @error('nom')
                                <div class="invalid-feedback">{{ $message }}</div>
                            @enderror
                        </div>

                        <div class="d-grid gap-2">
                            <button type="submit" class="btn btn-success fw-bold">
                                <i class="fas fa-save me-2"></i>Enregistrer le Sport
                            </button>
                            <a href="{{ route('sports.index') }}" class="btn btn-outline-secondary">
                                Annuler
                            </a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection