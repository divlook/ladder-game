import React from 'react'
import { Button } from '@storybook/react/demo'

export default {
    title: 'Storybook Example',
}

export const withText = () => <Button>Hello Button</Button>

export const withEmoji = () => (
    <Button>
        <span role="img" aria-label="so cool">
            😀 😎 👍 💯
        </span>
    </Button>
)
