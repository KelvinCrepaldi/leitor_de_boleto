# leitor_de_boleto

## Desafio

"Queremos poder através da aplicação consultar linhas digitáveis de boleto de título bancário
e pagamento de concessionárias, verificando se a mesma é válida ou não. Sendo válida e
possuindo valor e/ou data de vencimento ter o retorno desses dados."

Node.js Express.

baixar dependencias do projeto

- $ yarn install

iniciar app

- $ yarn app

iniciar testes

- $ yarn test

configuração da porta em .env
por padrão a porta é configurada para 8080 caso não seja especificada

rota: http://localhost:8080/boleto/<número do boleto>

# Diretório

criei uma representação grafica para me ajudar no projeto:
./blto.ods

Middleware - validateCodeMiddleware verifica o tipo de boleto, faz a validação dos códigos de DV e trata algumas exceptions.

Controllers - controle da rota de boleto que usa Services especificos para cada tipo de boleto.

Services - eu criei 2 services pois a logica dos 2 tipos de boletos tem muitas diferenças e o código ficaria muito grande.

obs: ainda estou aprendendo typescript, então só arrisquei algumas coisas.
