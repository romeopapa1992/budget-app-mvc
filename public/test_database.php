<?php
require_once '../App/config/database.php';

try {
    $query = $db->query("SELECT * FROM users");
    $results = $query->fetchAll(PDO::FETCH_ASSOC);

    echo "<pre>";
    print_r($results);
    echo "</pre>";
} catch (PDOException $error) {
    echo "Error: " . $error->getMessage();
}
