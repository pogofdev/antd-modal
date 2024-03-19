import { DraggableModal, DraggableModalProps, DraggableModalProvider, DraggableModalContext } from '../../antd-modal/src/index'
import '@cubetiq/antd-modal/dist/index.css'
import { Breadcrumb, Button, Layout } from 'antd'
import { useCallback, useContext, useEffect, useState } from 'react'

const { Content, Footer } = Layout

interface ModalWithButtonProps extends DraggableModalProps {
    windowId: string
    title: string
}

function ModalWithButton(props: ModalWithButtonProps) {
    const [visible, setVisible] = useState(false)
    const onOk = useCallback(() => setVisible(true), [])
    const onCancel = useCallback(() => setVisible(false), [])
    const onToggle = useCallback(() => setVisible((v) => !v), [])
    const modalProvider = useContext(DraggableModalContext)
    
    // useEffect(() => {
        
    //     if(!visible) {
            
    //         if (!modalProvider) {
    //             return
    //             throw new Error('No Provider')
    //         }
        
    //         const { dispatch, state } = modalProvider
    //         dispatch({ type: 'hide', id:props.windowId  })
    //     }
    // }, [visible])
    const handleHide = ()=>{
        // const modalProvider = useContext(DraggableModalContext)
        if (!modalProvider) {
            throw new Error('No Provider')
        }

        const { dispatch, state } = modalProvider
        
        dispatch({ type: 'minimize', id:props.windowId, width:0, height:0 })
    }
    return (
        <>
            <Button onClick={onToggle} type={visible ? 'dashed' : 'primary'} style={{ margin: 10 }}>
                {visible ? `Close ${props.title}` : `Open ${props.title}`}
            </Button>
            <DraggableModal
                        mask={true}
                        maskClosable={true} 
                        maskColor="rgba(0,0,0,0.5)"
            open={visible} onOk={onOk} onCancel={onCancel}  {...props} onRezise={(width,height) => {console.log(width,height)}} 
            minHeight={500}
            minWidth={1000}
            >
                 <Button  style={{ margin: 10 }} onClick={handleHide}>
                Hide modal {props.windowId}
            </Button>
            </DraggableModal>
        </>
    )
}

const App = () => (
    <DraggableModalProvider>
        <Layout className="layout" style={{ minHeight: '100vh' }}>
            <Content style={{ padding: '0 50px' }}>
                <Breadcrumb style={{ margin: '16px 0' }}>
                    <Breadcrumb.Item>Ant Design</Breadcrumb.Item>
                    <Breadcrumb.Item>Draggable Modal</Breadcrumb.Item>
                </Breadcrumb>
                <div style={{ background: '#fff', padding: 24 }}>
                    <ModalWithButton   windowId={`${Math.random()}`} title="Modal A" />
                    <ModalWithButton   windowId={`${Math.random()}`} title="Modal B" initialWidth={500} initialHeight={100} />
                    <ModalWithButton   windowId={`${Math.random()}`} title="Modal C" />
                </div>
            </Content>
            <Footer style={{ textAlign: 'center' }}>
                <a href="https://github.com/sombochea/antd-modal">GitHub</a>
            </Footer>
        </Layout>
    </DraggableModalProvider>
)

export default App
