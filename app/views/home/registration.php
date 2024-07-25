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
    <nav class="navbar navbar-expand-lg navbar-light bg-none">
        <div class="container-fluid">
          <a class="btn btn-lg btn-secondary custom-btn" href="./index.html">Home</a>
          <button id="navbar-toggler" class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav"
            aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarNav">
          </div>
        </div>
      </nav>
<main class="form-signin m-auto">
  <form class="p-3 mx-2" action="registration.php" method="post">
    <h1 class="h3 mb-3 fw-bold">Please sign up</h1>
    <div class="form-floating my-2">
        <input type="text" class="form-control" id="floatingName" name="first_name" placeholder="First Name">
        <label for="floatingName">First Name</label>
        <p class="error-text">First name cannot be empty.</p>
        <img src="./resources/icon-error.svg" class="error-icon" alt="icon error">
    </div>
    <div class="form-floating my-2">
        <input type="text" class="form-control" id="floatingSurname" name="last_name" placeholder="Last Name">
        <label for="floatingSurname">Last Name</label>
        <p class="error-text">Last name cannot be empty.</p>
        <img src="./resources/icon-error.svg" class="error-icon" alt="icon error">
    </div>
    <div class="form-floating my-2">
        <input type="email" class="form-control" id="floatingEmail" name="email" placeholder="name@example.com">
        <label for="floatingEmail">Email address</label>
        <p class="error-text">Looks like this is not an email.</p>
        <img src="./resources/icon-error.svg" class="error-icon" alt="icon error">
    </div>
    <div class="form-floating my-2">
        <input type="password" class="form-control" id="floatingPassword" name="password" placeholder="Password">
        <label for="floatingPassword">Password</label>
        <p class="error-text">Passwords must meet complexity requirements.</p>
        <img src="./resources/icon-error.svg" class="error-icon" alt="icon error">
    </div>

    <button class="btn btn-secondary btn-lg custom-btn w-100" type="submit">Sign up</button>
  </form>
</main>
</div>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
<script src="script.js"></script>

</body>

</html>