<?php
include "../../connect.php";

if ($_SERVER['REQUEST_METHOD'] == 'POST')
{
    $input = file_get_contents('php://input');
    $customer = json_decode($input, true);

    //set the values
    $nome = $customer['nome'];
    $cpf = $customer['cpf'];
    $phone = $customer['telefone'];
    $email = $customer['email'];
    $cep = $customer['cep'];
    $bairro = $customer['bairro'];
    $cidade = $customer['cidade'];
    $estado = $customer['estado'];
    $rua = $customer['rua'];
    $nume = $customer['numero'];
    $complemento = $customer['complemento'];

    $comando = $pdo->prepare("INSERT INTO `cliente`(`nome`, `cpf`, `telefone`, `email`, `cep`, `estado`, `cidade`, `bairro`, `rua`, `numero`, `complemento`)
    VALUES ('$nome','$cpf','$phone','$email','$cep','$estado','$cidade','$bairro','$rua','$nume','$complemento')");

    $resultado = $comando->execute();

    if ($resultado) {
        echo json_encode(["success" => "Cliente inserido com sucesso"]);
    } else {
        echo json_encode(["error" => "Erro ao inserir o cliente"]);
    }
}