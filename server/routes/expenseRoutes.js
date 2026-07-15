const express = require("express");

const router = express.Router();

const {
    addExpense,
    getExpenses,
    deleteExpense,
    updateExpense
} = require("../controllers/expenseController");

const authMiddleware = require("../middleware/authMiddleware");


// Add expense
router.post(
    "/",
    authMiddleware,
    addExpense
);


// Get all expenses
router.get(
    "/",
    authMiddleware,
    getExpenses
);


// Delete expense
router.delete(
    "/:id",
    authMiddleware,
    deleteExpense
);


// Update expense
router.put(
    "/:id",
    authMiddleware,
    updateExpense
);


module.exports = router;