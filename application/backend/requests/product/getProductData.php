<?php
include "../../connect.php";

if ($_SERVER['REQUEST_METHOD'] == 'GET') {

    $id = $_GET['id'];

    $comando = $pdo->prepare("SELECT * FROM produto WHERE id = :id");
    $comando->bindParam(":id", $id);
    $resultado = $comando->execute();
    $product = $comando->fetch(PDO::FETCH_ASSOC);

    if ($resultado) {
        echo json_encode($product);
    } else {
        echo json_encode(["error" => "Erro ao buscar produtos"]);
    }
}