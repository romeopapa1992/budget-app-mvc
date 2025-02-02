const updateCategories = (url, selectId) => {
  $.ajax({
      url: url,
      method: 'GET',
      success: function (data) {
          const categories = JSON.parse(data);
          const select = $(selectId);
          select.empty(); 
          select.append('<option value="" disabled selected>Select a category</option>');
          categories.forEach(category => {
              select.append(new Option(category.name, category.id));
          });
      }
  });
};
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


$(document).ready(function () {

  function loadExpenseCategories(selectors) {
    $.ajax({
        url: "/getExpenseCategories",
        method: 'GET',
        success: function (response) {
            const categories = JSON.parse(response);
            
            selectors.forEach(selector => {
                const categorySelect = $(selector);
                categorySelect.empty().append('<option value="" disabled selected>Select a category</option>');

                categories.forEach(category => {
                    categorySelect.append(`<option value="${category.id}">${category.name}</option>`);
                });
            });
        },
        error: function () {
            alert("Failed to load expense categories.");
        }
    });
}

$(document).ready(function () {
    loadExpenseCategories(["#expenseCategorySelect", "#limitCategorySelect"]);
});

  $("#setLimitButton").click(function () {
    const categoryId = $("#limitCategorySelect").val();
    const monthYear = $("#limitMonthYear").val();
    const limit = $("#categoryLimit").val();

    if (!categoryId || !monthYear || !limit) {
        alert("Please fill in all fields.");
        return;
    }

    const data = {
        category_id: categoryId,
        month_year: monthYear,
        limit_amount: limit
    };

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
          $("#categoryLimitInfo").val("Category required");
          $("#categorySpentAmount").val("Category required");
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
              $("#categoryLimitInfo").val(data.limit);
              $("#categorySpentAmount").val(data.spent);


          },
          error: function () {
              console.log("Error retrieving category limit and spent amount");
              $("#categoryLimitInfo").val("Error retrieving limit");
              $("#categorySpentAmount").val("Error retrieving spent amount");
          }
      });
  });
});

/*$(document).ready(function () {
  $("#expenseCategorySelect, #floatingDate").change(function () {
      let categoryId = $("#expenseCategorySelect").val();
      let selectedDate = $("#floatingDate").val();
      
      if (!categoryId || !selectedDate) {
          $("#categoryLimitInfo").val("Category required");
          $("#categorySpentAmount").val("Category required");
          return;
      }

      let monthYear = selectedDate.substring(0, 7); // Pobieramy "YYYY-MM"
      
      $.ajax({
          url: "/getCategoryLimitAndSpentAmount",
          type: "GET",
          data: { category_id: categoryId, month_year: monthYear },
          success: function (response) {
              let data = JSON.parse(response);
              $("#categoryLimitInfo").val(data.limit);
              $("#categorySpentAmount").val(data.spent);
          },
          error: function () {
              $("#categoryLimitInfo").val("Error retrieving limit");
              $("#categorySpentAmount").val("Error retrieving spent amount");
          }
      });
  });
});

$(document).ready(function () {
  function updateSpentAmount() {
      let categoryId = $("#expenseCategorySelect").val();
      let date = $("#floatingDate").val();

      if (!categoryId || !date) {
          $("#categorySpentAmount").val("Category required");
          return;
      }

      let monthYear = date.slice(0, 7);

      $.ajax({
          url: "/getSpentAmount",
          type: "GET",
          data: { category_id: categoryId, month_year: monthYear },
          success: function (response) {
              let data = JSON.parse(response);
              $("#categorySpentAmount").val(data.spent_amount + " PLN");
          },
          error: function () {
              $("#categorySpentAmount").val("Error loading data");
          }
      });
  }

  $("#expenseCategorySelect, #floatingDate").change(updateSpentAmount);
});*/

