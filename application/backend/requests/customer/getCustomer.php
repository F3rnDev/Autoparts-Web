<?php
include "../../connect.php";

if ($_SERVER['REQUEST_METHOD'] == 'GET')
{
    //get id from the request
    $id = $_GET['id'];

    $comando = $pdo->prepare("SELECT * FROM cliente WHERE id = $id");
    $resultado = $comando->execute();
    $customerInfo = $comando->fetch(PDO::FETCH_ASSOC);

    if ($resultado) {
        echo json_encode($customerInfo);
    } else {
        echo json_encode(["error" => "Erro ao buscar clientes"]);
    }
}