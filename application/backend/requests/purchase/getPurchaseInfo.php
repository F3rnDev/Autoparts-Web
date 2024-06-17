<?php
include "../../connect.php";

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $id = $_GET['id'];

    $comando = $pdo->prepare("SELECT * FROM compra WHERE ID = :id");
    $comando->bindParam(":id", $id);
    $resultado = $comando->execute();
    $purchase = $comando->fetch(PDO::FETCH_ASSOC);

    $comando = $pdo->prepare("SELECT * FROM compraprod WHERE compraID = :id");
    $comando->bindParam(":id", $purchase["ID"]);
    $resultado = $comando->execute();
    $purchase['products'] = $comando->fetchAll(PDO::FETCH_ASSOC);

    if ($resultado) {
        echo json_encode($purchase);
    } 
    else {
        echo json_encode(["error" => "Erro ao buscar compras"]);
    }
}