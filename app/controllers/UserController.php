<?php

namespace App\Controllers;

use App\Models\User;
use PDO;

class UserController
{
    private $db;
    private $userModel;

    public function __construct(PDO $db)
    {
        $this->db = $db;
        $this->userModel = new User($db);
    }

    public function registration()
    {
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            $first_name = $_POST['first_name'];
            $last_name = $_POST['last_name'];
            $email = $_POST['email'];
            $password = $_POST['password'];

            // Hashowanie hasła
            $hashed_password = password_hash($password, PASSWORD_BCRYPT);

            // Sprawdzenie, czy email już istnieje
            if ($this->userModel->checkEmailExists($email)) {
                echo json_encode(['status' => 'error', 'message' => 'Email already exists']);
                exit();
            }

            // Tworzenie nowego użytkownika
            if ($this->userModel->createUser($first_name, $last_name, $email, $hashed_password)) {
                header('Location: /budget-app-mvc/public/index.php?action=signin');
                exit();
            } else {
                echo json_encode(['status' => 'error', 'message' => 'Registration failed']);
            }
        } else {
            header('Location: /budget-app-mvc/public/index.php?action=registration');
            exit();
        }
    }

    public function showRegistrationForm()
    {
        require_once '../App/views/pages/registration.html';
    }
}