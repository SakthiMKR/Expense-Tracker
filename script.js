    const form = document.getElementById("expense-form");
    const expenseList = document.getElementById("expense-list");
    const totalDisplay = document.getElementById("total");
    const filterCategory = document.getElementById("filter-category");
    const filterPeriod = document.getElementById("filter-period");
    const ctx = document.getElementById("expense-chart").getContext("2d");

    let expenses = [];
    let chart;

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const description = document.getElementById("description").value;
      const amount = parseFloat(document.getElementById("amount").value);
      const date = document.getElementById("date").value;
      const category = document.getElementById("category").value;

      const expense = {
        id: Date.now(),
        description,
        amount,
        date,
        category,
      };

      expenses.push(expense);
      form.reset();
      displayExpenses();
    });

    filterCategory.addEventListener("change", displayExpenses);
    filterPeriod.addEventListener("change", displayExpenses);

    function displayExpenses() {
      expenseList.innerHTML = "";
      let total = 0;
      const filterCat = filterCategory.value;
      const filterTime = filterPeriod.value;

      const today = new Date();

      const filtered = expenses.filter((exp) => {
        const expDate = new Date(exp.date);
        const sameDay = expDate.toDateString() === today.toDateString();
        const sameMonth = expDate.getMonth() === today.getMonth() && expDate.getFullYear() === today.getFullYear();
        const sameYear = expDate.getFullYear() === today.getFullYear();

        let timeMatch =
          filterTime === "daily" ? sameDay :
          filterTime === "monthly" ? sameMonth :
          filterTime === "yearly" ? sameYear : true;

        return (filterCat === "All" || exp.category === filterCat) && timeMatch;
      });

      filtered.forEach((exp) => {
        total += exp.amount;
        const li = document.createElement("li");
        li.className = "bg-gray-100 p-4 rounded flex justify-between items-start gap-4 flex-wrap";
        li.innerHTML = `
          <div>
            <p class="font-semibold">${exp.description}</p>
            <p class="text-sm text-gray-500">₹${exp.amount} | ${exp.date} | ${exp.category}</p>
          </div>
          <div class="space-x-2">
            <button onclick="editExpense(${exp.id})" class="text-blue-500">Edit</button>
            <button onclick="deleteExpense(${exp.id})" class="text-red-500">Delete</button>
          </div>
        `;
        expenseList.appendChild(li);
      });

      totalDisplay.textContent = total.toFixed(2);
      updateChart(filtered);
    }

    function deleteExpense(id) {
      expenses = expenses.filter((exp) => exp.id !== id);
      displayExpenses();
    }

    function editExpense(id) {
      const exp = expenses.find((e) => e.id === id);
      if (exp) {
        document.getElementById("description").value = exp.description;
        document.getElementById("amount").value = exp.amount;
        document.getElementById("date").value = exp.date;
        document.getElementById("category").value = exp.category;
        deleteExpense(id);
      }
    }

    function updateChart(data) {
      const categoryTotals = {};
      data.forEach(exp => {
        categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
      });

      const labels = Object.keys(categoryTotals);
      const amounts = Object.values(categoryTotals);

      if (chart) chart.destroy();
      chart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: labels,
          datasets: [{
            label: 'Expenses by Category',
            data: amounts,
            backgroundColor: ['#60A5FA', '#34D399', '#FBBF24', '#F87171', '#A78BFA'],
          }]
        },
        options: {
          responsive: true,
        }
      });
    }