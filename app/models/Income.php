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
        $sql = 'SELECT name FROM incomes_category_default WHERE id = :category_id';
        $query = $this->db->prepare($sql);
        $query->bindValue(':category_id', $category, PDO::PARAM_INT);
        $query->execute();
        $categoryData = $query->fetch(PDO::FETCH_ASSOC);

        if (!$categoryData) {
            return false; 
        }

        $categoryName = $categoryData['name']; 

        $sql = 'SELECT id FROM incomes_category_assigned_to_users WHERE user_id = :user_id AND name = :category_name';
        $query = $this->db->prepare($sql);
        $query->bindValue(':user_id', $userId, PDO::PARAM_INT);
        $query->bindValue(':category_name', $categoryName, PDO::PARAM_STR);
        $query->execute();
        $assignedCategoryData = $query->fetch(PDO::FETCH_ASSOC);

        if (!$assignedCategoryData) {
            $sql = 'INSERT INTO incomes_category_assigned_to_users (user_id, name) VALUES (:user_id, :category_name)';
            $query = $this->db->prepare($sql);
            $query->bindValue(':user_id', $userId, PDO::PARAM_INT);
            $query->bindValue(':category_name', $categoryName, PDO::PARAM_STR);
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


    public function addIncomeCategory($userId, $categoryName)
    {
        $sql = 'SELECT id FROM incomes_category_default WHERE name = :name';
        $query = $this->db->prepare($sql);
        $query->bindValue(':name', $categoryName, PDO::PARAM_STR);
        $query->execute();
        $existingCategory = $query->fetch(PDO::FETCH_ASSOC);

        if ($existingCategory) {
            return false;
        } else {
            $sql = 'INSERT INTO incomes_category_default (name) VALUES (:name)';
            $query = $this->db->prepare($sql);
            $query->bindValue(':name', $categoryName, PDO::PARAM_STR);
            return $query->execute();
        }
    }

    public function removeIncomeCategory($userId, $categoryId)
    {
        $sql = 'DELETE FROM incomes_category_default WHERE id = :id';
        $query = $this->db->prepare($sql);
        $query->bindValue(':id', $categoryId, PDO::PARAM_INT);
        return $query->execute();
    }

    public function getIncomeCategories()
    {
        $sql = 'SELECT id, name FROM incomes_category_default';
        $query = $this->db->prepare($sql);
        $query->execute();
        return $query->fetchAll(PDO::FETCH_ASSOC);
    }
}
