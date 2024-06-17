<?php
include '../../connect.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = file_get_contents('php://input');
    $info = json_decode($input, true);

    $prodId = $info['prodId'];
    $qtd = $info['qtd'];
    $purchaseID = $info['purchaseID'];

    $comando = $pdo->prepare("INSERT INTO compraprod (compraID, prodID, quantidade) VALUES ($purchaseID, $prodId, $qtd)");
    $resultado = $comando->execute();

    if($resultado)
    {
        echo json_encode(["success" => "Produto adicionado com sucesso!"]);
    }
    else
    {
        echo json_encode(["error" => "Erro ao adicionar produto"]);
    }
}