<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Modifier Sport</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light">
<div class="container mt-5">
    <div class="row justify-content-center">
        <div class="col-md-6">
            <div class="card shadow">
                <div class="card-header bg-warning text-dark">
                    <h5 class="mb-0">Modifier le Sport : {{ $sport->nom }}</h5>
                </div>
                <div class="card-body">
                    <form action="{{ route('sports.update', $sport->id) }}" method="POST">
                        @csrf
                        @method('PUT') <div class="mb-3">
                            <label class="form-label">Nom du Sport</label>
                            <input type="text" name="nom" value="{{ $sport->nom }}" class="form-control" required>
                        </div>

                        <div class="d-flex justify-content-between">
                            <button type="submit" class="btn btn-success">Enregistrer les modifications</button>
                            <a href="{{ route('sports.index') }}" class="btn btn-secondary">Annuler</a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>
</body>
</html>