<?php require_once '../app/views/layout/header.php'; ?>
<?php require_once '../app/views/components/navbar.php'; ?>

<h1>Add Income</h1>
<form action="income.php" method="POST" id="incomeForm">
    <label for="amount">Amount:</label>
    <input type="text" name="amount" id="amount" required>
    <br>
    <label for="date">Date:</label>
    <input type="date" name="date" id="date" required>
    <br>
    <label for="category">Category:</label>
    <input type="text" name="category" id="category" required>
    <br>
    <label for="comment">Comment:</label>
    <input type="text" name="comment" id="comment">
    <br>
    <button type="submit">Add Income</button>
</form>

<div id="incomeMessage"></div>

<script src="../app/views/assets/js/income.js"></script>

<?php require_once '../app/views/layout/footer.php'; ?>
