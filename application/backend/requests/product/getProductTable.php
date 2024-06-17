<?php

include "../../connect.php";

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $comando = $pdo->prepare("SELECT * FROM produto");
    $resultado = $comando->execute();
    $products = $comando->fetchAll(PDO::FETCH_ASSOC);

    if ($resultado) {
        echo json_encode($products);
    } else {
        echo json_encode(["error" => "Erro ao buscar produtos"]);
    }
}