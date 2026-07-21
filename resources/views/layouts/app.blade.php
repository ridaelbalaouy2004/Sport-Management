<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SportManager - Pro</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
        body { background-color: #f8f9fa; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
        .navbar { box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .main-content { min-height: 85vh; padding: 40px 0; }
        .nav-link { font-weight: 500; transition: 0.3s; }
        .nav-link:hover { color: #ffc107 !important; transform: translateY(-1px); }
        footer { font-size: 0.9rem; }
    </style>
</head>
<body>

    <nav class="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
        <div class="container">
            <a class="navbar-brand fw-bold fs-4" href="/">
                <i class="fas fa-trophy text-warning me-2"></i>SportManager
            </a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto align-items-center">
                    <li class="nav-item">
                        <a class="nav-link px-3" href="/"><i class="fas fa-home me-1"></i> Accueil</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link px-3" href="{{ route('sports.index') }}"><i class="fas fa-running me-1"></i> Sports</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link px-3" href="{{ route('equipes.index') }}"><i class="fas fa-shield-alt me-1"></i> Équipes</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link px-3" href="{{ route('joueurs.index') }}"><i class="fas fa-users me-1"></i> Joueurs</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link px-3" href="{{ route('matchs.index') }}"><i class="fas fa-calendar-check me-1"></i> Matchs</a>
                    </li>
                    <li class="nav-item ms-lg-2">
                        <a class="btn btn-warning btn-sm fw-bold px-3" href="{{ route('matchs.classement') }}">
                            <i class="fas fa-chart-line me-1"></i> Classement
                        </a>
                    </li>
                    <li class="nav-item ms-lg-2">
                        <form class="btn btn-warning btn-sm fw-bold px-3" action="{{ route('logout') }}" method="POST">
                            @csrf
                            <button type="submit" style="border: none; background : none; font-size :16px;"> Logout</button>
                        </form>
                    </li>
                </ul>
            </div>
        </div>
    </nav>

    <main class="container main-content">
        @yield('content')
    </main>

    <footer class="bg-white text-center py-4 border-top mt-auto">
        <div class="container">
            <p class="mb-1 text-dark fw-bold">SportManager Pro v1.0</p>
            <p class="mb-0 text-muted small">© 2026 Tous droits réservés - Créé avec <i class="fas fa-heart text-danger"></i> pour le sport.</p>
        </div>
    </footer>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>