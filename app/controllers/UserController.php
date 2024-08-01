<?php

require_once '../App/Models/User.php';
require_once '../App/Config/database.php'; 

class UserController {
    private $userModel;

    public function __construct() {
        $this->userModel = new User($db);
    }

    public function showRegistrationForm() {
        require_once '../App/views/pages/registration.html';
    }

    public function register() {
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            $first_name = $_POST['first_name'];
            $last_name = $_POST['last_name'];
            $email = $_POST['email'];
            $password = $_POST['password'];

            $hashed_password = password_hash($password, PASSWORD_BCRYPT);

            if ($this->userModel->userExists($email)) {
                echo json_encode(['status' => 'error', 'message' => 'Email already exists']);
                exit();
            }

            if ($this->userModel->registerUser($first_name, $last_name, $email, $hashed_password)) {
                echo json_encode(['status' => 'success']);
            } else {
                echo json_encode(['status' => 'error', 'message' => 'Registration failed']);
            }
        } else {
            header('Location: index.php');
            exit();
        }
    }
}

