import React, { createContext, useContext, useState, useEffect } from 'react';

const ScoreboardContext = createContext(null);

export function ScoreboardProvider({ children }) {
    const [students, setStudents] = useState([]);
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getCsrfToken = () => {
        return document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
    };

    const fetchStudents = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/students');
            if (!response.ok) throw new Error('Failed to fetch students');
            const data = await response.json();
            setStudents(data);
        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchLeaderboard = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/leaderboard');
            if (!response.ok) throw new Error('Failed to fetch leaderboard');
            const data = await response.json();
            setLeaderboard(data);
        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const updateScore = async (studentId, points) => {
        try {
            const response = await fetch(`/api/students/${studentId}/score`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': getCsrfToken(),
                },
                body: JSON.stringify({ points }),
            });
            if (!response.ok) throw new Error('Failed to update score');
            
            // Optimistic update locally
            setStudents(prev => 
                prev.map(s => s.id === studentId ? { ...s, total_score: s.total_score + points } : s)
            );
            setLeaderboard(prev => 
                prev.map(s => s.id === studentId ? { ...s, total_score: s.total_score + points } : s)
                    .sort((a, b) => b.total_score - a.total_score)
            );

            // Refetch in background to ensure accurate synchronization
            fetchStudents();
            fetchLeaderboard();
            return true;
        } catch (err) {
            console.error(err);
            setError(err.message);
            return false;
        }
    };

    const addAchievement = async (studentId, formData) => {
        try {
            const response = await fetch(`/api/students/${studentId}/achievements`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': getCsrfToken(),
                },
                body: formData,
            });
            
            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.message || 'Failed to save achievement');
            }

            // Sync database status
            await Promise.all([fetchStudents(), fetchLeaderboard()]);
            return true;
        } catch (err) {
            console.error(err);
            setError(err.message);
            throw err;
        }
    };

    const resetScores = async () => {
        try {
            const response = await fetch('/api/leaderboard/reset', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': getCsrfToken(),
                },
            });
            if (!response.ok) throw new Error('Failed to reset leaderboard');

            // Optimistic reset locally
            setStudents(prev => prev.map(s => ({ ...s, total_score: 0 })));
            setLeaderboard(prev => prev.map(s => ({ ...s, total_score: 0 })));

            await Promise.all([fetchStudents(), fetchLeaderboard()]);
            return true;
        } catch (err) {
            console.error(err);
            setError(err.message);
            return false;
        }
    };

    const createStudent = async (name, avatarUrl) => {
        try {
            const response = await fetch('/api/students', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': getCsrfToken(),
                },
                body: JSON.stringify({ name, avatar_url: avatarUrl }),
            });
            if (!response.ok) throw new Error('Failed to create student');

            await Promise.all([fetchStudents(), fetchLeaderboard()]);
            return true;
        } catch (err) {
            console.error(err);
            setError(err.message);
            return false;
        }
    };

    useEffect(() => {
        fetchStudents();
        fetchLeaderboard();
    }, []);

    return (
        <ScoreboardContext.Provider value={{
            students,
            leaderboard,
            loading,
            error,
            fetchStudents,
            fetchLeaderboard,
            updateScore,
            addAchievement,
            resetScores,
            createStudent,
            setError
        }}>
            {children}
        </ScoreboardContext.Provider>
    );
}

export function useScoreboard() {
    const context = useContext(ScoreboardContext);
    if (!context) {
        throw new Error('useScoreboard must be used within a ScoreboardProvider');
    }
    return context;
}
