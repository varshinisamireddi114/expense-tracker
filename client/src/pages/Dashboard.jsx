import { useEffect, useState } from "react";
import API from "../api/api";
import AddExpense from "../components/AddExpense";
import ExpenseChart from "../components/ExpenseChart";
import Navbar from "../components/Navbar";

function Dashboard() {
    const [expenses, setExpenses] = useState([]);
    const [editExpense, setEditExpense] = useState(null);

    const [search, setSearch] = useState("");
    const [filterType, setFilterType] = useState("All");
    const [filterCategory, setFilterCategory] = useState("All");

    // =========================
    // FETCH EXPENSES
    // =========================

    const fetchExpenses = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await API.get("/expenses", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setExpenses(response.data);

        } catch (error) {
            console.log(
                error.response?.data || error.message
            );
        }
    };


    // =========================
    // DELETE EXPENSE
    // =========================

    const deleteExpense = async (id) => {
        try {
            const token = localStorage.getItem("token");

            await API.delete(`/expenses/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            fetchExpenses();

        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Failed to delete transaction"
            );
        }
    };


    // =========================
    // UPDATE EXPENSE
    // =========================

    const updateExpense = async () => {
        try {
            const token = localStorage.getItem("token");

            await API.put(
                `/expenses/${editExpense._id}`,
                {
                    title: editExpense.title,
                    amount: Number(editExpense.amount),
                    category: editExpense.category,
                    type: editExpense.type
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setEditExpense(null);

            fetchExpenses();

        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Failed to update transaction"
            );
        }
    };


    // =========================
    // TOTALS
    // =========================

    const totalIncome = expenses
        .filter((item) => item.type === "Income")
        .reduce(
            (sum, item) => sum + Number(item.amount),
            0
        );


    const totalExpense = expenses
        .filter((item) => item.type === "Expense")
        .reduce(
            (sum, item) => sum + Number(item.amount),
            0
        );


    const balance = totalIncome - totalExpense;


    // =========================
    // CATEGORIES
    // =========================

    const categories = [
        ...new Set(
            expenses.map((item) => item.category)
        )
    ];


    // =========================
    // FILTER EXPENSES
    // =========================

    const filteredExpenses = expenses.filter((expense) => {

        const searchMatch = expense.title
            .toLowerCase()
            .includes(search.toLowerCase());

        const typeMatch =
            filterType === "All" ||
            expense.type === filterType;

        const categoryMatch =
            filterCategory === "All" ||
            expense.category === filterCategory;

        return (
            searchMatch &&
            typeMatch &&
            categoryMatch
        );
    });


    // =========================
    // LOAD DATA
    // =========================

    useEffect(() => {
        fetchExpenses();
    }, []);


    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/40 to-purple-50/40">

            <Navbar />

            <main className="px-4 py-7 sm:px-6 lg:px-8">

                <div className="mx-auto max-w-[1550px]">


                    {/* ================================================= */}
                    {/* HEADER */}
                    {/* ================================================= */}

                    <div className="relative mb-7 overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 p-7 text-white shadow-xl">

                        <div className="absolute -right-10 -top-16 h-48 w-48 rounded-full bg-white/10" />

                        <div className="absolute -bottom-20 right-32 h-40 w-40 rounded-full bg-white/10" />


                        <div className="relative flex flex-col justify-between gap-5 md:flex-row md:items-center">

                            <div>

                                <div className="mb-2 inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">

                                    ✨ Financial Overview

                                </div>


                                <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">

                                    Welcome to your Dashboard

                                </h1>


                                <p className="mt-2 max-w-xl text-sm text-blue-100">

                                    Track your income, expenses and spending
                                    habits all in one place.

                                </p>

                            </div>


                            <div className="rounded-2xl border border-white/20 bg-white/10 px-6 py-4 backdrop-blur-md">

                                <p className="text-xs text-blue-100">
                                    Total Transactions
                                </p>

                                <p className="mt-1 text-3xl font-extrabold">
                                    {expenses.length}
                                </p>

                            </div>

                        </div>

                    </div>



                    {/* ================================================= */}
                    {/* SUMMARY TILES */}
                    {/* ================================================= */}

                    <div className="mb-7 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">


                        {/* BALANCE */}

                        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-500 to-blue-600 p-6 text-white shadow-lg">

                            <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/10" />

                            <p className="text-sm font-medium text-indigo-100">
                                Current Balance
                            </p>

                            <p className="mt-3 text-3xl font-extrabold">
                                ₹{balance.toLocaleString("en-IN")}
                            </p>

                            <div className="mt-4 text-xs text-indigo-100">
                                Income − Expenses
                            </div>

                        </div>


                        {/* INCOME */}

                        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-400 to-teal-600 p-6 text-white shadow-lg">

                            <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/10" />

                            <p className="text-sm font-medium text-emerald-100">
                                Total Income
                            </p>

                            <p className="mt-3 text-3xl font-extrabold">
                                ₹{totalIncome.toLocaleString("en-IN")}
                            </p>

                            <div className="mt-4 text-xs text-emerald-100">
                                Money received
                            </div>

                        </div>


                        {/* EXPENSE */}

                        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-400 to-pink-600 p-6 text-white shadow-lg">

                            <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/10" />

                            <p className="text-sm font-medium text-rose-100">
                                Total Expense
                            </p>

                            <p className="mt-3 text-3xl font-extrabold">
                                ₹{totalExpense.toLocaleString("en-IN")}
                            </p>

                            <div className="mt-4 text-xs text-rose-100">
                                Money spent
                            </div>

                        </div>


                        {/* SAVINGS */}

                        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-500 to-fuchsia-600 p-6 text-white shadow-lg">

                            <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/10" />

                            <p className="text-sm font-medium text-purple-100">
                                Net Savings
                            </p>

                            <p className="mt-3 text-3xl font-extrabold">
                                ₹{balance.toLocaleString("en-IN")}
                            </p>

                            <div className="mt-4 text-xs text-purple-100">
                                Available balance
                            </div>

                        </div>

                    </div>



                    {/* ================================================= */}
                    {/* QUICK ACTION */}
                    {/* ================================================= */}

                    <div className="mb-7 overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-50 via-white to-purple-50 shadow-lg ring-1 ring-indigo-100">

                        <div className="border-b border-indigo-100 bg-gradient-to-r from-indigo-500 via-blue-500 to-purple-500 px-6 py-5 text-white">

                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

                                <div>

                                    <h2 className="text-xl font-extrabold">
                                        Quick Action
                                    </h2>

                                    <p className="mt-1 text-sm text-blue-100">
                                        Add a new income or expense
                                    </p>

                                </div>


                                <div className="rounded-2xl bg-white/15 px-4 py-2 text-sm font-bold backdrop-blur">

                                    ➕ Add Transaction

                                </div>

                            </div>

                        </div>


                        <div className="p-6">

                            <AddExpense
                                refresh={fetchExpenses}
                            />

                        </div>

                    </div>



                    {/* ================================================= */}
                    {/* ANALYTICS + TRANSACTIONS */}
                    {/* ================================================= */}

                    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">


                        {/* ANALYTICS */}

                        <div className="overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-slate-200">

                            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-6 py-5 text-white">

                                <div className="flex items-center justify-between">

                                    <div>

                                        <h2 className="text-xl font-extrabold">
                                            Analytics
                                        </h2>

                                        <p className="mt-1 text-sm text-blue-100">
                                            Visualize your spending and income
                                        </p>

                                    </div>

                                    <div className="rounded-xl bg-white/15 px-3 py-2 text-lg backdrop-blur">
                                        📊
                                    </div>

                                </div>

                            </div>


                            <div className="p-5">

                                <ExpenseChart
                                    expenses={expenses}
                                />

                            </div>

                        </div>



                        {/* RECENT TRANSACTIONS */}

                        <div className="overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-slate-200">

                            <div className="bg-gradient-to-r from-fuchsia-500 via-purple-600 to-indigo-600 px-6 py-5 text-white">

                                <div className="flex items-center justify-between">

                                    <div>

                                        <h2 className="text-xl font-extrabold">
                                            Recent Transactions
                                        </h2>

                                        <p className="mt-1 text-sm text-purple-100">
                                            Manage your income and expenses
                                        </p>

                                    </div>

                                    <div className="rounded-xl bg-white/15 px-3 py-2 text-lg backdrop-blur">
                                        💳
                                    </div>

                                </div>

                            </div>



                            {/* FILTERS */}

                            <div className="border-b border-slate-100 bg-slate-50/70 p-5">

                                <div className="grid grid-cols-1 gap-3 md:grid-cols-3">

                                    <input
                                        type="text"
                                        placeholder="🔍 Search transaction..."
                                        value={search}
                                        onChange={(e) =>
                                            setSearch(e.target.value)
                                        }
                                        className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                                    />


                                    <select
                                        value={filterType}
                                        onChange={(e) =>
                                            setFilterType(e.target.value)
                                        }
                                        className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                                    >

                                        <option value="All">
                                            All Types
                                        </option>

                                        <option value="Income">
                                            Income
                                        </option>

                                        <option value="Expense">
                                            Expense
                                        </option>

                                    </select>


                                    <select
                                        value={filterCategory}
                                        onChange={(e) =>
                                            setFilterCategory(e.target.value)
                                        }
                                        className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                                    >

                                        <option value="All">
                                            All Categories
                                        </option>

                                        {categories.map(
                                            (category) => (
                                                <option
                                                    key={category}
                                                    value={category}
                                                >
                                                    {category}
                                                </option>
                                            )
                                        )}

                                    </select>

                                </div>


                                {(search ||
                                    filterType !== "All" ||
                                    filterCategory !== "All") && (

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSearch("");
                                            setFilterType("All");
                                            setFilterCategory("All");
                                        }}
                                        className="mt-3 rounded-lg px-3 py-2 text-xs font-bold text-indigo-600 transition hover:bg-indigo-50"
                                    >
                                        ↻ Reset Filters
                                    </button>

                                )}

                            </div>



                            {/* TRANSACTION LIST */}

                            <div className="max-h-[610px] overflow-y-auto p-5">

                                {filteredExpenses.length === 0 ? (

                                    <div className="flex min-h-[300px] items-center justify-center">

                                        <div className="text-center">

                                            <div className="text-5xl">
                                                🧾
                                            </div>

                                            <p className="mt-4 text-sm font-bold text-slate-600">
                                                No transactions found
                                            </p>

                                            <p className="mt-1 text-xs text-slate-400">
                                                Add a transaction or change your filters
                                            </p>

                                        </div>

                                    </div>

                                ) : (

                                    <div className="space-y-3">

                                        {filteredExpenses.map(
                                            (expense) => (

                                                <div
                                                    key={expense._id}
                                                    className={`group rounded-2xl border p-4 transition hover:-translate-y-0.5 hover:shadow-md ${
                                                        expense.type === "Income"
                                                            ? "border-emerald-100 bg-gradient-to-r from-emerald-50 to-teal-50"
                                                            : "border-rose-100 bg-gradient-to-r from-rose-50 to-pink-50"
                                                    }`}
                                                >

                                                    <div className="flex items-center justify-between gap-4">


                                                        {/* LEFT */}

                                                        <div className="flex min-w-0 items-center gap-3">

                                                            <div
                                                                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-lg shadow-sm ${
                                                                    expense.type === "Income"
                                                                        ? "bg-gradient-to-br from-emerald-400 to-teal-500 text-white"
                                                                        : "bg-gradient-to-br from-rose-400 to-pink-500 text-white"
                                                                }`}
                                                            >

                                                                {expense.type === "Income"
                                                                    ? "↗"
                                                                    : "↘"}

                                                            </div>


                                                            <div className="min-w-0">

                                                                <p className="truncate text-sm font-bold text-slate-800">

                                                                    {expense.title}

                                                                </p>


                                                                <div className="mt-1 flex flex-wrap items-center gap-2">

                                                                    <span className="rounded-full bg-white px-2 py-1 text-[10px] font-semibold text-slate-500 shadow-sm">

                                                                        {expense.category}

                                                                    </span>


                                                                    <span className="text-[10px] text-slate-400">

                                                                        {new Date(
                                                                            expense.date
                                                                        ).toLocaleDateString(
                                                                            "en-IN"
                                                                        )}

                                                                    </span>

                                                                </div>

                                                            </div>

                                                        </div>



                                                        {/* RIGHT */}

                                                        <div className="flex shrink-0 items-center gap-3">


                                                            <div className="text-right">

                                                                <p
                                                                    className={`text-sm font-extrabold ${
                                                                        expense.type === "Income"
                                                                            ? "text-emerald-600"
                                                                            : "text-rose-600"
                                                                    }`}
                                                                >

                                                                    {expense.type === "Income"
                                                                        ? "+"
                                                                        : "-"}₹
                                                                    {Number(
                                                                        expense.amount
                                                                    ).toLocaleString(
                                                                        "en-IN"
                                                                    )}

                                                                </p>


                                                                <p className="text-[10px] font-medium text-slate-400">

                                                                    {expense.type}

                                                                </p>

                                                            </div>



                                                            {/* ACTIONS - ALWAYS VISIBLE */}

                                                            <div className="flex shrink-0 gap-2">

                                                                {/* EDIT */}

                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        setEditExpense(
                                                                            expense
                                                                        )
                                                                    }
                                                                    className="rounded-lg bg-white px-3 py-2 text-xs font-bold text-indigo-600 shadow-sm transition hover:bg-indigo-50"
                                                                >
                                                                    Edit
                                                                </button>


                                                                {/* DELETE */}

                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        deleteExpense(
                                                                            expense._id
                                                                        )
                                                                    }
                                                                    className="rounded-lg bg-white px-3 py-2 text-xs font-bold text-rose-600 shadow-sm transition hover:bg-rose-50"
                                                                >
                                                                    Delete
                                                                </button>

                                                            </div>

                                                        </div>

                                                    </div>

                                                </div>

                                            )
                                        )}

                                    </div>

                                )}

                            </div>

                        </div>

                    </div>

                </div>

            </main>



            {/* ========================================================= */}
            {/* EDIT MODAL */}
            {/* ========================================================= */}

            {editExpense && (

                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">

                    <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl">


                        {/* MODAL HEADER */}

                        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-fuchsia-600 px-6 py-5 text-white">

                            <div className="flex items-center justify-between">

                                <div>

                                    <h2 className="text-xl font-extrabold">
                                        Edit Transaction
                                    </h2>

                                    <p className="mt-1 text-xs text-purple-100">
                                        Update your transaction details
                                    </p>

                                </div>


                                <button
                                    type="button"
                                    onClick={() =>
                                        setEditExpense(null)
                                    }
                                    className="rounded-xl bg-white/15 px-3 py-2 text-lg backdrop-blur transition hover:bg-white/25"
                                >
                                    ✕
                                </button>

                            </div>

                        </div>



                        {/* MODAL BODY */}

                        <div className="space-y-4 p-6">


                            {/* TITLE */}

                            <div>

                                <label className="mb-1 block text-xs font-bold text-slate-600">
                                    Title
                                </label>

                                <input
                                    type="text"
                                    value={editExpense.title}
                                    onChange={(e) =>
                                        setEditExpense({
                                            ...editExpense,
                                            title: e.target.value
                                        })
                                    }
                                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                                />

                            </div>


                            {/* AMOUNT */}

                            <div>

                                <label className="mb-1 block text-xs font-bold text-slate-600">
                                    Amount
                                </label>

                                <input
                                    type="number"
                                    value={editExpense.amount}
                                    onChange={(e) =>
                                        setEditExpense({
                                            ...editExpense,
                                            amount: e.target.value
                                        })
                                    }
                                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                                />

                            </div>


                            {/* CATEGORY */}

                            <div>

                                <label className="mb-1 block text-xs font-bold text-slate-600">
                                    Category
                                </label>

                                <input
                                    type="text"
                                    value={editExpense.category}
                                    onChange={(e) =>
                                        setEditExpense({
                                            ...editExpense,
                                            category: e.target.value
                                        })
                                    }
                                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                                />

                            </div>


                            {/* TYPE */}

                            <div>

                                <label className="mb-1 block text-xs font-bold text-slate-600">
                                    Type
                                </label>

                                <select
                                    value={editExpense.type}
                                    onChange={(e) =>
                                        setEditExpense({
                                            ...editExpense,
                                            type: e.target.value
                                        })
                                    }
                                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                                >

                                    <option value="Expense">
                                        Expense
                                    </option>

                                    <option value="Income">
                                        Income
                                    </option>

                                </select>

                            </div>



                            {/* BUTTONS */}

                            <div className="flex gap-3 pt-2">

                                <button
                                    type="button"
                                    onClick={() =>
                                        setEditExpense(null)
                                    }
                                    className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
                                >
                                    Cancel
                                </button>


                                <button
                                    type="button"
                                    onClick={updateExpense}
                                    className="flex-1 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3 text-sm font-bold text-white shadow-md transition hover:from-indigo-700 hover:to-purple-700"
                                >
                                    Save Changes
                                </button>

                            </div>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
}

export default Dashboard;