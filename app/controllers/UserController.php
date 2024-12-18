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
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {

            $name = trim($_POST['name']);
            $surname = trim($_POST['surname']);
            $email = trim($_POST['email']);
            $password = $_POST['password'];

            $errors = [];
        
            if ($this->userModel->checkEmailExists($email)) {
                $errors['email'] = 'Email already exists.';
            }
            
            if (!preg_match('/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^\da-zA-Z]).{8,}$/', $password)) {
                $errors['password'] = 'Passwords must meet complexity requirements.';
            }

            if ($errors) {
                echo json_encode(['status' => 'error', 'errors' => $errors]);
                return;
            }

            $hashedPassword = password_hash($password, PASSWORD_BCRYPT);

            $isCreated = $this->userModel->createUser($name, $surname, $email, $hashedPassword);
            echo json_encode([
                'status' => $isCreated ? 'success' : 'error',
                'message' => $isCreated ? 'Registration successful.' : 'Registration failed.'
            ]);
        } else {
            require_once '../App/views/pages/registration.html';
            exit();
        }
    }

    public function signin()
    {
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            $email = $_POST['email'];
            $password = $_POST['password'];

            $user = $this->userModel->getUserByEmail($email);

            if ($user && password_verify($password, $user['password'])) {
                if (session_status() == PHP_SESSION_NONE) {
                    session_start();
                }
                $_SESSION['user_id'] = $user['id'];
                $_SESSION['email'] = $user['email'];

                echo json_encode(['status' => 'success', 'message' => 'Login successful!']);
                return;
            } else {
                echo json_encode(['status' => 'error', 'message' => 'Wrong email or password!']);
                return;
            }
        } else {
        require_once '../App/views/pages/signin.html'; 
        }
    }

    public function updateUser()
    {
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            $userId = $_SESSION['user_id'];
            $name = !empty(trim($_POST['name'])) ? trim($_POST['name']) : null;
            $surname = !empty(trim($_POST['surname'])) ? trim($_POST['surname']) : null;
            $email = !empty(trim($_POST['email'])) ? trim($_POST['email']) : null;
            $password = !empty($_POST['password']) ? $_POST['password'] : null;

            $errors = [];

            if (empty($name) && empty($surname) && empty($email) && empty($password)) {
                $errors['general'] = 'At least one field must be filled to update.';
            }

            if ($email && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
                $errors['email'] = 'Invalid email format.';
            }

            if ($email && $this->userModel->checkEmailExists($email)) {
                $errors['email'] = 'Email already exists.';
            }

            if ($password && !preg_match('/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^\da-zA-Z]).{8,}$/', $password)) {
                $errors['password'] = 'Password must meet complexity requirements.';
            }

            if (!empty($errors)) {
                echo json_encode(['status' => 'error', 'errors' => $errors]);
                return;
            }

            if ($name || $surname || $email) {
                $this->userModel->updateUser($userId, $name, $surname, $email);
            }

            if ($password) {
                $hashedPassword = password_hash($password, PASSWORD_BCRYPT);
                $this->userModel->updateUserPassword($userId, $hashedPassword);
            }

            echo json_encode(['status' => 'success', 'message' => 'User data updated successfully.']);
        } else {
            header('Location: /userSettings');
            exit();
        }
    }

    public function deleteUser()
    {
        if (session_status() == PHP_SESSION_NONE) {
            session_start();
        }

        $userId = $_SESSION['user_id'];

        if ($this->userModel->deleteUserById($userId)) {
            session_unset();
            session_destroy();
            echo json_encode(['status' => 'success', 'message' => 'Account deleted successfully.']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Failed to delete account.']);
        }
    }

    public function logout()
    {
        if (session_status() == PHP_SESSION_NONE) {
         session_start();
        }
        session_unset();
        session_destroy();
        header('Location: / ');
        exit();
    }
}