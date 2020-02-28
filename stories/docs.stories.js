import React from 'react'
import { storiesOf } from '@storybook/react'

const DocsComponent = () => <div />

const setInfoOption= (text = '') => ({
    source: false,
    text,
    propTables: false,
})

storiesOf('Docs/Hello', module)
    .add('Introduction', DocsComponent, {
        info: setInfoOption(),
        readme: {
            content: require('../wikis/Introduction.md').default,
        },
    })
    .add('Installation', DocsComponent, {
        info: setInfoOption(),
        readme: {
            content: require('../wikis/Introduction.md').default,
        },
    })
