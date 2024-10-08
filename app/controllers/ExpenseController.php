<?php

namespace App\Controllers;

use App\Models\Expense;
use Core\View;

class ExpenseController
{
    private $expenseModel;

public function __construct($db)
    {
        $this->expenseModel = new Expense($db);
    }

    public function addExpense()
{
    if ($_SERVER['REQUEST_METHOD'] == 'POST') {
        
        $userId = $_SESSION['user_id'];
        $amount = trim($_POST['amount']);
        $dateOfExpense = trim($_POST['date']);
        $category = trim($_POST['category']);
        $paymentMethod = trim($_POST['payment_method']);
        $comment = ucfirst(strtolower(trim($_POST['comment'])));

        $errors = [];

        if (empty($amount)) {
            $errors['amount'] = 'Amount cannot be empty.';
        } elseif (!is_numeric($amount)) {
            $errors['amount'] = 'Amount must be a valid number.';
        }

        if (!empty($errors)) {
            echo json_encode(['status' => 'error', 'errors' => $errors]);
            return;
        }

        if ($this->expenseModel->addExpense($userId, $amount, $dateOfExpense, $category, $paymentMethod, $comment)) {
            echo json_encode(['status' => 'success', 'message' => 'Expense has been added successfully!']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'An error occurred while adding the expense.']);
        }
    }
}

    public function addExpenseCategory()
    {
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            session_start();
            $userId = $_SESSION['user_id'];
            $categoryName = trim($_POST['newExpenseCategory']);

            if ($this->expenseModel->addExpenseCategory($userId, $categoryName)) {
                echo json_encode(['status' => 'success', 'message' => 'New category has been added successfully!']);
            } else {
                echo json_encode(['status' => 'error', 'message' => 'Category already exists']);
            }
        }
    }

public function removeExpenseCategory()
{
    if ($_SERVER['REQUEST_METHOD'] == 'POST') {
        session_start();
        $userId = $_SESSION['user_id'];
        $categoryId = $_POST['expenseCategorySelect'];

        if ($this->expenseModel->removeExpenseCategory($userId, $categoryId)) {
            echo json_encode(['status' => 'success', 'message' => 'Category removed successfully!']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Failed to remove category.']);
        }
    }
}

public function getExpenseCategories()
{
    $categories = $this->expenseModel->getExpenseCategories();
    echo json_encode($categories);
}

    public function showExpensesForm()
    {
        require_once '../App/views/pages/expenses.html';
    }

    public function showExpenseSettingsForm()
    {
        require_once '../App/views/pages/expenseSettings.html';
    }

} 