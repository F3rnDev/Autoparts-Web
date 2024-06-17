<?php
include '../../connect.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = file_get_contents('php://input');
    $info = json_decode($input, true);

    $prodId = $info['prodId'];
    $qtd = $info['qtd'];
    $purchaseID = $info['purchaseID'];

    $comando = $pdo->prepare("UPDATE compraprod SET quantidade = $qtd WHERE compraID = $purchaseID AND prodID = $prodId");
    $resultado = $comando->execute();

    if ($resultado) {
        echo json_encode(["success" => "Produto editado com sucesso!"]);
    } else {
        echo json_encode(["error" => "Erro ao editar produto"]);
    }
}