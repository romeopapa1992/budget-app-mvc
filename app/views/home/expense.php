<?php require_once '../app/views/layout/header.php'; ?>

<!DOCTYPE html>
<html lang="en" class="h-100">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Home</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
  <link rel="stylesheet" href="./home.css">
</head>

<body class="d-flex h-100 text-center">
  <div class="cover-container d-flex w-100 h-100 p-3 mx-auto flex-column">
    <nav class="navbar navbar-expand-lg navbar-light bg-none mb-auto">
      <div class="container-fluid">
        <a class="btn btn-lg btn-secondary custom-btn" href="./index.html">Home</a>
        <button id="navbar-toggler" class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav"
          aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <div class="navbar-nav ms-auto">
            <a class="btn btn-lg btn-secondary custom-btn" href="incomes.html">Incomes</a>
            <a class="btn btn-lg btn-secondary custom-btn" href="balance.html">Balance</a>
            <a class="btn btn-lg btn-secondary custom-btn" href="logout.php">Log out</a>
          </div>
        </div>
      </div>
    </nav>

    <main class="form-signin m-auto">
      <form class="p-3 mx-2" action="expenses.php" method="post">
        <h1 class="h3 mb-3 fw-bold">Enter expense data</h1>
        <div class="form-floating my-2">
          <input type="text" class="form-control" id="amount" placeholder="$$$" name="amount">
          <label for="amount">Amount in PLN</label>
          <p class="error-text" id="amountError">Amount cannot be empty.</p>
        </div>
        <div class="form-floating my-2">
          <input type="date" class="form-control" id="date" name="date">
          <label for="date">Date</label>
          <p class="error-text" id="dateError">Select the date.</p>
        </div>
        <div class="form-floating my-2">
          <select class="form-select" id="category" aria-label="Select Category" name="category">
            <option value="food">Food</option>
            <option value="fuel">Fuel</option>
            <option value="city-transport">City Transport</option>
            <option value="taxi">Taxi</option>
            <option value="fun">Fun</option>
            <option value="health">Health</option>
            <option value="clothes">Clothes</option>
            <option value="hygiene">Hygiene</option>
            <option value="kids">Kids</option>
            <option value="recreation">Recreation</option>
            <option value="travel">Travel</option>
            <option value="savings">Savings</option>
            <option value="for-pension">For pension</option>
            <option value="debt-repayment">Debt repayment</option>
            <option value="presents">Presents</option>
            <option value="another">Another</option>
          </select>
          <label for="category">Expense Category</label>
          <p class="error-text" id="categoryError">Select the category.</p>
        </div>
        <div class="form-floating my-2">
          <select class="form-select" id="payment_method" aria-label="Select Payment Method" name="payment_method">
            <option value="debit_card">Debit Card</option>
            <option value="cash">Cash</option>
            <option value="credit_card">Credit Card</option>
          </select>
          <label for="payment_method">Payment Method</label>
          <p class="error-text" id="paymentMethodError">Select the payment method.</p>
        </div>
        <div class="form-floating my-2">
          <textarea class="form-control" placeholder="Leave a comment here" id="comment" name="comment"></textarea>
          <label for="comment">Comment</label>
        </div>
        <div class="buttons d-flex justify-content-between ">
          <button class="btn btn-secondary btn-lg custom-btn py-2" type="submit">Add</button>
          <button class="btn btn-secondary btn-lg custom-btn py-2" type="button" id="clear-expense-button">Clear</button> 
        </div>
      </form>
    </main>
  </div>

  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
  <script src="script.js"></script>

</body>
</html>
