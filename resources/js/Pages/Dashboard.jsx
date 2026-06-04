import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { ScoreboardProvider } from '@/Components/ScoreboardContext';
import QuickScoreView from '@/Components/QuickScoreView';
import AchievementsView from '@/Components/AchievementsView';
import LeaderboardView from '@/Components/LeaderboardView';
import AddStudentView from '@/Components/AddStudentView';

export default function Dashboard() {
    const [activeTab, setActiveTab] = useState('quick-score');

    return (
        <ScoreboardProvider>
            <AuthenticatedLayout
                header={
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        <h2 className="text-2xl font-black leading-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-pink-500 to-indigo-600 dark:from-amber-400 dark:to-indigo-400">
                            🏫 إدارة صف آدم البار (Adam El-Bar Classroom)
                        </h2>
                        <div className="flex bg-gray-100 dark:bg-gray-900 p-1.5 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-inner">
                            <button
                                onClick={() => setActiveTab('quick-score')}
                                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
                                    activeTab === 'quick-score'
                                    ? 'bg-amber-400 text-white shadow-md'
                                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-800'
                                }`}
                            >
                                ✨ النقاط السريعة
                            </button>
                            <button
                                onClick={() => setActiveTab('achievements')}
                                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
                                    activeTab === 'achievements'
                                    ? 'bg-purple-500 text-white shadow-md'
                                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-800'
                                }`}
                            >
                                🏆 الأوسمة
                            </button>
                            <button
                                onClick={() => setActiveTab('leaderboard')}
                                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
                                    activeTab === 'leaderboard'
                                    ? 'bg-orange-500 text-white shadow-md'
                                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-800'
                                }`}
                            >
                                🥇 الصدارة
                            </button>
                            <button
                                onClick={() => setActiveTab('add-student')}
                                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
                                    activeTab === 'add-student'
                                    ? 'bg-emerald-500 text-white shadow-md'
                                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-800'
                                }`}
                            >
                                👦 إضافة بطل
                            </button>
                        </div>
                    </div>
                }
            >
                <Head title="Adam El-Bar Scoreboard" />

                <div className="py-8">
                    <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                        <div className="bg-gray-50/50 dark:bg-gray-900/50 p-2 sm:p-6 rounded-3xl">
                            {activeTab === 'quick-score' && <QuickScoreView />}
                            {activeTab === 'achievements' && <AchievementsView />}
                            {activeTab === 'leaderboard' && <LeaderboardView />}
                            {activeTab === 'add-student' && <AddStudentView />}
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        </ScoreboardProvider>
    );
}
