<?php

namespace App\Controllers;

use App\Models\User;
use PDO;

class SettingsController
{
    private $db;
    private $userModel;

    public function __construct(PDO $db)
    {
        $this->db = $db;
        $this->userModel = new User($db);
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

        if ($email && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $errors['email'] = 'Invalid email format.';
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
        header('Location: /budget-app-mvc/public/index.php?action=userSettings');
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

    public function showUserSettingsForm()
    {
        require_once '../App/views/pages/userSettings.html';
    }
}
