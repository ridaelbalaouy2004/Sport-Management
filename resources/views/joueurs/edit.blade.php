<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Modifier Joueur</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light container mt-5">
    <div class="card shadow">
        <div class="card-header bg-warning">Modifier le joueur : {{ $joueur->nom }} {{ $joueur->prenom }}</div>
        <div class="card-body">
            <form action="{{ route('joueurs.update', $joueur->id) }}" method="POST">
                @csrf
                @method('PUT')
                <div class="row g-3">
                    <div class="col-md-6">
                        <label>Nom</label>
                        <input type="text" name="nom" value="{{ $joueur->nom }}" class="form-control" required>
                    </div>
                    <div class="col-md-6">
                        <label>Prénom</label>
                        <input type="text" name="prenom" value="{{ $joueur->prenom }}" class="form-control" required>
                    </div>
                    <div class="col-md-4">
                        <label>Âge</label>
                        <input type="number" name="age" value="{{ $joueur->age }}" class="form-control" required>
                    </div>
                    <div class="col-md-4">
                        <label>Poste</label>
                        <select name="poste" class="form-select" required>
                            <option value="Gardien" {{ $joueur->poste == 'Gardien' ? 'selected' : '' }}>Gardien</option>
                            <option value="Défenseur" {{ $joueur->poste == 'Défenseur' ? 'selected' : '' }}>Défenseur</option>
                            <option value="Milieu" {{ $joueur->poste == 'Milieu' ? 'selected' : '' }}>Milieu</option>
                            <option value="Attaquant" {{ $joueur->poste == 'Attaquant' ? 'selected' : '' }}>Attaquant</option>
                        </select>
                    </div>
                    <div class="col-md-4">
                        <label>Équipe</label>
                        <select name="equipe_id" class="form-select" required>
                            @foreach($equipes as $equipe)
                                <option value="{{ $equipe->id }}" {{ $joueur->equipe_id == $equipe->id ? 'selected' : '' }}>
                                    {{ $equipe->nom }}
                                </option>
                            @endforeach
                        </select>
                    </div>
                    <div class="col-12 mt-4">
                        <button type="submit" class="btn btn-success w-100">Enregistrer les modifications</button>
                    </div>
                </div>
            </form>
        </div>
    </div>
</body>
</html>