import {
  AppBar,
  Avatar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  Fab,
  Grid,
  IconButton,
  LinearProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Paper,
  ThemeProvider,
  Toolbar,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import SearchIcon from '@mui/icons-material/Search'
import MoreIcon from '@mui/icons-material/MoreVert'
import InboxIcon from '@mui/icons-material/MoveToInbox'
import MailIcon from '@mui/icons-material/Mail'
import FilterVintageIcon from '@mui/icons-material/FilterVintage'
import LabelIcon from '@mui/icons-material/Label'
import DeleteIcon from '@mui/icons-material/Delete'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import EditIcon from '@mui/icons-material/Edit'
import { createTheme, styled } from '@mui/material/styles'
import TextEditor from './TextEditor'
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'
import { v4 as uuidV4 } from 'uuid'
import { createRef, useCallback, useEffect, useRef, useState } from 'react'

const StyledFab = styled(Fab)({
  position: 'absolute',
  left: '50%',
  top: -30,
  marginLeft: '-50px',
})

function App() {
  const [openDrawer, setOpenDrawer] = useState(false)
  const [loading, setLoading] = useState(false)
  const [tagsLoading, setTagsLoading] = useState(false)
  const [isEditorReady, setIsEditorReady] = useState(false)
  const [tags, setTags] = useState([])

  const tagsUpdatedCallback = useCallback((data) => {
    setTags(data)
  }, [])
  const isLoading = useCallback((l = true) => setLoading(l), [])
  const isEditorReadyHandler = (ready = true) => {
    setIsEditorReady(ready)
  }

  useEffect(() => {
    setTagsLoading(true)

    setTimeout(() => {
      setTagsLoading(false)
    }, 500)
  }, [tags])

  const onOpenDrawer = () => setOpenDrawer(true)
  const onCloseDrawer = () => setOpenDrawer(false)

  return (
    <Router>
      <ThemeProvider
        theme={createTheme({
          typography: {
            fontSize: 14,
          },
        })}
      >
        <Box sx={{ display: 'flex' }}>
          <CssBaseline />
          <Box
            component="main"
            sx={{
              backgroundColor: '#f5f5f5',
              flexGrow: 1,
              height: '100vh',
              overflow: 'auto',
              p: 4,
            }}
          >
            <Grid
              container
              spacing={3}
              direction="row"
              justifyContent="space-between"
              alignItems="stretch"
              sx={{ height: '90%' }}
            >
              <Box component={Grid} item md display={{ xs: 'none', md: 'block' }} className="focusMode">
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                  }}
                ></Paper>
              </Box>
              <Grid item xs={12} md={8}>
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'auto',
                    height: '100%',
                    position: 'relative',
                  }}
                >
                  {loading && (
                    <LinearProgress color="inherit" sx={{ position: 'absolute', width: '100%', left: 0, top: 0 }} />
                  )}
                  <Switch>
                    <Route path="/" exact>
                      <Redirect to={`/documents/${uuidV4()}`} />
                    </Route>
                    <Route path="/documents/:id">
                      <TextEditor
                        isLoading={isLoading}
                        isEditorReadyHandler={isEditorReadyHandler}
                        tagsUpdatedCallback={tagsUpdatedCallback}
                      />
                    </Route>
                  </Switch>
                </Paper>
              </Grid>
              <Box component={Grid} item md display={{ xs: 'none', md: 'block' }} className="focusMode">
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    overflowY: 'auto',
                    height: '100%',
                    position: 'relative',
                  }}
                >
                  {tagsLoading && (
                    <LinearProgress color="inherit" sx={{ position: 'absolute', width: '100%', left: 0, top: 0 }} />
                  )}
                  <List
                    sx={{ width: '100%', height: '0px', bgcolor: 'background.paper' }}
                    component="nav"
                    aria-labelledby="nested-list-subheader"
                    subheader={
                      <ListSubheader component="div" id="nested-list-subheader">
                        Your Tags
                      </ListSubheader>
                    }
                  >
                    {[...tags].reverse().map((t) => (
                      <ListItem
                        key={`${t.index}-${t.length}`}
                        secondaryAction={
                          <>
                            <IconButton size="small" edge="start" aria-label="edit">
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton size="small" edge="end" aria-label="delete">
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </>
                        }
                      >
                        <ListItemAvatar>
                          <IconButton size="small" edge="start" aria-label="delete">
                            <FavoriteBorderIcon fontSize="small" />
                          </IconButton>
                        </ListItemAvatar>
                        <ListItemText primary={`Index: ${t.index}`} secondary={t.content} />
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              </Box>
            </Grid>
          </Box>
          <div className="focusMode">
            <AppBar position="fixed" color="primary" sx={{ top: 'auto', bottom: 0 }}>
              <Toolbar>
                <IconButton color="inherit" aria-label="open drawer" onClick={onOpenDrawer}>
                  <MenuIcon />
                </IconButton>
                <StyledFab color="secondary" variant="extended">
                  <FilterVintageIcon sx={{ marginRight: 0.5 }} /> LILAC
                </StyledFab>
                <Box sx={{ flexGrow: 1 }} />
                <IconButton color="inherit">
                  <SearchIcon />
                </IconButton>
                <IconButton color="inherit">
                  <MoreIcon />
                </IconButton>
              </Toolbar>
            </AppBar>
          </div>
          <Drawer anchor={'bottom'} open={openDrawer} onClose={onCloseDrawer}>
            <Box sx={{ width: 'auto' }} role="presentation">
              <List>
                {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
                  <ListItem key={text} disablePadding>
                    <ListItemButton>
                      <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
                      <ListItemText primary={text} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
              <Divider />
              <List>
                {['All mail', 'Trash', 'Spam'].map((text, index) => (
                  <ListItem key={text} disablePadding>
                    <ListItemButton>
                      <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
                      <ListItemText primary={text} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Box>
          </Drawer>
        </Box>
      </ThemeProvider>
    </Router>
  )
}

export default App
