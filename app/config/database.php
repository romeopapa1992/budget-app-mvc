<?php
$dsn = 'mysql:host=localhost;dbname=budget_manager';
$username = 'root';
$password = '';
$options = [];

try {
    $db = new PDO($dsn, $username, $password, $options);
} catch (PDOException $e) {
    echo 'Connection failed: ' . $e->getMessage();
    exit();
}
?>
