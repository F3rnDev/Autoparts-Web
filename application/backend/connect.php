<?php

date_default_timezone_set('America/Sao_Paulo');

$name = "autopartsweb";
$host = "localhost";

try{
    $pdo = new PDO("mysql:dbname=$name;host=$host;
    charset=utf8","root","");
}
catch(PDOException $erro)
{
    echo("ERRO NA CONEXÃO: <br> ".$erro->getMessage());
}

?>
