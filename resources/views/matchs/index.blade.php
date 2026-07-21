@extends('layouts.app')

@section('content')
    <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="fw-bold m-0">🏟️ Gestion des المباريات</h2>
    </div>

    @if(session('success'))
        <div class="alert alert-success border-0 shadow-sm">{{ session('success') }}</div>
    @endif

    <div class="card mb-4 shadow-sm border-0">
        <div class="card-header bg-primary text-white fw-bold">Programmer un Match</div>
        <div class="card-body">
            <form action="{{ route('matchs.store') }}" method="POST">
                @csrf
                <div class="row g-3">
                    <div class="col-md-3">
                        <label class="form-label small fw-bold">Équipe Domicile</label>
                        <select name="equipe_domicile_id" class="form-select" required>
                            <option value="">Choisir...</option>
                            @foreach($equipes as $equipe)
                                <option value="{{ $equipe->id }}">{{ $equipe->nom }}</option>
                            @endforeach
                        </select>
                    </div>
                    <div class="col-md-3">
                        <label class="form-label small fw-bold">Équipe Extérieur</label>
                        <select name="equipe_exterieur_id" class="form-select" required>
                            <option value="">Choisir...</option>
                            @foreach($equipes as $equipe)
                                <option value="{{ $equipe->id }}">{{ $equipe->nom }}</option>
                            @endforeach
                        </select>
                    </div>
                    <div class="col-md-3">
                        <input type="datetime-local" name="date_match" class="form-control mt-4" required>
                    </div>
                    <div class="col-md-3">
                        <input type="text" name="lieu" class="form-control mt-4" placeholder="Stade" required>
                    </div>
                    <div class="col-12 text-end">
                        <button type="submit" class="btn btn-primary">Enregistrer</button>
                    </div>
                </div>
            </form>
        </div>
    </div>

    <div class="table-responsive bg-white shadow-sm rounded">
        <table class="table table-hover mb-0">
            <thead class="table-dark">
                <tr>
                    <th>Date</th>
                    <th>Domicile</th>
                    <th class="text-center">Score</th>
                    <th>Extérieur</th>
                    <th>Lieu</th>
                </tr>
            </thead>
            <tbody>
                @foreach($matchs as $match)
                <tr class="align-middle">
                    <td>{{ \Carbon\Carbon::parse($match->date_match)->format('d/m H:i') }}</td>
                    <td class="fw-bold">{{ $match->equipeDomicile->nom }}</td>
                    <td class="text-center">
                        <form action="{{ route('matchs.updateScore', $match->id) }}" method="POST" class="d-flex gap-1 justify-content-center">
                            @csrf @method('PUT')
                            <input type="number" name="score_domicile" value="{{ $match->score_domicile }}" class="form-control form-control-sm text-center" style="width: 45px;">
                            <span>-</span>
                            <input type="number" name="score_exterieur" value="{{ $match->score_exterieur }}" class="form-control form-control-sm text-center" style="width: 45px;">
                            <button class="btn btn-sm btn-success py-0">OK</button>
                        </form>
                    </td>
                    <td class="fw-bold">{{ $match->equipeExterieur->nom }}</td>
                    <td>{{ $match->lieu }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>
@endsection