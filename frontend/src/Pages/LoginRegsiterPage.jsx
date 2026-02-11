import React, { useState } from 'react';
import { loginUserApi, registerUserApi } from "../Redux/Feature/Auth.api";

const LoginRegister = ({ onLogin }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const validateForm = () => {
        if (!isLogin) {
            if (!formData.name.trim()) {
                setError('Name is required');
                return false;
            }
            if (formData.password !== formData.confirmPassword) {
                setError('Passwords do not match');
                return false;
            }
            if (formData.password.length < 6) {
                setError('Password must be at least 6 characters long');
                return false;
            }
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email.trim() || !emailRegex.test(formData.email)) {
            setError('Please enter a valid email address');
            return false;
        }

        if (!formData.password.trim()) {
            setError('Password is required');
            return false;
        }

        return true;
    };

    const handleLogin = async (credentials) => {
        try {
            setLoading(true);
            const response = await loginUserApi(credentials);

            if (response.data && response.data.token) {
                // Store token in localStorage
                localStorage.setItem('token', response.data.token);

                // You can store additional user data if API returns it
                if (response.data.user) {
                    localStorage.setItem('userData', JSON.stringify(response.data.user));
                }

                // Store email separately for convenience
                localStorage.setItem('userEmail', credentials.email);

                // Notify parent component
                onLogin(credentials.email);
            } else {
                throw new Error('No token received from server');
            }
        } catch (error) {
            console.error('Login error:', error);

            // Handle different types of errors
            if (error.response) {
                // Server responded with error status
                if (error.response.status === 401) {
                    setError('Invalid email or password');
                } else if (error.response.status === 400) {
                    setError('Bad request. Please check your input.');
                } else if (error.response.data && error.response.data.message) {
                    setError(error.response.data.message);
                } else {
                    setError('Login failed. Please try again.');
                }
            } else if (error.request) {
                // Request made but no response
                setError('Network error. Please check your connection.');
            } else {
                // Something else happened
                setError('An error occurred. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (userData) => {
        try {
            setLoading(true);
            const response = await registerUserApi(userData);

            if (response.data && response.data.success) {
                // After successful registration, automatically login
                await handleLogin({
                    email: userData.email,
                    password: userData.password
                });
            } else if (response.data && response.data.message) {
                // Show success message but maybe need email verification
                setError(response.data.message);
                setIsLogin(true); // Switch to login form
            }
        } catch (error) {
            console.error('Registration error:', error);

            if (error.response) {
                if (error.response.status === 409) {
                    setError('User already exists with this email');
                } else if (error.response.status === 400) {
                    setError('Invalid registration data');
                } else if (error.response.data && error.response.data.message) {
                    setError(error.response.data.message);
                } else {
                    setError('Registration failed. Please try again.');
                }
            } else if (error.request) {
                setError('Network error. Please check your connection.');
            } else {
                setError('An error occurred during registration.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!validateForm()) {
            return;
        }

        if (isLogin) {
            // Handle login
            await handleLogin({
                email: formData.email,
                password: formData.password
            });
        } else {
            // Handle registration
            await handleRegister({
                name: formData.name,
                email: formData.email,
                password: formData.password
            });
        }
    };

    const switchMode = () => {
        setIsLogin(!isLogin);
        setError('');
        setFormData({
            name: '',
            email: '',
            password: '',
            confirmPassword: ''
        });
    };

    return (
        <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-6">
                {isLogin ? 'Login' : 'Register'}
            </h2>

            {error && (
                <div className={`mb-4 p-2 rounded ${error.includes('success') || error.includes('Success')
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                    }`}>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                {!isLogin && (
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2" htmlFor="name">
                            Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
                            placeholder="Enter your name"
                            required={!isLogin}
                            disabled={loading}
                        />
                    </div>
                )}

                <div className="mb-4">
                    <label className="block text-gray-700 mb-2" htmlFor="email">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
                        placeholder="Enter your email"
                        required
                        disabled={loading}
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 mb-2" htmlFor="password">
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
                        placeholder="Enter your password"
                        required
                        disabled={loading}
                        minLength={6}
                    />
                </div>

                {!isLogin && (
                    <div className="mb-6">
                        <label className="block text-gray-700 mb-2" htmlFor="confirmPassword">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
                            placeholder="Confirm your password"
                            required={!isLogin}
                            disabled={loading}
                            minLength={6}
                        />
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-2 px-4 rounded mb-4 ${loading
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-500 hover:bg-blue-600'
                        } text-white`}
                >
                    {loading ? (
                        <span className="flex items-center justify-center">
                            <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Processing...
                        </span>
                    ) : (
                        isLogin ? 'Login' : 'Register'
                    )}
                </button>
            </form>

            <div className="text-center">
                <button
                    onClick={switchMode}
                    disabled={loading}
                    className={`${loading ? 'text-gray-400 cursor-not-allowed' : 'text-blue-500 hover:text-blue-600'
                        }`}
                >
                    {isLogin
                        ? "Don't have an account? Register"
                        : "Already have an account? Login"}
                </button>
            </div>
        </div>
    );
};

export default LoginRegister;
