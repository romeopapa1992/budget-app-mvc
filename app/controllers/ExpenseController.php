<?php

namespace App\Controllers;

use App\Models\Expense;
use PDO;

class ExpenseController
{
    private $db;
    private $expenseModel;

    public function __construct($db)  
    {
        $this->db = $db;
        $this->expenseModel = new Expense($this->db);
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
                exit;
            } else {
                echo json_encode(['status' => 'error', 'message' => 'An error occurred while adding the expense.']);
                exit;
            }
        }
        require_once '../App/views/pages/expenses.html'; 
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
        if (!isset($_SESSION['user_id'])) {
        echo json_encode([]);
        return;
        }

        $userId = $_SESSION['user_id'];
        $categories = $this->expenseModel->getExpenseCategories($userId);
        echo json_encode($categories);
    }

    public function getCategoryLimit()
    {
        $data = json_decode(file_get_contents("php://input"), true);
        $userId = $_SESSION['user_id'];
        $categoryId = $data['category_id'];
        $monthYear = $data['month_year'];

        $expenseModel = new Expense($this->db);
        $limit = $this->expenseModel->getCategoryLimit($userId, $categoryId, $monthYear);

        echo json_encode(["status" => "success", "limit" => $limit]);
    }

    public function setCategoryLimit()
    {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            session_start();
            if (!isset($_SESSION['user_id'])) {
                http_response_code(401);
                echo json_encode(["error" => "Unauthorized"]);
                return;
            }

            $userId = $_SESSION['user_id'];
            $data = json_decode(file_get_contents("php://input"), true);
            $categoryId = $data['category_id'] ?? null;
            $monthYear = $data['month_year'] ?? null;
            $limitAmount = $data['limit_amount'] ?? null;


            if (!$categoryId || !$monthYear || !$limitAmount) {
                http_response_code(400);
                echo json_encode(["error" => "Missing required parameters"]);
                return;
            }

            $success = $this->expenseModel->setCategoryLimit($userId, $categoryId, $monthYear, $limitAmount);
            if ($success) {
                echo json_encode(["message" => "Limit set successfully!"]);
            } else {
                http_response_code(500);
                echo json_encode(["error" => "Failed to set limit"]);
            }
        }
    }

    public function getCategoryLimitAndSpentAmount()
    {
        if (!isset($_SESSION['user_id'])) {
            echo json_encode(['error' => 'Unauthorized']);
            return;
        }

        $userId = $_SESSION['user_id'];
        $categoryDefaultId = $_GET['category_id'] ?? null; 
        $monthYear = $_GET['month_year'] ?? null;

        if (!$categoryDefaultId || !$monthYear) {
            echo json_encode(['error' => 'Missing parameters']);
            return;
        }

        $expenseModel = new Expense($this->db);
        $limit = $expenseModel->getCategoryLimit($userId, $categoryDefaultId, $monthYear);
        $spent = 0;

        $sql = 'SELECT id FROM expenses_category_assigned_to_users 
                WHERE user_id = :user_id 
                AND name = (SELECT name FROM expenses_category_default WHERE id = :category_default_id)';

        $query = $this->db->prepare($sql);
        $query->bindValue(':user_id', $userId, PDO::PARAM_INT);
        $query->bindValue(':category_default_id', $categoryDefaultId, PDO::PARAM_INT);
        $query->execute();
        $assignedCategory = $query->fetch(PDO::FETCH_ASSOC);

        if ($assignedCategory) {
            $categoryAssignedId = $assignedCategory['id']; 
            $spent = $expenseModel->getTotalExpensesForCategory($userId, $categoryAssignedId, $monthYear);
        }

        echo json_encode([
            'limit' => ($limit === null || $limit === false) ? null : $limit,
            'spent' => $spent !== null ? $spent : 0,
            'limit_not_set' => ($limit === null || $limit === false)
        ]);
    }


    public function getCategorySpentAmount()
    {
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            $userId = $_SESSION['user_id'];
            $categoryId = trim($_POST['category_id']);
            $monthYear = trim($_POST['month_year']);

            $spentAmount = $this->expenseModel->getTotalExpensesForCategory($userId, $categoryId, $monthYear);

            echo json_encode(['status' => 'success', 'spentAmount' => $spentAmount]);
            exit;
        }
        echo json_encode(['status' => 'error', 'message' => 'Invalid request.']);
        exit;
    }

    public function validateExpenseLimit($userId, $categoryId, $dateOfExpense, $amount) 
    {
        $monthYear = date('Y-m', strtotime($dateOfExpense));
        $spent = $this->expenseModel->getTotalExpensesForCategory($userId, $categoryId, $monthYear);
        $limit = $this->expenseModel->getCategoryLimit($userId, $categoryId, $monthYear);

            if ($limit !== null) {
            $remaining = $limit - $spent;
            if ($amount > $remaining) {
                return ["status" => "error", "message" => "Limit exceeded by " . ($amount - $remaining) . " PLN"];
            }
        }

        return ["status" => "success"];
    }

}