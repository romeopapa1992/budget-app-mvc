<?php

$setup = require_once 'setup.php';

try {
    $db = new PDO(
        "mysql:host={$setup['host']};dbname={$setup['database']}",
        $setup['user'],
        $setup['password']
        );
        $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    } catch (PDOException $e) {
        echo 'Connection failed: ' . $e->getMessage();
        exit(); 
    }
