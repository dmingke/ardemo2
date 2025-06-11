// src/ARViewer.jsx
import React, { useEffect, useRef } from 'react'

// 引入 model-viewer 的 JS（只需引入一次，可放在 public/index.html 里）
const MODEL_VIEWER_SCRIPT = 'https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js'

export default function ARViewer() {
  const videoRef = useRef(null)
  const modelViewerRef = useRef(null)
  // let longPressTimer = useRef(null)
  // let isLongPress = false

  useEffect(() => {
    // 动态加载 model-viewer 脚本
    if (!window.customElements.get('model-viewer')) {
      const script = document.createElement('script')
      script.src = MODEL_VIEWER_SCRIPT
      script.type = 'module'
      document.head.appendChild(script)
    }
    // 获取摄像头
    navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    })
  }, [])

  // // 按压事件逻辑
  // useEffect(() => {
  //   const modelViewer = modelViewerRef.current
  //   const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
  //   if (!modelViewer || isIOS) return

  //   const changeModel = (modelName) => {

  //       // console.log("changeModel", modelName)
  //       modelViewer.setAttribute('src', `/${modelName}.glb`)
      
  //   }

  //   const handlePointerDown = () => {
  //     // console.log("I pressed")
  //     isLongPress = false
  //     longPressTimer.current = setTimeout(() => {
  //       isLongPress = true
  //       changeModel('base_basic_shaded_run')
  //     }, 500)
  //   }

  //   const handlePointerUp = () => {
  //     // console.log("I up")
  //     if (longPressTimer.current) clearTimeout(longPressTimer.current)
  //     if (!isLongPress) {
  //       console.log("base_basic_shaded_idle")
  //       changeModel('base_basic_shaded_idle')
  //     } else {
  //       changeModel('base_basic_shaded')
  //     }
  //   }

  //   modelViewer.addEventListener('pointerdown', handlePointerDown)
  //   modelViewer.addEventListener('pointerup', handlePointerUp)

  //   return () => {
  //     modelViewer.removeEventListener('pointerdown', handlePointerDown)
  //     modelViewer.removeEventListener('pointerup', handlePointerUp)
  //   }
  // }, [])

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      {/* 摄像头背景 */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={{
          position: 'absolute',
          width: '100vw',
          height: '100vh',
          objectFit: 'cover',
          zIndex: 1,
        }}
      />
      {/* 3D 模型 */}
      <model-viewer
        ref={modelViewerRef}
        id="arModel"
        src="/base_basic_shaded.glb"
        ios-src='/base_basic_pbr.usdz'
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 2,
          background: 'transparent',
        }}
        camera-controls
        ar
        ar-modes="webxr scene-viewer quick-look"

        shadow-intensity="1"
        interaction-prompt="none"
        background-color="transparent"
      ></model-viewer>
    </div>
  )
}
