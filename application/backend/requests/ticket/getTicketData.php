<?php
include "../../connect.php";

if ($_SERVER['REQUEST_METHOD'] == 'GET')
{
    //get id from the request
    $id = $_GET['id'];

    $comando = $pdo->prepare("SELECT * FROM os WHERE id = $id");
    $resultado = $comando->execute();
    $ticket = $comando->fetch(PDO::FETCH_ASSOC);

    //get products from osProd
    for ($i = 0; $i < count($ticket); $i++)
    {
        $comando = $pdo->prepare("SELECT * FROM osprod WHERE osID = " . $ticket['ID']);
        $resultado = $comando->execute();
        $products = $comando->fetchAll(PDO::FETCH_ASSOC);

        $ticket['products'] = $products;
    }

    if($resultado)
    {
        echo json_encode($ticket);
    }
    else
    {
        echo json_encode(["error" => "Erro ao buscar ordens de serviço"]);
    }
}