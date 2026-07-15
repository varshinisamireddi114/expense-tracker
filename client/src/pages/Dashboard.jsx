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



    const fetchExpenses = async () => {

        try {

            const token = localStorage.getItem("token");


            const response = await API.get("/expenses", {

                headers: {

                    Authorization: `Bearer ${token}`

                }

            });


            setExpenses(response.data);


        } catch(error) {

            console.log(error);

        }

    };




    const deleteExpense = async(id)=>{

        try {


            const token = localStorage.getItem("token");


            await API.delete(`/expenses/${id}`,{

                headers:{
                    Authorization:`Bearer ${token}`
                }

            });


            alert("Expense deleted successfully");


            fetchExpenses();


        } catch(error){

            console.log(error);

        }

    };





    const updateExpense = async()=>{


        try{


            const token = localStorage.getItem("token");


            await API.put(

                `/expenses/${editExpense._id}`,

                editExpense,

                {

                    headers:{
                        Authorization:`Bearer ${token}`
                    }

                }

            );



            alert("Expense updated successfully");


            setEditExpense(null);


            fetchExpenses();



        }catch(error){

            console.log(error);

        }


    };





    const totalIncome = expenses

        .filter(item=>item.type==="Income")

        .reduce(

            (sum,item)=>sum+Number(item.amount),

            0

        );





    const totalExpense = expenses

        .filter(item=>item.type==="Expense")

        .reduce(

            (sum,item)=>sum+Number(item.amount),

            0

        );





    const balance = totalIncome-totalExpense;





    const categories = [

        ...new Set(

            expenses.map(item=>item.category)

        )

    ];





    const filteredExpenses = expenses.filter((expense)=>{


        const searchMatch = expense.title

            .toLowerCase()

            .includes(search.toLowerCase());



        const typeMatch =

            filterType==="All" ||

            expense.type===filterType;



        const categoryMatch =

            filterCategory==="All" ||

            expense.category===filterCategory;



        return (

            searchMatch &&

            typeMatch &&

            categoryMatch

        );


    });






    useEffect(()=>{

        fetchExpenses();

    },[]);






    return(


<div className="min-h-screen bg-gray-100">


<Navbar />



<div className="p-6">



<h1 className="text-3xl font-bold mb-6">

Expense Dashboard

</h1>





<div className="grid md:grid-cols-3 gap-5 mb-6">



<div className="bg-white shadow rounded-xl p-5">

<p className="text-gray-500">
Total Income
</p>


<h2 className="text-2xl font-bold text-green-600">

₹{totalIncome}

</h2>


</div>






<div className="bg-white shadow rounded-xl p-5">

<p className="text-gray-500">
Total Expense
</p>


<h2 className="text-2xl font-bold text-red-600">

₹{totalExpense}

</h2>


</div>






<div className="bg-white shadow rounded-xl p-5">

<p className="text-gray-500">
Balance
</p>


<h2 className="text-2xl font-bold text-blue-600">

₹{balance}

</h2>


</div>



</div>







<div className="bg-white rounded-xl shadow p-5 mb-6">


<AddExpense refresh={fetchExpenses}/>


</div>






<div className="bg-white rounded-xl shadow p-5 mb-6">


<ExpenseChart expenses={expenses}/>


</div>







<div className="bg-white rounded-xl shadow p-5">


<h2 className="text-xl font-bold mb-5">

Your Expenses

</h2>





<div className="flex flex-col md:flex-row gap-3 mb-5">



<input

className="border rounded-lg p-2 flex-1"

placeholder="Search expense..."

value={search}

onChange={(e)=>setSearch(e.target.value)}

/>





<button

className="bg-gray-600 text-white px-4 rounded-lg"

onClick={()=>setSearch("")}

>

Clear

</button>







<select

className="border rounded-lg p-2"

value={filterType}

onChange={(e)=>setFilterType(e.target.value)}

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

className="border rounded-lg p-2"

value={filterCategory}

onChange={(e)=>setFilterCategory(e.target.value)}

>


<option value="All">
All Categories
</option>


{

categories.map((cat)=>(


<option key={cat} value={cat}>

{cat}

</option>


))

}



</select>




</div>







{

filteredExpenses.length===0 ? (


<p>
No expenses found
</p>



):(



filteredExpenses.map((expense)=>(



<div

key={expense._id}

className="border rounded-xl p-4 mb-3 flex justify-between items-center"

>


<div>


<h3 className="font-bold text-lg">

{expense.title}

</h3>


<p>

₹{expense.amount} ({expense.category})

</p>


<p className="text-gray-500">

{expense.type}

</p>


</div>





<div className="flex gap-2">


<button

className="bg-blue-500 text-white px-3 py-1 rounded"

onClick={()=>setEditExpense(expense)}

>

Edit

</button>






<button

className="bg-red-500 text-white px-3 py-1 rounded"

onClick={()=>deleteExpense(expense._id)}

>

Delete

</button>



</div>



</div>



))


)


}







{

editExpense && (


<div className="mt-6 border rounded-xl p-5">


<h2 className="font-bold text-xl mb-4">

Edit Expense

</h2>





<input

className="border p-2 rounded w-full mb-3"

value={editExpense.title}

onChange={(e)=>

setEditExpense({

...editExpense,

title:e.target.value

})

}

/>





<input

className="border p-2 rounded w-full mb-3"

type="number"

value={editExpense.amount}

onChange={(e)=>

setEditExpense({

...editExpense,

amount:e.target.value

})

}

/>






<input

className="border p-2 rounded w-full mb-3"

value={editExpense.category}

onChange={(e)=>

setEditExpense({

...editExpense,

category:e.target.value

})

}

/>






<button

className="bg-green-600 text-white px-4 py-2 rounded mr-3"

onClick={updateExpense}

>

Update

</button>





<button

className="bg-gray-500 text-white px-4 py-2 rounded"

onClick={()=>setEditExpense(null)}

>

Cancel

</button>



</div>


)


}





</div>


</div>


</div>


);


}


export default Dashboard;