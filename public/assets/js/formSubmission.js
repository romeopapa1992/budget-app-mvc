import { hideError, showError, handleErrors } from './errors.js';

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
