const Expense = require("../models/Expense");


// Add Expense
const addExpense = async (req, res) => {
    try {

        const { title, amount, category, type } = req.body;


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

        res.status(500).json({

            message: error.message

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


        res.status(500).json({

            message: error.message

        });

    }

};



// Delete Expense
const deleteExpense = async (req, res) => {

    try {


        await Expense.findByIdAndDelete(req.params.id);


        res.json({

            message: "Expense deleted successfully"

        });


    } catch (error) {


        res.status(500).json({

            message: error.message

        });

    }

};



// Update Expense
const updateExpense = async (req, res) => {

    try {


        const expense = await Expense.findById(req.params.id);



        if (!expense) {

            return res.status(404).json({

                message: "Expense not found"

            });

        }



        expense.title = req.body.title || expense.title;

        expense.amount = req.body.amount || expense.amount;

        expense.category = req.body.category || expense.category;

        expense.type = req.body.type || expense.type;



        await expense.save();



        res.json({

            message: "Expense updated successfully",

            expense

        });



    } catch (error) {


        res.status(500).json({

            message: error.message

        });


    }

};



module.exports = {

    addExpense,

    getExpenses,

    deleteExpense,

    updateExpense

};