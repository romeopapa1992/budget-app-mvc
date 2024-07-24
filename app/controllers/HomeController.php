<?php

class HomeController {
    public function index() {
        require_once '../app/views/home/index.php';
    }

    public function signup() {
        require_once '../app/views/home/signup.php';
    }

    public function signin() {
        require_once '../app/views/home/signin.php';
    }
}