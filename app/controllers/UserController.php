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
            $name = trim($_POST['name']);
            $surname = trim($_POST['surname']);
            $email = trim($_POST['email']);
            $password = $_POST['password'];

            $errors = [];

            // Walidacja pól
            if (empty($name)) {
                $errors['name'] = 'First name cannot be empty.';
            }

            if (empty($surname)) {
                $errors['surname'] = 'Last name cannot be empty.';
            }

            if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
                $errors['email'] = 'Looks like this is not an email.';
            } elseif ($this->userModel->checkEmailExists($email)) {
                $errors['email'] = 'Email already exists.';
            }

            if (empty($password) || !preg_match('/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^\da-zA-Z]).{8,}$/', $password)) {
                $errors['password'] = 'Passwords must meet complexity requirements.';
            }

            // Sprawdzenie czy są błędy
            if (!empty($errors)) {
                echo json_encode(['status' => 'error', 'errors' => $errors]);
                return;
            }

            // Hashowanie hasła
            $hashed_password = password_hash($password, PASSWORD_BCRYPT);

            // Tworzenie nowego użytkownika
            if ($this->userModel->createUser($name, $surname, $email, $hashed_password)) {
                echo json_encode(['status' => 'success']);
            } else {
                echo json_encode(['status' => 'error', 'message' => 'Registration failed.']);
            }
        } else {
            header('Location: /budget-app-mvc/public/index.php?action=registration');
            exit();
        }
    }

    public function signin() {
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            $email = $_POST['email'];
            $password = $_POST['password'];

            $user = $this->userModel->getUserByEmail($email);

            if ($user && password_verify($password, $user['password'])) {
                session_start();
                $_SESSION['user_id'] = $user['id'];
                $_SESSION['first_name'] = $user['first_name'];

                echo json_encode(['status' => 'success']);
            } else {
                echo json_encode(['status' => 'error', 'message' => 'Wrong email or password!']);
            }
        } else {
            // Wyświetlenie widoku logowania, jeśli nie jest to żądanie POST
            require_once 'app/views/signin.php';
        }
    }

    public function logout()
    {
        session_start();
        session_unset();
        session_destroy();
        header('Location: /budget-app-mvc/public/index.php?action=signin');
        exit();
    }

    public function showRegistrationForm()
    {
        require_once '../App/views/pages/registration.html';
    }

    public function showSigninForm()
    {
        require_once '../App/views/pages/signin.html';
    }
}