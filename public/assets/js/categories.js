const updateCategories = (url, selectId) => {
    $.ajax({
        url: url,
        method: 'GET',
        success: function (data) {
            const categories = JSON.parse(data);
            const select = $(selectId);
            select.empty();
            categories.forEach(category => {
                select.append(new Option(category.name, category.id));
            });
        }
    });
};
updateCategories('/getExpenseCategories', '#expenseCategorySelect');
updateCategories('/getIncomeCategories', '#incomeCategorySelect');

$('#addExpenseCategoryForm, #removeExpenseCategoryForm, #addIncomeCategoryForm, #removeIncomeCategoryForm').submit(function (event) {
    event.preventDefault();
    $.ajax({
        url: $(this).attr('action'),
        method: 'POST',
        data: $(this).serialize(),
        success: function (response) {
            alert(JSON.parse(response).message);
            location.reload();
        }
    });
});