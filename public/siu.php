<?php
require_once '../app/controllers/HomeController.php';
require_once '../app/controllers/UserController.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $controller = new UserController();
    $controller->register();
} else {
    $controller = new HomeController();
    $controller->signup();
}
?>
