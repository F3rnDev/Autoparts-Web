<?php

include "../../connect.php";

if ($_SERVER['REQUEST_METHOD'] == "POST")
{
    $input = file_get_contents('php://input');
    $info = json_decode($input, true);

    $customer = $info['customer'];
    $employee = $info['employee'];
    $type = $info['type'];
    $date = $info['date'];
    $description = $info['description'];
    $status = $info['status'];

    $comando = $pdo->prepare("INSERT INTO os (clientID, funcID, tipo, dataInicio, descrição, status) VALUES ($customer, $employee, '$type', '$date', '$description', '$status')");
    $resultado = $comando->execute();

    if($resultado)
    {
        echo json_encode(["success" => "Ticket adicionado com sucesso!"]);
    }
    else
    {
        echo json_encode(["error" => "Erro ao adicionar ticket"]);
    }
}