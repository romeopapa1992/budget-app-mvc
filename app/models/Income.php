<?php

require_once '../config/database.php';

class Income {
    public $id;
    public $amount;
    public $date;
    public $category;
    public $comment;
    public $user_id;

    public function save() {
        global $db;
        $sql = 'INSERT INTO incomes (amount, date, category, comment, user_id) VALUES (:amount, :date, :category, :comment, :user_id)';
        $query = $db->prepare($sql);
        $query->bindValue(':amount', $this->amount);
        $query->bindValue(':date', $this->date);
        $query->bindValue(':category', $this->category);
        $query->bindValue(':comment', $this->comment);
        $query->bindValue(':user_id', $this->user_id);
        return $query->execute();
    }
}
?>
