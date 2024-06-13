<?php
include "../../connect.php";

if ($_SERVER['REQUEST_METHOD'] == 'POST')
{
    $input = file_get_contents('php://input');
    $customer = json_decode($input, true);

    //set the values
    $id = $customer['ID'];
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

    $comando = $pdo->prepare("UPDATE `cliente` SET `nome`='$nome',`cpf`='$cpf',`telefone`='$phone',`email`='$email',
    `cep`='$cep',`estado`='$estado',`cidade`='$cidade',`bairro`='$bairro',`rua`='$rua',`numero`='$nume',`complemento`='$complemento' WHERE `ID` = $id");

    $resultado = $comando->execute();

    if ($resultado) {
        echo json_encode(["success" => "Cliente alterado com sucesso"]);
    } else {
        echo json_encode(["error" => "Erro ao alterar o cliente"]);
    }
}