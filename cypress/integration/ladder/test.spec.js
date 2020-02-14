/// <reference types="cypress" />

const defaultDelay = 200
const playerIn4 = ['미유', '로빈', '에반', '차드']
const rewardIn4 = ['당첨', '꽝', '꽝', '꽝']

describe('TEST LADDER GAME', () => {
    before(() => {
        cy.visit('http://localhost:3000')
    })

    describe('몇 개의 사다리가 필요하신가요?', () => {
        it('4개가 필요합니다.', () => {
            cy.get('.MuiInputBase-input')
                .clear()
                .wait(defaultDelay)
                .focus()
                .wait(defaultDelay)
                .type('4')
                .wait(defaultDelay)
                .focused()
                .should('have.value', '4')
            cy.get('.MuiButton-contained')
                .wait(defaultDelay)
                .click()
        })
    })

    describe('이름을 입력해주세요.', () => {
        it('사다리 참가자는 미유, 로빈, 에반, 차드입니다.', () => {
            cy.get(':nth-child(3) > .MuiStepContent-root')
                .find('.MuiInputBase-input')
                .each((el, index) => {
                    cy.wrap(el)
                        .wait(defaultDelay)
                        .focus()
                        .wait(defaultDelay)
                        .type(playerIn4[index])
                        .focused()
                        .should('have.value', playerIn4[index])
                })
            cy.get('.MuiButton-contained')
                .wait(defaultDelay)
                .click()
        })
    })

    describe('보상을 입력해주세요.', () => {
        it('보상은 당첨 1개와 꽝 3개입니다.', () => {
            cy.get(':nth-child(5) > .MuiStepContent-root')
                .find('.MuiInputBase-input')
                .each((el, index) => {
                    cy.wrap(el)
                        .wait(defaultDelay)
                        .focus()
                        .wait(defaultDelay)
                        .type(rewardIn4[index])
                        .focused()
                        .should('have.value', rewardIn4[index])
                })
            cy.get('.MuiButton-contained')
                .wait(defaultDelay)
                .click()
        })
    })

    describe('사다리가 만들어졌습니다.', () => {
        it('사다리 위치까지 스크롤합니다.', () => {
            cy.get('.makeStyles-resetContainer-5').scrollIntoView()
        })
        it('사다리 막대기는 총 4개입니다.', () => {
            cy.get('.makeStyles-ladderContainer-414')
                .children()
                .filter(':visible')
                .should('have.length', 4)
        })
    })

    describe('사다리의 중간 막대기를 그립니다.', () => {
        it('중간 막대기를 그립니다.', () => {
            cy.get('.MuiBox-root-401 > :nth-child(2)')
                .wait(defaultDelay)
                .click()
            cy.get('.MuiBox-root-404 > :nth-child(4)')
                .wait(defaultDelay)
                .click()

            cy.get('.MuiBox-root-404 > :nth-child(8)')
                .wait(defaultDelay)
                .click()
            cy.get('.MuiBox-root-407 > :nth-child(8)')
                .wait(defaultDelay)
                .click()

            cy.get('.MuiBox-root-407 > :nth-child(14)')
                .wait(defaultDelay)
                .click()
            cy.get('.MuiBox-root-410 > :nth-child(4)')
                .wait(defaultDelay)
                .click()

            cy.get('.MuiBox-root-410 > :nth-child(20)')
                .wait(defaultDelay)
                .click()
            cy.get('.MuiBox-root-401 > :nth-child(4)')
                .wait(defaultDelay)
                .click()
        })
        it('마지막으로 그린 막대기를 지웁니다.', () => {
            cy.get('[style="display: block; top: 306px; left: -17.5087px; width: 659.017px; height: 8px; transform: rotate(33.1113deg);"]')
                .wait(defaultDelay)
                .click()
        })
        it('두번 클릭하면 취소됩니다.', () => {
            cy.get('.MuiBox-root-401 > :nth-child(12)')
                .wait(defaultDelay)
                .click()
                .should('have.class', 'active')
                .wait(defaultDelay)
                .click()
                .should('not.have.class', 'active')
        })
        it('이미 연결된 포인트는 선택되지 않습니다.', () => {
            cy.get('.makeStyles-resetContainer-5').scrollIntoView()
            cy.get('.MuiBox-root-401 > :nth-child(12)')
                .wait(defaultDelay)
                .should('not.have.class', 'linked')
                .should('not.have.class', 'active')
                .click()
            cy.get('.makeStyles-resetContainer-5').scrollIntoView()
            cy.get('.MuiBox-root-404 > :nth-child(8)')
                .wait(defaultDelay)
                .should('have.class', 'linked')
                .click({ force: true, })
        })
        it('같은 막대기에 있는 포인트를 클릭하면 이미 선택된 포인트의 선택이 취소됩니다.', () => {
            cy.get('.MuiBox-root-401 > :nth-child(12)')
                .should('not.have.class', 'linked')
                .should('have.class', 'active')
            cy.get('.MuiBox-root-401 > :nth-child(14)')
                .wait(defaultDelay)
                .should('not.have.class', 'linked')
                .should('not.have.class', 'active')
                .click()
                .should('not.have.class', 'linked')
                .should('not.have.class', 'active')
            cy.get('.MuiBox-root-401 > :nth-child(12)')
                .should('not.have.class', 'linked')
                .should('not.have.class', 'active')
        })
    })
})
