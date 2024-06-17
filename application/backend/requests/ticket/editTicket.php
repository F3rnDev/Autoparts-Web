<?php

include "../../connect.php";

if ($_SERVER['REQUEST_METHOD'] == "POST")
{
    $input = file_get_contents('php://input');
    $info = json_decode($input, true);

    $id = $info['id'];
    $customer = $info['customer'];
    $employee = $info['employee'];
    $type = $info['type'];
    $date = $info['date'];
    $endDate = $info['endDate'];
    $description = $info['description'];
    $serviceVal = $info['value'];
    $status = $info['status'];


    $comando = $pdo->prepare("UPDATE os SET 
    clientID = :customer, 
    funcID = :employee, 
    tipo = :type, 
    dataInicio = :date, 
    dataFim = :endDate, 
    descrição = :description,  
    valorServiço = :serviceVal, 
    status = :status 
    WHERE ID = :id");

    // Vincular os parâmetros com os valores correspondentes
    $comando->bindParam(':customer', $customer);
    $comando->bindParam(':employee', $employee);
    $comando->bindParam(':type', $type);
    $comando->bindParam(':date', $date);
    $comando->bindParam(':endDate', $endDate);
    $comando->bindParam(':description', $description);
    $comando->bindParam(':serviceVal', $serviceVal);
    $comando->bindParam(':status', $status);
    $comando->bindParam(':id', $id);

    // Executar o comando
    $resultado = $comando->execute();

    if($resultado)
    {
        if ($status == 'concluido')
        {
            $comando = $pdo->prepare('SELECT * FROM osprod WHERE osID = :id');
            $comando->bindParam(':id', $id);
            $resultado = $comando->execute();
            $products = $comando->fetchAll(PDO::FETCH_ASSOC);

            $results = [];
            
            foreach ($products as $product)
            {
                $comando = $pdo->prepare('SELECT * FROM inventario WHERE ID = :id');
                $comando->bindParam(':id', $product['prodID']);
                $resultado = $comando->execute();
                $productInfo = $comando->fetch(PDO::FETCH_ASSOC);

                $comando = $pdo->prepare('UPDATE inventario SET quantidade = :quantidade WHERE ID = :id');

                $qtd = $productInfo['quantidade'] - $product['quant'];

                $comando->bindParam(':quantidade', $qtd);
                $comando->bindParam(':id', $productInfo['ID']);
                $resultado = $comando->execute();

                if($resultado)
                {
                    $results[] = 'success';
                }
            }

            if (count($results) == count($products))
            {
                echo json_encode(["success" => "Ticket editado com sucesso!"]);
            }
            else
            {
                echo json_encode(["error" => "Erro ao editar ticket"]);
            }
        }
        else
        {
            echo json_encode(["success" => "Ticket editado com sucesso!"]);
        }
    }
    else
    {
        echo json_encode(["error" => "Erro ao editar ticket"]);
    }
}