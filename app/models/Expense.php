<?php

require_once '../config/database.php';

class Expense {
    public $id;
    public $amount;
    public $date;
    public $category;
    public $payment_method;
    public $comment;
    public $user_id;

    public function save() {
        global $db;
        $sql = 'INSERT INTO expenses (amount, date, category, payment_method, comment, user_id) VALUES (:amount, :date, :category, :payment_method, :comment, :user_id)';
        $query = $db->prepare($sql);
        $query->bindValue(':amount', $this->amount);
        $query->bindValue(':date', $this->date);
        $query->bindValue(':category', $this->category);
        $query->bindValue(':payment_method', $this->payment_method);
        $query->bindValue(':comment', $this->comment);
        $query->bindValue(':user_id', $this->user_id);
        return $query->execute();
    }
}
?>
