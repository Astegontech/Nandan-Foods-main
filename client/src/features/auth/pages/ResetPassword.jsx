import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAppContext } from '../../../context/AppContext';

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const { backendUrl, setshowUserLogin } = useAppContext();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            return toast.error("Passwords do not match");
        }
        if (password.length < 8) {
            return toast.error("Password must be at least 8 characters");
        }

        setLoading(true);
        try {
            const { data } = await axios.post(`${backendUrl}/api/user/reset-password/${token}`, { password });
            if (data.success) {
                toast.success(data.message);
                navigate('/');
                setshowUserLogin(true); // Open login modal
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='min-h-[60vh] flex items-center justify-center bg-gray-50'>
            <form onSubmit={handleSubmit} className='bg-white p-8 rounded-lg shadow-md w-full max-w-md'>
                <h2 className='text-2xl font-bold mb-6 text-center text-gray-800'>Reset Password</h2>

                <div className='mb-4'>
                    <label className='block text-gray-700 text-sm font-medium mb-2'>New Password</label>
                    <input
                        type="password"
                        className='w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={8}
                    />
                </div>

                <div className='mb-6'>
                    <label className='block text-gray-700 text-sm font-medium mb-2'>Confirm Password</label>
                    <input
                        type="password"
                        className='w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary'
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>

                <button
                    type='submit'
                    disabled={loading}
                    className='w-full bg-primary text-white py-2 rounded-md hover:bg-primary-dull transition duration-300 disabled:opacity-50'
                >
                    {loading ? 'Reseting...' : 'Reset Password'}
                </button>
            </form>
        </div>
    );
};

export default ResetPassword;
