<?php

class HomeController {
    public function index() {
        require_once '../app/views/home/startPage.php';
    }

    public function signup() {
        require_once '../app/views/home/signup.php';
    }

    public function signin() {
        require_once '../app/views/home/signin.php';
    }
}