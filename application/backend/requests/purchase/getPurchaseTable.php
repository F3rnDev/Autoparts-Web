<?php

include '../../connect.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $comando = $pdo->prepare("SELECT * FROM compra");
    $resultado = $comando->execute();
    $purchase = $comando->fetchAll(PDO::FETCH_ASSOC);

    if ($resultado) {
        echo json_encode($purchase);
    } 
    else {
        echo json_encode(["error" => "Erro ao buscar compras"]);
    }
}