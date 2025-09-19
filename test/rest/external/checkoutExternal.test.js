// Bibliotecas
const request = require('supertest');
const { expect } = require('chai');


// Testes
describe('checkout external', () => {
    describe('POST /checkout', () => {
        beforeEach(async () => {
            const respostaLogin = await request('http://localhost:3000')
                .post('/api/users/login')
                .send({
                    email: 'alice@email.com',
                    password: '123456'
                });

            token = respostaLogin.body.token;
        });

        it('Quando realizo um checkout eu recebo um 200', async () => {
            const respostaCheckout = await request('http://localhost:3000')
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

                //console.log(resposta.body);

        const respostaEsperada = require('../fixture/respostas/checkoutComSucesso.json');
        expect(respostaCheckout.status).to.equal(200);
        expect(respostaCheckout.body).to.deep.equal(respostaEsperada);
        });

        
        it('Quando realizo um checkout sem me autenticar eu recebo um 401', async () => {
            const respostaCheckout = await request('http://localhost:3000')
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

                //console.log(resposta.body);

        expect(respostaCheckout.status).to.equal(401);
        expect(respostaCheckout.body.error).to.deep.equal('Token inválido');
        });


    });

});





