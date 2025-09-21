// Bibliotecas
const request = require('supertest');
const sinon = require('sinon');
const { expect } = require('chai');

// Aplicação
const app = require('../../../rest/app');

// Mock
const checkoutService = require('../../../src/services/checkoutService');

let token;

// Testes
describe('checkout Controller', () => {
    describe('POST /checkout',  () => {
        beforeEach(async () => {
            const respostaLogin = await request(app)
                .post('/api/users/login')
                .send({
                    email: 'alice@email.com',
                    password: '123456'
                });

            token = respostaLogin.body.token;
        });

        afterEach(() => {
            // Restore any sinon stubs/spies between tests
            sinon.restore();
        });

        it('Usando Mocks: Quando realizo um checkout eu recebo um 200', async () => {
            // Mocar apenas a função transfer do Service
            const checkoutServiceMock = sinon.stub(checkoutService, 'checkout');
            checkoutServiceMock.returns({
                
                    items: [
                        {
                            productId: 1,
                            quantity: 5
                        }
                    ],
                    freight: 10,
                    paymentMethod: "boleto",
                    cardData: {
                        number: "100745-5",
                        name: "jonatas sousa",
                        expiry: "12/27",
                        cvv: "1234"
                    }
                });

                const respostaCheckout = await request(app)
                .post('/api/checkout')
                .set('Authorization', `Bearer ${token}`)
                .send({

                    items: [
                        {
                            productId: 1,
                            quantity: 5
                        }
                    ],
                    freight: 10,
                    paymentMethod: "boleto",
                    cardData: {
                        number: "100745-5",
                        name: "jonatas sousa",
                        expiry: "12/27",
                        cvv: "1234"
                    }
                });
     

    expect(respostaCheckout.status).to.equal(200);

        });

        it('Usando Mocks: Quando realizo um checkout sem me autenticar eu recebo um 401', async () => {
            // Mocar apenas a função transfer do Service
            const checkoutServiceMock = sinon.stub(checkoutService, 'checkout');
            checkoutServiceMock.throws(new Error('Token inválido'));

            const resposta = await request(app)
                .post('/api/checkout')
                .send({
                    items: [
                        {
                            productId: 1,
                            quantity: 5
                        }
                    ],
                    freight: 10,
                    paymentMethod: "boleto",
                    cardData: {
                        number: "100745-5",
                        name: "jonatas sousa",
                        expiry: "12/27",
                        cvv: "1234"
                    }
                });

        // Como o service lança erro, a expectativa é 401 e mensagem de erro
        expect(resposta.status).to.equal(401);
        expect(resposta.body).to.have.property('error','Token inválido');

        });


    });

});





