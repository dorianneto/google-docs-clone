import {
  AppBar,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  CssBaseline,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Drawer,
  Fab,
  Grid,
  IconButton,
  InputBase,
  LinearProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  ThemeProvider,
  Toolbar,
  Typography,
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
import KeyboardIcon from '@mui/icons-material/Keyboard'
import DirectionsIcon from '@mui/icons-material/Directions'
import TuneIcon from '@mui/icons-material/Tune'
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary'
import GroupIcon from '@mui/icons-material/Group'
import NotificationsIcon from '@mui/icons-material/Notifications'
import SettingsIcon from '@mui/icons-material/Settings'
import LogoutIcon from '@mui/icons-material/Logout'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import HistoryEduIcon from '@mui/icons-material/HistoryEdu'
import PsychologyIcon from '@mui/icons-material/Psychology'
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter'
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
  const [openKeyboardModal, setOpenKeyboardModal] = useState(false)
  const [openSearchModal, setOpenSearchModal] = useState(false)
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
    const handler = (e) => {
      if (e.ctrlKey && e.which === 191) {
        e.preventDefault()
        setOpenKeyboardModal(true)
      }

      if (e.ctrlKey && e.which === 71) {
        e.preventDefault()
        setOpenSearchModal(true)
      }

      if (e.ctrlKey && e.shiftKey && e.which === 77) {
        e.preventDefault()
        setOpenDrawer(true)
      }
    }
    document.addEventListener('keydown', handler)

    return () => {
      document.removeEventListener('keydown', handler)
    }
  }, [])

  useEffect(() => {
    setTagsLoading(true)

    setTimeout(() => {
      setTagsLoading(false)
    }, 500)
  }, [tags])

  const onOpenDrawer = () => setOpenDrawer(true)
  const onCloseDrawer = () => setOpenDrawer(false)

  function LinearProgressWithLabel(props) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ width: '100%', mr: 1 }}>
          <LinearProgress variant="determinate" {...props} />
        </Box>
        <Box sx={{ minWidth: 35 }}>
          <Typography variant="body2" color="text.secondary">{`${Math.round(props.value)}%`}</Typography>
        </Box>
      </Box>
    )
  }

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
                    overflow: 'auto',
                    height: '100%',
                  }}
                >
                  <List
                    sx={{ width: '100%', height: '0px', bgcolor: 'background.paper' }}
                    component="nav"
                    aria-labelledby="nested-list-subheader"
                    subheader={
                      <ListSubheader component="div" id="nested-list-subheader">
                        Daily milestones
                      </ListSubheader>
                    }
                  >
                    <ListItem>
                      <IconButton edge="start" aria-label="delete">
                        <HistoryEduIcon />
                      </IconButton>
                      <ListItemText primary="Write 200 words" />
                    </ListItem>
                    <ListItem divider>
                      <ListItemText primary={<LinearProgressWithLabel color="secondary" value={20} />} />
                    </ListItem>
                    <ListItem disabled>
                      <IconButton edge="start" aria-label="delete">
                        <FitnessCenterIcon />
                      </IconButton>
                      <ListItemText primary="Writting exercise" />
                    </ListItem>
                    <ListItem disabled divider>
                      <ListItemText primary={<LinearProgressWithLabel color="success" value={100} />} />
                    </ListItem>
                    <ListItem>
                      <IconButton edge="start" aria-label="delete">
                        <PsychologyIcon />
                      </IconButton>
                      <ListItemText primary="Stay focused" secondary="At least for 15 minutes" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary={<LinearProgressWithLabel color="primary" value={50} />} />
                    </ListItem>
                  </List>
                </Paper>
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
                        Document Tags <Chip label={tags.length} variant="outlined" size="small" />
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
                <IconButton color="inherit" onClick={() => setOpenSearchModal(true)}>
                  <SearchIcon />
                </IconButton>
                <IconButton color="inherit" onClick={() => setOpenKeyboardModal(true)}>
                  <KeyboardIcon />
                </IconButton>
              </Toolbar>
            </AppBar>
          </div>
          <Drawer anchor={'bottom'} open={openDrawer} onClose={onCloseDrawer}>
            <Box sx={{ width: 'auto' }} role="presentation">
              <List>
                <ListItem key="documents" disablePadding>
                  <ListItemButton>
                    <ListItemIcon>
                      <LocalLibraryIcon />
                    </ListItemIcon>
                    <ListItemText primary="Library" />
                  </ListItemButton>
                </ListItem>
                <ListItem key="tags" disablePadding>
                  <ListItemButton>
                    <ListItemIcon>
                      <LabelIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Tags"
                      secondary={
                        <small>
                          <kbd>CTRL</kbd> + <kbd>SHIFT</kbd>+ <kbd>X</kbd>
                        </small>
                      }
                    />
                  </ListItemButton>
                </ListItem>
                <ListItem key="characters" disablePadding>
                  <ListItemButton>
                    <ListItemIcon>
                      <GroupIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Characters"
                      secondary={
                        <small>
                          <kbd>CTRL</kbd> + <kbd>SHIFT</kbd>+ <kbd>X</kbd>
                        </small>
                      }
                    />
                  </ListItemButton>
                </ListItem>
                <ListItem key="milestones" disablePadding>
                  <ListItemButton>
                    <ListItemIcon>
                      <EmojiEventsIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Milestones"
                      secondary={
                        <small>
                          <kbd>CTRL</kbd> + <kbd>SHIFT</kbd>+ <kbd>X</kbd>
                        </small>
                      }
                    />
                  </ListItemButton>
                </ListItem>
                <ListItem key="notifications" disablePadding>
                  <ListItemButton>
                    <ListItemIcon>
                      <NotificationsIcon />
                    </ListItemIcon>
                    <ListItemText primary="Notifications" />
                  </ListItemButton>
                </ListItem>
              </List>
              <Divider />
              <List>
                <ListItem disablePadding>
                  <ListItemButton>
                    <ListItemAvatar>
                      <Avatar
                        sx={{ width: 32, height: 32 }}
                        alt="Cindy Baker"
                        src="https://mui.com/static/images/avatar/2.jpg"
                      />
                    </ListItemAvatar>
                    <ListItemText primary="Profile" />
                  </ListItemButton>
                </ListItem>
                <ListItem key="settings" disablePadding>
                  <ListItemButton>
                    <ListItemIcon>
                      <SettingsIcon />
                    </ListItemIcon>
                    <ListItemText primary="Settings" />
                  </ListItemButton>
                </ListItem>
                <ListItem key="signout" disablePadding>
                  <ListItemButton color="secondary">
                    <ListItemIcon>
                      <LogoutIcon />
                    </ListItemIcon>
                    <ListItemText primary="Sign out" />
                  </ListItemButton>
                </ListItem>
              </List>
            </Box>
          </Drawer>
        </Box>
      </ThemeProvider>

      <Dialog open={openKeyboardModal} onClose={() => setOpenKeyboardModal(false)}>
        <DialogTitle onClose={() => setOpenKeyboardModal(false)}>Keyboard Shortcuts</DialogTitle>
        <DialogContent dividers>
          <TableContainer>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Open this panel
                  </TableCell>
                  <TableCell align="right">
                    <kbd>CTRL</kbd> + <kbd>/</kbd>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Search on text
                  </TableCell>
                  <TableCell align="right">
                    <kbd>CTRL</kbd> + <kbd>G</kbd>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Focus Mode
                  </TableCell>
                  <TableCell align="right">
                    <kbd>CTRL</kbd> + <kbd>SHIFT</kbd> + <kbd>F</kbd>
                  </TableCell>
                </TableRow>
                <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell component="th" scope="row">
                    Menu
                  </TableCell>
                  <TableCell align="right">
                    <kbd>CTRL</kbd> + <kbd>SHIFT</kbd> + <kbd>M</kbd>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={() => setOpenKeyboardModal(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Modal
        open={openSearchModal}
        onClose={() => setOpenSearchModal(false)}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Paper component="form" sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: '30%', border: 0 }}>
          <IconButton sx={{ p: '10px' }} aria-label="menu">
            <MenuIcon />
          </IconButton>
          <InputBase sx={{ ml: 1, flex: 1 }} placeholder="Search on text" autoFocus />
          <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
            <SearchIcon />
          </IconButton>
          <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
          <IconButton color="primary" sx={{ p: '10px' }} aria-label="tune">
            <TuneIcon />
          </IconButton>
        </Paper>
      </Modal>
    </Router>
  )
}

export default App
