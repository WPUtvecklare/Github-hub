import React, { useState, useContext, useEffect, useRef } from 'react'
import { useSnackbar } from 'notistack'
import { GithubContext } from '../../context/GithubContext'

import { Paper, List, ListSubheader, ListItem, ListItemText, IconButton } from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import ExpandLessIcon from '@material-ui/icons/ExpandLess'
import LaunchIcon from '@material-ui/icons/Launch'
import DeleteIcon from '@material-ui/icons/Delete'
import { WebSocketContext } from '../../context/WebSocketContext'

const Notifications = () => {
  const [fullHeight, setFullHeight] = useState(false)
  const [notifications, setNotifications] = useState([])
  const ref = useRef(notifications)

  const { socket, setSocket } = useContext(WebSocketContext)
  const { user, userSettings, clearUserNotifications } = useContext(GithubContext)

  const { enqueueSnackbar } = useSnackbar()

  const changeHeight = () => {
    setFullHeight(!fullHeight)
  }

  // Store a reference to notifications
  useEffect(() => {
    ref.current = notifications
  }, [notifications])

  // Checks if there are notifications stored in the DB
  useEffect(() => {
    if (
      notifications.length === 0 &&
      userSettings &&
      userSettings.notifications &&
      userSettings.notifications.length
    ) {
      setNotifications(userSettings.notifications)
      clearUserNotifications()
    }
  }, [userSettings])

  useEffect(() => {
    if (user && !socket) {
      const socket = new window.WebSocket(
        `wss://uw9jdvyktk.execute-api.us-east-1.amazonaws.com/dev?userId=${user.id}`
      )
      setSocket(socket)

      socket.onopen = () => console.log('Socket is open')

      socket.onmessage = event => {
        const data = JSON.parse(event.data)
        setNotifications([data, ...ref.current])
        enqueueSnackbar(`New event: ${capitalizeFirstLetter(data.event)}`, { variant: 'info' })
      }
    }
  }, [user])

  const clearNotifications = () => {
    setNotifications([])
    enqueueSnackbar('Cleared all notifications', { variant: 'success' })
  }

  return (
    <div className='notifications-feed'>
      <Paper>
        <List
          className={!fullHeight ? 'small-height' : ''}
          subheader={
            <ListSubheader
              className='flex align-center space-between'
              style={{ background: '#eee' }}
            >
              Events based on your subscriptions
              {
                notifications.length > 0 && (
                  <IconButton onClick={clearNotifications} aria-label='delete'>
                    <DeleteIcon />
                  </IconButton>
                )
              }
              {!fullHeight ? (
                <ExpandMoreIcon
                  className='toggle-button'
                  onClick={changeHeight}
                />
              ) : (
                <ExpandLessIcon
                  className='toggle-button'
                  onClick={changeHeight}
                />
              )}
            </ListSubheader>
          }
        >
          <ListItem style={{ display: 'block' }}>
            {notifications.length > 0
              ? notifications.map((n, i) => (
                <div className='notification-item' key={i}>
                  <ListItem
                    className='notification'
                    style={{ display: 'block' }}
                    component='div'
                  >
                    {Object.keys(n)
                      .sort()
                      .map((item, i) =>
                        item === 'link' ? (
                          <a
                            className='inline-flex'
                            key={i}
                            href={n[item]}
                            target='_blank'
                            rel='noopener noreferrer'
                          >
                            {capitalizeFirstLetter(item)}
                            <LaunchIcon
                              style={{ marginLeft: '5px' }}
                              fontSize='small'
                            />
                          </a>
                        ) : (
                          <p key={i}>
                            <b>{capitalizeFirstLetter(item)}</b>: {n[item]}
                          </p>
                        )
                      )}
                  </ListItem>
                </div>
              )) : <ListItemText primary='No events yet' />}
          </ListItem>
        </List>
      </Paper>
    </div>
  )
}

export default Notifications

function capitalizeFirstLetter (str) {
  return str[0].toUpperCase() + str.slice(1)
}
