<?php

require_once '../vendor/autoload.php';
require_once '../App/Config/database.php';

use App\Controllers\{
    HomeController, UserController, IncomeController, ExpenseController, BalanceController
};

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
                $homeController->showRegistrationForm();
            }
            break;

         case 'signin':
            if ($_SERVER['REQUEST_METHOD'] === 'POST') {
                $userController->signin();
            } else {
                $homeController->showSigninForm();
            }
            break;

        case 'income': 
            if ($_SERVER['REQUEST_METHOD'] === 'POST') {
                $incomeController->addIncome();
            } else {
                $homeController->showIncomeForm();
            }
            break;

        case 'expense':
            if ($_SERVER['REQUEST_METHOD'] === 'POST') {
                $expenseController->addExpense();
            } else {
                $homeController->showExpenseForm();
            }
            break;

        case 'balance':
            if (session_status() === PHP_SESSION_NONE) {
                session_start();
            } 
            if (isset($_SESSION['user_id'])) {
                $balanceController->showBalance();
            } else {
                echo json_encode(['status' => 'error', 'message' => 'You need to log in to access the page.']);
            }
            break;

        case 'expenseSettings':
            $homeController->showExpenseSettingsForm();
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
            $homeController->showIncomeSettingsForm();
            break;

        case 'addIncomeCategory':
            $incomeController->addIncomeCategory();
            break;
        
        case 'getDetails':
            $balanceController->getDetails();
            break;

        case 'removeIncomeCategory':
            $incomeController->removeIncomeCategory();
            break;

        case 'getIncomeCategories':
            $incomeController->getIncomeCategories();
            break;
        
        case 'userSettings':
            $homeController->showUserSettingsForm();
            break;

        case 'updateUser':
            $userController->updateUser();
            break;
        
        case 'getExpenseCategoryData':
            $balanceController->getExpenseCategoryData();
            break;

        case 'deleteUser':
            $userController->deleteUser();
            break;

        case 'logout':  
            $userController->logout();
            break;
        }
    } else {
    $homeController->index();
}