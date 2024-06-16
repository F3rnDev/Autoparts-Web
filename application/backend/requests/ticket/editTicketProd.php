<?php
include "../../connect.php";

if ($_SERVER['REQUEST_METHOD'] == "POST")
{
    $input = file_get_contents('php://input');
    $info = json_decode($input, true);

    $product = $info['product'];
    $qtd = $info['qtd'];
    $osID = $info['os'];
    $id = $info['id'];

    $comando = $pdo->prepare("UPDATE osprod SET prodID = $product, quant = $qtd WHERE osID = $osID AND prodID = $id");
    $resultado = $comando->execute();

    if ($resultado)
    {
        echo json_encode(["success" => "Produto editado com sucesso! $qtd $product $osID $id"]);
    }
    else
    {
        echo json_encode(["error" => "Erro ao editar produto"]);
    }
}