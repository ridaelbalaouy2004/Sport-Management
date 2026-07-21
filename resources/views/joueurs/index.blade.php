@extends('layouts.app')

@section('content')
<div class="container">
    <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="fw-bold text-info">🏃 Gestion des Joueurs</h2>
        <a href="{{ route('joueurs.create') }}" class="btn btn-info text-white shadow-sm">
            <i class="fas fa-user-plus me-1"></i> Ajouter un Joueur
        </a>
    </div>

    <div class="card border-0 shadow-sm mb-4">
        <div class="card-body">
            <form action="{{ route('joueurs.index') }}" method="GET" class="row g-3">
                <div class="col-md-5">
                    <div class="input-group">
                        <span class="input-group-text bg-light border-0"><i class="fas fa-search text-muted"></i></span>
                        <input type="text" name="search" class="form-control border-0 bg-light" 
                               placeholder="Rechercher par nom ou prénom..." value="{{ request('search') }}">
                    </div>
                </div>

                <div class="col-md-4">
                    <select name="equipe_id" class="form-select border-0 bg-light">
                        <option value="">Toutes les équipes</option>
                        @foreach($equipes as $equipe)
                            <option value="{{ $equipe->id }}" {{ request('equipe_id') == $equipe->id ? 'selected' : '' }}>
                                {{ $equipe->nom }}
                            </option>
                        @endforeach
                    </select>
                </div>

                <div class="col-md-3 d-flex gap-2">
                    <button type="submit" class="btn btn-dark flex-grow-1">Filtrer</button>
                    <a href="{{ route('joueurs.index') }}" class="btn btn-outline-secondary"><i class="fas fa-undo"></i></a>
                </div>
            </form>
        </div>
    </div>

    @if(session('success'))
        <div class="alert alert-success border-0 shadow-sm">{{ session('success') }}</div>
    @endif

    <div class="card border-0 shadow-sm">
        <div class="card-body p-0">
            <table class="table table-hover align-middle mb-0">
                <thead class="table-light">
                    <tr>
                        <th class="ps-4">Joueur (Nom & Prénom)</th>
                        <th>Âge</th>
                        <th>Position</th>
                        <th>Équipe</th>
                        <th class="text-end pe-4">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse($joueurs as $joueur)
                    <tr>
                        <td class="ps-4">
                            <div class="fw-bold">{{ $joueur->nom }} {{ $joueur->prenom }}</div>
                        </td>
                        <td>{{ $joueur->age }} ans</td>
                        <td><span class="badge bg-light text-dark border">{{ $joueur->poste }}</span></td>
                        <td>
                            <span class="badge bg-primary bg-opacity-10 text-primary">
                                {{ $joueur->equipe->nom ?? 'Sans club' }}
                            </span>
                        </td>
                        <td class="text-end pe-4">
                            <a href="{{ route('joueurs.edit', $joueur->id) }}" class="btn btn-sm btn-outline-warning">
                                <i class="fas fa-edit"></i>
                            </a>
                            <form action="{{ route('joueurs.destroy', $joueur->id) }}" method="POST" class="d-inline">
                                @csrf @method('DELETE')
                                <button type="submit" class="btn btn-sm btn-outline-danger" onclick="return confirm('Supprimer ce joueur ?')">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </form>
                        </td>
                    </tr>
                    @empty
                    <tr>
                        <td colspan="5" class="text-center py-4 text-muted">Aucun joueur trouvé.</td>
                    </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>
</div>
@endsection