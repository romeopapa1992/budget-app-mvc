<?php
require_once 'database.php';

$tables = [
    'users' => "
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            first_name VARCHAR(50) NOT NULL,
            last_name VARCHAR(50) NOT NULL,
            email VARCHAR(100) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL
        )",
    'incomes' => "
        CREATE TABLE IF NOT EXISTS incomes (
            id INT AUTO_INCREMENT PRIMARY KEY,
            amount DECIMAL(10, 2) NOT NULL,
            date DATE NOT NULL,
            category VARCHAR(50) NOT NULL,
            comment TEXT,
            user_id INT,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )",
    'expenses' => "
        CREATE TABLE IF NOT EXISTS expenses (
            id INT AUTO_INCREMENT PRIMARY KEY,
            amount DECIMAL(10, 2) NOT NULL,
            date DATE NOT NULL,
            category VARCHAR(50) NOT NULL,
            payment_method VARCHAR(50) NOT NULL,
            comment TEXT,
            user_id INT,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )"
];

foreach ($tables as $table => $sql) {
    try {
        $db->exec($sql);
        echo "Table '$table' created successfully.<br>";
    } catch (PDOException $e) {
        echo "Error creating table '$table': " . $e->getMessage() . "<br>";
    }
}
?>
