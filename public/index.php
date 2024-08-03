 <?php

require_once '../vendor/autoload.php';

require_once '../App/Config/database.php';

use App\Controllers\HomeController;
use App\Controllers\UserController;

$homeController = new HomeController();
$userController = new UserController($db);

if (isset($_GET['action'])) {
    switch ($_GET['action']) {
        case 'registration':
            if ($_SERVER['REQUEST_METHOD'] === 'POST') {
                $userController->registration();
            } else {
                $userController->showRegistrationForm();
            }
            break;
        case 'signin':
            $homeController->signin();
            break;
        case 'balance':
            $homeController->balance();
            break;
        default:
            $homeController->index();
            break;
    }
} else {
    $homeController->index();
}