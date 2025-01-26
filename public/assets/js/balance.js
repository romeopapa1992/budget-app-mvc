$('#period').on('change', function () {
    $('#balance-info, #details-section').addClass('d-none');
    const isCustomPeriod = $(this).val() === 'custom';
    $('#custom-date-range').toggleClass('d-none', !isCustomPeriod);
    if (isCustomPeriod) {
        $('#startDate, #endDate').val('');
        $('#startDateError, #endDateError').addClass('d-none');  
        $('#startDate, #endDate').removeClass('error');  
    }
});    

$('#balance-form').on('submit', function (e) {
    e.preventDefault();
    const period = $('#period').val(), startDate = $('#startDate').val(), endDate = $('#endDate').val();

    if (period === 'custom' && (!startDate || !endDate)) {
        if (!startDate) $('#startDateError').removeClass('d-none');
        if (!endDate) $('#endDateError').removeClass('d-none');
        return;
    }

    $.ajax({
        type: 'POST',
        url: '/balance',
        data: { period, startDate, endDate },
        success: function (response) {
            const balanceData = JSON.parse(response);
            if (balanceData.error) {
                alert('Error: ' + balanceData.error);
            } else {
                $('#balance').text(`Balance: ${balanceData.balance} PLN`);
                $('#total-income').text(`Total Income: ${balanceData.income} PLN`);
                $('#total-expense').text(`Total Expense: ${balanceData.expense} PLN`);
                $('#balance-info').removeClass('d-none');
            }
        },
        error: function () {
            alert('An error occurred. Please try again.');
        }
    });
});

$('#clear-button').click(function () {
    $('#balance-form')[0].reset();
    $('#custom-date-range, #balance-info, #details-section').addClass('d-none');
});