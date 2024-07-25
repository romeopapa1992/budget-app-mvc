<?php
require_once '../app/controllers/ExpenseController.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    session_start();
    if (!isset($_SESSION['user_id'])) {
        header('Location: signin.php');
        exit();
    }

    $controller = new ExpenseController();
    $controller->add();
} else {
    require_once '../app/views/home/expense.php';
}
?>
