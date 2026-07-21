import { useState, useEffect } from 'react';
import { Dumbbell, Users, Shield, Calendar, TrendingUp } from 'lucide-react';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement,
  Title, Tooltip, Legend, ArcElement, PointElement, LineElement,
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import Card from '../components/Card';
import Badge from '../components/Badge';
import { formatDate, statusColor } from '../utils/helpers';
import { MOCK_STATS, CHART_COLORS } from '../utils/constants';
import { dashboardAPI, matchesAPI } from '../services/api';
import { PageLoader } from '../components/LoadingSpinner';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement);

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { position: 'top', labels: { boxWidth: 12, font: { size: 12 } } } },
  scales: {
    x: { grid: { display: false } },
    y: { beginAtZero: true, grid: { color: '#f1f5f9' } },
  },
};

const SPORTS_LABELS = ['Football', 'Basketball', 'Volleyball'];
const barData = {
  labels: SPORTS_LABELS,
  datasets: [
    {
      label: 'Wins', data: [36, 28, 14],
      backgroundColor: CHART_COLORS.blue, borderColor: CHART_COLORS.border.blue, borderWidth: 2, borderRadius: 6,
    },
    {
      label: 'Losses', data: [16, 10, 7],
      backgroundColor: CHART_COLORS.red, borderColor: CHART_COLORS.border.red, borderWidth: 2, borderRadius: 6,
    },
    {
      label: 'Draws', data: [8, 0, 3],
      backgroundColor: CHART_COLORS.amber, borderColor: CHART_COLORS.border.amber, borderWidth: 2, borderRadius: 6,
    },
  ],
};

const doughnutData = {
  labels: ['Wins', 'Losses', 'Draws'],
  datasets: [{
    data: [78, 33, 11],
    backgroundColor: [CHART_COLORS.blue, CHART_COLORS.red, CHART_COLORS.amber],
    borderColor: ['#fff', '#fff', '#fff'],
    borderWidth: 3,
  }],
};

const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 12 }, padding: 16 } },
  },
  cutout: '70%',
};

const Dashboard = () => {
  const [stats, setStats] = useState(MOCK_STATS);
  const [matches, setMatches] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [statsRes, matchesRes, chartRes] = await Promise.all([
          dashboardAPI.getStats().catch(() => ({ data: MOCK_STATS })),
          matchesAPI.getAll().catch(() => ({ data: { data: [] } })),
          dashboardAPI.getChartData().catch(() => ({ data: { by_sport: [], matches_per_month: [] } }))
        ]);
        setStats(statsRes.data);
        setMatches(matchesRes.data.data || matchesRes.data);
        setChartData(chartRes.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const upcomingMatches = matches.filter((m) => m.status === 'pending' || m.status === 'ongoing');
  const recentMatches = matches.filter((m) => m.status === 'finished');

  // Dynamic Chart Data
  const lineData = {
    labels: chartData?.matches_per_month?.map(m => m.month) || [],
    datasets: [
      {
        label: 'Matches',
        data: chartData?.matches_per_month?.map(m => m.count) || [],
        borderColor: CHART_COLORS.blue,
        backgroundColor: CHART_COLORS.blue + '80',
        borderWidth: 2,
        tension: 0.3,
        fill: true,
      }
    ]
  };

  const dynamicDoughnutData = {
    labels: chartData?.by_sport?.map(s => s.sport) || [],
    datasets: [{
      data: chartData?.by_sport?.map(s => s.teams) || [],
      backgroundColor: [CHART_COLORS.blue, CHART_COLORS.amber, CHART_COLORS.emerald, CHART_COLORS.purple, CHART_COLORS.red],
      borderColor: '#fff',
      borderWidth: 3,
    }],
  };

  if (loading) return <PageLoader />;

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Welcome banner */}
      <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-full opacity-10">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <circle cx="150" cy="50" r="80" fill="white" />
            <circle cx="50" cy="150" r="60" fill="white" />
          </svg>
        </div>
        <div className="relative">
          <p className="text-indigo-200 text-sm font-medium mb-1">Welcome back 👋</p>
          <h2 className="text-2xl font-bold mb-1">Sports Dashboard</h2>
          <p className="text-indigo-200 text-sm">{formatDate(new Date().toISOString())} · Season 2025–26</p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <Card title="Total Sports" value={stats.sports} icon={Dumbbell} color="indigo" growth={stats.sportsGrowth} subtitle="Active disciplines" />
        <Card title="Total Players" value={stats.players} icon={Users} color="emerald" growth={stats.playersGrowth} subtitle="Registered athletes" />
        <Card title="Total Teams" value={stats.teams} icon={Shield} color="amber" growth={stats.teamsGrowth} subtitle="Active clubs" />
        <Card title="Total Matches" value={stats.matches} icon={Calendar} color="purple" growth={stats.matchesGrowth} subtitle="This season" />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Line chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 card-shadow-md border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-800">Matches Over Time</h3>
              <p className="text-xs text-slate-400 mt-0.5">Monthly match frequency</p>
            </div>
            <TrendingUp className="w-4 h-4 text-indigo-500" />
          </div>
          <div style={{ height: '240px' }}>
            <Line data={lineData} options={chartOptions} />
          </div>
        </div>

        {/* Doughnut chart */}
        <div className="bg-white rounded-2xl p-5 card-shadow-md border border-slate-100">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-slate-800">Teams by Sport</h3>
            <p className="text-xs text-slate-400 mt-0.5">Distribution of teams</p>
          </div>
          <div style={{ height: '240px' }}>
            <Doughnut data={dynamicDoughnutData} options={doughnutOptions} />
          </div>
        </div>
      </div>

      {/* Recent & Upcoming */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Upcoming matches */}
        <div className="bg-white rounded-2xl p-5 card-shadow-md border border-slate-100">
          <h3 className="text-sm font-semibold text-slate-800 mb-4">Upcoming Matches</h3>
          <div className="space-y-3">
            {upcomingMatches.length === 0 && (
              <p className="text-sm text-slate-400 text-center py-6">No upcoming matches</p>
            )}
            {upcomingMatches.map((m) => (
              <div key={m.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-xl border border-blue-100">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">{m.home_team} <span className="text-slate-400 font-normal">vs</span> {m.away_team}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{formatDate(m.date)} · {m.venue}</p>
                </div>
                <Badge variant={m.status === 'ongoing' ? 'warning' : 'blue'}>
                  {m.status === 'ongoing' ? 'Ongoing' : 'Upcoming'}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Recent results */}
        <div className="bg-white rounded-2xl p-5 card-shadow-md border border-slate-100">
          <h3 className="text-sm font-semibold text-slate-800 mb-4">Recent Results</h3>
          <div className="space-y-3">
            {recentMatches.length === 0 && (
              <p className="text-sm text-slate-400 text-center py-6">No recent matches</p>
            )}
            {recentMatches.map((m) => (
              <div key={m.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-slate-800 truncate">{m.home_team} {m.home_score} - {m.away_score} {m.away_team}</p>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{formatDate(m.date)} · {m.venue}</p>
                </div>
                <Badge variant="success">Finished</Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
