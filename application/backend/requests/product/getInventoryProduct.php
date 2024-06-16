<?php
include "../../connect.php";

if ($_SERVER['REQUEST_METHOD'] == 'GET')
{
    //get id from the request
    $id = $_GET['id'];

    $comando = $pdo->prepare("SELECT * FROM inventario WHERE ID = $id");
    $resultado = $comando->execute();
    $inventory = $comando->fetch(PDO::FETCH_ASSOC);

    for ($i = 0; $i < count($inventory); $i++)
    {
        $comando = $pdo->prepare("SELECT nome, valorUn FROM produto WHERE ID = " . $inventory['prodID']);
        $resultado = $comando->execute();
        $product = $comando->fetch(PDO::FETCH_ASSOC);

        $inventory['produto'] = $product['nome'];
        $inventory['valorUn'] = $product['valorUn'];
    }

    if($resultado)
    {
        echo json_encode($inventory);
    }
    else
    {
        echo json_encode(["error" => "Erro ao buscar ordens de serviço"]);
    }
}