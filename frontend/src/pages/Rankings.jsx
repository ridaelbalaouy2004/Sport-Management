import { useState, useEffect } from 'react';
import { Trophy } from 'lucide-react';
import Badge from '../components/Badge';
import { rankColor, rankMedal, sortBy } from '../utils/helpers';
import { rankingsAPI, sportsAPI } from '../services/api';
import toast from 'react-hot-toast';
import { PageLoader } from '../components/LoadingSpinner';

const Rankings = () => {
  const [filterSportId, setFilterSportId] = useState('');
  const [rankings, setRankings] = useState([]);
  const [sportsList, setSportsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initData = async () => {
      try {
        const sportsRes = await sportsAPI.getAll();
        const sportsData = sportsRes.data.data || sportsRes.data;
        setSportsList(sportsData);
        if (sportsData.length > 0) {
          setFilterSportId(sportsData[0].id);
        } else {
          setLoading(false);
        }
      } catch (error) {
        toast.error('Failed to load sports');
        setLoading(false);
      }
    };
    initData();
  }, []);

  useEffect(() => {
    if (!filterSportId) return;
    const fetchRankings = async () => {
      setLoading(true);
      try {
        const res = await rankingsAPI.getAll({ sport_id: filterSportId });
        setRankings(res.data.data || res.data);
      } catch (error) {
        toast.error('Failed to fetch rankings');
      } finally {
        setLoading(false);
      }
    };
    fetchRankings();
  }, [filterSportId]);

  if (loading && rankings.length === 0) return <PageLoader />;

  return (
    <div className="flex flex-col gap-5 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Rankings</h2>
          <p className="text-sm text-slate-500 mt-0.5">League standings & points table</p>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-slate-600">Sport:</label>
          <select
            id="rankings-filter-sport"
            value={filterSportId}
            onChange={(e) => setFilterSportId(e.target.value)}
            className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
          >
            {sportsList.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
      </div>

      {/* Podium for top 3 */}
      {rankings.slice(0, 3).length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          {/* 2nd place */}
          {rankings[1] && (
            <div className="bg-gradient-to-b from-slate-50 to-white border border-slate-200 rounded-2xl p-4 text-center mt-4">
              <p className="text-3xl mb-2">🥈</p>
              <p className="font-bold text-slate-800">{rankings[1].team}</p>
              <p className="text-xs text-slate-400">{rankings[1].sport}</p>
              <p className="text-2xl font-bold text-slate-600 mt-2">{rankings[1].points}</p>
              <p className="text-xs text-slate-400">pts</p>
            </div>
          )}
          {/* 1st place */}
          {rankings[0] && (
            <div className="bg-gradient-to-b from-yellow-50 to-amber-50 border border-yellow-200 rounded-2xl p-4 text-center shadow-lg shadow-yellow-100 -mt-2">
              <p className="text-4xl mb-2">🥇</p>
              <p className="font-bold text-slate-800 text-lg">{rankings[0].team}</p>
              <p className="text-xs text-slate-400">{rankings[0].sport}</p>
              <p className="text-3xl font-bold text-yellow-600 mt-2">{rankings[0].points}</p>
              <p className="text-xs text-yellow-600 font-medium">pts</p>
            </div>
          )}
          {/* 3rd place */}
          {rankings[2] && (
            <div className="bg-gradient-to-b from-orange-50 to-white border border-orange-200 rounded-2xl p-4 text-center mt-5">
              <p className="text-3xl mb-2">🥉</p>
              <p className="font-bold text-slate-800">{rankings[2].team}</p>
              <p className="text-xs text-slate-400">{rankings[2].sport}</p>
              <p className="text-2xl font-bold text-orange-500 mt-2">{rankings[2].points}</p>
              <p className="text-xs text-slate-400">pts</p>
            </div>
          )}
        </div>
      )}

      {/* Full ranking table */}
      <div className="bg-white rounded-2xl overflow-hidden card-shadow-md border border-slate-100">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
          <Trophy className="w-4 h-4 text-indigo-500" />
          <h3 className="text-sm font-semibold text-slate-800">Full Standings</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Rank</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Team</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Sport</th>
                <th className="px-5 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wide">Played</th>
                <th className="px-5 py-3 text-center text-xs font-semibold text-emerald-600 uppercase tracking-wide">W</th>
                <th className="px-5 py-3 text-center text-xs font-semibold text-red-500 uppercase tracking-wide">L</th>
                <th className="px-5 py-3 text-center text-xs font-semibold text-amber-500 uppercase tracking-wide">D</th>
                <th className="px-5 py-3 text-center text-xs font-semibold text-indigo-600 uppercase tracking-wide">Points</th>
              </tr>
            </thead>
            <tbody>
              {rankings.map((row) => (
                <tr key={row.id} className={`border-b border-slate-50 last:border-0 hover:bg-slate-50/60 transition-colors ${row.rank <= 3 ? 'font-semibold' : ''}`}>
                  <td className="px-5 py-3">
                    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full border text-sm font-bold ${rankColor(row.rank)}`}>
                      {rankMedal(row.rank)}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-slate-800">{row.team}</td>
                  <td className="px-5 py-3"><Badge variant="purple">{row.sport}</Badge></td>
                  <td className="px-5 py-3 text-center text-slate-600">{row.played}</td>
                  <td className="px-5 py-3 text-center text-emerald-600 font-semibold">{row.wins}</td>
                  <td className="px-5 py-3 text-center text-red-500 font-semibold">{row.losses}</td>
                  <td className="px-5 py-3 text-center text-amber-500 font-semibold">{row.draws}</td>
                  <td className="px-5 py-3 text-center">
                    <span className="text-indigo-700 font-bold text-base">{row.points}</span>
                  </td>
                </tr>
              ))}
              {rankings.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-slate-400">No rankings available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Rankings;
