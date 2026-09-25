const mongoose = require("mongoose");
const Expense = require("../models/Expense");

// Add Expense
const addExpense = async (req, res) => {
    try {
        const { title, amount, category, type } = req.body;

        // Validate required fields
        if (
            !title ||
            !category ||
            amount === undefined ||
            !type
        ) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        // Validate amount
        if (typeof amount !== "number" || amount <= 0) {
            return res.status(400).json({
                message: "Amount must be a positive number"
            });
        }

        // Validate type
        if (type !== "Income" && type !== "Expense") {
            return res.status(400).json({
                message: "Type must be either Income or Expense"
            });
        }

        const expense = await Expense.create({
            title,
            amount,
            category,
            type,
            userId: req.user.id
        });

        res.status(201).json({
            message: "Expense added successfully",
            expense
        });

    } catch (error) {
        console.error("Add Expense Error:", error);

        res.status(500).json({
            message: "Internal server error"
        });
    }
};


// Get Expenses
const getExpenses = async (req, res) => {
    try {
        const expenses = await Expense.find({
            userId: req.user.id
        });

        res.json(expenses);

    } catch (error) {
        console.error("Get Expenses Error:", error);

        res.status(500).json({
            message: "Internal server error"
        });
    }
};


// Delete Expense
const deleteExpense = async (req, res) => {
    try {

        // Check whether ID is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                message: "Invalid expense ID"
            });
        }

        const expense = await Expense.findOneAndDelete({
            _id: req.params.id,
            userId: req.user.id
        });

        if (!expense) {
            return res.status(404).json({
                message: "Expense not found"
            });
        }

        res.json({
            message: "Expense deleted successfully"
        });

    } catch (error) {
        console.error("Delete Expense Error:", error);

        res.status(500).json({
            message: "Internal server error"
        });
    }
};


// Update Expense
const updateExpense = async (req, res) => {
    try {

        // Check whether ID is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                message: "Invalid expense ID"
            });
        }

        const expense = await Expense.findOne({
            _id: req.params.id,
            userId: req.user.id
        });

        if (!expense) {
            return res.status(404).json({
                message: "Expense not found"
            });
        }

        const { title, amount, category, type } = req.body;

        // Validate title
        if (title !== undefined) {
            if (typeof title !== "string" || !title.trim()) {
                return res.status(400).json({
                    message: "Title cannot be empty"
                });
            }
        }

        // Validate category
        if (category !== undefined) {
            if (typeof category !== "string" || !category.trim()) {
                return res.status(400).json({
                    message: "Category cannot be empty"
                });
            }
        }

        // Validate amount
        if (
            amount !== undefined &&
            (typeof amount !== "number" || amount <= 0)
        ) {
            return res.status(400).json({
                message: "Amount must be a positive number"
            });
        }

        // Validate type
        if (
            type !== undefined &&
            type !== "Income" &&
            type !== "Expense"
        ) {
            return res.status(400).json({
                message: "Type must be either Income or Expense"
            });
        }

        // Update only provided fields
        expense.title = title ?? expense.title;
        expense.amount = amount ?? expense.amount;
        expense.category = category ?? expense.category;
        expense.type = type ?? expense.type;

        await expense.save();

        res.json({
            message: "Expense updated successfully",
            expense
        });

    } catch (error) {
        console.error("Update Expense Error:", error);

        res.status(500).json({
            message: "Internal server error"
        });
    }
};


module.exports = {
    addExpense,
    getExpenses,
    deleteExpense,
    updateExpense
};