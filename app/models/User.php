<?php

class User {
    private $db;

    public function __construct($db) {
        $this->db = $db;
    }

    public function userExists($email) {
        $sql_check = 'SELECT COUNT(*) FROM users WHERE email = :email';
        $query_check = $this->db->prepare($sql_check);
        $query_check->bindValue(':email', $email);
        $query_check->execute();
        return $query_check->fetchColumn() > 0;
    }

    public function registerUser($first_name, $last_name, $email, $hashed_password) {
        $sql = 'INSERT INTO users (first_name, last_name, email, password) VALUES (:first_name, :last_name, :email, :password)';
        $query = $this->db->prepare($sql);
        $query->bindValue(':first_name', $first_name);
        $query->bindValue(':last_name', $last_name);
        $query->bindValue(':email', $email);
        $query->bindValue(':password', $hashed_password);
        return $query->execute();
    }
}

