import * as React from 'react'
import { useEffect, useMemo, useCallback, memo } from 'react'
import { Modal } from 'antd'
import { ModalProps } from 'antd/lib/modal'
import { ResizeHandle } from './ResizeHandle'
import { useDrag } from './useDrag'
import { DraggableModalContextMethods } from './DraggableModalContext'
import { usePrevious } from './usePrevious'
import { ModalID, ModalState, ModalsState } from './draggableModalReducer'
import { useResize } from './useResize'

const modalStyle: React.CSSProperties = { margin: 0, paddingBottom: 0, pointerEvents: 'auto' }

interface ContextProps extends DraggableModalContextMethods {
    id: ModalID
    modalState: ModalState
    modalsState: ModalsState
    initialWidth?: number
    maskColor?: string
    initialHeight?: number
    minWidth?: number
    minHeight?: number
    onRezise?: (width: number, height: number) => void
}

export type DraggableModalInnerProps = ModalProps & { children?: React.ReactNode } & ContextProps

function DraggableModalInnerNonMemo({
    id,
    modalState,
    modalsState,
    dispatch,
    open,
    children,
    title,
    initialWidth,
    initialHeight,
    minWidth,
    minHeight,
    onRezise,
    ...otherProps
}: DraggableModalInnerProps) {
    // Call on mount and unmount.
    useEffect(() => {
        dispatch({ type: 'mount', id, intialState: { initialWidth, initialHeight, minWidth, minHeight } })
        return () => dispatch({ type: 'unmount', id, })
    }, [dispatch, id, initialWidth, initialHeight])

    // Bring this to the front if it's been opened with props.
    const visiblePrevious = usePrevious(open)
    useEffect(() => {
        if (open !== visiblePrevious) {
            if (open) {
                dispatch({ type: 'show', id })
            } else {
                dispatch({ type: 'hide', id })
            }
        }
    }, [open, visiblePrevious, id, dispatch])

    const { zIndex, x, y, width, height } = modalState

    const style: React.CSSProperties = useMemo(() => ({ ...modalStyle, top: y, left: x, height }), [
        y,
        x,
        height,
    ])

    const onFocus = useCallback(() => dispatch({ type: 'focus', id }), [id, dispatch])

    const onDragWithID = useCallback((args: any) => dispatch({ type: 'drag', id, ...args }), [
        dispatch,
        id,
    ])

    const onResizeWithID = useCallback((args: any) => dispatch({ type: 'resize', id, ...args }), [
        dispatch,
        id,
    ])

    const onMouseDrag = useDrag(x, y, onDragWithID)
    const onMouseResize = useResize(x, y, width, height, onResizeWithID, minHeight, minWidth)

    const titleElement = useMemo(
        () => (
            <div
                className="ant-design-draggable-modal-title"
                onMouseDown={onMouseDrag}
                // onClick={onFocus}
            >
                {title}
            </div>
        ),
        [onMouseDrag, onFocus, title],
    )

    useEffect(() => {
        if (onRezise) {
            onRezise(width, height)
        }

    }, [width, height])
    console.log('zIndex', modalsState)
    return (
        <Modal
            wrapClassName="ant-design-draggable-modal"
            style={style}
            // maskStyle={{pointerEvents:zIndex===modalsState.maxZIndex ? 'none' : 'auto', backgroundColor:'#00000012'}}
            maskStyle={{pointerEvents:'none', backgroundColor:zIndex===modalsState.maxZIndex ? otherProps.maskColor ||'#00000012':'transparent'}}
            width={width}
            destroyOnClose={true}
            mask={otherProps.mask? zIndex===modalsState.maxZIndex: false}
            maskClosable={false}
            zIndex={zIndex}
            title={titleElement}
            open={open}
            {...otherProps}
        >
            <div style={{height: '100%', width:'100%', backgroundColor:'white' }}
            onClick={onFocus}>
            
                {children}
                <ResizeHandle onMouseDown={(e) => {
                    // console.log('onMouseResize',e)
                    onMouseResize(e)
                }} />
            </div>

        </Modal>
    )
}

export const DraggableModalInner = memo(DraggableModalInnerNonMemo)

if (process.env.NODE_ENV !== 'production') {
    DraggableModalInner.displayName = 'DraggableModalInner'
}
