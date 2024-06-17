<?php
include '../../connect.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = file_get_contents('php://input');
    $info = json_decode($input, true);

    $status = $info['status'];
    $filial = $info['filial'];
    
    $comando = $pdo->prepare("INSERT INTO compra (status, filial) VALUES (:status, :filial)");
    $comando->bindParam(":status", $status);
    $comando->bindParam(":filial", $filial);
    $resultado = $comando->execute();

    if($resultado)
    {
        echo json_encode(["success" => "Compra adicionada com sucesso!"]);
    }
    else
    {
        echo json_encode(["error" => "Erro ao adicionar compra"]);
    }
}