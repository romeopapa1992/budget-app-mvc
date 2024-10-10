<?php

namespace App\Models;

use PDO;

class User
{
    private $db;

    public function __construct(PDO $db)
    {
        $this->db = $db;
    }

    public function checkEmailExists($email)
    {
        $sql = 'SELECT COUNT(*) FROM users WHERE email = :email';
        $query = $this->db->prepare($sql);
        $query->bindValue(':email', $email);
        $query->execute();
        return $query->fetchColumn() > 0;
    }

    public function createUser($name, $surname, $email, $hashed_password)
    {
        $sql = 'INSERT INTO users (name, surname, email, password) VALUES (:name, :surname, :email, :password)';
        $query = $this->db->prepare($sql);
        $query->bindValue(':name', $name);
        $query->bindValue(':surname', $surname);
        $query->bindValue(':email', $email);
        $query->bindValue(':password', $hashed_password);
        return $query->execute();
    }

    public function getUserByEmail($email) {
        $sql = 'SELECT * FROM users WHERE email = :email';
        $query = $this->db->prepare($sql);
        $query->bindValue(':email', $email);
        $query->execute();

        return $query->fetch(PDO::FETCH_ASSOC);
    }

    public function updateUser($userId, $name = null, $surname = null, $email = null)
    {
        $updates = [];
        if ($name) {
            $updates[] = 'name = :name';
        }
        if ($surname) {
            $updates[] = 'surname = :surname';
        }
        if ($email) {
            $updates[] = 'email = :email';
        }

        if (empty($updates)) {
            return false; 
        }

        $sql = 'UPDATE users SET ' . implode(', ', $updates) . ' WHERE id = :id';
        $query = $this->db->prepare($sql);
        if ($name) {
            $query->bindValue(':name', $name);
        }
        if ($surname) {
            $query->bindValue(':surname', $surname);
        }
        if ($email) {
            $query->bindValue(':email', $email);
        }
        $query->bindValue(':id', $userId);
        return $query->execute();
    }

    public function updateUserPassword($userId, $hashedPassword)
    {
        $sql = 'UPDATE users SET password = :password WHERE id = :id';
        $query = $this->db->prepare($sql);
        $query->bindValue(':password', $hashedPassword);
        $query->bindValue(':id', $userId);
        return $query->execute();
    }

    public function deleteUserById($userId)
    {
        $sql = 'DELETE FROM users WHERE id = :id';
        $query = $this->db->prepare($sql);
        $query->bindValue(':id', $userId);
        return $query->execute();
    }
}
