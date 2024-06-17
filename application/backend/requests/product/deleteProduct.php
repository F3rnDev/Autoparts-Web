<?php
include "../../connect.php";

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $input = file_get_contents('php://input');
    $info = json_decode($input, true);

    $id = $info['ID'];

    $comando = $pdo->prepare("DELETE FROM produto WHERE ID = $id");
    $resultado = $comando->execute();

    if ($resultado) {
        echo json_encode(["success" => "Produto deletado com sucesso!"]);
    } else {
        //checar se o produto está associado no inventário
        $comando = $pdo->prepare("SELECT * FROM inventario WHERE prodID = $id");
        $resultado = $comando->execute();
        $product = $comando->fetchAll(PDO::FETCH_ASSOC);

        if(count($product) > 0)
        {
            echo json_encode(["error" => "Produto está associado a um inventário"]);
        }
        else {
            echo json_encode(["error" => "Erro ao deletar produto"]);
        }
    }
}