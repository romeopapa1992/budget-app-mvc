<?php

class HomeController {
    public function index() {
        require_once '../App/views/pages/startPage.html';
    }

    public function signup() {
        require_once '../App/views/pages/signup.html';
    }

    public function signin() {
        require_once '../App/views/pages/signin.html';
    }
}