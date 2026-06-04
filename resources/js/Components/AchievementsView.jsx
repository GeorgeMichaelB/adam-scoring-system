import React, { useState, useRef } from 'react';
import { useScoreboard } from './ScoreboardContext';

export default function AchievementsView() {
    const { students, addAchievement } = useScoreboard();
    
    const [selectedStudentId, setSelectedStudentId] = useState('');
    const [description, setDescription] = useState('');
    const [starsCount, setStarsCount] = useState(5);
    const [pointsAwarded, setPointsAwarded] = useState(10);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    
    const [submitting, setSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const fileInputRef = useRef(null);

    // Simple star component styling helper
    const handleStarClick = (rating) => {
        setStarsCount(rating);
        // Automatically scale points with star ratings as a helpful default!
        // 1 star = 2 points, 2 stars = 4 points, 3 stars = 6 points, 4 stars = 8 points, 5 stars = 10 points
        setPointsAwarded(rating * 2);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedStudentId) {
            alert('الرجاء اختيار طالب أولاً! / Please select a student first!');
            return;
        }
        if (!description.trim()) {
            alert('الرجاء كتابة وصف الإنجاز / Please describe the achievement');
            return;
        }

        setSubmitting(true);
        setSuccessMessage('');

        try {
            const formData = new FormData();
            formData.append('description', description);
            formData.append('stars_count', starsCount);
            formData.append('points_awarded', pointsAwarded);
            if (imageFile) {
                formData.append('image', imageFile);
            }

            const success = await addAchievement(selectedStudentId, formData);
            if (success) {
                const student = students.find(s => s.id === parseInt(selectedStudentId));
                setSuccessMessage(`✨ تم تسجيل إنجاز رائع للبطل ${student?.name || ''}! (+${pointsAwarded} نقاط) ✨`);
                
                // Reset form fields
                setDescription('');
                setStarsCount(5);
                setPointsAwarded(10);
                setImageFile(null);
                setImagePreview(null);
                setSelectedStudentId('');
                if (fileInputRef.current) fileInputRef.current.value = '';

                // Clear success message after 5 seconds
                setTimeout(() => setSuccessMessage(''), 5000);
            }
        } catch (err) {
            console.error(err);
            alert('حدث خطأ أثناء حفظ الإنجاز / Failed to save achievement: ' + err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const selectedStudent = students.find(s => s.id === parseInt(selectedStudentId));

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            {/* Header banner */}
            <div className="bg-gradient-to-r from-purple-400 to-indigo-500 p-1 rounded-3xl shadow-xl text-center">
                <div className="bg-white dark:bg-gray-900 rounded-[22px] p-6">
                    <h3 className="text-2xl font-black text-gray-800 dark:text-white flex justify-center items-center gap-2">
                        <span>🏆 تسجيل إنجاز جديد 🏆</span>
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
                        وثّق اللحظات المميزة لطلابك وامنحهم الأوسمة والنجوم!
                    </p>
                </div>
            </div>

            {successMessage && (
                <div className="bg-gradient-to-r from-emerald-400 to-teal-500 text-white font-bold p-5 rounded-3xl text-center shadow-lg animate-bounce">
                    {successMessage}
                </div>
            )}

            {/* Achievement Form */}
            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border-4 border-purple-100 dark:border-gray-700 space-y-6">
                
                {/* 1. Select Student */}
                <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">
                        اختر البطل المتميز (Choose Student) <span className="text-rose-500">*</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <select
                            value={selectedStudentId}
                            onChange={(e) => setSelectedStudentId(e.target.value)}
                            className="w-full border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-2xl p-3 focus:outline-none focus:border-purple-400 transition font-bold"
                        >
                            <option value="">-- اختر طالباً --</option>
                            {students.map(s => (
                                <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                        </select>

                        {/* Selected Student Preview */}
                        {selectedStudent && (
                            <div className="flex items-center gap-3 bg-purple-50 dark:bg-purple-950/20 px-4 py-2 rounded-2xl border border-purple-200 dark:border-purple-800">
                                <img 
                                    src={selectedStudent.avatar_url} 
                                    alt={selectedStudent.name} 
                                    className="w-12 h-12 rounded-full bg-white border border-purple-300"
                                />
                                <div>
                                    <div className="font-bold text-gray-800 dark:text-white text-sm">{selectedStudent.name}</div>
                                    <div className="text-xs text-purple-600 dark:text-purple-400 font-bold">النقاط الحالية: {selectedStudent.total_score} ⭐</div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* 2. Achievement Description */}
                <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">
                        وصف الإنجاز (Achievement Description) <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="مثال: القراءة بطلاقة أمام الصف، ترتيب المقعد المدرسي، مساعدة صديق..."
                        rows="3"
                        className="w-full border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-2xl p-3.5 focus:outline-none focus:border-purple-400 transition"
                    ></textarea>
                </div>

                {/* 3. Photo Upload */}
                <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">
                        صورة الإنجاز (Photo - Optional)
                    </label>
                    <div className="flex flex-col sm:flex-row gap-4 items-center">
                        <div className="w-full">
                            <input
                                type="file"
                                accept="image/*"
                                ref={fileInputRef}
                                onChange={handleImageChange}
                                className="hidden"
                                id="achievement-photo"
                            />
                            <label
                                htmlFor="achievement-photo"
                                className="flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-purple-400 dark:hover:border-purple-400 rounded-2xl p-4 cursor-pointer text-gray-500 dark:text-gray-400 font-bold hover:bg-purple-50 dark:hover:bg-purple-950/15 transition-all text-center"
                            >
                                📸 {imageFile ? 'تغيير الصورة (Change Photo)' : 'اختر صورة من جهازك (Upload Photo)'}
                            </label>
                        </div>
                        {imagePreview && (
                            <div className="relative w-28 h-28 rounded-2xl overflow-hidden border-2 border-purple-200 shadow-md shrink-0">
                                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => {
                                        setImageFile(null);
                                        setImagePreview(null);
                                        if (fileInputRef.current) fileInputRef.current.value = '';
                                    }}
                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition"
                                >
                                    ✕
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* 4. Stars Rating Component */}
                <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 text-center">
                        تقييم النجوم (Stars Rating)
                    </label>
                    <div className="flex justify-center items-center gap-3">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => handleStarClick(star)}
                                className="transition-all transform hover:scale-125 focus:outline-none"
                            >
                                <svg 
                                    className={`w-12 h-12 ${star <= starsCount ? 'text-amber-400 fill-amber-400 filter drop-shadow' : 'text-gray-300 dark:text-gray-600'}`} 
                                    viewBox="0 0 24 24" 
                                    fill="currentColor"
                                >
                                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                                </svg>
                            </button>
                        ))}
                    </div>
                    <p className="text-center text-xs text-gray-400 dark:text-gray-500 font-bold mt-1">
                        النجوم المحددة: {starsCount} / 5 نجوم ذهبية
                    </p>
                </div>

                {/* 5. Points Awarded input */}
                <div className="space-y-2 max-w-xs mx-auto text-center">
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">
                        النقاط الممنوحة (Points Awarded)
                    </label>
                    <input
                        type="number"
                        min="1"
                        value={pointsAwarded}
                        onChange={(e) => setPointsAwarded(parseInt(e.target.value) || 0)}
                        className="w-full text-center text-xl font-bold border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-2xl p-3 focus:outline-none focus:border-purple-400 transition"
                    />
                </div>

                {/* Submit button */}
                <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 hover:from-purple-600 hover:via-pink-600 hover:to-indigo-600 text-white font-extrabold text-lg py-4 rounded-2xl shadow-xl transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {submitting ? '⏳ جاري الإرسال... (Submitting...)' : '🚀 إرسال الإنجاز وتحديث النقاط! (Submit)'}
                </button>

            </form>
        </div>
    );
}
