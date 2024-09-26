<?php

namespace App\Controllers;

use App\Models\Income;
use Core\View;


namespace App\Controllers;

use App\Models\Income;
use Core\View;

class IncomeController
{
    private $incomeModel;

    public function __construct($db)
    {
        $this->incomeModel = new Income($db);
    }
    public function income()
{
    if ($_SERVER['REQUEST_METHOD'] == 'POST') {
        $userId = $_SESSION['user_id'];
        $amount = trim($_POST['amount']);
        $dateOfIncome = trim($_POST['date']);
        $category = trim($_POST['category']);
        $comment = ucfirst(strtolower(trim($_POST['comment'])));

        // Backend validation for empty fields
        $errors = [];
        if (empty($amount)) {
            $errors['amount'] = "Amount cannot be empty.";
        }
        if (empty($dateOfIncome)) {
            $errors['date'] = "Date cannot be empty.";
        }
        if (empty($category)) {
            $errors['category'] = "Category cannot be empty.";
        }

        // If there are validation errors, return them
        if (!empty($errors)) {
            echo json_encode(['status' => 'error', 'errors' => $errors]);
            exit;
        }

        // Continue with database insert if no errors
        if ($this->incomeModel->addIncome($userId, $amount, $dateOfIncome, $category, $comment)) {
            echo json_encode(['status' => 'success', 'message' => 'Income has been added successfully!']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'An error occurred while adding the income.']);
        }
    }
}


    public function addIncomeCategory()
    {
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            session_start();
            $userId = $_SESSION['user_id'];
            $categoryName = trim($_POST['newIncomeCategory']);

            if ($this->incomeModel->addIncomeCategory($userId, $categoryName)) {
                echo json_encode(['status' => 'success', 'message' => 'New category has been added successfully!']);
            } else {
                echo json_encode(['status' => 'error', 'message' => 'Category already exists']);
            }
        }
    }

    public function removeIncomeCategory()
    {
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            session_start();
            $userId = $_SESSION['user_id'];
            $categoryId = $_POST['incomeCategorySelect'];

            if ($this->incomeModel->removeIncomeCategory($userId, $categoryId)) {
                echo json_encode(['status' => 'success', 'message' => 'Category removed successfully!']);
            } else {
                echo json_encode(['status' => 'error', 'message' => 'Failed to remove category.']);
            }
        }
    }

    public function getIncomeCategories()
    {
        $categories = $this->incomeModel->getIncomeCategories();
        echo json_encode($categories);
    }

    public function showIncomeForm()
    {
        require_once '../App/views/pages/income.html';
    }

    public function showIncomeSettingsForm()
    {
        require_once '../App/views/pages/incomeSettings.html';
    }
} 