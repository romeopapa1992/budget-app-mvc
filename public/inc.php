<?php
require_once '../app/controllers/IncomeController.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    session_start();
    if (!isset($_SESSION['user_id'])) {
        header('Location: signin.php');
        exit();
    }

    $controller = new IncomeController();
    $controller->add();
} else {
    require_once '../app/views/home/income.php';
}
?>
