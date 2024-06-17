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

    $comando = $pdo->prepare("INSERT INTO produto (ID, nome, tipo, descricao, valorUn) VALUES (:id, :name, :type, :description, :value)");

    $comando->bindParam(":id", $id);
    $comando->bindParam(":name", $name);
    $comando->bindParam(":type", $type);
    $comando->bindParam(":description", $description);
    $comando->bindParam(":value", $value);

    $resultado = $comando->execute();

    if ($resultado) {
        echo json_encode(["success" => "Produto criado com sucesso!"]);
    } else {
        echo json_encode(["error" => "Erro ao criar produto"]);
    }


}