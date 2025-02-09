<?php

namespace App\Models;

use PDO;

class Expense
{
    private $db;

    public function __construct($db)
    {
        $this->db = $db;
    }

    public function addExpense($userId, $amount, $dateOfExpense, $category, $paymentMethod, $comment)
    {   
        $sql = 'SELECT name FROM expenses_category_default WHERE id = :category_id';
        $query = $this->db->prepare($sql);
        $query->bindValue(':category_id', $category, PDO::PARAM_INT);
        $query->execute();
        $categoryData = $query->fetch(PDO::FETCH_ASSOC);

        if (!$categoryData) {
            return false; 
        }

        $categoryName = $categoryData['name'];

        $sql = 'SELECT id FROM expenses_category_assigned_to_users WHERE user_id = :user_id AND name = :category_name';
        $query = $this->db->prepare($sql);
        $query->bindValue(':user_id', $userId, PDO::PARAM_INT);
        $query->bindValue(':category_name', $categoryName, PDO::PARAM_STR);
        $query->execute();
        $assignedCategoryData = $query->fetch(PDO::FETCH_ASSOC);

        if (!$assignedCategoryData) {
            $sql = 'INSERT INTO expenses_category_assigned_to_users (user_id, name) VALUES (:user_id, :category_name)';
            $query = $this->db->prepare($sql);
            $query->bindValue(':user_id', $userId, PDO::PARAM_INT);
            $query->bindValue(':category_name', $categoryName, PDO::PARAM_STR);
            $query->execute();
            $expenseCategoryAssignedToUserId = $this->db->lastInsertId();
        } else {
            $expenseCategoryAssignedToUserId = $assignedCategoryData['id'];
        }

        $sql = 'SELECT name FROM payment_methods_default WHERE name = :payment_method';
        $query = $this->db->prepare($sql);
        $query->bindValue(':payment_method', $paymentMethod, PDO::PARAM_STR);
        $query->execute();
        $defaultPaymentMethodData = $query->fetch(PDO::FETCH_ASSOC);

        if (!$defaultPaymentMethodData) {
            return false; 
        }

        $defaultPaymentMethodName = $defaultPaymentMethodData['name'];

        $sql = 'SELECT id FROM payment_methods_assigned_to_users WHERE user_id = :user_id AND name = :payment_method';
        $query = $this->db->prepare($sql);
        $query->bindValue(':user_id', $userId, PDO::PARAM_INT);
        $query->bindValue(':payment_method', $defaultPaymentMethodName, PDO::PARAM_STR);
        $query->execute();
        $assignedPaymentMethodData = $query->fetch(PDO::FETCH_ASSOC);

        if (!$assignedPaymentMethodData) {
            $sql = 'INSERT INTO payment_methods_assigned_to_users (user_id, name) VALUES (:user_id, :payment_method)';
            $query = $this->db->prepare($sql);
            $query->bindValue(':user_id', $userId, PDO::PARAM_INT);
            $query->bindValue(':payment_method', $defaultPaymentMethodName, PDO::PARAM_STR);
            $query->execute();
            $paymentMethodAssignedToUserId = $this->db->lastInsertId();
        } else {
            $paymentMethodAssignedToUserId = $assignedPaymentMethodData['id'];
        }

        $sql = 'INSERT INTO expenses (user_id, expense_category_assigned_to_user_id, payment_method_assigned_to_user_id, amount, date_of_expense, expense_comment) 
                VALUES (:user_id, :expense_category_assigned_to_user_id, :payment_method_assigned_to_user_id, :amount, :date_of_expense, :expense_comment)';
        $query = $this->db->prepare($sql);
        $query->bindValue(':user_id', $userId, PDO::PARAM_INT);
        $query->bindValue(':expense_category_assigned_to_user_id', $expenseCategoryAssignedToUserId, PDO::PARAM_INT);
        $query->bindValue(':payment_method_assigned_to_user_id', $paymentMethodAssignedToUserId, PDO::PARAM_INT);
        $query->bindValue(':amount', $amount, PDO::PARAM_STR);
        $query->bindValue(':date_of_expense', $dateOfExpense, PDO::PARAM_STR);
        $query->bindValue(':expense_comment', $comment, PDO::PARAM_STR);
        return $query->execute();
    }

    public function addExpenseCategory($userId, $categoryName)
    {
        $sql = 'SELECT id FROM expenses_category_default WHERE name = :name';
        $query = $this->db->prepare($sql);
        $query->bindValue(':name', $categoryName, PDO::PARAM_STR);
        $query->execute();
        $existingCategory = $query->fetch(PDO::FETCH_ASSOC);

        if ($existingCategory) {
            return false; 
        } else {
            $sql = 'INSERT INTO expenses_category_default (name) VALUES (:name)';
            $query = $this->db->prepare($sql);
            $query->bindValue(':name', $categoryName, PDO::PARAM_STR);
            return $query->execute();
        }
    }

    public function removeExpenseCategory($userId, $categoryId)
    {
        $sql = 'DELETE FROM expenses_category_default WHERE id = :id';
        $query = $this->db->prepare($sql);
        $query->bindValue(':id', $categoryId, PDO::PARAM_INT);
        return $query->execute();
    }

    public function getExpenseCategories()
    {
        $sql = 'SELECT id, name FROM expenses_category_default';
        $query = $this->db->prepare($sql);
        $query->execute();
        return $query->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getCategoryLimit($userId, $categoryId, $monthYear)
{
    $sql = 'SELECT limit_amount FROM expense_limits 
            WHERE user_id = :user_id AND category_id = :category_id AND month_year = :month_year';
    
    $query = $this->db->prepare($sql);
    $query->bindValue(':user_id', $userId, PDO::PARAM_INT);
    $query->bindValue(':category_id', $categoryId, PDO::PARAM_INT);
    $query->bindValue(':month_year', $monthYear, PDO::PARAM_STR);
    $query->execute();

    return $query->fetchColumn();

}

public function setCategoryLimit($userId, $categoryId, $monthYear, $limitAmount)
{
    $sql = 'INSERT INTO expense_limits (user_id, category_id, month_year, limit_amount) 
            VALUES (:user_id, :category_id, :month_year, :limit_amount)
            ON DUPLICATE KEY UPDATE limit_amount = VALUES(limit_amount)';

    $query = $this->db->prepare($sql);
    $query->bindValue(':user_id', $userId, PDO::PARAM_INT);
    $query->bindValue(':category_id', $categoryId, PDO::PARAM_INT);
    $query->bindValue(':month_year', $monthYear, PDO::PARAM_STR);
    $query->bindValue(':limit_amount', $limitAmount, PDO::PARAM_STR);

    return $query->execute();
}

public function getTotalExpensesForCategory($userId, $categoryId, $monthYear)
{
    $sql = 'SELECT SUM(amount) as total FROM expenses 
            WHERE user_id = :user_id 
            AND expense_category_assigned_to_user_id = :category_id 
            AND DATE_FORMAT(date_of_expense, "%Y-%m") = :month_year';
    $query = $this->db->prepare($sql);
    $query->bindValue(':user_id', $userId, PDO::PARAM_INT);
    $query->bindValue(':category_id', $categoryId, PDO::PARAM_INT);
    $query->bindValue(':month_year', $monthYear, PDO::PARAM_STR);
    $query->execute();
    $result = $query->fetch(PDO::FETCH_ASSOC);
    return $result ? $result['total'] : 0;
} 

public function getCategoryLimitAndSpentAmount($userId, $categoryId, $monthYear)
{
    $limit = $this->getCategoryLimit($userId, $categoryId, $monthYear);
    $spent = $this->getTotalExpensesForCategory($userId, $categoryId, $monthYear);
    return ["limit" => $limit, "spent" => $spent];
}


}