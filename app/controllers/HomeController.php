<?php

namespace App\Controllers;

class HomeController {
    public function index() {
        require_once '../App/views/pages/startPage.html';
    }

    public function showRegistrationForm()
    {
        require_once '../App/views/pages/registration.html';
    }

    public function showSigninForm()
    {
        require_once '../App/views/pages/signin.html';
    }

    public function balance() {
        require_once '../App/views/pages/balance.html';
    }

    public function showExpensesForm()
    {
        require_once '../App/views/pages/expenses.html';
    }

    public function showIncomeForm()
    {
        require_once '../App/views/pages/income.html';
    }

    public function showExpenseSettingsForm()
    {
        require_once '../App/views/pages/expenseSettings.html';
    }

    public function showIncomeSettingsForm()
    {
        require_once '../App/views/pages/incomeSettings.html';
    }

    public function showUserSettingsForm()
    {
        require_once '../App/views/pages/userSettings.html';
    }

}