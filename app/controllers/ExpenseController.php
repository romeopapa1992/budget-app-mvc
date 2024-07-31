<?php

require_once '../App/models/Expense.php';

class ExpenseController {
    public function add() {
        $expense = new Expense();
        $expense->amount = $_POST['amount'];
        $expense->date = $_POST['date'];
        $expense->category = $_POST['category'];
        $expense->payment_method = $_POST['payment_method'];
        $expense->comment = $_POST['comment'];
        $expense->user_id = $_SESSION['user_id'];

        if ($expense->save()) {
            echo json_encode(['status' => 'success']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Failed to add expense']);
        }
    }
}
?>
