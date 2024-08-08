<?php

require_once '../vendor/autoload.php';
require_once '../App/Config/database.php';

use App\Controllers\HomeController;
use App\Controllers\UserController;
use App\Controllers\IncomeController;
use App\Controllers\ExpenseController;
use App\Controllers\BalanceController; 

// Inicjalizacja kontrolerów
$homeController = new HomeController();
$userController = new UserController($db);
$incomeController = new IncomeController($db);
$expenseController = new ExpenseController($db); 
$balanceController = new BalanceController($db); 


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

        case 'income': 
            if ($_SERVER['REQUEST_METHOD'] === 'POST') {
                $incomeController->income();
            } else {
                $incomeController->showIncomeForm();
            }
            break;

        case 'expense':  
            if ($_SERVER['REQUEST_METHOD'] === 'POST') {
                $expenseController->addExpense();
            } else {
                $expenseController->showExpenseForm();
            }
            break;

        case 'balance':
    //  Sprawdzenie, czy użytkownik jest zalogowany
        if (session_status() == PHP_SESSION_NONE) {
        session_start();
        }
            if (isset($_SESSION['user_id'])) {
            // Wyświetlanie widoku bilansu
            $balanceController->showBalance();
        } else {
            // Jeśli użytkownik nie jest zalogowany, przekierowanie na stronę logowania
            header('Location: /budget-app-mvc/public/index.php?action=signin');
        }
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
