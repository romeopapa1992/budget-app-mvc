$(document).ready(function() {

    // Obsługa zdarzenia 'submit' dla formularzy
    $("form").submit(function(event) {
        event.preventDefault();
        const form = $(this);
        const action = form.attr('action');

        if (form.attr('action').includes('signin')) {
            validateAndSubmitForm(form, true);  // Walidacja i obsługa formularza logowania
        } else {
            validateAndSubmitForm(form);  // Walidacja i obsługa formularza rejestracji
        }
    });

    function handleErrors(errors) {
        // Wyczyść poprzednie błędy
        $('.error-text').hide();
        $('input').removeClass('error');

        // Wyświetl nowe błędy
        for (let key in errors) {
            const input = $(`#${key.charAt(0).toLowerCase() + key.slice(1)}`);
            const errorElement = input.siblings('.error-text');
            errorElement.text(errors[key]).show();
            input.addClass('error');
        }
    }

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    // Ukrywanie błędów przy wprowadzaniu danych
    $('#floatingName, #floatingSurname, #floatingEmail, #floatingPassword, #signinEmail, #signinPassword').on('input', function() {
        const input = $(this);
        const errorElement = input.siblings('.error-text');
        hideError(input, errorElement);
    });

    // Walidacja i przesyłanie formularza
    function validateAndSubmitForm(form, isLoginForm = false) {
        const inputs = form.find("input");
        let hasError = false;
    
        inputs.each(function() {
          const input = $(this);
          const value = input.val().trim();
          const errorElement = input.siblings(".error-text");
          const inputType = input.attr('type');
    
          if (value === "") {
            showError(input, errorElement);
            hasError = true;
          } else {
            if (!isLoginForm && inputType === 'password' && !validatePassword(value)) {
              showError(input, errorElement);
              hasError = true;
            } else if (inputType === 'email' && !validateEmail(value)) {
              showError(input, errorElement);
              hasError = true;
            } else {
              hideError(input, errorElement);
            }
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
                    if (isLoginForm) {
                        // Teraz przekierowujemy użytkownika
                        window.location.href = '/budget-app-mvc/public/index.php?action=balance';
                    } else {
                        alert('Registration successful! You can now log in.');
                        window.location.href = '/budget-app-mvc/public/index.php?action=signin';
                    }
                } else if (response.status === 'error') {
                    // Obsługa błędów logowania
                    alert(response.message);
                } else {
                    alert(response.message);
                }
            },
            error: function() {
                alert('An error occurred. Please try again.');
            }
        });
    }
    
      function validateAndSubmitIncomeForm(form) {
        const amount = $('#amount').val().trim();
        const date = $('#date').val().trim();
        const category = $('#category').val().trim();
        const comment = $('#comment').val().trim();
        let hasError = false;
    
        // Walidacja formularza...
    
        if (!hasError) {
            $.ajax({
                url: '/budget-app-mvc/public/index.php?controller=User&action=signin',
                type: 'POST',
                data: { amount, date, category, comment },
                dataType: 'json',
                success: function(response) {
                    if (response.status === 'error') {
                        alert(response.message);
                    } else {
                        alert('Income has been added successfully.');
                        form[0].reset();
                    }
                }
            });
        }
    }

    function validateAndSubmitExpenseForm(form) {
        const amount = $('#amount').val().trim();
        const date = $('#date').val().trim();
        const category = $('#category').val().trim();
        const paymentMethod = $('#payment_method').val().trim();
        const comment = $('#comment').val().trim();
        let hasError = false;

        // Walidacja formularza
        if (amount === "" || isNaN(amount)) {
            showError($('#amount'), $('#amount-error'));
            hasError = true;
        }
        if (date === "") {
            showError($('#date'), $('#date-error'));
            hasError = true;
        }
        if (category === "") {
            showError($('#category'), $('#category-error'));
            hasError = true;
        }
        if (paymentMethod === "") {
            showError($('#payment_method'), $('#payment_method-error'));
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
                        alert('Expense has been added successfully.');
                        form[0].reset();
                    } else {
                        alert(response.message);
                    }
                }
            });
        }
    }

    $(document).ready(function() {
        $('#period').on('change', function() {
            if ($(this).val() === 'custom') {
                $('#custom-date-range').removeClass('d-none');
            } else {
                $('#custom-date-range').addClass('d-none');
            }
        });
    
        $('#balance-form').on('submit', function(e) {
            e.preventDefault();
    
            const period = $('#period').val();
            const startDate = $('#startDate').val();
            const endDate = $('#endDate').val();
    
            if (period === 'custom') {
                if (!startDate || !endDate) {
                    if (!startDate) $('#startDateError').removeClass('d-none');
                    if (!endDate) $('#endDateError').removeClass('d-none');
                    return;
                }
            }
    
            $.ajax({
                type: 'POST',
                url: '/budget-app-mvc/public/index.php?controller=BalanceController&action=showBalance',
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
                        $('#balance').text('Balance: ' + balanceData.balance);
                        $('#total-income').text('Total Income: ' + balanceData.income);
                        $('#total-expense').text('Total Expense: ' + balanceData.expense);
                        $('#balance-info').removeClass('d-none');
                    }
                }
            });
        });
    
        $('#clear-button').on('click', function() {
            $('#balance-info').addClass('d-none');
            $('#balance-form')[0].reset();
            $('#custom-date-range').addClass('d-none');
        });
    });
    
     
});
