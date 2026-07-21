@extends('layouts.app')

@section('content')
<div class="container">
    <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="fw-bold text-primary">🏆 Liste des Sports</h2>
        <a href="{{ route('sports.create') }}" class="btn btn-primary shadow-sm">
            <i class="fas fa-plus-circle me-1"></i> Ajouter un Sport
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
                        <th class="ps-4">Nom du Sport</th>
                        <th>Nombre d'Équipes</th>
                        <th class="text-end pe-4">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($sports as $sport)
                    <tr>
                        <td class="ps-4 fw-bold text-dark">{{ $sport->nom }}</td>
                        <td>
                            <span class="badge bg-soft-info text-info px-3">
                                {{ $sport->equipes->count() }} Équipes
                            </span>
                        </td>
                        <td class="text-end pe-4">
                            <a href="{{ route('sports.edit', $sport->id) }}" class="btn btn-sm btn-outline-warning me-1">
                                <i class="fas fa-edit"></i> Modifier
                            </a>

                            <form action="{{ route('sports.destroy', $sport->id) }}" method="POST" class="d-inline">
                                @csrf
                                @method('DELETE')
                                <button type="submit" class="btn btn-sm btn-outline-danger" onclick="return confirm('Êtes-vous sûr de vouloir supprimer ce sport ?')">
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