<?php

class HomeController {
    public function index() {
        require_once '../App/views/pages/startPage.html';
    }

    public function registration() {
        require_once '../App/views/pages/registration.html';
    }

    public function signin() {
        require_once '../App/views/pages/signin.html';
    }

    public function balance() {
        require_once '../App/views/pages/balance.html';
    }

     public function expense() {
        require_once '../App/views/pages/expense.html';
    }

    public function income() {
        require_once '../App/views/pages/income.html';
    }

}