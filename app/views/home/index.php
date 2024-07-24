<?php require_once '../app/views/layout/header.php'; ?>

<!DOCTYPE html>
<html lang="en" class="h-100">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Home</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
  <link rel="stylesheet" href="../app/views/assets/css/home.css"> 
</head>
<body class="d-flex h-100 text-center">
  <div class="cover-container d-flex w-100 p-3 mx-auto flex-column">
    <nav class="navbar navbar-expand-lg navbar-light bg-none mb-auto">
      <div class="container-fluid">
        <a class="btn btn-lg btn-secondary custom-btn" href="./index.html">Home</a>
        <button id="navbar-toggler" class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <div class="navbar-nav ms-auto">
            <a class="btn btn-lg btn-secondary custom-btn" href="registration.html">Registration</a>
            <a class="btn btn-lg btn-secondary custom-btn" href="signin.html">Sign In</a>
            <a class="btn btn-lg btn-secondary custom-btn" id="balance-link" href="balance.html">Balance</a>
            <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-hidden="true">
              <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                  <div class="modal-header">
                    <h2 class="modal-title" id="exampleModalLongTitle">Please, log in!</h2>
                  </div>
                  <div class="modal-body">
                    <p>You should log in, if you want to review your balance.</p>
                  </div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-lg btn-secondary custom-btn" data-bs-dismiss="modal">Close</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
    <div class="row justify-content-center">
      <main class="inner d-flex justify-content-center align-items-center w-50 flex-column">
        <h1 class="cover-heading fw-bold p-3">Welcome to my budget page</h1>
        <p class="lead mb-4">Let me introduce my budget application. With this tool, you can easily plan and control your incomes and expenses.</p>
        <p class="learn">
          <button type="button" class="btn btn-lg btn-secondary custom-btn" data-bs-toggle="modal" data-bs-target="#learnMoreModal">Learn more</button>
        </p>
        <div class="modal fade" id="learnMoreModal" tabindex="-1" role="dialog" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h2 class="modal-title" id="exampleModalLongTitle">Check my page!</h2>
              </div>
              <div class="modal-body">
                <p>Are you looking for a simple budgeting app? Control and plan your finances with my page!</p>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-lg btn-secondary custom-btn" data-bs-dismiss="modal">Close</button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
    <footer class="mastfoot mt-auto bg-none">
      <div class="down mb-4">
        <span class="badge rounded-pill text-bg-success fw-bold text-body-emphasis">Coded by romeopapa1992</span>
      </div>
    </footer>
  </div>
  <script src="script.js"></script>
</body>
</html>

