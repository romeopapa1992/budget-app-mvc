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
            const input = $('#${key.charAt(0).toLowerCase() + key.slice(1)}');
            const errorElement = input.siblings('.error-text');
            errorElement.text(errors[key]).show();
            input.addClass('error');
        }
    }

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    $('#floatingName, #floatingSurname, #floatingEmail, #floatingPassword, #signinEmail, #signinPassword').on('input', function() {
        const input = $(this);
        const errorElement = input.siblings('.error-text');
        hideError(input, errorElement);
    });

    function validateAndSubmitForm(form, isLoginForm = false) {
        const inputs = form.find("input");
        let hasError = false;
    
        inputs.each(function() {
            const input = $(this);
            const value = input.val().trim();
            const errorElement = input.siblings(".error-text");
    
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
                    alert(response.message || 'Email already exists.');
                    form[0].reset(); 
                } else {
                    console.log('Unexpected response: ', response);
                }
            }            
        });
    }
    
  
    $('#editOption').change(function() {
        var selectedOption = $(this).val();
    
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

    
    function validateAndSubmitExpenseForm(form) {
        const amount = $('#amount').val().trim();
        const date = $('#date').val().trim();
        const category = $('#category').val().trim();
        const paymentMethod = $('#payment_method').val().trim();
        const comment = $('#comment').val().trim();
        let hasError = false;
    
        if (amount === "" || isNaN(amount)) {
            showError($('#amount'), $('#amountError'));
            hasError = true;
        }
        if (date === "") {
            showError($('#date'), $('#dateError'));
            hasError = true;
        }
        if (category === "") {
            showError($('#category'), $('#categoryError'));
            hasError = true;
        }
        if (paymentMethod === "") {
            showError($('#payment_method'), $('#paymentMethodError'));
            hasError = true;
        }
    
        if (!hasError) {
            $.ajax({
                url: '/budget-app-mvc/public/index.php?action=expense',
                type: 'POST',
                data: form.serialize(),
                dataType: 'json',
                success: function(response) {
                    if (response.status === 'success') {
                        handleSuccessResponse(form);
                    } else {
                        alert(response.message);
                    }
                },
                error: function() {
                    alert('An error occurred. Please try again.');
                }
            });
        }
    }   
    
    $('#period').on('change', function() {
        if ($(this).val() === 'custom') {
            $('#custom-date-range').removeClass('d-none');
        } else {
            $('#custom-date-range').addClass('d-none');
            $('#startDateError').addClass('d-none');
            $('#endDateError').addClass('d-none');
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
            } else {
                $('#startDateError').addClass('d-none');
            }
    
            if (!endDate) {
                $('#endDateError').removeClass('d-none');
                hasError = true;
            } else {
                $('#endDateError').addClass('d-none');
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
    
    $('#clear-button').on('click', function() {
        $('#balance-form')[0].reset();
        $('#balance-info').addClass('d-none');
    });
    
    $('#clear-income-button').on('click', function() {
        $('#income-form')[0].reset();
    });
    
    $('#clear-expense-button').on('click', function() {
        $('#expense-form')[0].reset();
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

    $('#details-button').click(function() {

    let period = $('#period').val();
    let startDate = $('#startDate').val();
    let endDate = $('#endDate').val();

    // Sprawdzenie, czy dla niestandardowego okresu wprowadzono daty
    if (period === 'custom' && (!startDate || !endDate)) {
        alert('Proszę wprowadzić zarówno datę początkową, jak i końcową dla niestandardowego okresu.');
        return;
    }

        $.ajax({
            url: '/budget-app-mvc/public/index.php?action=getDetails',
            type: 'POST',
            data: {
                period: $('#period').val(),
                start_date: $('#startDate').val(),
                end_date: $('#endDate').val()
            },
            success: function(response) {
                console.log(response);
                try {
                    let data = JSON.parse(response);

                    if (data.error) {
                        console.error('Błąd z serwera:', data.error);
                        alert('Błąd: ' + data.error);
                        return;
                    }

                    // Wypełnianie tabeli przychodów
                    let incomeDetails = $('#income-details tbody');
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
                        incomeDetails.append('<tr><td colspan="5">Brak przychodów dla wybranego okresu.</td></tr>');
                    }

                    // Wypełnianie tabeli wydatków
                    let expenseDetails = $('#expense-details tbody');
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
                        expenseDetails.append('<tr><td colspan="6">Brak wydatków dla wybranego okresu.</td></tr>');
                    }

                    $('#details-section').removeClass('d-none');
                } catch (error) {
                    console.error('Błąd przetwarzania odpowiedzi:', error);
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.error('AJAX Error:', textStatus, errorThrown);
                alert('Wystąpił błąd podczas pobierania danych.');
            }
        });
    });

    $('#period').on('change', function() {
        if ($(this).val() === 'custom') {
            $('#custom-date-range').removeClass('d-none');
        } else {
            $('#custom-date-range').addClass('d-none');
        }
    });

    $('#balance-form').submit(function(e) {
        e.preventDefault();
        // Można dodać tutaj AJAX do wyświetlenia salda, 
        // lub pozwolić na standardowe przesłanie formularza
    });

    $('#clear-button').click(function() {
        $('#balance-form')[0].reset();
        $('#custom-date-range').addClass('d-none');
        $('#balance-info').addClass('d-none');
        $('#details-section').addClass('d-none');
    });
    
});
