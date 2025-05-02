import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    const [workouts, setWorkouts] = useState([]);
    const [form, setForm] = useState({
        date: '',
        type: '',
        duration: 0,
        caloriesBurned: 0
    });

    const fetchWorkouts = async () => {
        try {
            const response = await axios.get('/api/workouts');
            setWorkouts(response.data);
        } catch (error) {
            console.error('Error fetching workouts:', error);
        }
    };

    useEffect(() => { fetchWorkouts(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/workouts', form);
            console.log("Workout added:", response.data); 
            await fetchWorkouts();                       
            setForm({ date: '', type: '', duration: 0, caloriesBurned: 0 });
        } catch (error) {
            console.error('Error adding workout:', error);
        }
    }


    const deleteWorkout = async (id) => {
        try {
            await axios.delete(`/api/workouts/${id}`);
            fetchWorkouts();
        } catch (error) {
            console.error('Error deleting workout:', error);
        }
    }

    return (
        <div className="container mt-4">
            <h2 className="mb-4 text-center">🏋️ Fitness Tracker</h2>
        
            <div className="card p-4 mb-4 shadow-sm">
                <h4>Add New Workout</h4>
                <form onSubmit={handleSubmit}>
                <div className="row g-3 mb-3">
                    <div className="col-md-6">
                    <label className="form-label">Date</label>
                    <input type="date" className="form-control" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required />
                    </div>
                    <div className="col-md-6">
                    <label className="form-label">Workout Type</label>
                    <input className="form-control" placeholder="e.g. Running" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} required />
                    </div>
                    <div className="col-md-6">
                    <label className="form-label">Duration (min)</label>
                    <input type="number" className="form-control" value={form.duration} onChange={e => setForm({ ...form, duration: parseInt(e.target.value) })} required />
                    </div>
                    <div className="col-md-6">
                    <label className="form-label">Calories Burned</label>
                    <input type="number" className="form-control" value={form.caloriesBurned} onChange={e => setForm({ ...form, caloriesBurned: parseInt(e.target.value) })} required />
                    </div>
                </div>
                <button type="submit" className="btn btn-success w-100">➕ Add Workout</button>
                </form>
            </div>
        
            <div className="card p-4 shadow-sm">
                <h4>Workout History</h4>
                {workouts.length === 0 ? (
                <p className="text-muted">No workouts yet.</p>
                ) : (
                <ul className="list-group">
                    {Array.isArray(workouts) && workouts.map(w => (
                    <li key={w.id || `${w.date}-${w.type}`} className="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                        <strong>{w.date}</strong> — {w.type} | {w.duration} min | {w.caloriesBurned} kcal
                        </div>
                        <button className="btn btn-danger btn-sm" onClick={() => deleteWorkout(w.id)}>🗑️ Delete</button>
                    </li>
                    ))}
                </ul>
                )}
            </div>
        </div>
    );

}

export default App;