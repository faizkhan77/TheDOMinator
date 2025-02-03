import { useState } from "react";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../components";
import styles from '../style';
import "./Spinner.css"

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { login } = useAuth();
    const [loading, setLoading] = useState(false); // Added loading state
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            await login(username, password);
            navigate("/loggedinhome");
        } catch (err) {
            setError("Invalid username or password");
        } finally {
            setLoading(false); // Set loading to false after the process completes (for both login and signup)
        }
    };

    return (
        <>
            <div className={`${styles.paddingX} ${styles.flexCenter} bg-primary`}>
                <div className={`${styles.boxWidth}`}>
                    <Navbar />
                </div>
            </div>

            <div className="bg-[#00040f] text-white font-sans min-h-screen flex items-center justify-center">
                <div className="bg-gray-800 bg-opacity-90 w-full max-w-md p-8 rounded-xl shadow-2xl">
                    <h1 className="text-3xl font-bold text-center mb-6 text-purple-300">Welcome Back!</h1>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium mb-2">
                                Username
                            </label>
                            <input
                                type="text"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full bg-gray-700 border border-transparent rounded-md px-4 py-3 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none placeholder-gray-400"
                                placeholder="Enter your username"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-gray-700 border border-transparent rounded-md px-4 py-3 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none placeholder-gray-400"
                                placeholder="Enter your password"
                                required
                            />
                        </div>
                        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
                        <button
                            type="submit"
                            className="w-full bg-purple-500 text-white py-3 rounded-md hover:bg-purple-400 focus:outline-none transition duration-300 flex justify-center items-center"
                            disabled={loading}
                        >
                            {loading ? <span className="spinner"></span> : "Login"}
                        </button>
                    </form>
                    <div className="mt-8 text-center">
                        <p className="text-sm text-gray-400">
                            Don't have an account?{" "}
                            <span onClick={() => navigate("/signin")} className="cursor-pointer text-purple-500 hover:underline">
                                Sign Up
                            </span>
                        </p>
                    </div>
                </div>
            </div>
            );
};
        </>
    );
};

export default Login;
