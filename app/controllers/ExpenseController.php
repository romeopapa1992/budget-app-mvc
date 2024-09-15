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

    public function addExpenseCategory() {
        $newCategory = $_POST['newExpenseCategory'];

        // Connect to database
        $db = new Database();
        $query = "INSERT INTO expenses_category_assigned_to_users (user_id, name) VALUES (?, ?)";
        $params = [$_SESSION['user_id'], $newCategory];
        $db->execute($query, $params);

        echo json_encode(['status' => 'success']);
    }

    public function removeExpenseCategory() {
        $categoryId = $_POST['expenseCategorySelect'];

        // Connect to database
        $db = new Database();
        $query = "DELETE FROM expenses_category_assigned_to_users WHERE id = ? AND user_id = ?";
        $params = [$categoryId, $_SESSION['user_id']];
        $db->execute($query, $params);

        echo json_encode(['status' => 'success']);
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