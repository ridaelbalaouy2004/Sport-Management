export const ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/',
  SPORTS: '/sports',
  PLAYERS: '/players',
  TEAMS: '/teams',
  MATCHES: '/matches',
  RESULTS: '/results',
  RANKINGS: '/rankings',
  ADMIN: '/admin',
  PROFILE: '/profile',
};

export const ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  VIEWER: 'viewer',
};

export const MATCH_STATUS = {
  UPCOMING: 'upcoming',
  ONGOING: 'ongoing',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

export const CHART_COLORS = {
  blue: 'rgba(99, 102, 241, 0.8)',
  emerald: 'rgba(16, 185, 129, 0.8)',
  red: 'rgba(239, 68, 68, 0.8)',
  amber: 'rgba(245, 158, 11, 0.8)',
  purple: 'rgba(139, 92, 246, 0.8)',
  teal: 'rgba(20, 184, 166, 0.8)',
  border: {
    blue: 'rgba(99, 102, 241, 1)',
    emerald: 'rgba(16, 185, 129, 1)',
    red: 'rgba(239, 68, 68, 1)',
    amber: 'rgba(245, 158, 11, 1)',
    purple: 'rgba(139, 92, 246, 1)',
    teal: 'rgba(20, 184, 166, 1)',
  },
};

// Mock data for demo (used when API is unavailable)
export const MOCK_SPORTS = [
  { id: 1, name: 'Football', category: 'Team', players: 120, teams: 8, status: 'active' },
  { id: 2, name: 'Basketball', category: 'Team', players: 48, teams: 4, status: 'active' },
  { id: 3, name: 'Tennis', category: 'Individual', players: 32, teams: 0, status: 'active' },
  { id: 4, name: 'Volleyball', category: 'Team', players: 72, teams: 6, status: 'active' },
  { id: 5, name: 'Swimming', category: 'Individual', players: 24, teams: 0, status: 'inactive' },
];

export const MOCK_TEAMS = [
  { id: 1, name: 'Thunder Hawks', sport: 'Football', sport_id: 1, coach: 'James Wilson', players: 22, wins: 15, losses: 3, draws: 2, status: 'active' },
  { id: 2, name: 'Blue Sharks', sport: 'Football', sport_id: 1, coach: 'Maria Lopez', players: 20, wins: 12, losses: 5, draws: 3, status: 'active' },
  { id: 3, name: 'Golden Eagles', sport: 'Basketball', sport_id: 2, coach: 'Alex Carter', players: 12, wins: 18, losses: 2, draws: 0, status: 'active' },
  { id: 4, name: 'Red Dragons', sport: 'Basketball', sport_id: 2, coach: 'Chen Wei', players: 12, wins: 10, losses: 8, draws: 0, status: 'active' },
  { id: 5, name: 'Mighty Waves', sport: 'Volleyball', sport_id: 4, coach: 'Sarah Brown', players: 12, wins: 7, losses: 5, draws: 2, status: 'active' },
  { id: 6, name: 'Steel Lions', sport: 'Football', sport_id: 1, coach: 'Tom Ford', players: 21, wins: 9, losses: 8, draws: 3, status: 'active' },
];

export const MOCK_PLAYERS = [
  { id: 1, name: 'Carlos Mendez', age: 24, position: 'Forward', team: 'Thunder Hawks', team_id: 1, sport: 'Football', sport_id: 1, jersey: '#9', status: 'active' },
  { id: 2, name: 'Amara Diallo', age: 22, position: 'Midfielder', team: 'Blue Sharks', team_id: 2, sport: 'Football', sport_id: 1, jersey: '#7', status: 'active' },
  { id: 3, name: 'Jake Robertson', age: 26, position: 'Defender', team: 'Thunder Hawks', team_id: 1, sport: 'Football', sport_id: 1, jersey: '#4', status: 'active' },
  { id: 4, name: 'Yuki Tanaka', age: 21, position: 'Point Guard', team: 'Golden Eagles', team_id: 3, sport: 'Basketball', sport_id: 2, jersey: '#11', status: 'active' },
  { id: 5, name: 'Leo Santos', age: 23, position: 'Center', team: 'Red Dragons', team_id: 4, sport: 'Basketball', sport_id: 2, jersey: '#33', status: 'active' },
  { id: 6, name: 'Nina Kowalski', age: 25, position: 'Setter', team: 'Mighty Waves', team_id: 5, sport: 'Volleyball', sport_id: 4, jersey: '#2', status: 'active' },
  { id: 7, name: 'Omar Hassan', age: 28, position: 'Goalkeeper', team: 'Steel Lions', team_id: 6, sport: 'Football', sport_id: 1, jersey: '#1', status: 'active' },
  { id: 8, name: 'Elena Petrov', age: 20, position: 'Libero', team: 'Mighty Waves', team_id: 5, sport: 'Volleyball', sport_id: 4, jersey: '#10', status: 'inactive' },
];

export const MOCK_MATCHES = [
  { id: 1, home_team: 'Thunder Hawks', away_team: 'Blue Sharks', sport: 'Football', date: '2026-05-10T15:00:00', venue: 'City Stadium', status: 'upcoming' },
  { id: 2, home_team: 'Golden Eagles', away_team: 'Red Dragons', sport: 'Basketball', date: '2026-05-08T18:30:00', venue: 'Arena Hall', status: 'upcoming' },
  { id: 3, home_team: 'Thunder Hawks', away_team: 'Steel Lions', sport: 'Football', date: '2026-04-20T16:00:00', venue: 'City Stadium', status: 'completed' },
  { id: 4, home_team: 'Mighty Waves', away_team: 'Blue Sharks', sport: 'Volleyball', date: '2026-04-18T14:00:00', venue: 'Sports Hall B', status: 'completed' },
  { id: 5, home_team: 'Red Dragons', away_team: 'Golden Eagles', sport: 'Basketball', date: '2026-05-15T19:00:00', venue: 'Arena Hall', status: 'upcoming' },
];

export const MOCK_RESULTS = [
  { id: 1, match: 'Thunder Hawks vs Steel Lions', sport: 'Football', home_score: 3, away_score: 1, winner: 'Thunder Hawks', date: '2026-04-20' },
  { id: 2, match: 'Mighty Waves vs Blue Sharks', sport: 'Volleyball', home_score: 3, away_score: 0, winner: 'Mighty Waves', date: '2026-04-18' },
  { id: 3, match: 'Golden Eagles vs Red Dragons', sport: 'Basketball', home_score: 98, away_score: 87, winner: 'Golden Eagles', date: '2026-04-15' },
  { id: 4, match: 'Blue Sharks vs Steel Lions', sport: 'Football', home_score: 2, away_score: 2, winner: 'Draw', date: '2026-04-12' },
];

export const MOCK_RANKINGS = [
  { id: 1, rank: 1, team: 'Thunder Hawks', sport: 'Football', played: 20, wins: 15, losses: 3, draws: 2, points: 47 },
  { id: 2, rank: 2, team: 'Blue Sharks', sport: 'Football', played: 20, wins: 12, losses: 5, draws: 3, points: 39 },
  { id: 3, rank: 3, team: 'Steel Lions', sport: 'Football', played: 20, wins: 9, losses: 8, draws: 3, points: 30 },
  { id: 4, rank: 4, team: 'Golden Eagles', sport: 'Basketball', played: 20, wins: 18, losses: 2, draws: 0, points: 54 },
  { id: 5, rank: 5, team: 'Red Dragons', sport: 'Basketball', played: 18, wins: 10, losses: 8, draws: 0, points: 30 },
];

export const MOCK_USERS = [
  { id: 1, name: 'Admin User', email: 'admin@sportsync.com', role: 'admin', status: 'active', created_at: '2025-01-01' },
  { id: 2, name: 'Coach James', email: 'james@sportsync.com', role: 'manager', status: 'active', created_at: '2025-02-15' },
  { id: 3, name: 'Viewer One', email: 'viewer@sportsync.com', role: 'viewer', status: 'active', created_at: '2025-03-10' },
];

export const MOCK_STATS = {
  sports: 5, players: 8, teams: 6, matches: 5,
  sportsGrowth: '+2', playersGrowth: '+12', teamsGrowth: '+1', matchesGrowth: '+3',
};
