<?php
include "../../connect.php";

if ($_SERVER['REQUEST_METHOD'] == "POST")
{
    $input = file_get_contents('php://input');
    $info = json_decode($input, true);

    $id = $info['id'];

    $comando = $pdo->prepare("DELETE FROM os WHERE ID = :id");
    $comando->bindParam(':id', $id);
    $resultado = $comando->execute();

    if($resultado)
    {
        //deletar de osProdutos
        $comando = $pdo->prepare("DELETE FROM osProd WHERE osID = :id");
        $comando->bindParam(":id", $id);
        $resultado = $comando->execute();

        if($resultado)
        {
            echo json_encode(["success" => "Ticket deletado com sucesso!"]);
        }
        else
        {
            echo json_encode(["error" => "Erro ao deletar ticket"]);
        }
    }
    else
    {
        echo json_encode(["error" => "Erro ao deletar ticket"]);
    }
}