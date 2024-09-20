<?php

require_once '../vendor/autoload.php';
require_once '../App/Config/database.php';

use App\Controllers\HomeController;
use App\Controllers\UserController;
use App\Controllers\IncomeController;
use App\Controllers\ExpenseController;
use App\Controllers\BalanceController; 

$homeController = new HomeController();
$userController = new UserController($db);
$incomeController = new IncomeController($db);
$expenseController = new ExpenseController($db); 
$balanceController = new BalanceController($db); 

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
            if (session_status() == PHP_SESSION_NONE) {
             session_start();
            }
            if (isset($_SESSION['user_id'])) {

            $balanceController->showBalance();
            } else {
            echo json_encode(['status' => 'error', 'message' => 'You should log in, if you want to review your balance.']);
            }
            break;

        case 'editUser':
            $userController->editUser();
            break;

        case 'expenseSettings':
            $expenseController->showExpenseSettingsForm();
            break;

        case 'addExpenseCategory':
            $expenseController->addExpenseCategory();
            break;

        case 'removeExpenseCategory':
            $expenseController->removeExpenseCategory();
            break;

        case 'getExpenseCategories':
            $expenseController->getExpenseCategories();
            break;

        case 'incomeSettings':
            $incomeController->showIncomeSettingsForm();
            break;

        case 'addIncomeCategory':
            $incomeController->addIncomeCategory();
            break;

        case 'removeIncomeCategory':
            $incomeController->removeIncomeCategory();
            break;

        case 'getIncomeCategories':
            $incomeController->getIncomeCategories();
            break;
        
        case 'userSettings':
            $userController->showUserSettingsForm();
            break;

        case 'updateUser':
            $userController->updateUser();
            break;

        case 'deleteUser':
            $userController->deleteUser();
            break;

        case 'logout':  
            $userController->logout();
            break;

        default:
            $homeController->index();
            break;
    }
} else {
    $homeController->index();
}