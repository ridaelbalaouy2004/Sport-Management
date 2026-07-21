@extends('layouts.app')

@section('content')
    <div class="container py-4">
        <h2 class="fw-bold mb-4 text-center text-uppercase">📊 Classement du Championnat</h2>
        
        <div class="table-responsive bg-white shadow-sm rounded p-3">
            <table class="table table-hover align-middle">
                <thead class="table-dark">
                    <tr class="text-center">
                        <th>Pos</th>
                        <th class="text-start">Équipe</th>
                        <th>MJ</th>
                        <th>G</th>
                        <th>N</th>
                        <th>P</th>
                        <th>Diff</th>
                        <th class="bg-primary">Pts</th>
                    </tr>
                </thead>
                <tbody class="text-center">
                    @forelse($stats as $index => $s)
                    <tr>
                        <td><span class="badge bg-secondary rounded-pill">{{ $index + 1 }}</span></td>
                        <td class="text-start fw-bold text-dark">{{ $s['nom'] }}</td>
                        <td>{{ $s['mj'] }}</td>
                        <td class="text-success fw-bold">{{ $s['g'] }}</td>
                        <td class="text-warning fw-bold">{{ $s['n'] }}</td>
                        <td class="text-danger fw-bold">{{ $s['p'] }}</td>
                        <td class="fw-bold {{ $s['diff'] > 0 ? 'text-success' : ($s['diff'] < 0 ? 'text-danger' : '') }}">
                            {{ $s['diff'] > 0 ? '+'.$s['diff'] : $s['diff'] }}
                        </td>
                        <td class="fw-bold fs-5 text-primary">{{ $s['pts'] }}</td>
                    </tr>
                    @empty
                    <tr>
                        <td colspan="8" class="py-4 text-muted">Aucune donnée disponible. Marquez des scores pour voir le classement.</td>
                    </tr>
                    @endforelse
                </tbody>
            </table>
        </div>

        <div class="text-center mt-4">
            <a href="{{ route('matchs.index') }}" class="btn btn-outline-dark shadow-sm">
                <i class="fas fa-arrow-left me-2"></i>Retour aux Matchs
            </a>
        </div>
    </div>
@endsection