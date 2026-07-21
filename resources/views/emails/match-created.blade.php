<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Match Scheduled</title>
    <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; background: #f1f5f9; margin: 0; padding: 0; }
        .container { max-width: 580px; margin: 40px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.10); }
        .header { background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); padding: 36px 32px; text-align: center; }
        .header h1 { color: #fff; font-size: 24px; margin: 0 0 6px; }
        .header p  { color: rgba(255,255,255,0.8); font-size: 14px; margin: 0; }
        .body { padding: 32px; }
        .match-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; margin: 16px 0; text-align: center; }
        .teams { display: flex; align-items: center; justify-content: center; gap: 20px; font-size: 20px; font-weight: 700; color: #1e293b; }
        .vs { background: #6366f1; color: #fff; border-radius: 50%; width: 36px; height: 36px; display: inline-flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 800; }
        .info-row { display: flex; justify-content: center; gap: 24px; margin-top: 16px; }
        .info-item { text-align: center; }
        .info-item .label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: #94a3b8; }
        .info-item .value { font-size: 14px; font-weight: 600; color: #334155; margin-top: 2px; }
        .footer { padding: 20px 32px; background: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center; font-size: 12px; color: #94a3b8; }
    </style>
</head>
<body>
<div class="container">
    <div class="header">
        <h1>⚽ New Match Scheduled</h1>
        <p>SportSync Management System</p>
    </div>
    <div class="body">
        <p style="color:#475569;font-size:15px;">A new match has been scheduled on the platform. Here are the details:</p>
        <div class="match-card">
            <div class="teams">
                <span>{{ $match->equipeDomicile?->nom ?? 'Home Team' }}</span>
                <span class="vs">VS</span>
                <span>{{ $match->equipeExterieur?->nom ?? 'Away Team' }}</span>
            </div>
            <div class="info-row">
                <div class="info-item">
                    <div class="label">Date</div>
                    <div class="value">{{ \Carbon\Carbon::parse($match->date_match)->format('M d, Y') }}</div>
                </div>
                <div class="info-item">
                    <div class="label">Time</div>
                    <div class="value">{{ \Carbon\Carbon::parse($match->date_match)->format('H:i') }}</div>
                </div>
                <div class="info-item">
                    <div class="label">Venue</div>
                    <div class="value">{{ $match->lieu ?? 'TBD' }}</div>
                </div>
                @if($match->equipeDomicile?->sport)
                <div class="info-item">
                    <div class="label">Sport</div>
                    <div class="value">{{ $match->equipeDomicile->sport->nom }}</div>
                </div>
                @endif
            </div>
        </div>
        <p style="color:#64748b;font-size:14px;margin-top:24px;">
            Log in to SportSync to manage this match, update scores, and track rankings.
        </p>
    </div>
    <div class="footer">
        &copy; {{ date('Y') }} SportSync — Sports Management Platform
    </div>
</div>
</body>
</html>
