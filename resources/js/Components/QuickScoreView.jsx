import React, { useState } from 'react';
import { useScoreboard } from './ScoreboardContext';

export default function QuickScoreView() {
    const { students, updateScore } = useScoreboard();
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [customPoints, setCustomPoints] = useState('');
    const [updatingId, setUpdatingId] = useState(null);

    const handleQuickScore = async (studentId, points) => {
        setUpdatingId(studentId);
        const success = await updateScore(studentId, points);
        if (success && selectedStudent?.id === studentId) {
            // Update selected student's score in the open modal
            setSelectedStudent(prev => ({ ...prev, total_score: prev.total_score + points }));
        }
        setUpdatingId(null);
    };

    const handleCustomScore = async (isAddition) => {
        if (!selectedStudent) return;
        const points = parseInt(customPoints);
        if (isNaN(points) || points <= 0) return;

        setUpdatingId(selectedStudent.id);
        const finalPoints = isAddition ? points : -points;
        const success = await updateScore(selectedStudent.id, finalPoints);
        if (success) {
            setSelectedStudent(prev => ({ ...prev, total_score: prev.total_score + finalPoints }));
            setCustomPoints('');
        }
        setUpdatingId(null);
    };

    return (
        <div className="space-y-8">
            {/* Header section with a playful description */}
            <div className="bg-gradient-to-r from-pink-400 via-amber-400 to-emerald-400 p-1 rounded-3xl shadow-xl">
                <div className="bg-white dark:bg-gray-900 rounded-[22px] p-6 text-center">
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white flex justify-center items-center gap-2 flex-wrap">
                        <span>✨ لوحة النقاط السريعة ✨</span>
                        <span className="text-xs px-3 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100 rounded-full font-semibold">1st Grade (الصف الأول)</span>
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
                        انقر على أي طالب لإضافة نجوم أو نقاط تشجيعية!
                    </p>
                </div>
            </div>

            {/* Students Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {students.map((student) => {
                    const isSelected = selectedStudent?.id === student.id;
                    const isUpdating = updatingId === student.id;
                    
                    return (
                        <div 
                            key={student.id}
                            onClick={() => {
                                setSelectedStudent(student);
                                setCustomPoints('');
                            }}
                            className={`relative overflow-hidden cursor-pointer rounded-3xl p-5 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl border-4 ${
                                isSelected 
                                ? 'border-amber-400 bg-amber-50 dark:bg-amber-950/20 shadow-amber-200 dark:shadow-none' 
                                : 'border-white dark:border-gray-800 bg-white dark:bg-gray-800 shadow-md'
                            }`}
                        >
                            {/* Decorative background shape */}
                            <div className="absolute -top-10 -right-10 w-24 h-24 rounded-full bg-yellow-100 dark:bg-yellow-950/30 opacity-40 blur-lg pointer-events-none"></div>
                            
                            {/* Student Avatar */}
                            <div className="relative flex justify-center mb-3">
                                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-300 to-amber-500 p-1 shadow-md transform transition duration-500 hover:rotate-6">
                                    <img 
                                        src={student.avatar_url} 
                                        alt={student.name} 
                                        className="w-full h-full object-cover rounded-full bg-white"
                                    />
                                </div>
                                {/* Score Badge */}
                                <div className="absolute -bottom-2 right-2 bg-gradient-to-r from-emerald-400 to-teal-500 text-white font-bold text-xs px-2.5 py-0.5 rounded-full shadow-lg flex items-center gap-0.5 border border-white">
                                    ⭐ {student.total_score}
                                </div>
                            </div>

                            {/* Name & Quick Status */}
                            <div className="text-center mt-2">
                                <h4 className="text-base font-bold text-gray-800 dark:text-gray-100 truncate">{student.name}</h4>
                            </div>

                            {/* Tiny updating overlay */}
                            {isUpdating && (
                                <div className="absolute inset-0 bg-white/70 dark:bg-gray-900/70 flex items-center justify-center rounded-3xl">
                                    <div className="animate-bounce text-amber-500 font-bold text-sm">⏳ تحديث...</div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Quick Action Modal/Panel */}
            {selectedStudent && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm transition-opacity duration-300">
                    <div className="bg-white dark:bg-gray-850 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border-4 border-amber-300 transform transition-all duration-300 scale-100">
                        {/* Modal Header */}
                        <div className="bg-gradient-to-r from-amber-400 to-yellow-500 p-6 text-white text-center relative">
                            <button 
                                onClick={() => setSelectedStudent(null)}
                                className="absolute top-4 right-4 text-white hover:text-yellow-100 bg-black/10 hover:bg-black/25 rounded-full p-2 w-8 h-8 flex items-center justify-center transition"
                            >
                                ✕
                            </button>
                            <img 
                                src={selectedStudent.avatar_url} 
                                alt={selectedStudent.name} 
                                className="w-20 h-20 mx-auto rounded-full bg-white border-4 border-white shadow-lg -mb-14 mt-2"
                            />
                        </div>

                        {/* Modal Body */}
                        <div className="pt-16 pb-8 px-6 space-y-6">
                            <div className="text-center">
                                <h3 className="text-2xl font-black text-gray-800 dark:text-white">{selectedStudent.name}</h3>
                                <p className="text-emerald-500 dark:text-emerald-400 font-bold text-lg mt-1">النقاط الحالية: {selectedStudent.total_score} ⭐</p>
                            </div>

                            {/* Quick Points Grid */}
                            <div className="space-y-3">
                                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 text-center">أضف نقاط تشجيعية سريعة:</label>
                                <div className="flex flex-wrap gap-2 justify-center">
                                    {[
                                        { val: 2, color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 hover:bg-emerald-200 hover:scale-110 active:scale-95' },
                                        { val: 5, color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 hover:bg-emerald-200 hover:scale-110 active:scale-95' },
                                        { val: 7, color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 hover:bg-emerald-200 hover:scale-110 active:scale-95' },
                                        { val: 10, color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300 hover:bg-yellow-200 hover:scale-110 active:scale-95 border-2 border-yellow-300 font-black' },
                                        { val: -2, color: 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 hover:bg-rose-200 hover:scale-110 active:scale-95' },
                                        { val: -5, color: 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 hover:bg-rose-200 hover:scale-110 active:scale-95' },
                                        { val: -10, color: 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 hover:bg-rose-200 hover:scale-110 active:scale-95' },
                                    ].map((btn) => (
                                        <button
                                            key={btn.val}
                                            disabled={updatingId === selectedStudent.id}
                                            onClick={() => handleQuickScore(selectedStudent.id, btn.val)}
                                            className={`px-4 py-2.5 rounded-2xl font-bold text-base transition duration-200 shadow-md ${btn.color}`}
                                        >
                                            {btn.val > 0 ? `+${btn.val}` : btn.val}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Custom Points Block */}
                            <div className="border-t border-gray-100 dark:border-gray-700 pt-6 space-y-3">
                                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 text-center">أو أدخل قيمة مخصصة:</label>
                                <div className="flex gap-3 justify-center items-center max-w-xs mx-auto">
                                    <button
                                        disabled={updatingId === selectedStudent.id}
                                        onClick={() => handleCustomScore(false)}
                                        className="bg-rose-500 hover:bg-rose-600 text-white font-bold px-4 py-2.5 rounded-2xl shadow-md transition transform active:scale-95"
                                    >
                                        خصم (-)
                                    </button>
                                    <input
                                        type="number"
                                        placeholder="نقاط"
                                        value={customPoints}
                                        onChange={(e) => setCustomPoints(e.target.value)}
                                        className="w-20 text-center text-lg font-bold border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-2xl p-2 focus:outline-none focus:border-amber-400 transition"
                                    />
                                    <button
                                        disabled={updatingId === selectedStudent.id}
                                        onClick={() => handleCustomScore(true)}
                                        className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-4 py-2.5 rounded-2xl shadow-md transition transform active:scale-95"
                                    >
                                        إضافة (+)
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
