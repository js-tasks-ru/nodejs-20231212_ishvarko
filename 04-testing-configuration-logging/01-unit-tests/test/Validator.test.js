const Validator = require('../Validator');
const expect = require('chai').expect;

describe('testing-configuration-logging/unit-tests', () => {
    describe('Validator', () => {
        describe('Малидатор проверяет строковые поля', () => {
            it('Должен возвращать ошибку если строка короче минимальной длинны', () => {
                const validator = new Validator({
                    name: {
                        type: 'string',
                        min: 10,
                        max: 20,
                    },
                });

                const errors = validator.validate({name: 'Lalala'});

                expect(errors).to.have.length(1);
                expect(errors[0]).to.have.property('field').and.to.be.equal('name');
                expect(errors[0]).to.have.property('error').and.to.be.equal('too short, expect 10, got 6');
            });
            it('Должен возвращать ошибку если строка длиннее максимальной длинны', () => {
                const validator = new Validator({
                    name: {
                        type: 'string',
                        min: 10,
                        max: 20,
                    },
                });

                const errors = validator.validate({name: 'Lalala56789012345678901'});

                expect(errors).to.have.length(1);
                expect(errors[0]).to.have.property('field').and.to.be.equal('name');
                expect(errors[0]).to.have.property('error').and.to.be.equal('too long, expect 20, got 23');
            });
            it('Должен возвращать ошибку если тип не строка ', () => {
                const validator = new Validator({
                    name: {
                        type: 'string',
                        min: 10,
                        max: 20,
                    },
                });

                const errors = validator.validate({name: 123});

                expect(errors).to.have.length(1);
                expect(errors[0]).to.have.property('field').and.to.be.equal('name');
                expect(errors[0]).to.have.property('error').and.to.be.equal(`expect string, got number`);
            });
            it('Должен не возвращать ошибку если строка соответствует', () => {
                const validator = new Validator({
                    name: {
                        type: 'string',
                        min: 4,
                        max: 20,
                    },
                });

                const errors = validator.validate({name: 'Lalala'});
                expect(errors).to.have.length(0);
            });
        });
        describe('Валидатор проверяет числовые поля', () => {
            it('Должен возвращать ошибку если число меньше минимального значения', () => {
                const validator = new Validator({
                    age: {
                        type: 'number',
                        min: 10,
                        max: 20,
                    },
                });

                const errors = validator.validate({age: 5});

                expect(errors).to.have.length(1);
                expect(errors[0]).to.have.property('field').and.to.be.equal('age');
                expect(errors[0]).to.have.property('error').and.to.be.equal('too little, expect 10, got 5');
            });
            it('Должен возвращать ошибку если число больше максимального значения', () => {
                const validator = new Validator({
                    age: {
                        type: 'number',
                        min: 10,
                        max: 20,
                    },
                });

                const errors = validator.validate({age: 23});

                expect(errors).to.have.length(1);
                expect(errors[0]).to.have.property('field').and.to.be.equal('age');
                expect(errors[0]).to.have.property('error').and.to.be.equal('too big, expect 20, got 23');
            });
            it('Должен возвращать ошибку если тип не число', () => {
                const validator = new Validator({
                    age: {
                        type: 'number',
                        min: 10,
                        max: 20,
                    },
                });

                const errors = validator.validate({age: '15'});

                expect(errors).to.have.length(1);
                expect(errors[0]).to.have.property('field').and.to.be.equal('age');
                expect(errors[0]).to.have.property('error').and.to.be.equal(`expect number, got string`);
            });
            it('Должен не возвращать ошибку если число соответствует', () => {
                const validator = new Validator({
                    age: {
                        type: 'number',
                        min: 10,
                        max: 20,
                    },
                });

                const errors = validator.validate({age: 15});
                expect(errors).to.have.length(0);

            });
        });
        describe('Валидатор проверяет смешанные обьекты', () => {
            it('Должен вернуть 2 ошибки при проверке мин-макс значений', () => {
                const validator = new Validator({
                    age: {
                        type: 'number',
                        min: 10,
                        max: 20,
                    },
                    name: {
                        type: 'string',
                        min: 4,
                        max: 10
                    }
                });

                const errors = validator.validate({age: 23, name: 'Lal', city: 'NY'});
                expect(errors).to.have.length(2);
                expect(errors[0]).to.have.property('field').and.to.be.equal('age');
                expect(errors[0]).to.have.property('error').and.to.be.equal('too big, expect 20, got 23');
                expect(errors[1]).to.have.property('field').and.to.be.equal('name');
                expect(errors[1]).to.have.property('error').and.to.be.equal('too short, expect 4, got 3');
            });
            it('Должен вернуть 2 ошибки при проверке типов', () => {
                const validator = new Validator({
                    age: {
                        type: 'number',
                        min: 10,
                        max: 20,
                    },
                    name: {
                        type: 'string',
                        min: 4,
                        max: 10
                    }
                });

                const errors = validator.validate({age: 'Lal', name: 23, city: 'NY'});
                expect(errors).to.have.length(2);

            });
            it('Должен вернуть ошибку если нет обязательного значения',  () => {
                const validator = new Validator({
                    age: {
                        type: 'number',
                        min: 10,
                        max: 20,
                    },
                    name: {
                        type: 'string',
                        min: 4,
                        max: 10
                    }
                });
                const errors = validator.validate({age: 23, city: 'NY'});
                expect(errors).to.have.length(2);
                expect(errors[1]).to.have.property('error').and.to.be.equal('is required');
            });
        });
    });
});
