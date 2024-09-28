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

    $sql = 'SELECT id FROM payment_methods_assigned_to_users WHERE user_id = :user_id AND name = :payment_method';
    $query = $this->db->prepare($sql);
    $query->bindValue(':user_id', $userId, PDO::PARAM_INT);
    $query->bindValue(':payment_method', $paymentMethod, PDO::PARAM_STR);
    $query->execute();
    $assignedPaymentMethodData = $query->fetch(PDO::FETCH_ASSOC);

    if (!$assignedPaymentMethodData) {
        $sql = 'INSERT INTO payment_methods_assigned_to_users (user_id, name) VALUES (:user_id, :payment_method)';
        $query = $this->db->prepare($sql);
        $query->bindValue(':user_id', $userId, PDO::PARAM_INT);
        $query->bindValue(':payment_method', $paymentMethod, PDO::PARAM_STR);
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

}