<?php

require_once '../vendor/autoload.php';
require_once '../App/Config/database.php';
require_once '../App/Config/Router.php';
require_once '../App/Middleware/AuthMiddleware.php';

use App\Middleware\AuthMiddleware;
use App\Config\Router;
use App\Controllers\{
    HomeController, UserController, IncomeController, ExpenseController, BalanceController
};

$homeController = new HomeController();
$userController = new UserController($db);
$incomeController = new IncomeController($db);
$expenseController = new ExpenseController($db);
$balanceController = new BalanceController($db);
$router = new Router($db);

$router->add('', HomeController::class, 'index');
$router->add('registration', UserController::class, 'registration');
$router->add('signin', UserController::class, 'signin');
$router->add('income', IncomeController::class, 'addIncome', true);
$router->add('expense', ExpenseController::class, 'addExpense', true);
$router->add('balance', BalanceController::class, 'showBalance', true);
$router->add('userSettings', HomeController::class, 'showUserSettingsForm', true);
$router->add('expenseSettings', HomeController::class, 'showExpenseSettingsForm', true);
$router->add('incomeSettings', HomeController::class, 'showIncomeSettingsForm', true);
$router->add('addExpenseCategory', ExpenseController::class, 'addExpenseCategory');
$router->add('removeExpenseCategory', ExpenseController::class, 'removeExpenseCategory');
$router->add('getExpenseCategories', ExpenseController::class, 'getExpenseCategories');
$router->add('addIncomeCategory', IncomeController::class, 'addIncomeCategory');
$router->add('getIncomeCategories', IncomeController::class, 'getIncomeCategories');
$router->add('removeIncomeCategory', IncomeController::class, 'removeIncomeCategory');
$router->add('getDetails', BalanceController::class, 'getDetails');
$router->add('getExpenseCategoryData', BalanceController::class, 'getExpenseCategoryData');
$router->add('updateUser', UserController::class, 'updateUser');
$router->add('deleteUser', UserController::class, 'deleteUser');
$router->add('logout', UserController::class, 'logout');

$path = $_GET['path'] ?? '';

$router->handle($path);