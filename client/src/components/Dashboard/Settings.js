import React, { useState, useEffect, useContext } from 'react'
import { useSnackbar } from 'notistack'

import { GithubContext } from '../../context/GithubContext'

import { Paper, List, ListSubheader, Input, ListItem, ListItemText, Button, Box, FormControl } from '@material-ui/core'

const Settings = () => {
  const [url, setURL] = useState('')
  const { userSettings, updateUserURL } = useContext(GithubContext)
  const { enqueueSnackbar } = useSnackbar()

  useEffect(() => {
    if (userSettings && userSettings.callbackURL) {
      setURL(userSettings.callbackURL)
    }
  }, [userSettings])

  const updateURL = () => {
    if (url) {
      const newURL = checkURL(url)
      updateUserURL(newURL)
      enqueueSnackbar('Successfully updated callback URL', { variant: 'success' })
    }
  }

  const handleChange = e => {
    setURL(e.target.value)
  }

  const checkURL = (url) => {
    return url && !url.includes('http') ? 'http://' + url : url
  }

  return (
    <div className='settings'>
      <Paper>
        <List
          subheader={
            <ListSubheader
              className='flex align-center space-between'
              style={{ background: '#eee' }}
            >
              Settings
            </ListSubheader>
          }
        >
          <ListItem>
            <ListItemText primary='Enter a webhook URL in order to receive notifications while offline' />
          </ListItem>
          <ListItem>
            <form autoComplete='off' style={{ width: '100%' }}>
              <Box display='flex' flexDirection='row' justifyContent='space-between'>
                <FormControl>
                  <Input
                    error={url.length < 10}
                    placeholder='Webhook URL'
                    value={url}
                    onChange={handleChange}
                    fullWidth
                    type='url'
                    required
                  />
                </FormControl>
                <FormControl>
                  <Button variant='outlined' onClick={updateURL} disabled={url.length < 10}>
                    {url.length > 1 ? 'Update' : 'Save'}
                  </Button>
                </FormControl>
              </Box>
            </form>
          </ListItem>
        </List>
      </Paper>
    </div>
  )
}

export default Settings
