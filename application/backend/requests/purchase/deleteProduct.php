<?php
include "../../connect.php";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = file_get_contents('php://input');
    $info = json_decode($input, true);

    $prodId = $info['prodId'];
    $purchaseID = $info['purchaseID'];

    $comando = $pdo->prepare("DELETE FROM compraprod WHERE compraID = $purchaseID AND prodID = $prodId");
    $resultado = $comando->execute();

    if ($resultado) {
        echo json_encode(["success" => "Produto deletado com sucesso!"]);
    } else {
        echo json_encode(["error" => "Erro ao deletar produto"]);
    }
}