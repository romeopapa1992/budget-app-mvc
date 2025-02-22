import { drawExpenseChart } from "./charts.js";

$('#view-button').click(function() {
    const period = $('#period').val();
    const startDate = $('#startDate').val();
    const endDate = $('#endDate').val();

    $.ajax({
        url: '/getDetails',
        type: 'POST',
        data: { period, startDate, endDate },
        success: function(response) {
            const data = JSON.parse(response);

            const incomeDetails = $('#income-details tbody');
            incomeDetails.empty();
            $('#no-incomes-message').addClass('d-none');
            if (data.incomes.length) {
                data.incomes.forEach((income, index) => {
                    incomeDetails.append(`
                        <tr>
                            <td>${index + 1}</td>
                            <td>${income.date_of_income}</td>
                            <td>${income.amount}</td>
                            <td>${income.category}</td>
                            <td>${income.comment}</td>
                        </tr>
                    `);
                });
            } else {
                $('#no-incomes-message').removeClass('d-none');
            }

            const expenseDetails = $('#expense-details tbody');
            expenseDetails.empty();
            $('#no-expenses-message').addClass('d-none');
            if (data.expenses.length) {
                data.expenses.forEach((expense, index) => {
                    expenseDetails.append(`
                        <tr>
                            <td>${index + 1}</td>
                            <td>${expense.date_of_expense}</td>
                            <td>${expense.amount}</td>
                            <td>${expense.category}</td>
                            <td>${expense.payment_method}</td>
                            <td>${expense.comment}</td>
                        </tr>
                    `);
                });
            } else {
                $('#no-expenses-message').removeClass('d-none');
            }

            $('#details-section').removeClass('d-none');

            $.ajax({
                url: '/getExpenseCategoryData',
                type: 'POST',
                data: { period, startDate, endDate },
                success: function(categoryResponse) {
                    const categoryData = JSON.parse(categoryResponse);
                    $('#no-expense-chart-message').addClass('d-none');
                    if (categoryData.length) {
                        $('#expenseChart').removeClass('d-none');
                        drawExpenseChart(categoryData);
                    } else {
                        if (expenseChart instanceof Chart) {
                            expenseChart.destroy();
                        }
                        $('#expenseChart').addClass('d-none');
                        $('#no-expense-chart-message').removeClass('d-none');
                    }
                },
                error: function() {
                    alert('Error fetching expense category data.');
                }
            });
        },
        error: function() {
            alert('Error fetching data. Please try again.');
        }
    });
});
