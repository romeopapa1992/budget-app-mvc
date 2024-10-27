$(document).ready(function () {
    const clearErrors = () => {
        $('.error-text').hide();
        $('input, select').removeClass('error');
    };

    const showError = (input, errorElement) => {
        input.addClass("error");
        errorElement.show();
    };

    const hideError = (input, errorElement) => {
        input.removeClass("error");
        errorElement.hide();
    };

    const handleErrors = (errors) => {
        clearErrors();
        Object.keys(errors).forEach(key => {
            const input = $(`#floating${key.charAt(0).toUpperCase() + key.slice(1)}`);
            const errorElement = input.siblings('.error-text');
            errorElement.text(errors[key]).show();
            input.addClass('error');
        });
    };  

    const validateAndSubmitForm = (form, isLoginForm = false) => {
        const inputs = form.find("input");
        let hasError = false, allFieldsEmpty = true;

        inputs.each(function () {
            const input = $(this);
            const value = input.val().trim();
            const errorElement = input.siblings(".error-text");

            if (value) allFieldsEmpty = false;

            if (!value) {
                showError(input, errorElement);
                hasError = true;
            } else {
                hideError(input, errorElement);
            }
        });

        if (!hasError) submitForm(form, isLoginForm);
    };

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
                        window.location.href = '/balance';
                    } else if (form.attr('action').includes('registration')) {
                        window.location.href = '/signin';
                    }
                } else if (response.status === 'error') {
                    if (response.errors) {
                        handleErrors(response.errors);
                    } else {
                        alert(response.message || 'An error occurred.');
                    }
                } 
            }
        });
    } 
    
    $('#clear-income-button').click(function() {
        $('#addIncomeForm')[0].reset(); 
        clearErrors(); 
    });

    $('#clear-expense-button').click(function() {
        $('#addExpenseForm')[0].reset(); 
        clearErrors(); 
    });

    $("form").not("#addExpenseCategoryForm, #removeExpenseCategoryForm, #addIncomeCategoryForm, #removeIncomeCategoryForm").submit(function (event) {
        event.preventDefault();
        validateAndSubmitForm($(this), $(this).attr('action').includes('signin'));
    });

    $('input').on('input', function () {
        hideError($(this), $(this).siblings(".error-text"));
    });

    $('#editOption').change(function () {
        const selectedOption = $(this).val();
        $('#editSelectionForm')[0].reset();
        clearErrors();
        $('#editForm').show();

        $('#nameField, #surnameField, #emailField, #passwordField').hide();
        if (selectedOption) $(`#${selectedOption}Field`).show();
    });

    $('#editSelectionForm').submit(function (event) {
        event.preventDefault();
        if (!$(this).find('input').toArray().some(input => $(input).val().trim())) return;

        $.ajax({
            url: $(this).attr('action'),
            type: 'POST',
            data: $(this).serialize(),
            dataType: 'json',
            success: function (response) {
                if (response.status === 'success') {
                    alert('Data updated successfully.');
                    $('#editSelectionForm')[0].reset();
                    $('#editForm').hide();
                } else handleErrors(response.errors);
            },
            error: function () {
                alert('An error occurred. Please try again.');
            }
        });
    });

    $('#period').on('change', function () {
        $('#balance-info, #details-section').addClass('d-none');
        const isCustomPeriod = $(this).val() === 'custom';
        $('#custom-date-range').toggleClass('d-none', !isCustomPeriod);
        if (isCustomPeriod) {
            $('#startDate, #endDate').val('');
            $('#startDateError, #endDateError').addClass('d-none');  
            $('#startDate, #endDate').removeClass('error');  
        }
    });    

    $('#balance-form').on('submit', function (e) {
        e.preventDefault();
        const period = $('#period').val(), startDate = $('#startDate').val(), endDate = $('#endDate').val();

        if (period === 'custom' && (!startDate || !endDate)) {
            if (!startDate) $('#startDateError').removeClass('d-none');
            if (!endDate) $('#endDateError').removeClass('d-none');
            return;
        }

        $.ajax({
            type: 'POST',
            url: '/balance',
            data: { period, startDate, endDate },
            success: function (response) {
                const balanceData = JSON.parse(response);
                if (balanceData.error) {
                    alert('Error: ' + balanceData.error);
                } else {
                    $('#balance').text(`Balance: ${balanceData.balance} PLN`);
                    $('#total-income').text(`Total Income: ${balanceData.income} PLN`);
                    $('#total-expense').text(`Total Expense: ${balanceData.expense} PLN`);
                    $('#balance-info').removeClass('d-none');
                }
            },
            error: function () {
                alert('An error occurred. Please try again.');
            }
        });
    });

    const setupModalForm = (buttonId, modalId) => $(buttonId).click(() => $(modalId).modal('show'));
    setupModalForm('#deleteAccountBtn', '#deleteAccountModal');
    setupModalForm('#addExpenseCategoryBtn', '#expenseCategoryModal');
    setupModalForm('#removeExpenseCategoryBtn', '#removeExpenseCategoryModal');
    setupModalForm('#addIncomeCategoryBtn', '#incomeCategoryModal');
    setupModalForm('#removeIncomeCategoryBtn', '#removeIncomeCategoryModal');

    $('#confirmDeleteBtn').click(function () {
        $.ajax({
            url: '/deleteUser',
            type: 'POST',
            success: function (response) {
                if (JSON.parse(response).status === 'success') {
                    alert('Account deleted successfully.');
                    window.location.href = '/ ';
                } else {
                    alert('Failed to delete account. Please try again.');
                }
            },
            error: function () {
                alert('An error occurred. Please try again.');
            }
        });
        $('#deleteAccountModal').modal('hide');
    });

    const updateCategories = (url, selectId) => {
        $.ajax({
            url: url,
            method: 'GET',
            success: function (data) {
                const categories = JSON.parse(data);
                const select = $(selectId);
                select.empty();
                categories.forEach(category => {
                    select.append(new Option(category.name, category.id));
                });
            }
        });
    };
    updateCategories('/getExpenseCategories', '#expenseCategorySelect');
    updateCategories('/getIncomeCategories', '#incomeCategorySelect');

    $('#addExpenseCategoryForm, #removeExpenseCategoryForm, #addIncomeCategoryForm, #removeIncomeCategoryForm').submit(function (event) {
        event.preventDefault();
        $.ajax({
            url: $(this).attr('action'),
            method: 'POST',
            data: $(this).serialize(),
            success: function (response) {
                alert(JSON.parse(response).message);
                location.reload();
            }
        });
    });

    $('#clear-button').click(function () {
        $('#balance-form')[0].reset();
        $('#custom-date-range, #balance-info, #details-section').addClass('d-none');
    });

    let expenseChart;

    function drawExpenseChart(expenseData) {
        $('#no-expenses-message').addClass('d-none');
    
        if (expenseChart) {
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
                    incomeDetails.append('<tr><td colspan="5">No incomes for the selected period.</td></tr>');
                }
    
                const expenseDetails = $('#expense-details tbody');
                expenseDetails.empty();
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
                    expenseDetails.append('<tr><td colspan="6">No expenses for the selected period.</td></tr>');
                }
    
                $('#details-section').removeClass('d-none');
    
                $.ajax({
                    url: '/getExpenseCategoryData',
                    type: 'POST',
                    data: { period, startDate, endDate },
                    success: function(categoryResponse) {
                        const categoryData = JSON.parse(categoryResponse);
                        if (categoryData.length) {
                            $('#expenseChart').removeClass('d-none');
                            $('#no-expenses-message').addClass('d-none');
                            drawExpenseChart(categoryData);
                        } else {
                            if (expenseChart) expenseChart.destroy();
                            $('#expenseChart').addClass('d-none');
                            $('#no-expenses-message').removeClass('d-none');
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
    
});