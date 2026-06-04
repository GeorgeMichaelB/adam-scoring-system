import React, { useState } from 'react';
import { useScoreboard } from './ScoreboardContext';

export default function LeaderboardView() {
    const { leaderboard, resetScores, loading } = useScoreboard();
    const [showResetConfirm, setShowResetConfirm] = useState(false);
    const [resetting, setResetting] = useState(false);

    // Get Top 3 students
    const top3 = leaderboard.slice(0, 3);
    // Get remaining students
    const remaining = leaderboard.slice(3);

    // Map top 3 elements to specific positions: [2nd, 1st, 3rd]
    const podiumStudents = [];
    if (top3[1]) podiumStudents.push({ ...top3[1], place: 2 }); // 2nd Place (Silver)
    if (top3[0]) podiumStudents.push({ ...top3[0], place: 1 }); // 1st Place (Gold)
    if (top3[2]) podiumStudents.push({ ...top3[2], place: 3 }); // 3rd Place (Bronze)

    const handleReset = async () => {
        setResetting(true);
        const success = await resetScores();
        setResetting(false);
        if (success) {
            setShowResetConfirm(false);
            alert('تم تصفير النقاط بنجاح! / Leaderboard reset successfully!');
        } else {
            alert('حدث خطأ أثناء إعادة التعيين / Reset failed.');
        }
    };

    return (
        <div className="space-y-12">
            {/* Header banner */}
            <div className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500 p-1 rounded-3xl shadow-xl text-center">
                <div className="bg-white dark:bg-gray-900 rounded-[22px] p-6">
                    <h3 className="text-2xl font-black text-gray-800 dark:text-white flex justify-center items-center gap-2">
                        <span>🏆 لائحة الصدارة الأسبوعية 🏆</span>
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
                        شجع أبطالك الصغار على ارتقاء القمة!
                    </p>
                </div>
            </div>

            {/* Top 3 Podium Component */}
            {top3.length > 0 ? (
                <div className="flex flex-col items-center justify-center pt-8 pb-4">
                    <div className="flex items-end justify-center w-full max-w-lg gap-3 sm:gap-6 px-4">
                        
                        {/* 2nd Place Podium */}
                        {top3[1] && (
                            <div className="flex flex-col items-center flex-1 transition transform hover:scale-105 duration-300">
                                {/* Student details above podium */}
                                <div className="text-center mb-2">
                                    <div className="relative inline-block">
                                        <img 
                                            src={top3[1].avatar_url} 
                                            alt={top3[1].name} 
                                            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-slate-300 bg-white shadow-md"
                                        />
                                        <span className="absolute -top-2 -right-2 bg-slate-400 text-white rounded-full w-7 h-7 flex items-center justify-center font-black text-sm border-2 border-white shadow">
                                            ٢
                                        </span>
                                    </div>
                                    <div className="font-extrabold text-sm sm:text-base text-gray-800 dark:text-white truncate max-w-[100px] mt-1">
                                        {top3[1].name.split(' ')[0]}
                                    </div>
                                    <div className="text-xs text-slate-500 dark:text-slate-400 font-black">
                                        {top3[1].total_score} ⭐
                                    </div>
                                </div>
                                {/* Podium Block */}
                                <div className="w-full bg-gradient-to-t from-slate-400 to-slate-200 h-28 sm:h-36 rounded-t-3xl shadow-lg border-t-4 border-slate-300 flex flex-col items-center justify-center">
                                    <span className="text-3xl sm:text-4xl font-black text-slate-500/50 drop-shadow-sm">2nd</span>
                                    <span className="text-xs font-bold text-slate-600">🥈 فضية</span>
                                </div>
                            </div>
                        )}

                        {/* 1st Place Podium */}
                        {top3[0] && (
                            <div className="flex flex-col items-center flex-1 transition transform hover:scale-105 duration-300 -translate-y-4">
                                {/* Golden Crown / Star Icon decoration */}
                                <div className="text-center mb-2">
                                    <div className="text-3xl animate-bounce mb-1">👑</div>
                                    <div className="relative inline-block">
                                        <img 
                                            src={top3[0].avatar_url} 
                                            alt={top3[0].name} 
                                            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-yellow-400 bg-white shadow-xl"
                                        />
                                        <span className="absolute -top-2 -right-2 bg-yellow-400 text-white rounded-full w-8 h-8 flex items-center justify-center font-black text-base border-2 border-white shadow-md">
                                            ١
                                        </span>
                                    </div>
                                    <div className="font-black text-base sm:text-lg text-yellow-600 dark:text-yellow-400 truncate max-w-[120px] mt-1">
                                        {top3[0].name.split(' ')[0]}
                                    </div>
                                    <div className="text-sm text-yellow-600 dark:text-yellow-400 font-black">
                                        {top3[0].total_score} ⭐
                                    </div>
                                </div>
                                {/* Podium Block */}
                                <div className="w-full bg-gradient-to-t from-yellow-400 to-yellow-200 h-36 sm:h-48 rounded-t-3xl shadow-2xl border-t-4 border-yellow-300 flex flex-col items-center justify-center relative overflow-hidden">
                                    {/* Ray animation in background */}
                                    <div className="absolute inset-0 bg-yellow-300/10 animate-pulse pointer-events-none"></div>
                                    <span className="text-4xl sm:text-5xl font-black text-yellow-600/50 drop-shadow-sm">1st</span>
                                    <span className="text-xs font-bold text-yellow-700">🥇 ذهبية</span>
                                </div>
                            </div>
                        )}

                        {/* 3rd Place Podium */}
                        {top3[2] && (
                            <div className="flex flex-col items-center flex-1 transition transform hover:scale-105 duration-300">
                                {/* Student details above podium */}
                                <div className="text-center mb-2">
                                    <div className="relative inline-block">
                                        <img 
                                            src={top3[2].avatar_url} 
                                            alt={top3[2].name} 
                                            className="w-14 h-14 sm:w-18 sm:h-18 rounded-full border-4 border-amber-600 bg-white shadow-md"
                                        />
                                        <span className="absolute -top-2 -right-2 bg-amber-700 text-white rounded-full w-7 h-7 flex items-center justify-center font-black text-sm border-2 border-white shadow">
                                            ٣
                                        </span>
                                    </div>
                                    <div className="font-extrabold text-sm sm:text-base text-gray-800 dark:text-white truncate max-w-[100px] mt-1">
                                        {top3[2].name.split(' ')[0]}
                                    </div>
                                    <div className="text-xs text-amber-700 dark:text-amber-500 font-black">
                                        {top3[2].total_score} ⭐
                                    </div>
                                </div>
                                {/* Podium Block */}
                                <div className="w-full bg-gradient-to-t from-amber-700 to-amber-550 h-24 sm:h-30 rounded-t-3xl shadow-md border-t-4 border-amber-600 flex flex-col items-center justify-center">
                                    <span className="text-2xl sm:text-3xl font-black text-amber-900/40 drop-shadow-sm">3rd</span>
                                    <span className="text-xs font-bold text-amber-900">🥉 برونزية</span>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            ) : (
                <div className="text-center text-gray-400 font-bold py-8">
                    لا يوجد طلاب في لائحة الصدارة بعد.
                </div>
            )}

            {/* Remaining Students List (Clean scrolling list) */}
            {remaining.length > 0 && (
                <div className="space-y-3 bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border-4 border-orange-50 dark:border-gray-700 max-w-xl mx-auto">
                    <h4 className="text-lg font-bold text-gray-700 dark:text-gray-300 pb-2 border-b border-gray-100 dark:border-gray-700">
                        بقية الأبطال (Remaining Stars)
                    </h4>
                    <div className="max-h-72 overflow-y-auto space-y-2 pr-1 scrollbar-thin scrollbar-thumb-orange-200">
                        {remaining.map((student, index) => {
                            const rank = index + 4;
                            return (
                                <div 
                                    key={student.id} 
                                    className="flex items-center justify-between p-3.5 rounded-2xl bg-orange-50/50 dark:bg-gray-900/50 border border-orange-100 dark:border-gray-700 hover:bg-orange-50 dark:hover:bg-gray-950 transition duration-200"
                                >
                                    <div className="flex items-center gap-3">
                                        {/* Rank badge */}
                                        <span className="font-extrabold text-orange-500 dark:text-orange-400 w-6 text-center">
                                            #{rank}
                                        </span>
                                        {/* Avatar */}
                                        <img 
                                            src={student.avatar_url} 
                                            alt={student.name} 
                                            className="w-10 h-10 rounded-full bg-white border border-orange-200 shadow-sm"
                                        />
                                        {/* Name */}
                                        <span className="font-bold text-gray-700 dark:text-gray-200">
                                            {student.name}
                                        </span>
                                    </div>
                                    {/* Score */}
                                    <span className="bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300 font-black px-3 py-1 rounded-full text-sm">
                                        {student.total_score} ⭐
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Reset Leaderboard Section */}
            <div className="flex justify-center pt-6">
                <button
                    onClick={() => setShowResetConfirm(true)}
                    className="bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900 font-bold px-6 py-3 rounded-2xl hover:bg-rose-200 dark:hover:bg-rose-950 transition transform active:scale-95 text-sm"
                >
                    ⚠️ إعادة تعيين لوحة الصدارة (Reset Scores)
                </button>
            </div>

            {/* Confirmation Modal */}
            {showResetConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-800 max-w-sm w-full rounded-3xl p-6 shadow-2xl border-4 border-rose-300 text-center space-y-4">
                        <div className="text-4xl text-rose-500">⚠️</div>
                        <h4 className="text-xl font-black text-gray-800 dark:text-white">هل أنت متأكد من التصفير؟</h4>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                            سيتم تصفير جميع نقاط الطلاب وحذف كافة الأوسمة والإنجازات المسجلة. هذه العملية لا يمكن التراجع عنها!
                        </p>
                        <div className="flex gap-3 justify-center pt-2">
                            <button
                                onClick={() => setShowResetConfirm(false)}
                                className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-bold px-4 py-2.5 rounded-xl transition"
                            >
                                إلغاء (Cancel)
                            </button>
                            <button
                                onClick={handleReset}
                                disabled={resetting}
                                className="bg-rose-500 hover:bg-rose-600 text-white font-bold px-5 py-2.5 rounded-xl shadow-md transition"
                            >
                                {resetting ? '⏳ جاري الحذف...' : 'نعم، قم بالتصفير'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
