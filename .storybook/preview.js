import { addDecorator, addParameters } from '@storybook/react'
import { withInfo, setDefaults as setInfoDefaults } from '@storybook/addon-info'
import { addReadme } from 'storybook-readme'

setInfoDefaults({
    inline: true,
    header: false,
})

addDecorator(withInfo)
addDecorator(addReadme)

addParameters({
    options: {
        theme: {
            brandTitle: 'Ladder Game',
        },
    },
})
