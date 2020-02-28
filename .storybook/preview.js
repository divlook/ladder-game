import { addDecorator, addParameters } from '@storybook/react'
import { withInfo, setDefaults } from '@storybook/addon-info'

setDefaults({
    inline: true,
    header: false,
})

addDecorator(withInfo)

addParameters({
    options: {
        theme: {
            brandTitle: 'Ladder Game',
        },
    },
})
