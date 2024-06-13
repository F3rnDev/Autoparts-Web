<?php
include "../../connect.php";

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $comando = $pdo->prepare("SELECT * FROM cliente");
    $resultado = $comando->execute();
    $customers = $comando->fetchAll(PDO::FETCH_ASSOC);

    if ($resultado) {
        echo json_encode($customers);
    } else {
        echo json_encode(["error" => "Erro ao buscar clientes"]);
    }
}