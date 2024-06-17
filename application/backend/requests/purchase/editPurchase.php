<?php
include '../../connect.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $input = file_get_contents('php://input');
    $info = json_decode($input, true);

    $id = $info['ID'];
    $status = $info['status'];
    $filial = $info['filial'];

    $comando = $pdo->prepare("UPDATE compra SET status = :status, filial = :filial WHERE ID = :id");
    $comando->bindParam(":id", $id);
    $comando->bindParam(":filial", $filial);
    $comando->bindParam(":status", $status);

    $resultado = $comando->execute();

    if ($resultado)
    {
        if ($status == "entregue")
        {
            $comando = $pdo->prepare("SELECT * FROM compraprod WHERE compraID = :id");
            $comando->bindParam(":id", $id);
            $comando->execute();
            $compraProdutos = $comando->fetchAll(PDO::FETCH_ASSOC);

            $results = [];
            foreach ($compraProdutos as $compraProduto)
            {
                $comando = $pdo->prepare("SELECT * FROM inventario WHERE prodID = :id");
                $comando->bindParam(":id", $compraProduto['prodID']);
                $comando->execute();
                $produto = $comando->fetch(PDO::FETCH_ASSOC);
    
                if ($produto != false && $produto['filial'] == $filial)
                {
                    $finalQuantity = $produto['quantidade'] + $compraProduto['quantidade'];
                    $comando = $pdo->prepare("UPDATE inventario SET quantidade = :quantidade WHERE ID = :id");
                    $comando->bindParam(":quantidade", $finalQuantity);
                    $comando->bindParam(":id", $produto["ID"]);

                    $resultado = $comando->execute();

                    if ($resultado)
                    {
                        $results[] = 'success';
                    }
                    else
                    {
                        $results[] = 'error';
                    }
                }
                else
                {
                    $comando = $pdo->prepare("INSERT INTO inventario (prodID, quantidade, filial) VALUES (:prodID, :quantidade, :filial)");
                    $comando->bindParam(":prodID", $compraProduto['prodID']);
                    $comando->bindParam(":quantidade", $compraProduto['quantidade']);
                    $comando->bindParam(":filial", $filial);

                    $resultado = $comando->execute();

                    if ($resultado)
                    {
                        $results[] = 'success';
                    }
                    else
                    {
                        $results[] = 'error';
                    }
                }
            }

            if (in_array('error', $results))
            {
                echo json_encode(["error" => "Erro ao atualizar compra"]);
            }
            else
            {
                echo json_encode(["success" => "Compra atualizada com sucesso!"]);
            }
        }
        else
        {
            echo json_encode(["success" => "Compra atualizada com sucesso!"]);
        }
    } else {
        echo json_encode(["error" => "Erro ao atualizar compra"]);
    }
}