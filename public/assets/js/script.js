$(document).ready(function() {
    const toggleFieldVisibility = (selector, condition) => $(selector).toggle(condition);
    const clearForm = (form) => form[0].reset();
    const toggleErrors = (input, errorElement, show) => {
        input.toggleClass("error", show);
        errorElement.toggle(show);
    };

    $("form").not("#addExpenseCategoryForm, #removeExpenseCategoryForm, #addIncomeCategoryForm, #removeIncomeCategoryForm")
        .submit(function(event) {
            event.preventDefault();
            const form = $(this);
            validateAndSubmitForm(form, form.attr('action').includes('signin'));
        });

    function handleErrors(errors) {
        $('.error-text').hide();
        $('input').removeClass('error');
        Object.keys(errors).forEach(key => {
            const input = $(`#floating${capitalizeFirstLetter(key)}`);
            toggleErrors(input, input.siblings('.error-text').text(errors[key]), true);
        });
    }

    $('input').on('input', function() {
        toggleErrors($(this), $(this).siblings(".error-text"), false);
    });

    function validateAndSubmitForm(form, isLoginForm = false) {
        let hasError = false;
        let allFieldsEmpty = true;
        form.find("input").each(function() {
            const input = $(this), value = input.val().trim();
            allFieldsEmpty = allFieldsEmpty && !value;
            toggleErrors(input, input.siblings(".error-text"), !value);
            hasError = hasError || !value;
        });
        if (!hasError) submitForm(form, isLoginForm);
    }

    function submitForm(form, isLoginForm) {
        $.ajax({
            url: form.attr('action'),
            type: 'POST',
            data: form.serialize(),
            dataType: 'json',
            success: (response) => {
                if (response.status === 'success') {
                    alert(response.message);
                    clearForm(form);
                    window.location.href = isLoginForm
                        ? '/budget-app-mvc/public/index.php?action=balance'
                        : '/budget-app-mvc/public/index.php?action=signin';
                } else handleErrors(response.errors || {});
            },
            error: () => alert('An error occurred. Please try again.')
        });
    }

    $('#editOption').change(function() {
        const fieldMap = {
            name: '#nameField',
            surname: '#surnameField',
            email: '#emailField',
            password: '#passwordField'
        };
        $('#editSelectionForm')[0].reset();
        clearErrors();
        Object.values(fieldMap).forEach(field => $(field).hide());
        toggleFieldVisibility(fieldMap[$(this).val()], true);
        $('#editForm').show();
    });

    $('#editSelectionForm').submit(function(event) {
        event.preventDefault();
        $.ajax({
            url: $(this).attr('action'),
            type: 'POST',
            data: $(this).serialize(),
            dataType: 'json',
            success: (response) => {
                if (response.status === 'success') {
                    alert('Data updated successfully.');
                    clearForm($('#editSelectionForm'));
                    $('#editForm').hide();
                } else handleErrors(response.errors || {});
            },
            error: () => alert('An error occurred. Please try again.')
        });
    });

    $('#clear-income-button, #clear-expense-button').click(function() {
        clearForm($(this).closest('form'));
        clearErrors();
    });

    $('#deleteAccountBtn').on('click', () => $('#deleteAccountModal').modal('show'));

    $('#confirmDeleteBtn').on('click', function() {
        $.ajax({
            url: '/budget-app-mvc/public/index.php?action=deleteUser',
            type: 'POST',
            success: (response) => {
                const jsonResponse = JSON.parse(response);
                alert(jsonResponse.status === 'success' ? 'Account deleted successfully.' : 'Failed to delete account.');
                if (jsonResponse.status === 'success') window.location.href = '/budget-app-mvc/public/index.php';
            },
            error: () => alert('An error occurred. Please try again.')
        });
        $('#deleteAccountModal').modal('hide');
    });

    $('#addExpenseCategoryBtn, #removeExpenseCategoryBtn, #addIncomeCategoryBtn, #removeIncomeCategoryBtn').click(function() {
        $($(this).data('target')).modal('show');
    });

    $('#period').change(function() {
        $('#balance-info, #details-section').addClass('d-none');
        toggleFieldVisibility('#custom-date-range', $(this).val() === 'custom');
        $('#startDate, #endDate').val('');
        $('.date-error').addClass('d-none');
    });

    $('#balance-form').on('submit', function(e) {
        e.preventDefault();
        const period = $('#period').val(), startDate = $('#startDate').val(), endDate = $('#endDate').val();
        if (period === 'custom' && (!startDate || !endDate)) {
            $('.date-error').toggleClass('d-none', !!startDate && !!endDate);
            return;
        }
        $.ajax({
            type: 'POST',
            url: '/budget-app-mvc/public/index.php?action=balance',
            data: { period, startDate, endDate },
            success: (response) => {
                const balanceData = JSON.parse(response);
                if (balanceData.error) alert(`Error: ${balanceData.error}`);
                else {
                    $('#balance').text(`Balance: ${balanceData.balance} PLN`);
                    $('#total-income').text(`Total Income: ${balanceData.income} PLN`);
                    $('#total-expense').text(`Total Expense: ${balanceData.expense} PLN`);
                    $('#balance-info').removeClass('d-none');
                }
            },
            error: () => alert('An error occurred. Please try again.')
        });
    });

    $('#clear-button').click(function() {
        clearForm($('#balance-form'));
        $('#custom-date-range, #balance-info, #details-section').addClass('d-none');
    });

    ['Expense', 'Income'].forEach(type => {
        $.ajax({
            url: `/budget-app-mvc/public/index.php?action=get${type}Categories`,
            method: 'GET',
            success: (data) => {
                const select = $(`#${type.toLowerCase()}CategorySelect`).empty();
                JSON.parse(data).forEach(category => select.append(new Option(category.name, category.id)));
            }
        });
    });

    $('#addExpenseCategoryForm, #removeExpenseCategoryForm, #addIncomeCategoryForm, #removeIncomeCategoryForm').on('submit', function(event) {
        event.preventDefault();
        $.ajax({
            url: $(this).attr('action'),
            method: 'POST',
            data: $(this).serialize(),
            success: (response) => {
                alert(JSON.parse(response).message);
                location.reload();
            }
        });
    });

    let expenseChart;
    function drawExpenseChart(expenseData) {
        const ctx = document.getElementById('expenseChart').getContext('2d');
        if (expenseChart) expenseChart.destroy();
        expenseChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: expenseData.map(item => item.category),
                datasets: [{
                    data: expenseData.map(item => parseFloat(item.total_amount)),
                    backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#8A89A6', '#98ABC5', '#8C564B', '#E377C2', '#7F7F7F', '#BCBD22', '#17BECF']
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { position: 'top', labels: { color: 'white' } },
                    tooltip: { callbacks: { label: (context) => `${context.label}: ${context.raw} PLN` } }
                }
            }
        });
    }

    $('#view-button').click(function() {
        const period = $('#period').val(), startDate = $('#startDate').val(), endDate = $('#endDate').val();
        $.ajax({
            url: '/budget-app-mvc/public/index.php?action=getDetails',
            type: 'POST',
            data: { period, startDate, endDate },
            success: (response) => {
                const data = JSON.parse(response), incomeDetails = $('#income-details tbody').empty(), expenseDetails = $('#expense-details tbody').empty();
                if (data.incomes.length) data.incomes.forEach((income, index) => incomeDetails.append(
                    `<tr><td>${index + 1}</td><td>${income.date_of_income}</td><td>${income.amount}</td><td>${income.category}</td><td>${income.comment}</td></tr>`
                ));
                else incomeDetails.append('<tr><td colspan="5">No incomes for the selected period.</td></tr>');
                if (data.expenses.length) data.expenses.forEach((expense, index) => expenseDetails.append(
                    `<tr><td>${index + 1}</td><td>${expense.date_of_expense}</td><td>${expense.amount}</td><td>${expense.category}</td><td>${expense.comment}</td></tr>`
                ));
                else expenseDetails.append('<tr><td colspan="5">No expenses for the selected period.</td></tr>');
                $('#details-section').removeClass('d-none');
                drawExpenseChart(data.expenseSummary);
            }
        });
    });
});
