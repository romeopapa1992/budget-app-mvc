<?php

require_once '../config/database.php';

class User {
    public $id;
    public $first_name;
    public $last_name;
    public $email;
    public $password;

    public static function findByEmail($email) {
        global $db;
        $sql = 'SELECT * FROM users WHERE email = :email';
        $query = $db->prepare($sql);
        $query->bindValue(':email', $email);
        $query->execute();
        return $query->fetch(PDO::FETCH_ASSOC);
    }

    public function save() {
        global $db;
        $sql = 'INSERT INTO users (first_name, last_name, email, password) VALUES (:first_name, :last_name, :email, :password)';
        $query = $db->prepare($sql);
        $query->bindValue(':first_name', $this->first_name);
        $query->bindValue(':last_name', $this->last_name);
        $query->bindValue(':email', $this->email);
        $query->bindValue(':password', $this->password);
        return $query->execute();
    }
}
?>
