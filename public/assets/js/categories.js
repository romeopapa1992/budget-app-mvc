import { handleErrors } from './errors.js';

$(document).ready(function () {
    console.log("jQuery loaded:", typeof $ !== 'undefined');

    let today = new Date().toISOString().split('T')[0];
    $("#floatingDate").val(today);

    let currentMonthYear = new Date().toISOString().slice(0, 7);
    $("#limitMonthYear").val(currentMonthYear).change();

    $("#expenseCategorySelect, #incomeCategorySelect, #limitCategorySelect").removeClass("form-control").addClass("form-select");

    function updateCategories(url, selectId) {
        console.log("Fetching categories from:", url);
        $.ajax({
            url: url,
            method: 'GET',
            success: function (data) {
                try {
                    const categories = JSON.parse(data);
                    console.log("Received categories:", categories);
                    
                    const select = $(selectId);
                    select.find("option:not(:first)").remove();

                    categories.forEach(category => {
                        select.append(new Option(category.name, category.id));
                    });
                } catch (error) {
                    console.error("Error parsing JSON:", error);
                }
            },
            error: function () {
                console.error("Failed to fetch categories from:", url);
            }
        });
    }

    function loadExpenseCategories(selectors) {
        console.log("Fetching expense categories...");
        $.ajax({
            url: "/getExpenseCategories",
            method: 'GET',
            success: function (response) {
                try {
                    const categories = JSON.parse(response);
                    console.log("Expense categories:", categories);
                    
                    selectors.forEach(selector => {
                        const categorySelect = $(selector);
                        categorySelect.find("option:not(:first)").remove(); 
                        
                        categories.forEach(category => {
                            const option = document.createElement("option"); 
                            option.value = category.id;
                            option.textContent = category.name;
                            categorySelect.append(option); 
                        });
                    });
                } catch (error) {
                    console.error("Error parsing expense categories JSON:", error);
                }
            },
            error: function () {
                console.error("Failed to load expense categories.");
            }
        });
    }    
    updateCategories('/getIncomeCategories', '#incomeCategorySelect');
    loadExpenseCategories(["#expenseCategorySelect", "#limitCategorySelect"]);

    function refreshForms() {
        console.log("Refreshing forms...");
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

    function resetLimitInfo() {
        $("#categoryLimitInfo").text("");
        $("#categorySpentAmount").text("");
        $("#limitExceedError").hide();
    }

    function resetLimitForm() {
        $('#setLimitForm')[0].reset();  
        $('.error-text').hide();  
        $('input, select').removeClass('error');
        $("#limitMonthYear").val(currentMonthYear).change();  
    }

    $("#clear-expense-button").click(function () {
        resetLimitInfo();
        $("#addExpenseForm")[0].reset(); 
    }); 
    
    $('#setLimitButton').click(function () {
        const categoryId = $("#limitCategorySelect").val();
        const monthYear = $("#limitMonthYear").val();
        const limit = $("#categoryLimit").val().trim();
    
        $(".error-text").hide();
        $("input, select").removeClass("error");
    
        let hasError = false;

        if (!categoryId) {
            $("#limitCategorySelect").addClass("error");
            $("#limitCategoryError").show();
            hasError = true;
        }
        if (!monthYear) {
            $("#limitMonthYear").addClass("error");
            $("#limitMonthYearError").show();
            hasError = true;
        }
    
        if (!limit) {
            $("#categoryLimit").addClass("error");
            $("#categoryLimitError").show();
            hasError = true;
        }
    
        if (hasError) return;
    
        const data = { category_id: categoryId, month_year: monthYear, limit_amount: limit };
        console.log("Sending limit data:", data);
    
        $.ajax({
            url: "/setCategoryLimit",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            },
            success: function (response) {
                try {
                    if (typeof response === "string") {
                        response = JSON.parse(response);
                    }
                    alert(response.message);
                    resetLimitForm();
                    refreshForms();
                } catch (error) {
                    console.error("Error parsing response JSON:", error);
                }
            }
        });
    });
        
    $("#limitCategorySelect, #limitMonthYear").change(function () {
        const categoryId = $("#limitCategorySelect").val();
        const monthYear = $("#limitMonthYear").val();
        
        if (categoryId && monthYear) {
            $.ajax({
                url: "/getCategoryLimit",
                method: "POST",
                data: JSON.stringify({ category_id: categoryId, month_year: monthYear }),
                contentType: "application/json",
                success: function (response) {
                    $("#categoryLimit").val(response.limit);
                }
            });
        
        }
    });
        
});
        
        $(document).ready(function () {
            $("#expenseCategorySelect, #floatingDate").change(function () {
                let categoryId = $("#expenseCategorySelect").val();
                let selectedDate = $("#floatingDate").val();
                
                console.log("Selected category ID:", categoryId);
                console.log("Selected date:", selectedDate);
          
                if (!categoryId || !selectedDate) {
                    $("#categoryLimitInfo").text("Category and data required");
                    $("#categorySpentAmount").text("Category and data required");
                    return;
                }
            
                let monthYear = selectedDate.substring(0, 7);
                console.log("Formatted month-year:", monthYear); 
            
                $.ajax({
                    url: "/getCategoryLimitAndSpentAmount",
                    type: "GET",
                    data: { category_id: categoryId, month_year: monthYear },
                    success: function (response) {
                        console.log("API Response for Limit and Spent Amount:", response);
                        let data = JSON.parse(response);
                        $("#categoryLimitInfo").text(`${data.limit} PLN`);
                        $("#categorySpentAmount").text(`${data.spent} PLN`);
        
                    },
                    error: function () {
                        console.log("Error retrieving category limit and spent amount");
                        $("#categoryLimitInfo").text("Error retrieving limit");
                        $("#categorySpentAmount").text("Error retrieving spent amount");
                    }
                });
            });
          });
        
          $(document).ready(function () {
        
            $('#limitMonthYear').closest('.form-floating').hide();
            $('#categoryLimit').closest('.form-floating').hide();
            $('#setLimitButton').hide();
        
            $('#limitCategorySelect').change(function () {
                if ($(this).val()) {
                    $('#limitMonthYear').closest('.form-floating').show();
                } else {
                    $('#limitMonthYear').closest('.form-floating').hide();
                    $('#categoryLimit').closest('.form-floating').hide();
                    $('#setLimitButton').hide();
                }
            });
        
            $('#limitMonthYear').change(function () {
                if ($(this).val()) {
                    $('#categoryLimit').closest('.form-floating').show();
                    $('#setLimitButton').show();
                } else {
                    $('#categoryLimit').closest('.form-floating').hide();
                    $('#setLimitButton').hide();
                }
            });
        });
        
        $(document).ready(function () {
            $("#expenseCategorySelect, #floatingDate, #floatingAmount").on('change keyup', function () {
                let categoryId = $("#expenseCategorySelect").val();
                let selectedDate = $("#floatingDate").val();
                let amount = parseFloat($("#floatingAmount").val());
                let monthYear = selectedDate.substring(0, 7);
          
                if (categoryId && selectedDate && !isNaN(amount)) {
                    $.ajax({
                        url: "/getCategoryLimitAndSpentAmount",
                        type: "GET",
                        data: { category_id: categoryId, month_year: monthYear },
                        success: function (response) {
                            let data = JSON.parse(response);
                            let limit = data.limit;
                            let spent = data.spent;
          
                            if (limit) {
                                let remaining = limit - spent;
                                if (amount > remaining) {
                                    let exceedAmount = amount - remaining;
                                    $("#limitExceedError").text(`Limit exceeded by ${exceedAmount.toFixed(2)} PLN`).show();
                                } else {
                                    $("#limitExceedError").hide();
                                }
                            } else {
                                $("#limitExceedError").hide();
                            }                            
                        }
                    });
                } else {
                    $("#limitExceedError").hide();
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
        