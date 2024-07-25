<?php

require_once '../config/database.php';

<?php
class Balance
{
    private $db;

    public function __construct($db)
    {
        $this->db = $db;
    }

    public function calculate($userId, $period, $startDate = '', $endDate = '')
    {
        if ($period == 'current_month') {
            $startDate = date('Y-m-01');
            $endDate = date('Y-m-t');
        } else if ($period == 'previous_month') {
            $startDate = date('Y-m-01', strtotime('first day of last month'));
            $endDate = date('Y-m-t', strtotime('last day of last month'));
        } else if ($period == 'current_year') {
            $startDate = date('Y-01-01');
            $endDate = date('Y-12-31');
        } else if ($period == 'custom' && !empty($startDate) && !empty($endDate)) {
            $startDate = $startDate;
            $endDate = $endDate;
        }

        $totalIncome = $this->getTotalIncome($userId, $startDate, $endDate);
        $totalExpense = $this->getTotalExpense($userId, $startDate, $endDate);

        $balance = $totalIncome - $totalExpense;

        return ['balance' => $balance, 'income' => $totalIncome, 'expense' => $totalExpense];
    }

    private function getTotalIncome($userId, $startDate, $endDate)
    {
        $sql = 'SELECT SUM(amount) as total_income FROM incomes WHERE user_id = :user_id AND date BETWEEN :start_date AND :end_date';
        $query = $this->db->prepare($sql);
        $query->bindValue(':user_id', $userId, PDO::PARAM_INT);
        $query->bindValue(':start_date', $startDate, PDO::PARAM_STR);
        $query->bindValue(':end_date', $endDate, PDO::PARAM_STR);
        $query->execute();
        $totalIncome = $query->fetch(PDO::FETCH_ASSOC)['total_income'] ?? 0;

        return $totalIncome !== null ? $totalIncome : 0;
    }

    private function getTotalExpense($userId, $startDate, $endDate)
    {
        $sql = 'SELECT SUM(amount) as total_expense FROM expenses WHERE user_id = :user_id AND date BETWEEN :start_date AND :end_date';
        $query = $this->db->prepare($sql);
        $query->bindValue(':user_id', $userId, PDO::PARAM_INT);
        $query->bindValue(':start_date', $startDate, PDO::PARAM_STR);
        $query->bindValue(':end_date', $endDate, PDO::PARAM_STR);
        $query->execute();
        $totalExpense = $query->fetch(PDO::FETCH_ASSOC)['total_expense'] ?? 0;

        return $totalExpense !== null ? $totalExpense : 0;
    }
}
?>

