-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 17-Jun-2024 às 22:40
-- Versão do servidor: 10.4.24-MariaDB
-- versão do PHP: 7.4.29

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `autopartsweb`
--

-- --------------------------------------------------------

--
-- Estrutura da tabela `cliente`
--

CREATE TABLE `cliente` (
  `ID` int(11) NOT NULL,
  `nome` varchar(50) NOT NULL,
  `cpf` varchar(50) NOT NULL,
  `telefone` varchar(10) NOT NULL,
  `email` varchar(50) NOT NULL,
  `cep` varchar(8) NOT NULL,
  `estado` varchar(50) NOT NULL,
  `cidade` varchar(50) NOT NULL,
  `bairro` varchar(50) NOT NULL,
  `rua` varchar(50) NOT NULL,
  `numero` varchar(10) NOT NULL,
  `complemento` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Extraindo dados da tabela `cliente`
--

INSERT INTO `cliente` (`ID`, `nome`, `cpf`, `telefone`, `email`, `cep`, `estado`, `cidade`, `bairro`, `rua`, `numero`, `complemento`) VALUES
(25, 'Oloco Carneiro', '70283449675', '3488888888', 'teste@teste.teste', '89203522', 'SC', 'Joinville', 'Anita Garibaldi', 'Rua Gothard Kaesemodel', '123', 'casa'),
(26, 'Roberto Carlos', '70283449675', '3212342324', 'dsadsa@sdada.com', '89203522', 'SC', 'Joinville', 'Anita Garibaldi', 'Rua Gothard Kaesemodel', '123', 'casa');

-- --------------------------------------------------------

--
-- Estrutura da tabela `compra`
--

CREATE TABLE `compra` (
  `ID` int(11) NOT NULL,
  `filial` varchar(50) NOT NULL,
  `status` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Extraindo dados da tabela `compra`
--

INSERT INTO `compra` (`ID`, `filial`, `status`) VALUES
(18, 'Joinville - SC', 'entregue');

-- --------------------------------------------------------

--
-- Estrutura da tabela `compraprod`
--

CREATE TABLE `compraprod` (
  `ID` int(11) NOT NULL,
  `compraID` int(11) NOT NULL,
  `prodID` varchar(50) NOT NULL,
  `quantidade` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Extraindo dados da tabela `compraprod`
--

INSERT INTO `compraprod` (`ID`, `compraID`, `prodID`, `quantidade`) VALUES
(33, 8, '31242321', 5),
(34, 8, '543865', 9),
(35, 9, '31242321', 4),
(36, 9, '543865', 10),
(37, 10, '543865', 1),
(38, 11, '543865', 5),
(39, 12, '31242321', 5),
(40, 13, '31242321', 5),
(41, 14, '543865', 5),
(46, 18, '31242321', 1);

-- --------------------------------------------------------

--
-- Estrutura da tabela `funcionario`
--

CREATE TABLE `funcionario` (
  `ID` int(11) NOT NULL,
  `nome` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `senha` varchar(50) NOT NULL,
  `telefone` varchar(10) NOT NULL,
  `nascData` date NOT NULL,
  `tipo` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Extraindo dados da tabela `funcionario`
--

INSERT INTO `funcionario` (`ID`, `nome`, `email`, `senha`, `telefone`, `nascData`, `tipo`) VALUES
(1, 'teste', 'teste@teste.com', 'ersters', '3434243232', '2024-06-14', 'funcionario');

-- --------------------------------------------------------

--
-- Estrutura da tabela `inventario`
--

CREATE TABLE `inventario` (
  `ID` int(11) NOT NULL,
  `prodID` varchar(50) NOT NULL,
  `filial` varchar(50) NOT NULL,
  `quantidade` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Extraindo dados da tabela `inventario`
--

INSERT INTO `inventario` (`ID`, `prodID`, `filial`, `quantidade`) VALUES
(1, '543865', 'Joinville - SC', 15),
(9, '31242321', 'Joinville - SC', 9),
(10, '543865', 'São Paulo - SP', 5);

-- --------------------------------------------------------

--
-- Estrutura da tabela `os`
--

CREATE TABLE `os` (
  `ID` int(11) NOT NULL,
  `tipo` varchar(50) NOT NULL,
  `status` varchar(50) NOT NULL,
  `clientID` int(11) NOT NULL,
  `funcID` int(11) NOT NULL,
  `dataInicio` date NOT NULL,
  `dataFim` date DEFAULT NULL,
  `descrição` varchar(100) NOT NULL,
  `valorServiço` decimal(6,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Extraindo dados da tabela `os`
--

INSERT INTO `os` (`ID`, `tipo`, `status`, `clientID`, `funcID`, `dataInicio`, `dataFim`, `descrição`, `valorServiço`) VALUES
(23, 'diagnostico', 'em andamento', 26, 1, '2024-06-16', NULL, 'teste', NULL),
(25, 'vendaPeca', 'concluido', 25, 1, '2024-06-17', '2024-06-17', 'teste', '23.43');

-- --------------------------------------------------------

--
-- Estrutura da tabela `osprod`
--

CREATE TABLE `osprod` (
  `ID` int(11) NOT NULL,
  `osID` int(11) NOT NULL,
  `prodID` int(11) NOT NULL,
  `quant` int(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Extraindo dados da tabela `osprod`
--

INSERT INTO `osprod` (`ID`, `osID`, `prodID`, `quant`) VALUES
(64, 23, 1, 1),
(65, 25, 1, 4);

-- --------------------------------------------------------

--
-- Estrutura da tabela `produto`
--

CREATE TABLE `produto` (
  `ID` varchar(50) NOT NULL,
  `nome` varchar(50) NOT NULL,
  `tipo` varchar(50) NOT NULL,
  `descricao` varchar(100) NOT NULL,
  `valorUn` decimal(5,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Extraindo dados da tabela `produto`
--

INSERT INTO `produto` (`ID`, `nome`, `tipo`, `descricao`, `valorUn`) VALUES
('31242321', 'teste', 'peca', 'teste', '20.00'),
('543865', 'Parafuso Mudado', 'peca', 'MEU DEUS ALTEREI', '15.00');

-- --------------------------------------------------------

--
-- Estrutura da tabela `userauth`
--

CREATE TABLE `userauth` (
  `ID` int(11) NOT NULL,
  `funcID` int(11) NOT NULL,
  `token` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Índices para tabelas despejadas
--

--
-- Índices para tabela `cliente`
--
ALTER TABLE `cliente`
  ADD PRIMARY KEY (`ID`);

--
-- Índices para tabela `compra`
--
ALTER TABLE `compra`
  ADD PRIMARY KEY (`ID`);

--
-- Índices para tabela `compraprod`
--
ALTER TABLE `compraprod`
  ADD PRIMARY KEY (`ID`);

--
-- Índices para tabela `funcionario`
--
ALTER TABLE `funcionario`
  ADD PRIMARY KEY (`ID`);

--
-- Índices para tabela `inventario`
--
ALTER TABLE `inventario`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `prodID` (`prodID`);

--
-- Índices para tabela `os`
--
ALTER TABLE `os`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `clientID` (`clientID`),
  ADD KEY `funcID` (`funcID`);

--
-- Índices para tabela `osprod`
--
ALTER TABLE `osprod`
  ADD PRIMARY KEY (`ID`);

--
-- Índices para tabela `produto`
--
ALTER TABLE `produto`
  ADD PRIMARY KEY (`ID`);

--
-- Índices para tabela `userauth`
--
ALTER TABLE `userauth`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `funcID` (`funcID`);

--
-- AUTO_INCREMENT de tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `cliente`
--
ALTER TABLE `cliente`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT de tabela `compra`
--
ALTER TABLE `compra`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT de tabela `compraprod`
--
ALTER TABLE `compraprod`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=47;

--
-- AUTO_INCREMENT de tabela `funcionario`
--
ALTER TABLE `funcionario`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de tabela `inventario`
--
ALTER TABLE `inventario`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de tabela `os`
--
ALTER TABLE `os`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT de tabela `osprod`
--
ALTER TABLE `osprod`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=70;

--
-- AUTO_INCREMENT de tabela `userauth`
--
ALTER TABLE `userauth`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- Restrições para despejos de tabelas
--

--
-- Limitadores para a tabela `inventario`
--
ALTER TABLE `inventario`
  ADD CONSTRAINT `inventario_ibfk_1` FOREIGN KEY (`prodID`) REFERENCES `produto` (`ID`);

--
-- Limitadores para a tabela `os`
--
ALTER TABLE `os`
  ADD CONSTRAINT `os_ibfk_2` FOREIGN KEY (`clientID`) REFERENCES `cliente` (`ID`),
  ADD CONSTRAINT `os_ibfk_3` FOREIGN KEY (`funcID`) REFERENCES `funcionario` (`ID`);

--
-- Limitadores para a tabela `userauth`
--
ALTER TABLE `userauth`
  ADD CONSTRAINT `userauth_ibfk_1` FOREIGN KEY (`funcID`) REFERENCES `funcionario` (`ID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
