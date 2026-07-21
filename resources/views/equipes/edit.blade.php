<form action="{{ route('equipes.update', $equipe->id) }}" method="POST" class="card p-4 shadow-sm">
    @csrf
    @method('PUT')
    
    <div class="mb-3">
        <label>Nom de l'équipe</label>
        <input type="text" name="nom" value="{{ $equipe->nom }}" class="form-control" required>
    </div>

    <div class="mb-3">
        <label>Ville</label>
        <input type="text" name="ville" value="{{ $equipe->ville }}" class="form-control" required>
    </div>

    <div class="mb-3">
        <label>Discipline Sportive</label>
        <select name="sport_id" class="form-select" required>
            @foreach($sports as $sport)
                <option value="{{ $sport->id }}" {{ $equipe->sport_id == $sport->id ? 'selected' : '' }}>
                    {{ $sport->nom }}
                </option>
            @endforeach
        </select>
    </div>

    <button type="submit" class="btn btn-primary">Mettre à jour</button>
    <a href="{{ route('equipes.index') }}" class="btn btn-secondary">Annuler</a>
</form>