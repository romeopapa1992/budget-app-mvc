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
        <button id="navbar-toggler" class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <div class="navbar-nav ms-auto">
            <a class="btn btn-lg btn-secondary custom-btn" href="incomes.html">Incomes</a>
            <a class="btn btn-lg btn-secondary custom-btn" href="expenses.html">Expenses</a>
            <a class="btn btn-lg btn-secondary custom-btn" href="logout.php">Log out</a>
          </div>
        </div>
      </div>
    </nav>
    <main class="form-signin m-auto">
      <form class="p-3 mx-2" id="balance-form">
        <h1 class="h3 mb-3 fw-bold">View your balance</h1>
        <div class="form-floating mb-3 my-2">
          <select id="period" class="form-select" aria-label="Balance period">
            <option value="current_month">Current Month</option>
            <option value="previous_month">Previous Month</option>
            <option value="current_year">Current Year</option>
            <option value="custom">Non-standard</option>
          </select>
          <label for="period">Select period</label>
        </div>
        <div class="d-none mb-3" id="custom-date-range">
          <label for="startDate">Start Date:</label>
          <input type="date" class="form-control" id="startDate">
          <p class="error-text" id="startDateError">Select start date for custom period.</p>
          <label for="endDate">End Date:</label>
          <input type="date" class="form-control" id="endDate">
          <p class="error-text" id="endDateError">Select end date for custom period.</p>
        </div>
        <div class="buttons d-flex justify-content-between">
          <button class="btn btn-secondary btn-lg custom-btn py-2" id="view-button" type="submit">View</button>
          <button class="btn btn-secondary btn-lg custom-btn py-2" id="clear-button" type="button">Clear</button>
        </div>
      </form>
      <div class="balance-info d-none p-3 text-start" id="balance-info">
        <h2 class="h3 mb-3 fw-bold">Balance Information</h2>
        <p class="fw-bold" id="balance"></p>
        <p class="fw-bold" id="total-income"></p>
        <p class="fw-bold" id="total-expense"></p>
      </div>
    </main>
  </div>
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
  <script src="https://www.gstatic.com/charts/loader.js"></script>
  <script src="script.js"></script>
</body>
</html>
