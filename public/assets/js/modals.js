import { clearErrors } from './errors.js';

const setupModalForm = (buttonId, modalId) => $(buttonId).click(() => $(modalId).modal('show'));
setupModalForm('#deleteAccountBtn', '#deleteAccountModal');
setupModalForm('#addExpenseCategoryBtn', '#expenseCategoryModal');
setupModalForm('#removeExpenseCategoryBtn', '#removeExpenseCategoryModal');
setupModalForm('#addIncomeCategoryBtn', '#incomeCategoryModal');
setupModalForm('#removeIncomeCategoryBtn', '#removeIncomeCategoryModal');

$('#confirmDeleteBtn').click(function () {
    $.ajax({
        url: '/deleteUser',
        type: 'POST',
        success: function (response) {
            if (JSON.parse(response).status === 'success') {
                alert('Account deleted successfully.');
                window.location.href = '/';
            } else {
                alert('Failed to delete account. Please try again.');
            }
        },
        error: function () {
            alert('An error occurred. Please try again.');
        }
    });
    $('#deleteAccountModal').modal('hide');
});

$('#editOption').change(function () {
    const selectedOption = $(this).val();
    $('#editSelectionForm')[0].reset();
    clearErrors();
    $('#editForm').show();

    $('#nameField, #surnameField, #emailField, #passwordField').hide();
    if (selectedOption) $(`#${selectedOption}Field`).show();
});