import { handleErrors } from './errors.js';

        $(document).ready(function () {

            let today = new Date().toISOString().split('T')[0];
            $("#floatingDate").val(today);

            let currentMonthYear = new Date().toISOString().slice(0, 7);
            $("#limitMonthYear").val(currentMonthYear).change();

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
            
            $('#setLimitButton').on("click", async () => {
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
                if (limit === "") {
                    $("#categoryLimit").addClass("error");
                    $("#categoryLimitError").show();
                    hasError = true;
                }
            
                if (hasError) return;
            
                try {
                    const response = await fetch("/setCategoryLimit", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ category_id: categoryId, month_year: monthYear, limit_amount: limit })
                    });
            
                    if (!response.ok) throw new Error("Failed to set limit");
                    const result = await response.json();
                    alert(result.message);
                    resetLimitForm();
                    refreshForms();
                } catch (error) {
                    console.error("Error setting category limit:", error);
                }
            });
            
            $("#limitCategorySelect").on("change", async () => {
                const categoryId = $("#limitCategorySelect").val();
            
                if (categoryId) {
                    $("#limitMonthYear").parent().show();
                    $("#categoryLimit").parent().show();
                    $("#setLimitButton").show();
            
                    const today = new Date();
                    const formattedMonthYear = today.toISOString().slice(0, 7);
                    $("#limitMonthYear").val(formattedMonthYear);
            
                    try {
                        const response = await fetch("/getCategoryLimit", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ category_id: categoryId, month_year: formattedMonthYear }) 
                        });
            
                        if (!response.ok) throw new Error("Failed to fetch limit");
                        const data = await response.json();
                        $("#categoryLimit").val(data.limit || "");
                    } catch (error) {
                        console.error("Error retrieving category limit:", error);
                    }
                }
            });            

            $("#expenseCategorySelect, #floatingDate").change(function () {
                let categoryId = $("#expenseCategorySelect").val();
                let selectedDate = $("#floatingDate").val();
          
                if (!categoryId || !selectedDate) {
                    $("#categoryLimitInfo").text("Category and data required");
                    $("#categorySpentAmount").text("Category and data required");
                    return;
                }
            
                let monthYear = selectedDate.substring(0, 7);
            
                $.ajax({
                    url: "/getCategoryLimitAndSpentAmount",
                    type: "GET",
                    data: { category_id: categoryId, month_year: monthYear },
                    success: function (response) {
                        let data = JSON.parse(response);

                        if (data.limit_not_set) {
                            $("#categoryLimitInfo").text("Limit not set");
                            $("#categorySpentAmount").text("Limit not set");
                        } else {
                            if (!data.limit) {
                                $("#categoryLimitInfo").text("Limit not set");
                            } else {
                                $("#categoryLimitInfo").text(`${data.limit} PLN`);
                            }

                            if (!data.spent) {
                                $("#categorySpentAmount").text("Limit not set");
                            } else {
                                $("#categorySpentAmount").text(`${data.spent} PLN`);
                            }
                         }
                    },
                    error: function () {
                        console.log("Error retrieving category limit and spent amount");
                        $("#categoryLimitInfo").text("Error retrieving limit");
                        $("#categorySpentAmount").text("Error retrieving spent amount");
                    }
                });
            });

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
