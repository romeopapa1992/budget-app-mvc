<?php

require_once '../App/Controllers/HomeController.php';

$controller = new HomeController();

if (isset($_GET['action'])) {
    switch ($_GET['action']) {
        case 'registration':
            $controller->registration();
            break;
        case 'signin':
            $controller->signin();
            break;
        case 'balance':
            $controller->balance();
            break;
        default:
            $controller->index();
            break;
    }
} else {
    $controller->index();
}
