import * as React from 'react'
import { FunctionComponent, ReactElement, useContext } from 'react'
// import { useUID } from 'react-uid'
import { DraggableModalContext } from './DraggableModalContext'
import { DraggableModalInner } from './DraggableModalInner'
import { getModalState } from './draggableModalReducer'
import { ModalProps } from 'antd/lib/modal'

export interface DraggableModalProps extends ModalProps {
    windowId: string
    initialWidth?: number
    initialHeight?: number
    minWidth?: number
    minHeight?: number
    maskColor?: string
    onRezise?: (width: number, height: number) => void
}

export const DraggableModal: FunctionComponent<DraggableModalProps> = (
    props: DraggableModalProps,
): ReactElement => {
    // Get the unique ID of this modal.
    

    // Get modal provider.
    const modalProvider = useContext(DraggableModalContext)
    if (!modalProvider) {
        throw new Error('No Provider')
    }

    const { dispatch, state } = modalProvider
    const modalState = getModalState({
        state,
        id:props.windowId,
        initialHeight: props.initialHeight,
        initialWidth: props.initialWidth,
        minWidth: props.minWidth,
        minHeight: props.minHeight,
    })

    // We do this so that we don't re-render all modals for every state change.
    // DraggableModalInner uses React.memo, so it only re-renders if
    // if props change (e.g. modalState).
    return <DraggableModalInner id={props.windowId}  dispatch={dispatch} modalState={modalState} modalsState={state} {...props} onRezise={props.onRezise} />
}
