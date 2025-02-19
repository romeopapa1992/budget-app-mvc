export const handleErrors = (errors) => {
    clearErrors();
    Object.keys(errors).forEach(key => {
        let input = $("#floating" + key.charAt(0).toUpperCase() + key.slice(1));

        if (!input.length) {
            input = $("#" + key); 
        }

        const errorElement = input.siblings('.error-text');

        if (errorElement.length && errors[key] !== "This field cannot be empty.") {
            errorElement.text(errors[key]).show();
        }

        if (!input.closest("#editSelectionForm").length || !input.is("select")) {
            input.addClass('error');
        }

        if (key === 'general') {
            $("#signin-error").text(errors[key]).show();
        }
        
    });
};

export const clearErrors = () => {
    $('.error-text').hide();
    $('input, select').removeClass('error');
};

export const showError = (input, errorElement) => {
    if (!input.is("select") || !input.closest("#editSelectionForm").length) {
        input.addClass("error");
    }
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

$("select").on("change", function () {
    hideError($(this), $(this).siblings(".error-text"));
});
