<?php
require_once '../app/models/Balance.php';

class BalanceController
{
    private $db;
    private $balanceModel;

    public function __construct()
    {
        require '../config/database.php';
        $this->db = $db;
        $this->balanceModel = new Balance($db);
    }

    public function show()
    {
        session_start();

        $userId = $_SESSION['user_id'];
        $period = isset($_POST['period']) ? trim($_POST['period']) : 'current_month';
        $startDate = isset($_POST['startDate']) ? trim($_POST['startDate']) : '';
        $endDate = isset($_POST['endDate']) ? trim($_POST['endDate']) : '';

        $balanceData = $this->balanceModel->calculate($userId, $period, $startDate, $endDate);

        echo json_encode($balanceData);
    }
}
?>
