import React, { useState } from 'react';
import { useScoreboard } from './ScoreboardContext';

export default function AddStudentView() {
    const { createStudent } = useScoreboard();
    const [name, setName] = useState('');
    const [avatarSeed, setAvatarSeed] = useState('Leo');
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    // Cute pre-selected seeds for children's adventurer avatars
    const avatarPresets = [
        { seed: 'Leo', label: '🦁 Leo' },
        { seed: 'Maya', label: '🐱 Maya' },
        { seed: 'Felix', label: '🦊 Felix' },
        { seed: 'Ruby', label: '🐰 Ruby' },
        { seed: 'Buster', label: '🐶 Buster' },
        { seed: 'Zoe', label: '🦄 Zoe' },
        { seed: 'Milo', label: '🐻 Milo' },
        { seed: 'Coco', label: '🐨 Coco' },
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) return;

        setSubmitting(true);
        setSuccess(false);

        const avatarUrl = `https://api.dicebear.com/7.x/adventurer/svg?seed=${avatarSeed}`;
        const ok = await createStudent(name, avatarUrl);
        setSubmitting(false);

        if (ok) {
            setSuccess(true);
            setName('');
            setTimeout(() => setSuccess(false), 3000);
        } else {
            alert('فشل إضافة الطالب / Failed to add student.');
        }
    };

    return (
        <div className="max-w-md mx-auto space-y-6">
            <div className="bg-gradient-to-r from-emerald-400 to-teal-500 p-1 rounded-3xl shadow-xl text-center">
                <div className="bg-white dark:bg-gray-900 rounded-[22px] p-6">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">👦 إضافة بطل جديد (Add Student) 👧</h3>
                    <p className="text-gray-500 dark:text-gray-400 mt-1 text-xs">
                        أضف طالباً جديداً في الصف واختر له رمزاً كرتونياً جميلاً!
                    </p>
                </div>
            </div>

            {success && (
                <div className="bg-emerald-100 border border-emerald-300 text-emerald-800 font-bold p-3 rounded-2xl text-center">
                    ✨ تم إضافة البطل بنجاح! / Student added! ✨
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-lg border-2 border-emerald-100 dark:border-gray-700 space-y-5">
                {/* Student Name */}
                <div className="space-y-1">
                    <label className="block text-xs font-bold text-gray-600 dark:text-gray-400">اسم الطالب (Student Name):</label>
                    <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="أدخل الاسم الثنائي للطفل..."
                        className="w-full border-2 border-gray-150 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-xl p-3 focus:outline-none focus:border-emerald-400 font-bold transition"
                    />
                </div>

                {/* Avatar Presets Selection */}
                <div className="space-y-2">
                    <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 text-center">اختر الشخصية الكرتونية (Choose Avatar):</label>
                    
                    {/* Character Preview */}
                    <div className="flex justify-center mb-3">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-300 to-teal-400 p-1 shadow-md">
                            <img
                                src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${avatarSeed}`}
                                alt="Selected Avatar"
                                className="w-full h-full object-cover rounded-full bg-white"
                            />
                        </div>
                    </div>

                    {/* Presets Grid */}
                    <div className="grid grid-cols-4 gap-2">
                        {avatarPresets.map((preset) => (
                            <button
                                key={preset.seed}
                                type="button"
                                onClick={() => setAvatarSeed(preset.seed)}
                                className={`p-2 rounded-xl text-xs font-bold text-center border-2 transition ${
                                    avatarSeed === preset.seed
                                    ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300'
                                    : 'border-gray-100 dark:border-gray-750 hover:bg-gray-50 dark:hover:bg-gray-900 text-gray-500'
                                }`}
                            >
                                <div className="text-lg">{preset.label.split(' ')[0]}</div>
                                <div>{preset.label.split(' ')[1]}</div>
                            </button>
                        ))}
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-500 hover:to-teal-600 text-white font-extrabold p-3.5 rounded-xl shadow-md transition transform active:scale-95 disabled:opacity-50"
                >
                    {submitting ? 'جاري الإضافة...' : '➕ إضافة الطالب إلى الصف'}
                </button>
            </form>
        </div>
    );
}
