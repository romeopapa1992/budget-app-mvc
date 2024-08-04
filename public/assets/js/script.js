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
                if (response.status === 'error') {
                    handleErrors(response.errors);
                } else {
                    alert('Registration successful! You can now log in.');
                    window.location.href = 'signin.html';
                }
            }
        });
    });

    function handleErrors(errors) {
        // Wyczyść poprzednie błędy
        $('.error-text').hide();
        $('input').removeClass('error');

        // Wyświetl nowe błędy
        for (let key in errors) {
            const input = $(`#floating${capitalizeFirstLetter(key)}`);
            const errorElement = input.siblings('.error-text');
            errorElement.text(errors[key]).show();
            input.addClass('error');
        }
    }

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    $('#floatingName, #floatingSurname, #floatingEmail, #floatingPassword').on('input', function() {
        const input = $(this);
        const errorElement = input.siblings('.error-text');
        hideError(input, errorElement);
    });

    function hideError(input, errorElement) {
        input.removeClass('error');
        errorElement.hide();
    }
});
