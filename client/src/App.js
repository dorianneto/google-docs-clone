import {
  AppBar,
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
  ListItemButton,
  ListItemIcon,
  ListItemText,
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
import { createTheme, styled } from '@mui/material/styles'
import TextEditor from './TextEditor'
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'
import { v4 as uuidV4 } from 'uuid'
import { useState } from 'react'

const StyledFab = styled(Fab)({
  position: 'absolute',
  left: '50%',
  top: -30,
  marginLeft: '-50px',
})

function App() {
  const [openDrawer, setOpenDrawer] = useState(false)
  const [loading, setLoading] = useState(false)

  const isLoading = (l = true) => setLoading(l)

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
          {loading && <LinearProgress color="inherit" sx={{ position: 'fixed', width: '100%' }} />}
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
                    height: '100%',
                  }}
                >
                  <Switch>
                    <Route path="/" exact>
                      <Redirect to={`/documents/${uuidV4()}`} />
                    </Route>
                    <Route path="/documents/:id">
                      <TextEditor isLoading={isLoading} />
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
                    height: '100%',
                  }}
                ></Paper>
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
