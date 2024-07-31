<?php
$setup = require_once 'setup.php';

try {
    $db = new PDO("mysql:host={$setup['host']};dbname={$setup['database']};charset=utf8",
        $setup['user'], $setup['password'], [
        PDO::ATTR_EMULATE_PREPARES => false,
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);
} catch (PDOException $error) {
    echo $error->getMessage();
    exit('Database error');
}
