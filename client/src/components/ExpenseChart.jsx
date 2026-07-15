import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid
} from "recharts";


function ExpenseChart({ expenses }) {


    const categoryData = expenses
        .filter(item => item.type === "Expense")
        .reduce((acc, item) => {

            const existing = acc.find(
                data => data.name === item.category
            );


            if (existing) {
                existing.value += Number(item.amount);
            } else {
                acc.push({
                    name: item.category,
                    value: Number(item.amount)
                });
            }


            return acc;

        }, []);



    const incomeExpenseData = [

        {
            name: "Income",
            amount: expenses
                .filter(item => item.type === "Income")
                .reduce((sum, item) => sum + Number(item.amount), 0)
        },


        {
            name: "Expense",
            amount: expenses
                .filter(item => item.type === "Expense")
                .reduce((sum, item) => sum + Number(item.amount), 0)
        }

    ];



    return (

        <div>


            <h3>Expense Category Chart</h3>


            <PieChart width={400} height={300}>

                <Pie
                    data={categoryData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={100}
                    label
                >

                    {
                        categoryData.map((entry, index) => (
                            <Cell key={index} />
                        ))
                    }

                </Pie>


                <Tooltip />

                <Legend />

            </PieChart>



            <h3>Income vs Expense</h3>


            <BarChart
                width={400}
                height={300}
                data={incomeExpenseData}
            >

                <CartesianGrid />

                <XAxis dataKey="name" />

                <YAxis />

                <Tooltip />

                <Bar
                    dataKey="amount"
                />

            </BarChart>


        </div>

    );

}


export default ExpenseChart;