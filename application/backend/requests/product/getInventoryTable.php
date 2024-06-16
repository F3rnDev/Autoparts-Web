<?php
include "../../connect.php";

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $comando = $pdo->prepare("SELECT * FROM inventario");
    $resultado = $comando->execute();
    $inventory = $comando->fetchAll(PDO::FETCH_ASSOC);

    for ($i = 0; $i < count($inventory); $i++) {
        $comando = $pdo->prepare("SELECT nome FROM produto WHERE id = " . $inventory[$i]['prodID']);
        $resultado = $comando->execute();
        $product = $comando->fetch(PDO::FETCH_ASSOC);

        $inventory[$i]['produto'] = $product['nome'];
    }

    if ($resultado) {
        echo json_encode($inventory);
    } else {
        echo json_encode(["error" => "Erro ao buscar clientes"]);
    }
}