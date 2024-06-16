<?php
include "../../connect.php";

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $comando = $pdo->prepare("SELECT * FROM funcionario");
    $resultado = $comando->execute();
    $employees = $comando->fetchAll(PDO::FETCH_ASSOC);

    if ($resultado) {
        echo json_encode($employees);
    } else {
        echo json_encode(["error" => "Erro ao buscar clientes"]);
    }
}