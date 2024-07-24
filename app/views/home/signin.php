<?php require_once '../app/views/layout/header.php'; ?>

<form action="signin.php" method="POST" id="signinForm">
    <label for="email">Email:</label>
    <input type="email" name="email" id="email" required>
    <br>
    <label for="password">Password:</label>
    <input type="password" name="password" id="password" required>
    <br>
    <button type="submit">Sign In</button>
</form>

<div id="signinMessage"></div>

<script src="../app/views/assets/js/signin.js"></script>

<?php require_once '../app/views/layout/footer.php'; ?>
