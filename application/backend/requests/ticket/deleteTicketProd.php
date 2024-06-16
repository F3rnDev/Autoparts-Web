<?php
include "../../connect.php";

if ($_SERVER['REQUEST_METHOD'] == "POST")
{
    $input = file_get_contents('php://input');
    $info = json_decode($input, true);

    $id = $info['id'];
    $osID = $info['os'];

    $comando = $pdo->prepare("DELETE FROM osprod WHERE osID = $osID AND prodID = $id");
    $resultado = $comando->execute();

    if ($resultado)
    {
        echo json_encode(["success" => "Produto deletado com sucesso!"]);
    }
    else
    {
        echo json_encode(["error" => "Erro ao deletar produto"]);
    }
}