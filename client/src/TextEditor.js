/* eslint-disable no-mixed-operators */
import { useCallback, useEffect, useRef, useState } from 'react'
import Quill from 'quill'
import 'quill/dist/quill.snow.css'
import { io } from 'socket.io-client'
import { useParams } from 'react-router-dom'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Paper,
  Popover,
  TextField,
} from '@mui/material'
import FormatBoldIcon from '@mui/icons-material/FormatBold'
import FormatItalicIcon from '@mui/icons-material/FormatItalic'
import LabelIcon from '@mui/icons-material/Label'
import Draggable from 'react-draggable'

const SAVE_INTERVAL_MS = 4000
// const TOOLBAR_OPTIONS = [
//   [{ header: [1, 2, 3, 4, 5, 6, false] }],
//   [{ font: [] }],
//   [{ list: 'ordered' }, { list: 'bullet' }],
//   ['bold', 'italic', 'underline'],
//   [{ color: [] }, { background: [] }],
//   [{ script: 'sub' }, { script: 'super' }],
//   [{ align: [] }],
//   ['image', 'blockquote', 'code-block'],
//   ['clean'],
// ]

function PaperComponent(props) {
  const nodeRef = useRef(null)

  return (
    <Draggable nodeRef={nodeRef} handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
      <Paper ref={nodeRef} {...props} />
    </Draggable>
  )
}

function toggleFocusMode() {
  const focusModeElements = document.body.getElementsByClassName('focusMode')

  for (const element of focusModeElements) {
    element.classList.toggle('fade')
  }
}

export default function TextEditor({ isLoading }) {
  const { id: documentId } = useParams()
  const [socket, setSocket] = useState()
  const [quill, setQuill] = useState()

  const [editorReady, setEditorReady] = useState(false)

  const [openToolbar, setOpenToolbar] = useState(false)
  const [anchorElToolbar, setAnchorElToolbar] = useState(null)

  const [open, setOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)

  const [tagData, setTagData] = useState([])
  const [tagContent, setTagContent] = useState(undefined)
  const [tempTag, setTempTag] = useState(null)
  const [openTagModal, setOpenTagModal] = useState(false)

  const [isTyping, setIsTyping] = useState(false)
  const [focusMode, setFocusMode] = useState(false)

  useEffect(() => {
    const s = io('http://localhost:3001')
    setSocket(s)

    return () => {
      s.disconnect()
    }
  }, [])

  useEffect(() => {
    let Inline = Quill.import('blots/inline')

    class TagBlot extends Inline {
      static create(value) {
        let node = super.create()
        node.setAttribute('data-index', value.index)
        node.setAttribute('data-length', value.length)
        node.classList.add('default-tag')

        return node
      }

      static formats(domNode) {
        if (domNode.getAttribute('data-index') && domNode.getAttribute('data-length')) {
          return {
            index: domNode.getAttribute('data-index'),
            length: domNode.getAttribute('data-length'),
          }
        } else {
          return super.formats(domNode)
        }
      }

      formats() {
        let formats = super.formats()
        formats['tag'] = TagBlot.formats(this.domNode)
        return formats
      }
    }
    TagBlot.blotName = 'tag'
    TagBlot.tagName = 'span'

    Quill.register(TagBlot)
  }, [])

  useEffect(() => {
    if (socket == null || quill == null) return

    socket.once('load-document', (document) => {
      const { tags = [], content } = document

      quill.setContents(content)
      quill.enable()
      quill.focus()

      setTagData(tags)
      setEditorReady(true)
    })

    socket.emit('get-document', documentId)
  }, [socket, quill, documentId])

  useEffect(() => {
    if (editorReady == null || quill == null) return

    const defaultTagElements = document.body.getElementsByClassName('default-tag')

    const handler = (e) => {
      e.preventDefault()

      const index = e.target.getAttribute('data-index')
      const length = e.target.getAttribute('data-length')

      const tag = tagData.filter((v) => v.index == index && v.length == length)

      setTagContent(tag[0].content)
      setOpenTagModal(true)
    }

    for (const element of defaultTagElements) {
      element.addEventListener('click', handler)
    }

    return () => {
      for (const element of defaultTagElements) {
        element.removeEventListener('click', handler)
      }
    }
  }, [quill, tagData, editorReady])

  useEffect(() => {
    if (socket == null || quill == null) return

    const interval = setInterval(() => {
      isLoading(false)
      socket.emit('save-document', { tags: tagData, content: quill.getContents() })
    }, SAVE_INTERVAL_MS)

    return () => {
      clearInterval(interval)
    }
  }, [socket, quill, tagData])

  useEffect(() => {
    if (socket == null || quill == null) return

    const handler = ({ tags, delta }) => {
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
      isLoading()
      socket.emit('send-changes', { tags: tagData, delta })
    }
    quill.on('text-change', handler)

    return () => {
      quill.off('text-change', handler)
    }
  }, [socket, quill, tagData])

  useEffect(() => {
    if (quill == null || isTyping == null) return

    const handler = (delta, oldDelta, source) => {
      if (source !== 'user' || isTyping) return

      setIsTyping(true)

      setTimeout(() => {
        toggleFocusMode()

        setFocusMode(true)
      }, 5000)
    }

    quill.on('text-change', handler)

    return () => {
      quill.off('text-change', handler)
    }
  }, [quill, isTyping])

  useEffect(() => {
    if (focusMode == null || focusMode === false) return

    const handler = (e) => {
      toggleFocusMode()

      setIsTyping(false)
      setFocusMode(false)
    }

    window.addEventListener('mouseover', handler)

    return () => {
      window.removeEventListener('mouseover', handler)
    }
  }, [focusMode])

  const wrapperRef = useCallback((wrapper) => {
    if (wrapper == null) return

    wrapper.innerHTML = ''
    const editor = document.createElement('div')
    editor.setAttribute('id', 'typewriter')
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

    let isUsingMouse = false

    editor.firstChild.addEventListener('mouseup', (e) => {
      isUsingMouse = true
    })

    q.keyboard.addBinding({
      key: 191,
      empty: true,
      handler: function (range) {
        const getBoundingClientRect = () => {
          return window.getSelection().anchorNode.getBoundingClientRect().toJSON()
        }

        setOpenToolbar(true)

        setAnchorElToolbar({ getBoundingClientRect, nodeType: 1 })
      },
    })

    q.on('selection-change', function (range, oldRange, source) {
      if (range === null || range.length === 0 || !isUsingMouse) return

      const selection = window.getSelection()
      const getRange = selection.getRangeAt(0)
      const getBoundingClientRect = () => {
        return getRange.getBoundingClientRect()
      }

      setOpen(true)
      setAnchorEl({ getBoundingClientRect, nodeType: 1 })
      setTempTag(range)
      isUsingMouse = false
    })

    setQuill(q)
  }, [])

  const handleCloseToolbar = () => {
    setOpenToolbar(false)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <>
      <div className="container" ref={wrapperRef}></div>
      {anchorElToolbar && (
        <Popover
          open={openToolbar}
          anchorEl={anchorElToolbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          onClose={handleCloseToolbar}
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

      {anchorEl && (
        <Popover
          open={open}
          anchorEl={anchorEl}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          onClose={handleClose}
        >
          <Paper>
            <List dense component="nav">
              <ListItemButton
                onClick={(e) => {
                  e.preventDefault()
                  setOpenTagModal(true)
                  setTagContent(undefined)
                }}
              >
                <ListItemIcon>
                  <LabelIcon />
                </ListItemIcon>
                <ListItemText primary="Tag" />
              </ListItemButton>
            </List>
          </Paper>
        </Popover>
      )}

      <Dialog
        open={openTagModal}
        onClose={() => {
          setOpenTagModal(false)
          setOpen(false)
        }}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
      >
        <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
          Add tag
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Suspendisse euismod ante non eros tincidunt, consequat porta lacus interdum.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Note"
            variant="standard"
            multiline
            fullWidth
            value={tagContent || undefined}
            onChange={(e) => setTagContent(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            onClick={() => {
              setOpenTagModal(false)
              setOpen(false)
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              const { index, length } = tempTag

              quill.formatText(index, length, 'tag', { index, length })

              setTagData(
                [...tagData, { ...tempTag, content: tagContent }].filter(
                  (value, index, self) =>
                    index === self.findIndex((p) => p.index === value.index && p.length === value.length)
                )
              )
              setOpenTagModal(false)
              setOpen(false)
              isLoading()
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
