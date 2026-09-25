const request = require("supertest");
const express = require("express");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const Expense = require("../models/Expense");
const expenseRoutes = require("../routes/expenseRoutes");
const authMiddleware = require("../middleware/authMiddleware");

const app = express();

app.use(express.json());

app.use("/api/expenses", expenseRoutes);


// Test route for authentication
app.get("/test-auth", authMiddleware, (req, res) => {
    res.json({
        message: "Authentication successful"
    });
});


describe("Expense API", () => {

    beforeEach(async () => {
        await Expense.deleteMany({});
    });


    test("should reject request without authentication token", async () => {

        const response = await request(app)
            .get("/api/expenses");

        expect(response.statusCode).toBe(401);

        expect(response.body.message)
            .toBe("Not authorized, no token");
    });


    test("should reject request with invalid token", async () => {

        const response = await request(app)
            .get("/api/expenses")
            .set("Authorization", "Bearer invalid-token");

        expect(response.statusCode).toBe(401);

        expect(response.body.message)
            .toBe("Not authorized, token failed");
    });


    test("should allow request with valid token", async () => {

        const token = jwt.sign(
            { id: "123456789012345678901234" },
            process.env.JWT_SECRET
        );

        const response = await request(app)
            .get("/test-auth")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);

        expect(response.body.message)
            .toBe("Authentication successful");
    });


    test("should add an expense for an authenticated user", async () => {

        const userId = "123456789012345678901234";

        const token = jwt.sign(
            { id: userId },
            process.env.JWT_SECRET
        );

        const response = await request(app)
            .post("/api/expenses")
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "Test Expense",
                amount: 500,
                category: "Food",
                type: "Expense"
            });

        expect(response.statusCode).toBe(201);

        expect(response.body.expense.title)
            .toBe("Test Expense");

        expect(response.body.expense.amount)
            .toBe(500);

        expect(response.body.expense.category)
            .toBe("Food");

        expect(response.body.expense.type)
            .toBe("Expense");

        expect(response.body.expense.userId)
            .toBe(userId);
    });


    test("should return only expenses belonging to the logged-in user", async () => {

        const userA = "123456789012345678901234";
        const userB = "223456789012345678901234";

        await Expense.create({
            title: "User A Expense",
            amount: 1000,
            category: "Food",
            type: "Expense",
            userId: userA
        });

        await Expense.create({
            title: "User B Expense",
            amount: 2000,
            category: "Travel",
            type: "Expense",
            userId: userB
        });

        const token = jwt.sign(
            { id: userA },
            process.env.JWT_SECRET
        );

        const response = await request(app)
            .get("/api/expenses")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);

        expect(response.body).toHaveLength(1);

        expect(response.body[0].title)
            .toBe("User A Expense");

        expect(response.body[0].userId)
            .toBe(userA);
    });


    test("should allow a user to delete their own expense", async () => {

        const userId = "123456789012345678901234";

        const expense = await Expense.create({
            title: "Expense To Delete",
            amount: 500,
            category: "Food",
            type: "Expense",
            userId: userId
        });

        const token = jwt.sign(
            { id: userId },
            process.env.JWT_SECRET
        );

        const response = await request(app)
            .delete(`/api/expenses/${expense._id}`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);

        expect(response.body.message)
            .toBe("Expense deleted successfully");

        const deletedExpense = await Expense.findById(expense._id);

        expect(deletedExpense).toBeNull();
    });


    test("should not allow a user to delete another user's expense", async () => {

        const userA = "123456789012345678901234";
        const userB = "223456789012345678901234";

        const expense = await Expense.create({
            title: "User B Expense",
            amount: 1000,
            category: "Travel",
            type: "Expense",
            userId: userB
        });

        const token = jwt.sign(
            { id: userA },
            process.env.JWT_SECRET
        );

        const response = await request(app)
            .delete(`/api/expenses/${expense._id}`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(404);

        expect(response.body.message)
            .toBe("Expense not found");

        const existingExpense = await Expense.findById(expense._id);

        expect(existingExpense).not.toBeNull();
    });


    test("should allow a user to update their own expense", async () => {

        const userId = "123456789012345678901234";

        const expense = await Expense.create({
            title: "Old Title",
            amount: 500,
            category: "Food",
            type: "Expense",
            userId: userId
        });

        const token = jwt.sign(
            { id: userId },
            process.env.JWT_SECRET
        );

        const response = await request(app)
            .put(`/api/expenses/${expense._id}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "Updated Title",
                amount: 800,
                category: "Shopping",
                type: "Expense"
            });

        expect(response.statusCode).toBe(200);

        expect(response.body.message)
            .toBe("Expense updated successfully");

        expect(response.body.expense.title)
            .toBe("Updated Title");

        expect(response.body.expense.amount)
            .toBe(800);

        expect(response.body.expense.category)
            .toBe("Shopping");

        const updatedExpense = await Expense.findById(expense._id);

        expect(updatedExpense.title)
            .toBe("Updated Title");

        expect(updatedExpense.amount)
            .toBe(800);

        expect(updatedExpense.category)
            .toBe("Shopping");
    });


    test("should not allow a user to update another user's expense", async () => {

        const userA = "123456789012345678901234";
        const userB = "223456789012345678901234";

        const expense = await Expense.create({
            title: "User B Expense",
            amount: 1000,
            category: "Travel",
            type: "Expense",
            userId: userB
        });

        const token = jwt.sign(
            { id: userA },
            process.env.JWT_SECRET
        );

        const response = await request(app)
            .put(`/api/expenses/${expense._id}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "Hacked Expense",
                amount: 9999,
                category: "Shopping",
                type: "Expense"
            });

        expect(response.statusCode).toBe(404);

        expect(response.body.message)
            .toBe("Expense not found");

        const unchangedExpense = await Expense.findById(expense._id);

        expect(unchangedExpense.title)
            .toBe("User B Expense");

        expect(unchangedExpense.amount)
            .toBe(1000);

        expect(unchangedExpense.category)
            .toBe("Travel");
    });

});