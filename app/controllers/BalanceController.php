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

        // Sprawdzenie, czy użytkownik jest zalogowany przed inicjalizacją modelu
        session_start();
        if (isset($_SESSION['user_id'])) {
            $userId = $_SESSION['user_id'];
            $this->balanceModel = new Balance($db, $userId);
        }
    }

    public function showBalance() {
        // Sprawdzenie, czy użytkownik jest zalogowany
        if (!isset($_SESSION['user_id'])) {
            // Przekierowanie do strony logowania, jeśli nie jest zalogowany
            header('Location: /budget-app-mvc/public/index.php?action=signin');
            exit();
        }

        // Pobranie danych bilansu użytkownika z modelu
        $balanceData = $this->balanceModel->getBalanceData();
        require_once '../App/views/pages/balance.html';

    }
}