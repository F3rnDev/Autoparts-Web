<?php
include '../../connect.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $input = file_get_contents('php://input');
    $info = json_decode($input, true);

    $id = $info['ID'];
    $qtd = $info['quantidade'];

    $comando = $pdo->prepare("UPDATE inventario SET quantidade = :qtd WHERE id = :id");
    $comando->bindParam(":id", $id);
    $comando->bindParam(":qtd", $qtd);
    $resultado = $comando->execute();

    if ($resultado)
    {
        echo json_encode(["success" => "Inventário atualizado com sucesso!"]);
    }
    else
    {
        echo json_encode(["error" => "Erro ao atualizar inventário"]);
    }
}