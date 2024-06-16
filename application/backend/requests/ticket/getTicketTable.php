<?php
include "../../connect.php";

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $comando = $pdo->prepare("SELECT * FROM os");
    $resultado = $comando->execute();
    $tickets = $comando->fetchAll(PDO::FETCH_ASSOC);

    //adicionar nome do cliente usando o id
    for ($i = 0; $i < count($tickets); $i++) {
        $comando = $pdo->prepare("SELECT nome FROM cliente WHERE id = " . $tickets[$i]['clientID']);
        $resultado = $comando->execute();
        $cliente = $comando->fetch(PDO::FETCH_ASSOC);

        $comando = $pdo->prepare("SELECT nome FROM funcionario WHERE id = " . $tickets[$i]['funcID']);
        $resultado = $comando->execute();
        $func = $comando->fetch(PDO::FETCH_ASSOC);

        $tickets[$i]['cliente'] = $cliente['nome'];
        $tickets[$i]['funcionario'] = $func['nome'];
    }


    if ($resultado) {
        echo json_encode($tickets);
    } else {
        echo json_encode(["error" => "Erro ao buscar ordens de serviço"]);
    }
}