<?php

namespace App\Controllers;

use App\Models\Balance;

class BalanceController
{
    private $db;
    private $balanceModel;

    public function __construct($db)
    {
        $this->db = $db;

        session_start();
        if (isset($_SESSION['user_id'])) {
            $userId = $_SESSION['user_id'];
            $this->balanceModel = new Balance($db, $userId);
        }
    }

    public function showBalance() {
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $period = $_POST['period'] ?? null;  
        $startDate = $_POST['startDate'] ?? null;
        $endDate = $_POST['endDate'] ?? null;

        if ($period !== null) {  
            $balanceData = $this->balanceModel->getBalance($period, $startDate, $endDate);
            echo json_encode($balanceData);
            exit();  
            } else {
            echo json_encode(['error' => 'Period not specified']);
            exit();
            }
        } else {
        require_once '../App/views/pages/balance.html';
        }
    }

}