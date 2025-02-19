import { hideError, showError, handleErrors } from './errors.js';

const validateAndSubmitForm = (form, isLoginForm = false) => {
    const inputs = form.find("input, select"); 
    let hasError = false, allFieldsEmpty = true;

    inputs.each(function () {
        const input = $(this);
        let value = input.val(); 

        if (value === null) {
            value = "";
        }

        value = value.trim(); 

        const errorElement = input.siblings(".error-text");

        if (value) {
            allFieldsEmpty = false;
            hideError(input, errorElement);
        } else {
            if (!errorElement.text()) {
                errorElement.text("Amount cannot be empty.");
            }
            showError(input, errorElement);
            hasError = true;
        }
    });

    if (!hasError) submitForm(form, isLoginForm);
};

const submitForm = (form, isLoginForm) => {
    $.ajax({
        url: form.attr('action'),
        type: 'POST',
        data: form.serialize(),
        dataType: 'json',
        success: function (response) {
            if (response.status === 'success') {
                alert(response.message);
                form[0].reset();
                $("#categoryLimitInfo").text("");  
                $("#categorySpentAmount").text("");
                if (isLoginForm) {
                    window.location.href = '/balance';
                } else if (form.attr('action').includes('registration')) {
                    window.location.href = '/signin';
                }
            } else if (response.status === 'error') {
                handleErrors(response.errors || { general: response.message });
            }
        },
    });
};

$("form").not("#addExpenseCategoryForm, #removeExpenseCategoryForm, #addIncomeCategoryForm, #removeIncomeCategoryForm").submit(function (event) {
    event.preventDefault();
    validateAndSubmitForm($(this), $(this).attr('action').includes('signin'));
});


