<?php
include "../../connect.php";

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $input = file_get_contents('php://input');
    $info = json_decode($input, true);

    $id = $info['ID'];
    $name = $info['nome'];
    $type = $info['tipo'];
    $description = $info['descricao'];
    $value = $info['valorUn'];

    $comando = $pdo->prepare("UPDATE produto SET nome = :name, tipo = :type, descricao = :description, valorUn = :value WHERE ID = :id");

    $comando->bindParam(":id", $id);
    $comando->bindParam(":name", $name);
    $comando->bindParam(":type", $type);
    $comando->bindParam(":description", $description);
    $comando->bindParam(":value", $value);

    $resultado = $comando->execute();

    if ($resultado) {
        echo json_encode(["success" => "Produto atualizado com sucesso!"]);
    } else {
        echo json_encode(["error" => "Erro ao atualizar produto"]);
    }
}