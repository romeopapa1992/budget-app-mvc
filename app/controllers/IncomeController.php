<?php

require_once '../app/models/Income.php';

class IncomeController {
    public function add() {
        $income = new Income();
        $income->amount = $_POST['amount'];
        $income->date = $_POST['date'];
        $income->category = $_POST['category'];
        $income->comment = $_POST['comment'];
        $income->user_id = $_SESSION['user_id'];

        if ($income->save()) {
            echo json_encode(['status' => 'success']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Failed to add income']);
        }
    }
}
?>
