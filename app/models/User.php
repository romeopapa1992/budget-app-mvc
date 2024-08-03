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

    public function createUser($first_name, $last_name, $email, $hashed_password)
    {
        $sql = 'INSERT INTO users (first_name, last_name, email, password) VALUES (:first_name, :last_name, :email, :password)';
        $query = $this->db->prepare($sql);
        $query->bindValue(':first_name', $first_name);
        $query->bindValue(':last_name', $last_name);
        $query->bindValue(':email', $email);
        $query->bindValue(':password', $hashed_password);
        return $query->execute();
    }
}