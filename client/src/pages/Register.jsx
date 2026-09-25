import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/api";

function Register() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    });

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

        setError("");
        setSuccess("");
    };


    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setSuccess("");

        if (
            !formData.name.trim() ||
            !formData.email.trim() ||
            !formData.password
        ) {
            setError("Please fill in all fields.");
            return;
        }

        if (formData.password.length < 6) {
            setError(
                "Password must be at least 6 characters."
            );
            return;
        }

        try {

            setLoading(true);

            const response = await API.post(
                "/auth/register",
                formData
            );

            setSuccess(
                response.data.message ||
                "Registration successful."
            );

            setFormData({
                name: "",
                email: "",
                password: ""
            });

            setTimeout(() => {
                navigate("/login");
            }, 1200);

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Registration failed. Please try again."
            );

        } finally {

            setLoading(false);

        }
    };


    return (

        <div className="min-h-screen w-full bg-slate-950 flex">


            {/* Left Side */}

            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-blue-700 via-indigo-700 to-violet-800 text-white">

                <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-white/10" />

                <div className="absolute bottom-[-180px] left-[-100px] w-[500px] h-[500px] rounded-full bg-white/10" />


                <div className="relative z-10 flex flex-col justify-between w-full p-16">


                    {/* Logo */}

                    <div className="flex items-center gap-3">

                        <div className="w-12 h-12 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center text-2xl font-bold backdrop-blur-sm">
                            ₹
                        </div>

                        <span className="text-2xl font-bold tracking-tight">
                            ExpenseFlow
                        </span>

                    </div>


                    {/* Main Content */}

                    <div className="max-w-xl">

                        <p className="uppercase tracking-[0.25em] text-sm text-blue-200 font-semibold mb-5">
                            Get Started
                        </p>

                        <h1 className="text-5xl xl:text-6xl font-bold leading-tight">
                            Build better
                            <br />
                            money habits.
                        </h1>

                        <p className="mt-6 text-lg text-blue-100 leading-relaxed max-w-lg">
                            Create your account and bring your
                            income, expenses, and financial activity
                            together in one place.
                        </p>


                        {/* Features */}

                        <div className="mt-10 space-y-5">


                            <div className="flex items-center gap-4">

                                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                                    ✓
                                </div>

                                <div>

                                    <p className="font-semibold">
                                        Organize transactions
                                    </p>

                                    <p className="text-sm text-blue-200">
                                        Keep your financial activity organized.
                                    </p>

                                </div>

                            </div>


                            <div className="flex items-center gap-4">

                                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                                    ✓
                                </div>

                                <div>

                                    <p className="font-semibold">
                                        Track income and expenses
                                    </p>

                                    <p className="text-sm text-blue-200">
                                        See where your money goes.
                                    </p>

                                </div>

                            </div>


                            <div className="flex items-center gap-4">

                                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                                    ✓
                                </div>

                                <div>

                                    <p className="font-semibold">
                                        View your financial insights
                                    </p>

                                    <p className="text-sm text-blue-200">
                                        Turn your transactions into useful insights.
                                    </p>

                                </div>

                            </div>

                        </div>

                    </div>


                    {/* Footer */}

                    <p className="text-sm text-blue-200">
                        © 2026 ExpenseFlow
                    </p>

                </div>

            </div>


            {/* Right Side */}

            <div className="w-full lg:w-1/2 min-h-screen bg-white flex items-center justify-center px-6 sm:px-12 lg:px-20 xl:px-28">

                <div className="w-full max-w-lg">


                    {/* Mobile Logo */}

                    <div className="lg:hidden flex items-center gap-3 mb-12">

                        <div className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xl">
                            ₹
                        </div>

                        <span className="text-xl font-bold text-slate-900">
                            ExpenseFlow
                        </span>

                    </div>


                    {/* Heading */}

                    <div className="mb-10">

                        <p className="text-sm font-bold tracking-wider text-blue-600 mb-3">
                            GET STARTED
                        </p>

                        <h2 className="text-4xl font-bold text-slate-900">
                            Create your account
                        </h2>

                        <p className="mt-3 text-slate-500">
                            Start managing your finances with ExpenseFlow.
                        </p>

                    </div>


                    {/* Error */}

                    {error && (

                        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                            {error}
                        </div>

                    )}


                    {/* Success */}

                    {success && (

                        <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-600">
                            {success}
                        </div>

                    )}


                    <form
                        onSubmit={handleSubmit}
                        className="space-y-6"
                    >


                        {/* Name */}

                        <div>

                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Full name
                            </label>

                            <input
                                type="text"
                                name="name"
                                placeholder="Enter your full name"
                                value={formData.name}
                                onChange={handleChange}
                                autoComplete="name"
                                className="w-full h-14 rounded-xl border border-slate-200 bg-slate-50 px-4 text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                            />

                        </div>


                        {/* Email */}

                        <div>

                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Email address
                            </label>

                            <input
                                type="email"
                                name="email"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={handleChange}
                                autoComplete="email"
                                className="w-full h-14 rounded-xl border border-slate-200 bg-slate-50 px-4 text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                            />

                        </div>


                        {/* Password */}

                        <div>

                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Password
                            </label>

                            <div className="relative">

                                <input
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    name="password"
                                    placeholder="Create a password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    autoComplete="new-password"
                                    className="w-full h-14 rounded-xl border border-slate-200 bg-slate-50 px-4 pr-20 text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-500 hover:text-blue-600"
                                >
                                    {showPassword
                                        ? "Hide"
                                        : "Show"}
                                </button>

                            </div>

                            <p className="mt-2 text-xs text-slate-400">
                                Use at least 6 characters.
                            </p>

                        </div>


                        {/* Register Button */}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-14 rounded-xl bg-blue-600 text-white font-semibold shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading
                                ? "Creating account..."
                                : "Create account"}
                        </button>

                    </form>


                    {/* Login */}

                    <div className="mt-8 text-center">

                        <p className="text-sm text-slate-500">

                            Already have an account?{" "}

                            <Link
                                to="/login"
                                className="font-semibold text-blue-600 hover:text-blue-700"
                            >
                                Sign in
                            </Link>

                        </p>

                    </div>


                    {/* Bottom */}

                    <p className="mt-12 text-center text-xs text-slate-400">
                        Create your account and start managing your expenses.
                    </p>

                </div>

            </div>

        </div>
    );
}

export default Register;