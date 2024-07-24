<?php

require_once '../app/models/User.php';

class UserController {
    public function register() {
        $user = new User();
        $user->first_name = $_POST['first_name'];
        $user->last_name = $_POST['last_name'];
        $user->email = $_POST['email'];
        $user->password = password_hash($_POST['password'], PASSWORD_BCRYPT);

        if ($user->save()) {
            echo json_encode(['status' => 'success']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Registration failed']);
        }
    }

    public function login() {
        $user = User::findByEmail($_POST['email']);
        if ($user && password_verify($_POST['password'], $user->password)) {
            session_start();
            $_SESSION['user_id'] = $user->id;
            $_SESSION['first_name'] = $user->first_name;
            echo json_encode(['status' => 'success']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Wrong email or password!']);
        }
    }
}
?>
