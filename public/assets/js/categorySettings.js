import { handleErrors } from './errors.js';

$(document).ready(function () {

    let today = new Date().toISOString().split('T')[0];
    $("#floatingDate").val(today);

    $("#expenseCategorySelect, #incomeCategorySelect, #limitCategorySelect").removeClass("form-control").addClass("form-select");

    function updateCategories(url, selectId) {
        $.ajax({
            url: url,
            method: 'GET',
            success: function (data) {
                try {
                    const categories = JSON.parse(data);
                            
                    const select = $(selectId);
                    select.find("option:not(:first)").remove();

                    categories.forEach(category => {
                        select.append(new Option(category.name, category.id));
                    });
                    } catch (error) {
                    console.error("Error parsing JSON:", error);
                    }
                }
            });
        }

    const loadExpenseCategories = async (selectors) => {
        try {
            const response = await fetch("/getExpenseCategories");
            if (!response.ok) throw new Error("Network response was not ok");
            const categories = await response.json();
                    
            selectors.forEach(selector => {
                const categorySelect = document.querySelector(selector);
                if (!categorySelect) {
                    return; 
                }
                        
                categories.forEach(category => {
                    categorySelect.append(new Option(category.name, category.id));
                });
            });
        } catch (error) {
            console.error("Error fetching expense categories:", error);
        }
    };                    

    updateCategories('/getIncomeCategories', '#incomeCategorySelect');
    loadExpenseCategories(["#expenseCategorySelect", "#limitCategorySelect"]);

    function refreshForms() {
        updateCategories('/getIncomeCategories', '#incomeCategorySelect');
        loadExpenseCategories(["#expenseCategorySelect", "#limitCategorySelect"]);
    }

    $('#addExpenseCategoryForm, #removeExpenseCategoryForm, #addIncomeCategoryForm, #removeIncomeCategoryForm').submit(function (event) {
        event.preventDefault();
        const form = $(this);
            
        if (form.attr('id') === 'removeExpenseCategoryForm' || form.attr('id') === 'removeIncomeCategoryForm') {
            const categorySelect = form.find('select'); 
            const errorText = categorySelect.siblings('.error-text');
            
            categorySelect.removeClass('error');
            errorText.hide(); 
            
            if (!categorySelect.val()) {
                categorySelect.addClass('error');
                errorText.show();
                return;
            }
        }
            
        $.ajax({
            url: form.attr('action'),
            method: 'POST',
            data: form.serialize(),
            success: function (response) {
                try {
                    const res = JSON.parse(response);
                    alert(res.message);
                    form.trigger("reset");
                    refreshForms();
                } catch (error) {
                    console.error("Error parsing response JSON:", error);
                }
            }
        });
    });    


    const resetUserEditForm = () => {
        $('#editSelectionForm')[0].reset();  
        $('#editForm').hide();  
        $('.error-text').hide();  
        $('input, select').removeClass('error');  
    };
            
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
                    resetUserEditForm(); 
                } else {
                    handleErrors(response.errors);
                }
            },
            error: function () {
                alert('An error occurred. Please try again.');
            }
        });
    }); 
});
