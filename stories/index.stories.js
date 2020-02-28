import React from 'react'
import { storiesOf } from '@storybook/react'
import Introduce from '../wikis/Introduce.md'

const DocsComponent = () => <div />
const setInfoOption= (text) => ({
    source: false,
    text,
    propTables: false,
})

storiesOf('Docs/Hello', module)
    .add('Hello', DocsComponent, {
        info: setInfoOption(Introduce),
    })
