<?php

namespace App\Config;
use App\Middleware\AuthMiddleware;

class Router
{
    private $db;
    private $routes = []; 

    public function __construct($db)
    {
        $this->db = $db;
        session_start();
    }

    public function add($path, $controller, $method, $authRequired = false)
    {
        $this->routes[$path] = [
            'controller' => $controller,
            'method' => $method,
            'authRequired' => $authRequired
        ];
    }

    public function handle($path)
    {
        if (isset($this->routes[$path])) {
            $controllerName = $this->routes[$path]['controller'];
            $methodName = $this->routes[$path]['method'];
            $authRequired = $this->routes[$path]['authRequired'];

            if ($authRequired) {
                AuthMiddleware::handle();
            }
            
            $controller = new $controllerName($this->db); 
            if (method_exists($controller, $methodName)) {
                $controller->$methodName();
            } else {
                echo "Method $methodName not found in controller $controllerName.";
            }
        } else {
            http_response_code(404);
            echo "Page not found.";
        }
    }
}