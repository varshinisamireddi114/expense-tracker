import { useState } from "react";
import API from "../api/api";

function AddExpense({ refresh }) {

    const [expense, setExpense] = useState({
        title: "",
        amount: "",
        category: "",
        type: "Expense"
    });

    const handleChange = (e) => {
        setExpense({
            ...expense,
            [e.target.name]:
                e.target.name === "amount"
                    ? Number(e.target.value)
                    : e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log("Form data:", expense);

        // Check required fields
        if (
            !expense.title.trim() ||
            !expense.amount ||
            !expense.category.trim()
        ) {
            alert("Please fill all fields");
            return;
        }

        // Check amount
        if (expense.amount <= 0) {
            alert("Amount must be greater than 0");
            return;
        }

        try {

            const token = localStorage.getItem("token");

            const response = await API.post(
                "/expenses",
                expense,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            console.log(response.data);

            alert("Added successfully");

            // Refresh expense list
            refresh();

            // Clear form
            setExpense({
                title: "",
                amount: "",
                category: "",
                type: "Expense"
            });

        } catch (error) {

            console.log(
                error.response?.data || error.message
            );

            alert(
                error.response?.data?.message ||
                "Failed to add expense"
            );
        }
    };

    return (
        <div>

            <h3>Add Income / Expense</h3>

            <form onSubmit={handleSubmit}>

                <input
                    name="title"
                    placeholder="Title"
                    value={expense.title}
                    onChange={handleChange}
                />

                <input
                    name="amount"
                    type="number"
                    placeholder="Amount"
                    value={expense.amount}
                    onChange={handleChange}
                />

                <input
                    name="category"
                    placeholder="Category"
                    value={expense.category}
                    onChange={handleChange}
                />

                <select
                    name="type"
                    value={expense.type}
                    onChange={handleChange}
                >
                    <option value="Expense">
                        Expense
                    </option>

                    <option value="Income">
                        Income
                    </option>
                </select>

                <button type="submit">
                    Add
                </button>

            </form>

        </div>
    );
}

export default AddExpense;