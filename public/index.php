<?php

require_once '../vendor/autoload.php';
require_once '../App/Config/database.php';

use App\Controllers\HomeController;
use App\Controllers\UserController;

// Inicjalizacja kontrolerów
$homeController = new HomeController();
$userController = new UserController($db);

// Obsługa routingów
if (isset($_GET['action'])) {
    switch ($_GET['action']) {
        case 'registration':
            if ($_SERVER['REQUEST_METHOD'] === 'POST') {
                $userController->registration();
            } else {
                $userController->showRegistrationForm();
            }
            break;

        case 'signin':
            if ($_SERVER['REQUEST_METHOD'] === 'POST') {
                $userController->signin();
            } else {
                $userController->showSigninForm();
            }
            break;

        case 'balance':
            $homeController->balance();
            break;

        case 'logout':  // Obsługa wylogowania
            $userController->logout();
            break;

        default:
            $homeController->index();
            break;
    }
} else {
    $homeController->index();
}
