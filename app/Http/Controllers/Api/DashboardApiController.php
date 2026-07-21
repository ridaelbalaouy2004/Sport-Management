<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Sport;
use App\Models\Equipe;
use App\Models\Joueur;
use App\Models\MatchModel;
use App\Models\Resultat;
use Illuminate\Http\Request;

class DashboardApiController extends Controller
{
    /**
     * GET /api/dashboard/stats
     */
    public function stats()
    {
        $now        = now();
        $lastMonth  = now()->subMonth();

        $totalSports  = Sport::count();
        $totalTeams   = Equipe::count();
        $totalPlayers = Joueur::count();
        $totalMatches = MatchModel::count();

        // Simple growth: count added in last 30 days
        $newSports  = Sport::where('created_at', '>=', $lastMonth)->count();
        $newTeams   = Equipe::where('created_at', '>=', $lastMonth)->count();
        $newPlayers = Joueur::where('created_at', '>=', $lastMonth)->count();
        $newMatches = MatchModel::where('created_at', '>=', $lastMonth)->count();

        return response()->json([
            'sports'         => $totalSports,
            'sportsGrowth'   => ($newSports > 0 ? '+' : '') . $newSports,
            'teams'          => $totalTeams,
            'teamsGrowth'    => ($newTeams > 0 ? '+' : '') . $newTeams,
            'players'        => $totalPlayers,
            'playersGrowth'  => ($newPlayers > 0 ? '+' : '') . $newPlayers,
            'matches'        => $totalMatches,
            'matchesGrowth'  => ($newMatches > 0 ? '+' : '') . $newMatches,
            'upcoming'       => MatchModel::whereIn('status', ['pending', 'ongoing'])->count(),
            'completed'      => MatchModel::where('status', 'finished')->count(),
        ]);
    }

    /**
     * GET /api/dashboard/chart
     * Returns match count per sport for charting
     */
    public function chart()
    {
        $sports = Sport::withCount([
            'equipes',
            'joueurs',
        ])->get()->map(fn($sport) => [
            'sport'   => $sport->nom,
            'teams'   => $sport->equipes_count,
            'players' => $sport->joueurs_count,
        ]);

        // Matches per month (last 6 months)
        $matchesPerMonth = [];
        for ($i = 5; $i >= 0; $i--) {
            $month = now()->subMonths($i);
            $matchesPerMonth[] = [
                'month' => $month->format('M Y'),
                'count' => MatchModel::whereYear('date_match', $month->year)
                                     ->whereMonth('date_match', $month->month)
                                     ->count(),
            ];
        }

        return response()->json([
            'by_sport'        => $sports,
            'matches_per_month' => $matchesPerMonth,
        ]);
    }
}
