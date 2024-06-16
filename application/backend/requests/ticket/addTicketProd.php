<?php
include "../../connect.php";

if ($_SERVER['REQUEST_METHOD'] == "POST")
{
    $input = file_get_contents('php://input');
    $info = json_decode($input, true);

    $product = $info['product'];
    $qtd = $info['qtd'];
    $osID = $info['os'];

    $comando = $pdo->prepare("INSERT INTO osprod (osID, prodID, quant) VALUES ($osID, $product, $qtd)");
    $resultado = $comando->execute();

    if ($resultado)
    {
        echo json_encode(["success" => "Produto adicionado com sucesso!"]);
    }
    else
    {
        echo json_encode(["error" => "Erro ao buscar ordens de serviço"]);
    }
}