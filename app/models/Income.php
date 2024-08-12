<?php

namespace App\Models;

use PDO;

class Income
{
    private $db;

    public function __construct($db)
    {
        $this->db = $db;
    }

    public function addIncome($userId, $amount, $dateOfIncome, $category, $comment)
    {
        $sql = 'SELECT id FROM incomes_category_assigned_to_users WHERE user_id = :user_id AND name = :category';
        $query = $this->db->prepare($sql);
        $query->bindValue(':user_id', $userId, PDO::PARAM_INT);
        $query->bindValue(':category', $category, PDO::PARAM_STR);
        $query->execute();
        $assignedCategoryData = $query->fetch(PDO::FETCH_ASSOC);

        if (!$assignedCategoryData) {
            $sql = 'INSERT INTO incomes_category_assigned_to_users (user_id, name) VALUES (:user_id, :category)';
            $query = $this->db->prepare($sql);
            $query->bindValue(':user_id', $userId, PDO::PARAM_INT);
            $query->bindValue(':category', $category, PDO::PARAM_STR);
            $query->execute();
            $incomeCategoryAssignedToUserId = $this->db->lastInsertId();
        } else {
            $incomeCategoryAssignedToUserId = $assignedCategoryData['id'];
        }

        $sql = 'INSERT INTO incomes (user_id, income_category_assigned_to_user_id, amount, date_of_income, income_comment) 
                VALUES (:user_id, :income_category_assigned_to_user_id, :amount, :date_of_income, :income_comment)';
        $query = $this->db->prepare($sql);
        $query->bindValue(':user_id', $userId, PDO::PARAM_INT);
        $query->bindValue(':income_category_assigned_to_user_id', $incomeCategoryAssignedToUserId, PDO::PARAM_INT);
        $query->bindValue(':amount', $amount, PDO::PARAM_STR);
        $query->bindValue(':date_of_income', $dateOfIncome, PDO::PARAM_STR);
        $query->bindValue(':income_comment', $comment, PDO::PARAM_STR);
        return $query->execute();
    }
}
