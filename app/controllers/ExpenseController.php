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
            session_start();
            $userId = $_SESSION['user_id'];
            $amount = trim($_POST['amount']);
            $dateOfExpense = trim($_POST['date']);
            $category = trim($_POST['category']);
            $paymentMethod = trim($_POST['payment_method']);
            $comment = ucfirst(strtolower(trim($_POST['comment'])));

            if ($this->expenseModel->addExpense($userId, $amount, $dateOfExpense, $category, $paymentMethod, $comment)) {
                echo json_encode(['status' => 'success', 'message' => 'Expense has been added successfully!']);
            } else {
                echo json_encode(['status' => 'error', 'message' => 'An error occurred while adding the expense.']);
            }
        }
    }

    public function showExpenseForm()
    {
        require_once '../App/views/pages/expenses.html';
    }
}