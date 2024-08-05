$(document).ready(function() {

    // Obsługa zdarzenia 'submit' dla formularzy
    $("form").submit(function(event) {
        event.preventDefault();
        const form = $(this);

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
                window.location.href = '/budget-app-mvc/public/index.php?controller=User&action=balance';
              } else {
                alert('Registration successful! You can now log in.');
                window.location.href = '/budget-app-mvc/public/index.php?controller=User&action=signin';
              }
            } else if (response.status === 'error') {
              // Obsługa błędów logowania (przy odpowiedzi z kluczem 'message')
              if (response.message) {
                alert(response.message);
              } else {
                handleErrors(response.errors);
              }
            } else {
              alert(response.message);
            }
          }
        });
      }
    
});
