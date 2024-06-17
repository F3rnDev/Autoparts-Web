<?php
include '../../connect.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $input = file_get_contents('php://input');
    $info = json_decode($input, true);

    $id = $info['ID'];

    $comando = $pdo->prepare("DELETE FROM compra WHERE ID = :id");
    $comando->bindParam(":id", $id);
    $resultado = $comando->execute();

    if ($resultado)
    {
        $comando = $pdo->prepare("DELETE FROM compraprod WHERE compraID = :id");
        $comando->bindParam(":id", $id);
        $resultado = $comando->execute();

        if ($resultado)
        {
            echo json_encode(["success" => "Compra deletada com sucesso!"]);
        }
        else
        {
            echo json_encode(["error" => "Erro ao deletar compra"]);
        }
    } 
    else
    {
        echo json_encode(["error" => "Erro ao deletar compra"]);
    }
}