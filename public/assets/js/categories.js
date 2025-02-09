$(document).ready(function () {
    console.log("jQuery loaded:", typeof $ !== 'undefined');

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
                    select.empty(); 
                    select.append('<option value="" disabled selected>Select a category</option>');
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

    updateCategories('/getIncomeCategories', '#incomeCategorySelect');

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
                        categorySelect.empty().append('<option value="" disabled selected>Select a category</option>');
                        categories.forEach(category => {
                            categorySelect.append(`<option value="${category.id}">${category.name}</option>`);
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
    
    loadExpenseCategories(["#expenseCategorySelect", "#limitCategorySelect"]);

    $('#addExpenseCategoryForm, #removeExpenseCategoryForm, #addIncomeCategoryForm, #removeIncomeCategoryForm').submit(function (event) {
        event.preventDefault();
        $.ajax({
            url: $(this).attr('action'),
            method: 'POST',
            data: $(this).serialize(),
            success: function (response) {
                try {
                    const res = JSON.parse(response);
                    alert(res.message);
                    loadExpenseCategories(["#expenseCategorySelect", "#limitCategorySelect"]);
                } catch (error) {
                    console.error("Error parsing response JSON:", error);
                }
            }
        });
    });

    $("#setLimitButton").click(function () {
        const categoryId = $("#limitCategorySelect").val();
        const monthYear = $("#limitMonthYear").val();
        const limit = $("#categoryLimit").val();

        if (!categoryId || !monthYear || !limit) {
            alert("Please fill in all fields.");
            return;
        }

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
              console.log(response); 
              if (typeof response === "string") {
                  response = JSON.parse(response);
              }
              alert(response.message);
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
                    $("#categoryLimitInfo").text("Category required");
                    $("#categorySpentAmount").text("Category required");
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
          
                            if (limit && (spent + amount) > limit) {
                                let exceedAmount = (spent + amount) - limit;
                                $("#limitExceedError").text(`Limit exceeded by ${exceedAmount.toFixed(2)} PLN`).show();
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