<?php

namespace App\Models;

use PDO;

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
                    throw new Exception('Invalid custom date range.');
                }
                break;
            default:
                throw new Exception('Invalid period specified.');
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
        $query->bindValue(':user_id', $this->userId, PDO::PARAM_INT);
        $query->bindValue(':start_date', $startDate, PDO::PARAM_STR);
        $query->bindValue(':end_date', $endDate, PDO::PARAM_STR);
        $query->execute();

        return $query->fetch(PDO::FETCH_ASSOC)['total_income'] ?? 0;
    }

    private function getTotalExpense($startDate, $endDate)
    {
        $sql = 'SELECT SUM(amount) as total_expense FROM expenses WHERE user_id = :user_id AND date_of_expense BETWEEN :start_date AND :end_date';
        $query = $this->db->prepare($sql);
        $query->bindValue(':user_id', $this->userId, PDO::PARAM_INT);
        $query->bindValue(':start_date', $startDate, PDO::PARAM_STR);
        $query->bindValue(':end_date', $endDate, PDO::PARAM_STR);
        $query->execute();

        return $query->fetch(PDO::FETCH_ASSOC)['total_expense'] ?? 0;
    }

    public function getBalanceData()
    {
        $startDate = date('Y-m-01');
        $endDate = date('Y-m-t');

        $totalIncome = $this->getTotalIncome($startDate, $endDate);
        $totalExpense = $this->getTotalExpense($startDate, $endDate);
        $balance = $totalIncome - $totalExpense;

        return [
            'income' => $totalIncome,
            'expense' => $totalExpense,
            'balance' => $balance
        ];
    }

    public function getIncomeDetails($startDate, $endDate)
    {
        $sql = 'SELECT 
                    incomes.id,
                    incomes.date_of_income, 
                    incomes.amount, 
                    incomes_category_assigned_to_users.name AS category, 
                    incomes.income_comment AS comment
                FROM incomes
                JOIN incomes_category_assigned_to_users 
                    ON incomes.income_category_assigned_to_user_id = incomes_category_assigned_to_users.id
                WHERE incomes.user_id = :user_id 
                  AND incomes.date_of_income BETWEEN :start_date AND :end_date
                ORDER BY incomes.date_of_income DESC';
        $query = $this->db->prepare($sql);
        $query->bindValue(':user_id', $this->userId, PDO::PARAM_INT);
        $query->bindValue(':start_date', $startDate, PDO::PARAM_STR);
        $query->bindValue(':end_date', $endDate, PDO::PARAM_STR);
        $query->execute();

        return $query->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getExpenseDetails($startDate, $endDate)
    {
        $sql = 'SELECT 
                    expenses.id,
                    expenses.date_of_expense, 
                    expenses.amount, 
                    expenses_category_assigned_to_users.name AS category, 
                    payment_methods_assigned_to_users.name AS payment_method, 
                    expenses.expense_comment AS comment
                FROM expenses
                JOIN expenses_category_assigned_to_users 
                    ON expenses.expense_category_assigned_to_user_id = expenses_category_assigned_to_users.id
                JOIN payment_methods_assigned_to_users 
                    ON expenses.payment_method_assigned_to_user_id = payment_methods_assigned_to_users.id
                WHERE expenses.user_id = :user_id 
                  AND expenses.date_of_expense BETWEEN :start_date AND :end_date
                ORDER BY expenses.date_of_expense DESC';

        $query = $this->db->prepare($sql);
        $query->bindValue(':user_id', $this->userId, PDO::PARAM_INT);
        $query->bindValue(':start_date', $startDate, PDO::PARAM_STR);
        $query->bindValue(':end_date', $endDate, PDO::PARAM_STR);
        $query->execute();

        return $query->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getDetails($period, $startDate = '', $endDate = '')
    {
        $this->setPeriodDates($period, $startDate, $endDate);

        $incomes = $this->getIncomeDetails($startDate, $endDate);
        $expenses = $this->getExpenseDetails($startDate, $endDate);

        return [
            'incomes' => $incomes,
            'expenses' => $expenses,
        ];
    }

    public function setPeriodDates(&$period, &$startDate, &$endDate)
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
                    throw new Exception('Invalid custom date range.');
                }
                if (!strtotime($startDate) || !strtotime($endDate)) {
                    throw new Exception('Invalid custom dates provided.');
                }
                break;
            default:
                throw new Exception('Invalid period specified.');
        }
    }

    public function getExpenseCategoriesForPeriod($startDate, $endDate)
    {
        $sql = 'SELECT 
                    expenses_category_assigned_to_users.name AS category, 
                    SUM(expenses.amount) AS total_amount
                FROM expenses
                JOIN expenses_category_assigned_to_users 
                    ON expenses.expense_category_assigned_to_user_id = expenses_category_assigned_to_users.id
                WHERE expenses.user_id = :user_id 
                  AND expenses.date_of_expense BETWEEN :start_date AND :end_date
                GROUP BY expenses_category_assigned_to_users.name';

        $query = $this->db->prepare($sql);
        $query->bindValue(':user_id', $this->userId, PDO::PARAM_INT);
        $query->bindValue(':start_date', $startDate, PDO::PARAM_STR);
        $query->bindValue(':end_date', $endDate, PDO::PARAM_STR);
        $query->execute();

        return $query->fetchAll(PDO::FETCH_ASSOC);
    }
}
