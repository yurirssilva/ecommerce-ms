# Checkout de E-commerce
Projeto de arquitetura de microserviços baseado em eventos. As atribuições do projeto foram divididos da forma abaixo:

#### bff-api
    - Backend for Frontend (centraliza a comunicação com os microserviços)
#### checkout-svc
    - Serviço de Checkout
#### payments-svc
    - Serviço de Pagamentos
#### shipping-svc
    - Serviço de Expedição

# Stack Utilizada
- Node.JS + NestJs
- Typescript
- RabbitMQ - Message Broker para eventos
- MongoDB
- Mongoose - ODM
- Jest + Supertest - Testes unitários e e2e
- Docker + Docker Compose – Para execução centralizada dos serviços


#  Descrição dos Serviços
## Checkout Service
- Cria e consulta checkouts
- Emite eventos de checkout.created via RabbitMQ
- Consome eventos de payment_events e shipping_events para atualizar o status do checkout

## Payment Service
- Consome eventos de checkout criado (checkout.created) para iniciar o pagamento
- Processa pagamentos de forma mockada, nesse ponto coloquei um pequeno delay para simular o processamento e em 30% dos casos retorna falha no pagamento
- Publica eventos payment_events (SUCCESS, FAILED). Como tanto o checkout, quanto o shipping consomem este evento optei por usar um exchange por conta da concorrência no consumo das mensagem.
- Possui um controller para retornar os dados do pagamento

## Shipping Service
- Consome eventos de payment pago
- Processa o envio 
- Publica eventos em shipping_events
- Possui um controller para retornar os dados da expedição

## BFF API
- Agrega informações de Checkout, Payment e Shipping
- Possui endpoint para inicializar o checkout
- Oferece endpoints para o front-end consultar pedidos agregados, e dados individuais do checkout, payment e shipping

# Execução
1. Para execução da aplicação
    - docker-compose up --build
2. A API estará disponível em http://localhost:3000
3. A documentação no swagger pode ser acessada em http://localhost:3000/docs
4. Para execução dos testes
    - docker-compose up --build tests

# Endpoints principais
## BFF
POST /orders → Cria checkout  
GET /orders/:checkoutId → Retorna agregação de checkout, pagamento e shipping


Exemplo:
```javascript 
{            
        customerId: '04b0e90e-8263-4ff7-b6d9-d205ed8aa2d1',
        items: [{ productId: 'p1', quantity: 2 }],
        total: 100
}
```
GET /health -> Retorna o status do BFF e de cada serviço

## Checkout
GET /checkout/:id → Consulta checkout  
GET /checkout/health -> Retorna o status do serviço de checkout

## Payment
GET /payments/:id → Consulta pagamento por checkoutId  
GET /payments/health -> Retorna o status do serviço de payments

## Shipping
GET /shippings/:id → Consulta shipping por checkoutId  
GET /shippings/health -> Retorna o status do serviço de shipping



# Boas práticas e padrões aplicados
1. Clean Architecture / UseCases para lógica de negócio
2. Dependency Injection via NestJS
3. Eventos assíncronos para desacoplamento entre serviços
4. Testes e2e para garantir integridade dos fluxos
5. Mocks para isolamento em testes unitários
6. Documentação com o swagger

# Diagrama de Arquitetura
![Alt text](/diagram.jpg?raw=true "Optional Title")