<?php require_once '../app/views/layout/header.php'; ?>

<form action="signup.php" method="POST" id="signupForm">
    <label for="first_name">First Name:</label>
    <input type="text" name="first_name" id="first_name" required>
    <br>
    <label for="last_name">Last Name:</label>
    <input type="text" name="last_name" id="last_name" required>
    <br>
    <label for="email">Email:</label>
    <input type="email" name="email" id="email" required>
    <br>
    <label for="password">Password:</label>
    <input type="password" name="password" id="password" required>
    <br>
    <button type="submit">Sign Up</button>
</form>

<div id="signupMessage"></div>

<script src="../app/views/assets/js/signup.js"></script>

<?php require_once '../app/views/layout/footer.php'; ?>
