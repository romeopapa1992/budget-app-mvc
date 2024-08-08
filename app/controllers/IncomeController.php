<?php

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

            if ($this->incomeModel->addIncome($userId, $amount, $dateOfIncome, $category, $comment)) {
                echo json_encode(['status' => 'success', 'message' => 'Income has been added successfully!']);
            } else {
                echo json_encode(['status' => 'error', 'message' => 'An error occurred while adding the income.']);
            }
        }
    }

    public function showIncomesForm()
    {
        require_once '../App/views/pages/incomes.html';
    }
}
