<?php

namespace App\Models; 

class Balance
{
    private $db;
    private $userId;

    public function __construct($db, $userId)
    {
        $this->db = $db;
        $this->userId = $userId;
    }

    public function getBalance($period, $startDate = '', $endDate = '')
    {
        switch ($period) {
            case 'current_month':
                $startDate = date('Y-m-01');
                $endDate = date('Y-m-t');
                break;
            case 'previous_month':
                $startDate = date('Y-m-01', strtotime('first day of last month'));
                $endDate = date('Y-m-t', strtotime('last day of last month'));
                break;
            case 'current_year':
                $startDate = date('Y-01-01');
                $endDate = date('Y-12-31');
                break;
            case 'custom':
                if (empty($startDate) || empty($endDate)) {
                    throw new \Exception('Invalid custom date range.');
                }
                break;
            default:
                throw new \Exception('Invalid period specified.');
        }

        $totalIncome = $this->getTotalIncome($startDate, $endDate);
        $totalExpense = $this->getTotalExpense($startDate, $endDate);
        $balance = $totalIncome - $totalExpense;

        return [
            'balance' => $balance,
            'income' => $totalIncome,
            'expense' => $totalExpense,
        ];
    }

    private function getTotalIncome($startDate, $endDate)
{
    $sql = 'SELECT SUM(amount) as total_income FROM incomes WHERE user_id = :user_id AND date_of_income BETWEEN :start_date AND :end_date';
    $query = $this->db->prepare($sql);
    $query->bindValue(':user_id', $this->userId, \PDO::PARAM_INT);
    $query->bindValue(':start_date', $startDate, \PDO::PARAM_STR);
    $query->bindValue(':end_date', $endDate, \PDO::PARAM_STR);
    $query->execute();

    return $query->fetch(\PDO::FETCH_ASSOC)['total_income'] ?? 0;  // Dodanie \ przed PDO
}

private function getTotalExpense($startDate, $endDate)
{
    $sql = 'SELECT SUM(amount) as total_expense FROM expenses WHERE user_id = :user_id AND date_of_expense BETWEEN :start_date AND :end_date';
    $query = $this->db->prepare($sql);
    $query->bindValue(':user_id', $this->userId, \PDO::PARAM_INT);
    $query->bindValue(':start_date', $startDate, \PDO::PARAM_STR);
    $query->bindValue(':end_date', $endDate, \PDO::PARAM_STR);
    $query->execute();

    return $query->fetch(\PDO::FETCH_ASSOC)['total_expense'] ?? 0;  // Dodanie \ przed PDO
}

public function getBalanceData()
{
    $startDate = date('Y-m-01'); // Początek bieżącego miesiąca
    $endDate = date('Y-m-t'); // Koniec bieżącego miesiąca

    $totalIncome = $this->getTotalIncome($startDate, $endDate);
    $totalExpense = $this->getTotalExpense($startDate, $endDate);
    $balance = $totalIncome - $totalExpense;

    return [
        'income' => $totalIncome,
        'expense' => $totalExpense,
        'balance' => $balance
    ];
}

}