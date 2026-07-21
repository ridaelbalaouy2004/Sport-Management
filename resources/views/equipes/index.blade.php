@extends('layouts.app')

@section('content')
<div class="container">
    <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="fw-bold text-success">🛡️ Liste des Équipes</h2>
        <a href="{{ route('equipes.create') }}" class="btn btn-success shadow-sm">
            <i class="fas fa-plus-circle me-1"></i> Ajouter une Équipe
        </a>
    </div>

    @if(session('success'))
        <div class="alert alert-success border-0 shadow-sm">
            {{ session('success') }}
        </div>
    @endif

    <div class="card border-0 shadow-sm">
        <div class="card-body p-0">
            <table class="table table-hover align-middle mb-0">
                <thead class="table-light">
                    <tr>
                        <th class="ps-4">Nom de l'Équipe</th>
                        <th>Ville</th>
                        <th>Sport</th>
                        <th class="text-end pe-4">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($equipes as $equipe)
                    <tr>
                        <td class="ps-4">
                            <span class="fw-bold text-dark">{{ $equipe->nom }}</span>
                        </td>
                        <td>{{ $equipe->ville }}</td>
                        <td>
                            <span class="badge bg-info text-white">
                                {{ $equipe->sport->nom ?? 'N/A' }}
                            </span>
                        </td>
                        <td class="text-end pe-4">
                            <a href="{{ route('equipes.edit', $equipe->id) }}" class="btn btn-sm btn-outline-warning me-1">
                                <i class="fas fa-edit"></i> Modifier
                            </a>

                            <form action="{{ route('equipes.destroy', $equipe->id) }}" method="POST" class="d-inline">
                                @csrf
                                @method('DELETE')
                                <button type="submit" class="btn btn-sm btn-outline-danger" onclick="return confirm('Voulez-vous vraiment supprimer cette équipe ?')">
                                    <i class="fas fa-trash"></i> Supprimer
                                </button>
                            </form>
                        </td>
                    </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
    </div>
</div>
@endsection