$(document).ready(function() {

    $("form").submit(function(event) {
        event.preventDefault();
        const form = $(this);
        $.ajax({
            url: form.attr('action'),
            type: 'POST',
            data: form.serialize(),
            dataType: 'json',
            success: function(response) {
                if (response.status === 'success') {
                    window.location.href = 'index.php?action=signin';
                } else {
                    alert(response.message); // lub obsługa błędów na stronie
                }
            }
        });
    });
  
    $('#floatingName, #floatingSurname, #floatingEmail, #floatingPassword, #signinEmail, #signinPassword').on('input', function() {
      const input = $(this);
      const errorElement = input.siblings('.error-text');
      hideError(input, errorElement);
    });
  
    function validateAndSubmitIncomeForm(form) {
      const amount = $('#amount').val().trim();
      const date = $('#date').val().trim();
      const category = $('#category').val().trim();
      const comment = $('#comment').val().trim();
      let hasError = false;
  
      if (!amount) {
        showError($('#amount'), $('#amountError'));
        hasError = true;
      } else {
        hideError($('#amount'), $('#amountError'));
      }
  
      if (!date) {
        showError($('#date'), $('#dateError'));
        hasError = true;
      } else {
        hideError($('#date'), $('#dateError'));
      }
  
      if (!category) {
        showError($('#category'), $('#categoryError'));
        hasError = true;
      } else {
        hideError($('#category'), $('#categoryError'));
      }
  
      if (!hasError) {
        $.ajax({
          url: 'incomes.php',
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
  
      if (!amount) {
        showError($('#amount'), $('#amountError'));
        hasError = true;
      } else {
        hideError($('#amount'), $('#amountError'));
      }
  
      if (!date) {
        showError($('#date'), $('#dateError'));
        hasError = true;
      } else {
        hideError($('#date'), $('#dateError'));
      }
  
      if (!category) {
        showError($('#category'), $('#categoryError'));
        hasError = true;
      } else {
        hideError($('#category'), $('#categoryError'));
      }
  
      if (!paymentMethod) {
        showError($('#payment_method'), $('#paymentMethodError'));
        hasError = true;
      } else {
        hideError($('#payment_method'), $('#paymentMethodError'));
      }
  
      if (!hasError) {
        $.ajax({
          url: 'expenses.php',
          type: 'POST',
          data: { amount, date, category, payment_method: paymentMethod, comment },
          dataType: 'json',
          success: function(response) {
            if (response.status === 'error') {
              alert(response.message);
            } else {
              alert('Expense has been added successfully.');
              form[0].reset();
            }
          }
        });
      }
    }
  
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
              window.location.href = 'balance.html';
            } else {
              alert('Registration successful! You can now log in.');
              window.location.href = 'signin.html';
            }
          } else {
            alert(response.message);
          }
        }
      });
    }
  
    $('#balance-link').on('click', function(event) {
      event.preventDefault();
      checkUserLoggedIn();
    });
  
    function checkUserLoggedIn() {
      $.ajax({
        url: 'checkLoggedIn.php',
        method: 'GET',
        success: function(response) {
          const data = JSON.parse(response);
          if (!data.loggedIn) {
            showLoginModal();
          } else {
            window.location.href = 'balance.html';
          }
        }
      });
    }
  
    function showLoginModal() {
      const myModal = new bootstrap.Modal(document.getElementById('exampleModal'), {
        keyboard: false
      });
      myModal.show();
      $('#exampleModal').on('hidden.bs.modal', function() {
        window.location.href = 'signin.html';
      });
    }
  
    $('#period').change(function() {
      toggleCustomDateRange($(this).val() === 'custom');
      $('#balance-info').addClass('d-none'); 
    });
  
    function toggleCustomDateRange(show) {
      $('#custom-date-range').toggleClass('d-none', !show);
    }
  
    $('#balance-form').submit(function(event) {
      event.preventDefault();
      handleBalanceFormSubmit();
    });
  
    function handleBalanceFormSubmit() {
      const period = $('#period').val();
      const startDate = $('#startDate').val();
      const endDate = $('#endDate').val();
      let hasError = false;
  
      if (period === 'custom') {
        if (!startDate) {
          showError($('#startDate'), $('#startDateError'));
          hasError = true;
        } else {
          hideError($('#startDate'), $('#startDateError'));
        }
  
        if (!endDate) {
          showError($('#endDate'), $('#endDateError'));
          hasError = true;
        } else {
          hideError($('#endDate'), $('#endDateError'));
        }
      }
  
      if (!hasError) {
        $.ajax({
          url: 'balance.php',
          method: 'POST',
          data: { period, startDate, endDate },
          success: function(response) {
            const data = JSON.parse(response);
            if (data.error) {
              alert(data.error);
            } else {
              displayBalanceResult(data);
            }
          },
          error: function(xhr, status, error) {
            console.error('AJAX Error: ', error);
            alert('An error occurred while fetching the balance.');
          }
        });
      }
    }  
  
    function displayBalanceResult(data) {
      $('#balance').html(Balance: ${parseFloat(data.balance).toFixed(2)} PLN);
      $('#total-income').html(Total Income: ${parseFloat(data.income).toFixed(2)} PLN);
      $('#total-expense').html(Total Expense: ${parseFloat(data.expense).toFixed(2)} PLN);
      $('#balance-info').removeClass('d-none');
    }
  
    function clearBalanceForm() {
      $('#balance-form')[0].reset();
      $('#custom-date-range').addClass('d-none');
      $('#balance-info').addClass('d-none');
      hideError($('#startDate'), $('#startDateError'));
      hideError($('#endDate'), $('#endDateError'));
    }
  
    function clearIncomeForm() {
      $('#income-form')[0].reset();
      hideError($('#amount'), $('#amountError'));
      hideError($('#date'), $('#dateError'));
      hideError($('#category'), $('#categoryError'));
    }
  
    function clearExpenseForm() {
      $('#expense-form')[0].reset();
      hideError($('#amount'), $('#amountError'));
      hideError($('#date'), $('#dateError'));
      hideError($('#category'), $('#categoryError'));
      hideError($('#payment_method'), $('#paymentMethodError'));
    }
  
    $('#clear-button').on('click', function() {
      clearBalanceForm();
    });
  
    $('#clear-income-button').on('click', function() {
      clearIncomeForm();
    });
  
    $('#clear-expense-button').on('click', function() {
      clearExpenseForm();
    });
  
    $('#startDate, #endDate').on('input', function() {
      hideError($(this), $(this).siblings('.error-text'));
    });
  
  });
