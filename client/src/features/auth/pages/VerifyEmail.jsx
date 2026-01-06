import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAppContext } from '../../../context/AppContext';

const VerifyEmail = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const { backendUrl, setshowUserLogin } = useAppContext();
    const [status, setStatus] = useState('Verifying...');

    useEffect(() => {
        const verify = async () => {
            try {
                const { data } = await axios.get(`${backendUrl}/api/user/verify-email/${token}`);
                if (data.success) {
                    toast.success(data.message);
                    setStatus('Email Verified Successfully! Redirecting to login...');
                    setTimeout(() => {
                        navigate('/');
                        setshowUserLogin(true); // Open login modal
                    }, 3000);
                } else {
                    toast.error(data.message);
                    setStatus(data.message || 'Verification failed');
                }
            } catch (error) {
                console.error(error);
                toast.error(error.message);
                setStatus('Verification failed');
            }
        };
        if (token) verify();
    }, [token, backendUrl, navigate, setshowUserLogin]);

    return (
        <div className='min-h-[60vh] flex items-center justify-center'>
            <div className='text-center p-8 shadow-lg rounded-lg border border-gray-100 bg-white'>
                <h2 className='text-2xl font-semibold mb-4 text-gray-800'>Email Verification</h2>
                <p className='text-gray-600'>{status}</p>
            </div>
        </div>
    );
};

export default VerifyEmail;
