export const handleErrors = (errors) => {
    clearErrors();
    Object.keys(errors).forEach(key => {
        const input = $(`#floating${key.charAt(0).toUpperCase() + key.slice(1)}`);
        const errorElement = input.siblings('.error-text');
        errorElement.text(errors[key]).show();
        input.addClass('error');
    });
};

export const clearErrors = () => {
    $('.error-text').hide();
    $('input, select').removeClass('error');
};

export const showError = (input, errorElement) => {
    input.addClass("error");
    errorElement.show();
};

export const hideError = (input, errorElement) => {
    input.removeClass("error");
    errorElement.hide();
};

$('#clear-income-button').click(function() {
    $('#addIncomeForm')[0].reset(); 
    clearErrors(); 
});

$('#clear-expense-button').click(function() {
    $('#addExpenseForm')[0].reset(); 
    clearErrors(); 
});

$('input').on('input', function () {
    hideError($(this), $(this).siblings(".error-text"));
});
