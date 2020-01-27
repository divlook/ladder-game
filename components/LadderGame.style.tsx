import { makeStyles } from '@material-ui/core'
import { State } from './LadderGame.interface'

export const colors = ['#ff8990', '#f7a03e', '#fed853', '#38bb8e', '#139367', '#cef500', '#ffb700', '#ff008f', '#00b4c4', '#ff4040']

export const useStyles = (state: State) =>
    makeStyles(theme => ({
        root: {
            width: '100%',
            minHeight: state.mapHeight,
            position: 'relative',
        },
        ladders: {
            position: 'relative',
            zIndex: 1,
            width: '100%',
            minHeight: state.mapHeight,
            overflowX: 'auto',
            overflowY: 'hidden',
        },
        ladderContainer: {
            width: 'auto',
            justifyContent: 'space-between',
            flexWrap: 'nowrap',
        },
        ladderItem: {
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
            minWidth: 80,
        },
        ladderItemHeader: {
            textAlign: 'center',
            marginBottom: theme.spacing(2),
        },
        ladderItemFooter: {
            textAlign: 'center',
            marginTop: theme.spacing(2),
        },
        ladderItemBlock: {
            position: 'relative',
            backgroundColor: '#9e7662',
            width: 10,
            height: 32,
            '&:first-child': {
                borderTopLeftRadius: 3,
                borderTopRightRadius: 3,
            },
            '&:last-child': {
                borderBottomLeftRadius: 3,
                borderBottomRightRadius: 3,
            },
        },
        ladderItemHandle: {
            cursor: 'pointer',
            width: 12,
            height: 12,
            borderRadius: 2,
            backgroundColor: '#795548',
            '&:hover:not(.linked), &.active': {
                zIndex: 1,
                boxShadow: '0 0 8px 4px rgba(255, 255, 255, 0.4), 0 0 12px 12px rgb(158, 118, 98, 0.6)',
            },
            '&.linked': {
                cursor: 'no-drop',
            },
        },
        ladderMidLine: {
            display: 'none',
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 2,
            backgroundColor: '#795548',
            width: 8,
            height: 8,
            borderRadius: 4,
            boxShadow: '0 2px 4px 2px rgba(0, 0, 0, 0.2)',
            cursor: 'pointer',
        },
        result: {
            display: 'none',
            position: 'absolute',
            zIndex: 999,
            width: '100%',
            height: '100%',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            '&.active': {
                display: 'block',
            },
            '& canvas': {
                position: 'absolute',
                minWidth: '100%',
                height: '100%',
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
            },
        },
        buttons: {
            marginTop: theme.spacing(6),
            marginBottom: theme.spacing(4),
        },
        buttonItem: {
            cursor: 'pointer',
            '&:not(:disabled)': {
                zIndex: 1000,
            },
        },
    }))
