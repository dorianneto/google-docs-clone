/* eslint-disable no-mixed-operators */
import { useCallback, useEffect, useState } from 'react'
import Quill from 'quill'
import 'quill/dist/quill.snow.css'
import { io } from 'socket.io-client'
import { useParams } from 'react-router-dom'
import { List, ListItemButton, ListItemIcon, ListItemText, ListSubheader, Paper, Popover } from '@mui/material'
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';

const SAVE_INTERVAL_MS = 2000
const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ font: [] }],
  [{ list: 'ordered' }, { list: 'bullet' }],
  ['bold', 'italic', 'underline'],
  [{ color: [] }, { background: [] }],
  [{ script: 'sub' }, { script: 'super' }],
  [{ align: [] }],
  ['image', 'blockquote', 'code-block'],
  ['clean'],
]

export default function TextEditor() {
  const { id: documentId } = useParams()
  const [socket, setSocket] = useState()
  const [quill, setQuill] = useState()
  const [open, setOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)

  useEffect(() => {
    const s = io('http://localhost:3001')
    setSocket(s)

    return () => {
      s.disconnect()
    }
  }, [])

  useEffect(() => {
    if (socket == null || quill == null) return

    socket.once('load-document', (document) => {
      quill.setContents(document)
      quill.enable()
    })

    socket.emit('get-document', documentId)
  }, [socket, quill, documentId])

  useEffect(() => {
    if (socket == null || quill == null) return

    const interval = setInterval(() => {
      socket.emit('save-document', quill.getContents())
    }, SAVE_INTERVAL_MS)

    return () => {
      clearInterval(interval)
    }
  }, [socket, quill])

  useEffect(() => {
    if (socket == null || quill == null) return

    const handler = (delta) => {
      quill.updateContents(delta)
    }
    socket.on('receive-changes', handler)

    return () => {
      socket.off('receive-changes', handler)
    }
  }, [socket, quill])

  useEffect(() => {
    if (socket == null || quill == null) return

    const handler = (delta, oldDelta, source) => {
      if (source !== 'user') return
      socket.emit('send-changes', delta)
    }
    quill.on('text-change', handler)

    return () => {
      quill.off('text-change', handler)
    }
  }, [socket, quill])

  const wrapperRef = useCallback((wrapper) => {
    if (wrapper == null) return

    wrapper.innerHTML = ''
    const editor = document.createElement('div')
    const toolbar = document.createElement('div')
    wrapper.append(toolbar)
    wrapper.append(editor)
    const q = new Quill(editor, {
      theme: 'snow',
      modules: {
        toolbar: false,
      },
    })
    q.disable()
    q.setText('Loading...')

    q.keyboard.addBinding({
      key: 191,
      empty: true,
      handler: function (range) {
        const getBoundingClientRect = () => {
          return this.quill.getBounds(range.index)
        }

        setOpen(true)

        setAnchorEl({ getBoundingClientRect, nodeType: 1 })
      },
    })

    setQuill(q)
  }, [])

  const handleClose = () => {
    setOpen(false)
  }

  const id = open ? 'virtual-element-popover' : undefined

  return (
    <>
      <div className="container" ref={wrapperRef}></div>
      {anchorEl && (
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          onClose={handleClose}
        >
          <Paper>
            <List
              dense
              component="nav"
              subheader={
                <ListSubheader component="div" id="nested-list-subheader">
                  Formatting
                </ListSubheader>
              }
            >
              <ListItemButton>
                <ListItemIcon>
                  <FormatBoldIcon />
                </ListItemIcon>
                <ListItemText primary="Bold" />
              </ListItemButton>
              <ListItemButton>
                <ListItemIcon>
                  <FormatItalicIcon />
                </ListItemIcon>
                <ListItemText primary="Italic" />
              </ListItemButton>
            </List>
          </Paper>
        </Popover>
      )}
    </>
  )
}
