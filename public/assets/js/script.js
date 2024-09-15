$(document).ready(function() {

  $("form").submit(function(event) {
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
      const input = $(`#${key.charAt(0).toLowerCase() + key.slice(1)}`);
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
                    window.location.href = '/budget-app-mvc/public/index.php?action=balance';
                } else {
                    if (form.attr('action').includes('income')) {
                        alert('Income has been added successfully.');
                        form[0].reset(); 
                    } else if (form.attr('action').includes('expense')) {
                        alert('Expense has been added successfully.');
                        form[0].reset(); 
                    } else {
                        alert('Registration successful! You can now log in.');
                        window.location.href = '/budget-app-mvc/public/index.php?action=signin';
                    }
                }
            } else if (response.status === 'error') {
                alert(response.message || 'An error occurred. Please try again.');
            } else {
                console.log('Unexpected response: ', response);
            }
        },
        error: function() {
            alert('An error occurred. Please try again.');
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
                
                // Reset the form after successful update
                $('#editSelectionForm')[0].reset();
                
                // Optionally hide the edit form after submission
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

  function validateAndSubmitIncomeForm(form) {
    const amount = $('#amount').val().trim();
    const date = $('#date').val().trim();
    const category = $('#category').val().trim();
    const comment = $('#comment').val().trim();
    let hasError = false;

    if (!hasError) {
        $.ajax({
            url: '/budget-app-mvc/public/index.php?action=income',
            type: 'POST',
            data: form.serialize(),
            dataType: 'json',
            success: function(response) {
              if (response.status === 'success') {
                  alert('Income has been added successfully.');
                  form[0].reset(); 
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
          alert('Expense has been added successfully.');
          form[0].reset();
        } else {
          alert(response.message);
        }
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
                $('#balance').text('Balance: ' + balanceData.balance);
                $('#total-income').text('Total Income: ' + balanceData.income);
                $('#total-expense').text('Total Expense: ' + balanceData.expense);
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
    loadExpenseCategories();
});

// Add expense category
$('#addExpenseCategoryForm').submit(function(event) {
    event.preventDefault();
    $.ajax({
        url: '/budget-app-mvc/public/controllers/expenseController.php',
        type: 'POST',
        data: $(this).serialize() + '&action=addExpenseCategory',
        success: function(response) {
            if (response.status === 'success') {
                alert('Category added successfully');
                $('#expenseCategoryModal').modal('hide');
            }
        }
    });
});

// Remove expense category
$('#removeExpenseCategoryForm').submit(function(event) {
    event.preventDefault();
    $.ajax({
        url: '/budget-app-mvc/public/controllers/expenseController.php',
        type: 'POST',
        data: $(this).serialize() + '&action=removeExpenseCategory',
        success: function(response) {
            if (response.status === 'success') {
                alert('Category removed successfully');
                $('#removeExpenseCategoryModal').modal('hide');
            }
        }
    });
});

// Load expense categories
function loadExpenseCategories() {
    $.ajax({
        url: '/budget-app-mvc/public/controllers/expenseController.php',
        type: 'POST',
        data: {action: 'getExpenseCategories'},
        success: function(response) {
            var select = $('#expenseCategorySelect');
            select.empty();
            response.categories.forEach(function(category) {
                select.append($('<option></option>').val(category.id).text(category.name));
            });
        }
    });
}

$('#addIncomeCategoryBtn').click(function() {
    $('#incomeCategoryModal').modal('show');
});
$('#removeIncomeCategoryBtn').click(function() {
    $('#removeIncomeCategoryModal').modal('show');
    loadIncomeCategories();
});

// Add income category
$('#addIncomeCategoryForm').submit(function(event) {
    event.preventDefault();
    $.ajax({
        url: '/budget-app-mvc/public/controllers/incomeController.php',
        type: 'POST',
        data: $(this).serialize() + '&action=addIncomeCategory',
        success: function(response) {
            if (response.status === 'success') {
                alert('Category added successfully');
                $('#incomeCategoryModal').modal('hide');
            }
        }
    });
});

// Remove income category
$('#removeIncomeCategoryForm').submit(function(event) {
    event.preventDefault();
    $.ajax({
        url: '/budget-app-mvc/public/controllers/incomeController.php',
        type: 'POST',
        data: $(this).serialize() + '&action=removeIncomeCategory',
        success: function(response) {
            if (response.status === 'success') {
                alert('Category removed successfully');
                $('#removeIncomeCategoryModal').modal('hide');
            }
        }
    });
});

// Load income categories
function loadIncomeCategories() {
    $.ajax({
        url: '/budget-app-mvc/public/controllers/incomeController.php',
        type: 'POST',
        data: {action: 'getIncomeCategories'},
        success: function(response) {
            var select = $('#incomeCategorySelect');
            select.empty();
            response.categories.forEach(function(category) {
                select.append($('<option></option>').val(category.id).text(category.name));
            });
        }
    });
}

});
