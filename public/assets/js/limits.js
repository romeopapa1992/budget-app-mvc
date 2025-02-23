let currentMonthYear = new Date().toISOString().slice(0, 7);

$("#limitMonthYear").val(currentMonthYear).change();

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