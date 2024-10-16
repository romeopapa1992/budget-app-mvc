$(document).ready(function() {

    $("form").not("#addExpenseCategoryForm, #removeExpenseCategoryForm, #addIncomeCategoryForm, #removeIncomeCategoryForm").submit(function(event) {
        event.preventDefault();
        const form = $(this);
        const action = form.attr('action');
  
        if (form.attr('action').includes('signin')) {
            validateAndSubmitForm(form, true);  
        } else {
            validateAndSubmitForm(form);  
        }
    });

    function handleErrors(errors) {
        $('.error-text').hide();  
        $('input').removeClass('error');  
    
        for (let key in errors) {
            const input = $(`#floating${capitalizeFirstLetter(key)}`);  
            const errorElement = input.siblings('.error-text');  
            errorElement.text(errors[key]).show();  
            input.addClass('error');  
        }
    }

    $('input').on('input', function() {
        const input = $(this);
        const errorElement = input.siblings(".error-text");
        hideError(input, errorElement);  
    });

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    function validateAndSubmitForm(form, isLoginForm = false) {
        const inputs = form.find("input");
        let hasError = false;
        let allFieldsEmpty = true;
    
        inputs.each(function() {
            const input = $(this);
            const value = input.val().trim();
            const errorElement = input.siblings(".error-text");
    
            if (value !== "") {
                allFieldsEmpty = false;
            }
    
            if (value === "") {
                showError(input, errorElement);
                hasError = true;
            } else {
                hideError(input, errorElement);
            }
        });
    
        if (!hasError) {
            submitForm(form, isLoginForm);
        }
    }
    

    function validatePassword(password) {
        const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^\da-zA-Z]).{8,}$/;
        return passwordPattern.test(password);
    }

    function validateEmail(email) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    }

    function showError(input, errorElement) {
        input.addClass("error");
        errorElement.show();
    }

    function hideError(input, errorElement) {
        input.removeClass("error");
        errorElement.hide();
    }

    function clearErrors() {
        $('.error-text').hide();  
        $('input, select').removeClass('error');  
    }

    function submitForm(form, isLoginForm) {
        $.ajax({
            url: form.attr('action'),
            type: 'POST',
            data: form.serialize(),
            dataType: 'json',
            success: function(response) {
                if (response.status === 'success') {
                    alert(response.message); 
                    form[0].reset(); 
    
                    if (isLoginForm) {
                        window.location.href = '/budget-app-mvc/public/index.php?action=balance';
                    } else if (form.attr('action').includes('registration')) {
                        window.location.href = '/budget-app-mvc/public/index.php?action=signin';
                    }
                } else if (response.status === 'error') {
                    if (response.errors) {
                        handleErrors(response.errors);
                    } else {
                        alert(response.message || 'An error occurred.');
                    }
                    form[0].reset();
                } 
            }
        });
    } 
  
    $('#editOption').change(function() {
        var selectedOption = $(this).val();
    
        $('#editSelectionForm')[0].reset();  
        clearErrors();  
    
        $('#nameField, #surnameField, #emailField, #passwordField').hide();

        if (selectedOption === 'name') {
            $('#nameField').show();
        } else if (selectedOption === 'surname') {
            $('#surnameField').show();
        } else if (selectedOption === 'email') {
            $('#emailField').show();
        } else if (selectedOption === 'password') {
            $('#passwordField').show();
        }
    
        $('#editForm').show();
    });
    
    
    $('#editSelectionForm').submit(function(event) {

        const name = $('#floatingName').val().trim();
        const surname = $('#floatingSurname').val().trim();
        const email = $('#floatingEmail').val().trim();
        const password = $('#floatingPassword').val().trim();
    
        if (!name && !surname && !email && !password) {
            event.preventDefault(); 
            return; 
        }
    
        event.preventDefault(); 
        
        $.ajax({
            url: $(this).attr('action'),
            type: 'POST',
            data: $(this).serialize(),
            dataType: 'json',
            success: function(response) {
                if (response.status === 'success') {
                    alert('Data updated successfully.');
                    $('#editSelectionForm')[0].reset();           
                    $('#editForm').hide();
                } else if (response.status === 'error') {
                    handleErrors(response.errors);
                }
            },
            error: function() {
                alert('An error occurred. Please try again.');
            }
        });
    });
    
    
    $('a[href="/budget-app-mvc/public/index.php?action=balance"]').on('click', function(e) {
        e.preventDefault(); 
    
        $.ajax({
            url: '/budget-app-mvc/public/index.php?action=balance',
            type: 'GET',
            success: function(response) {
                try {
                    const jsonResponse = JSON.parse(response);
                    if (jsonResponse.status === 'error') {
                        $('#loginRequiredModal').modal('show');
                        $('#loginRequiredModal').on('hidden.bs.modal', function() {
                            window.location.href = '/budget-app-mvc/public/index.php?action=signin';
                        });
                    } else {
                        window.location.href = '/budget-app-mvc/public/index.php?action=balance';
                    }
                } catch (e) {
                    window.location.href = '/budget-app-mvc/public/index.php?action=balance';
                }
            },
            error: function() {
                alert('An error occurred. Please try again.');
            }
        });
    });
    
    $('#period').on('change', function() {
        $('#balance-info').addClass('d-none');
        $('#details-section').addClass('d-none');
    
        if ($(this).val() === 'custom') {
            $('#custom-date-range').removeClass('d-none');
        } else {
            $('#custom-date-range').addClass('d-none');
            $('#startDate').val('');
            $('#endDate').val('');
            $('#startDateError').addClass('d-none');
            $('#endDateError').addClass('d-none');
        }
    });
    
    $('#startDate, #endDate, #amount, #date').on('change', function() {
        const startDate = $('#startDate').val();
        const endDate = $('#endDate').val();
        const amount = $('#amount').val();
        const date = $('#date').val();
        
        if (startDate) {
            $('#startDateError').addClass('d-none'); 
            $('#startDate').removeClass('error');
        }

        if (endDate) {
            $('#endDateError').addClass('d-none');
            $('#endDate').removeClass('error');  
        }

        if (amount) {
            $('#amountError').addClass('d-none');
            $('#amount').removeClass('error');  
        }

        if (date) {
            $('#dateError').addClass('d-none'); 
            $('#date').removeClass('error');  
        }
    });

    $('#balance-form').on('submit', function(e) {
        e.preventDefault();
    
        const period = $('#period').val();
        const startDate = $('#startDate').val();
        const endDate = $('#endDate').val();
        let hasError = false;
    
        if (period === 'custom') {
            if (!startDate) {
                $('#startDateError').removeClass('d-none');
                hasError = true;
            }
    
            if (!endDate) {
                $('#endDateError').removeClass('d-none');
                hasError = true;
            }
    
            if (hasError) {
                return;
            }
        }
    
        $.ajax({
            type: 'POST',
            url: '/budget-app-mvc/public/index.php?action=balance',
            data: {
                period: period,
                startDate: startDate,
                endDate: endDate
            },
            success: function(response) {
                const balanceData = JSON.parse(response);
                if (balanceData.error) {
                    alert('Error: ' + balanceData.error);
                } else {
                    $('#balance').text('Balance: ' + balanceData.balance + ' PLN');
                    $('#total-income').text('Total Income: ' + balanceData.income + ' PLN');
                    $('#total-expense').text('Total Expense: ' + balanceData.expense + ' PLN');
                    $('#balance-info').removeClass('d-none');
                }
            },
            error: function() {
                alert('An error occurred. Please try again.');
            }
        });
    });

    $('#clear-income-button').click(function() {
        $('#addIncomeForm')[0].reset(); 
        clearErrors(); 
    });

    $('#clear-expense-button').click(function() {
        $('#addExpenseForm')[0].reset(); 
        clearErrors(); 
    });
    
    $('#deleteAccountBtn').on('click', function() {
        $('#deleteAccountModal').modal('show');
    });
    
    $('#confirmDeleteBtn').on('click', function() {
        $.ajax({
            url: '/budget-app-mvc/public/index.php?action=deleteUser',
            type: 'POST',
            success: function(response) {
                const jsonResponse = JSON.parse(response);
                if (jsonResponse.status === 'success') {
                    alert('Account deleted successfully.');
                    window.location.href = '/budget-app-mvc/public/index.php';
                } else {
                    alert('Failed to delete account. Please try again.');
                }
            },
            error: function() {
                alert('An error occurred. Please try again.');
            }
        });
        $('#deleteAccountModal').modal('hide');
    });
    
    $('#addExpenseCategoryBtn').click(function() {
        $('#expenseCategoryModal').modal('show');
    });
    $('#removeExpenseCategoryBtn').click(function() {
        $('#removeExpenseCategoryModal').modal('show');
    });

    $('#addIncomeCategoryBtn').click(function() {
        $('#incomeCategoryModal').modal('show');
    });
    $('#removeIncomeCategoryBtn').click(function() {
        $('#removeIncomeCategoryModal').modal('show');
    });
    
    $.ajax({
        url: '/budget-app-mvc/public/index.php?action=getExpenseCategories',
        method: 'GET',
        success: function(data) {
            const categories = JSON.parse(data);
            const select = $('#expenseCategorySelect');
            select.empty();
            categories.forEach(category => {
                select.append(new Option(category.name, category.id));
            });
        }
    });

    $.ajax({
        url: '/budget-app-mvc/public/index.php?action=getIncomeCategories',
        method: 'GET',
        success: function(data) {
            const categories = JSON.parse(data);
            const select = $('#incomeCategorySelect');
            select.empty();
            categories.forEach(category => {
                select.append(new Option(category.name, category.id));
            });
        }
    });
    
    $('#addExpenseCategoryForm, #removeExpenseCategoryForm, #addIncomeCategoryForm, #removeIncomeCategoryForm').on('submit', function(event) {
        event.preventDefault();
        const form = $(this);
        $.ajax({
            url: form.attr('action'),
            method: 'POST',
            data: form.serialize(),
            success: function(response) {
                alert(JSON.parse(response).message);
                location.reload();
            }
        });
    });    

    let expenseChart;

    function drawExpenseChart(expenseData) {
    const ctx = document.getElementById('expenseChart').getContext('2d');
    const labels = expenseData.map(item => item.category);
    const data = expenseData.map(item => parseFloat(item.total_amount));

    if (expenseChart) {
        expenseChart.destroy();
    }

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

$('#details-button').click(function() {
    const period = $('#period').val();
    const startDate = $('#startDate').val();
    const endDate = $('#endDate').val();

    $.ajax({
        url: '/budget-app-mvc/public/index.php?action=getDetails',
        type: 'POST',
        data: { period, startDate, endDate },
        success: function(response) {
            let data = JSON.parse(response);

            let incomeDetails = $('#income-details tbody');
            incomeDetails.empty();
            if (data.incomes.length) {
                data.incomes.forEach((income, index) => {
                    incomeDetails.append(
                        `<tr>
                        <td>${index + 1}</td>
                        <td>${income.date_of_income}</td>
                        <td>${income.amount}</td>
                        <td>${income.category}</td>
                        <td>${income.comment}</td>
                    </tr>`
                    );
                });
            } else {
                incomeDetails.append('<tr><td colspan="5">No incomes for the selected period.</td></tr>');
            }

            let expenseDetails = $('#expense-details tbody');
            expenseDetails.empty();
            if (data.expenses.length) {
                data.expenses.forEach((expense, index) => {
                    expenseDetails.append(
                        `<tr>
                        <td>${index + 1}</td>
                        <td>${expense.date_of_expense}</td>
                        <td>${expense.amount}</td>
                        <td>${expense.category}</td>
                        <td>${expense.payment_method}</td>
                        <td>${expense.comment}</td>
                    </tr>`
                    );
                });
            } else {
                expenseDetails.append('<tr><td colspan="6">No expenses for the selected period.</td></tr>');
            }

            $('#details-section').removeClass('d-none');

            $.ajax({
                url: '/budget-app-mvc/public/index.php?action=getExpenseCategoryData',
                type: 'POST',
                data: { period, startDate, endDate },
                success: function(categoryResponse) {
                    let categoryData = JSON.parse(categoryResponse);
                    if (categoryData.length) {
                        drawExpenseChart(categoryData);  
                    } else {
                        $('#expenseChart').replaceWith('<p class="text-center">No expense data available for the selected period.</p>');
                    }
                },
                error: function() {
                    alert('Błąd podczas pobierania danych kategorii wydatków.');
                }
            });
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error('AJAX Error:', textStatus, errorThrown);
            alert('Wystąpił błąd podczas pobierania danych.');
        }
    });
});

$('#clear-button').click(function() {
    $('#balance-form')[0].reset();
    $('#custom-date-range').addClass('d-none');
    $('#balance-info').addClass('d-none');
    $('#details-section').addClass('d-none');

    if (expenseChart) {
        expenseChart.destroy();
    }
});

});