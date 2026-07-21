<?php

namespace App\Http\Controllers;
use App\Models\MatchModel;
use App\Models\Equipe;
use Illuminate\Http\Request;

class MatchController extends Controller
{
    public function index()
    {
        // كنصيفطو الماتشات ومعاهم سميات الفرق بجوج
        $matchs = MatchModel::with(['equipeDomicile', 'equipeExterieur'])->latest()->get();
        $equipes = Equipe::all();
        return view('matchs.index', compact('matchs', 'equipes'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'equipe_domicile_id' => 'required|different:equipe_exterieur_id',
            'equipe_exterieur_id' => 'required',
            'date_match' => 'required|date',
            'lieu' => 'required|string',
        ]);

        MatchModel::create($request->all());
        return redirect()->back()->with('success', 'Match ajouté avec succès!');
    }
    public function updateScore(Request $request, $id)
    {
    $request->validate([
        'score_domicile' => 'required|integer|min:0',
        'score_exterieur' => 'required|integer|min:0',
    ]);

    $match = MatchModel::findOrFail($id);
    $match->update([
        'score_domicile' => $request->score_domicile,
        'score_exterieur' => $request->score_exterieur,
    ]);

    return redirect()->back()->with('success', 'Score mis à jour !');
    }
    public function classement()
{
    // كنجيبو كاع الفرق
    $equipes = Equipe::all();
    $stats = [];

    foreach ($equipes as $equipe) {
        // كنجيبو الماتشات اللي لعباتهم هاد الفرقة (فدارها أو برا)
        $matchs = MatchModel::where('equipe_domicile_id', $equipe->id)
                            ->orWhere('equipe_exterieur_id', $equipe->id)
                            ->get();

        $mj = 0; $g = 0; $n = 0; $p = 0; $bp = 0; $bc = 0;

        foreach ($matchs as $m) {
            $mj++;
            if ($m->equipe_domicile_id == $equipe->id) {
                // تلعبات فدارها
                $bp += $m->score_domicile;
                $bc += $m->score_exterieur;
                if ($m->score_domicile > $m->score_exterieur) $g++;
                elseif ($m->score_domicile == $m->score_exterieur) $n++;
                else $p++;
            } else {
                // تلعبات برا
                $bp += $m->score_exterieur;
                $bc += $m->score_domicile;
                if ($m->score_exterieur > $m->score_domicile) $g++;
                elseif ($m->score_exterieur == $m->score_domicile) $n++;
                else $p++;
            }
        }

        $stats[] = [
            'nom' => $equipe->nom,
            'mj' => $mj,
            'g' => $g,
            'n' => $n,
            'p' => $p,
            'pts' => ($g * 3) + $n,
            'diff' => $bp - $bc
        ];
    }

    // ترتيب الفرق (النقط، ثم فارق الأهداف)
    usort($stats, function($a, $b) {
        if ($a['pts'] == $b['pts']) return $b['diff'] <=> $a['diff'];
        return $b['pts'] <=> $a['pts'];
    });

    return view('matchs.classement', compact('stats'));
}
}
