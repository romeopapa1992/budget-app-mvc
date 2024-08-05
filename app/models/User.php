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
}