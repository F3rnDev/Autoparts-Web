<?php
include "../../connect.php";

if ($_SERVER['REQUEST_METHOD'] == 'POST')
{
    $input = file_get_contents('php://input');
    $customerIds = json_decode($input, true);

    $results = [];
    $errors = [];

    foreach ($customerIds as $id) {
        // Usando placeholders para evitar injeção de SQL
        $comando = $pdo->prepare("DELETE FROM cliente WHERE ID = $id");
        $resultado = $comando->execute();

        if ($resultado) {
            $results[] = ["success" => "Cliente deletado com sucesso", "id" => $id];
        } else {
            $errors[] = ["error" => "Erro ao deletar cliente", "id" => $id, "errorInfo" => $comando->errorInfo()];
        }
    }

    if (count($errors) > 0) {
        echo json_encode(["error" => "Erro ao deletar o(s) cliente(s)", "result" => $errors]);
    } else {
        echo json_encode(["success" => "Cliente(s) deletado(s) com sucesso", "result" => $results]);
    }
}