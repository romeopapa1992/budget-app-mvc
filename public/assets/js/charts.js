let expenseChart;

export function drawExpenseChart(expenseData) {
    $('#no-expenses-message').addClass('d-none');

    if (expenseChart instanceof Chart) {
        expenseChart.destroy();
    }    

    const ctx = document.getElementById('expenseChart').getContext('2d');
    const labels = expenseData.map(item => item.category);
    const data = expenseData.map(item => parseFloat(item.total_amount));

    expenseChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                label: 'Expenses by Category',
                data: data,
                backgroundColor: [
                    '#FF6384', '#36A2EB', '#FFCE56', '#8A89A6', '#98ABC5', '#8C564B', '#E377C2', '#7F7F7F', '#BCBD22', '#17BECF'
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: 'white',
                    },
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.label + ': ' + context.raw + ' PLN';
                        }
                    }
                }
            }
        }
    });
}