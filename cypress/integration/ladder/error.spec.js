/// <reference types="cypress" />

const defaultDelay = 200

describe('TEST LADDER GAME', () => {
    before(() => {
        cy.visit('http://localhost:3000')
    })

    describe('사다리 갯수 입력 조건입니다.', () => {
        it('사다리 갯수는 숫자만 입력할 수 있습니다.', () => {
            cy.get('.MuiInputBase-input')
                .wait(defaultDelay)
                .type('ㄱㄴㄷㄹ')
                .wait(defaultDelay)
                .focused()
                .should('not.include.value')
                .wait(defaultDelay)
                .type('abcd')
                .wait(defaultDelay)
                .focused()
                .should('not.include.value')
                .wait(defaultDelay)
                .type('!@#$')
                .wait(defaultDelay)
                .focused()
                .should('not.include.value')
        })
        it('사다리 갯수는 2이상입니다.', () => {
            cy.get('.MuiInputBase-input')
                .clear()
                .wait(defaultDelay)
                .type('1')
                .wait(defaultDelay)
                .focused()
            cy.get('.MuiButton-contained')
                .should('have.attr', 'disabled')
            cy.get('.MuiInputBase-input')
                .clear()
                .wait(defaultDelay)
                .type('2')
                .wait(defaultDelay)
                .focused()
            cy.get('.MuiButton-contained')
                .should('not.have.attr', 'disabled')
        })
        it('사다리 갯수는 최대 20입니다.', () => {
            cy.get('.MuiInputBase-input')
                .clear()
                .wait(defaultDelay)
                .type('100')
                .wait(defaultDelay)
                .focused()
                .should('have.value', '20')
        })
    })
})
