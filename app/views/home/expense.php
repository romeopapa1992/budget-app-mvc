<?php require_once '../app/views/layout/header.php'; ?>
<?php require_once '../app/views/components/navbar.php'; ?>

<h1>Add Expense</h1>
<form action="expense.php" method="POST" id="expenseForm">
    <label for="amount">Amount:</label>
    <input type="text" name="amount" id="amount" required>
    <br>
    <label for="date">Date:</label>
    <input type="date" name="date" id="date" required>
    <br>
    <label for="category">Category:</label>
    <input type="text" name="category" id="category" required>
    <br>
    <label for="payment_method">Payment Method:</label>
    <input type="text" name="payment_method" id="payment_method" required>
    <br>
    <label for="comment">Comment:</label>
    <input type="text" name="comment" id="comment">
    <br>
    <button type="submit">Add Expense</button>
</form>

<div id="expenseMessage"></div>

<script src="../app/views/assets/js/expense.js"></script>

<?php require_once '../app/views/layout/footer.php'; ?>
