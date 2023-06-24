/* eslint-disable react-hooks/exhaustive-deps */
import { Apartment, ExpandLess, ExpandMore, MeetingRoom } from '@mui/icons-material'
import AddRoundedIcon from '@mui/icons-material/AddRounded'

import {
  Box,
  CircularProgress,
  Collapse,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import { DeleteButton, UpdateButton } from '~/components/button/Button'
import { Department, Room } from '~/global/interface'
import useDepartmentApi from '~/hooks/api/useDepartmentApi'
import useRoomApi from '~/hooks/api/useRoomApi'

const RoomAdvanced = () => {
  const [departments, setDepartments] = useState<Department[]>([])
  const [rooms, setRooms] = useState<Room[]>([])

  const [selectedDepartment, setSelectedDepartment] = useState<Department>({ id: '', name: '' })
  const { getAllDepartments } = useDepartmentApi()
  const { getRoomsInDepartment } = useRoomApi()
  const [loading, setLoading] = React.useState<boolean>(true)
  const [loadingRoom, setLoadingRoom] = React.useState<boolean>(false)

  const [open, setOpen] = React.useState(false)
  //handle options dropdown
  const handleOptions = () => {
    setOpen(!open)
  }
  //handle dropdown close after selecting
  const handleSelect = (dept: Department) => {
    setSelectedDepartment(dept)
    setLoadingRoom(true)
    setOpen(!open)
  }

  const fetchDepartment = async () => {
    await getAllDepartments().then((result) => {
      setDepartments(result.data)
      setSelectedDepartment(result.data[0])
    })
  }

  const fetchRooms = async () => {
    if (selectedDepartment.id) {
      await getRoomsInDepartment(selectedDepartment.id).then((result) => {
        setRooms(result.data)
        setLoading(false)
        setLoadingRoom(false)
      })
    }
  }

  useEffect(() => {
    fetchDepartment()
  }, [])

  useEffect(() => {
    fetchRooms()
  }, [selectedDepartment])

  return (
    <>
      <List
        sx={{
          width: '100%',
          height: { xs: 'calc(100vh - 92px - 6rem)', md: 'calc(100vh - 42px - 6rem)' },
          bgcolor: 'var(--white-color)',
          padding: '1rem 0',
          overflowY: 'scroll'
        }}
        component='div'
      >
        {!loading ? (
          <>
            <ListItemButton
              onClick={handleOptions}
              selected={open}
              sx={{
                paddingLeft: { sm: '5rem', xs: '1rem' },
                paddingRight: { sm: '5rem', xs: '1rem' },
                height: '52.5px'
              }}
            >
              <ListItemIcon sx={{ color: 'var(--black-color)' }}>
                <Apartment />
              </ListItemIcon>
              <ListItemText
                primary={selectedDepartment.name}
                primaryTypographyProps={{ fontFamily: 'inherit', color: 'var(--black-color)' }}
              />
              {open ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Divider sx={{ margin: '0 4rem' }} />
            <Collapse in={open} timeout='auto' unmountOnExit>
              <List component='div' disablePadding>
                {departments.map((room) => {
                  if (room === selectedDepartment) {
                    return null
                  }
                  return (
                    <>
                      <ListItemButton
                        key={room.id}
                        sx={{
                          paddingLeft: { sm: '5rem', xs: '1rem' },
                          paddingRight: { sm: '5rem', xs: '1rem' },
                          height: '52.5px'
                        }}
                        onClick={() => handleSelect(room)}
                      >
                        <ListItemIcon sx={{ color: 'var(--black-color)' }}>
                          <Apartment />
                        </ListItemIcon>
                        <ListItemText
                          primary={room.name}
                          primaryTypographyProps={{ fontFamily: 'inherit', color: 'var(--black-color)' }}
                        />
                      </ListItemButton>
                      <Divider sx={{ margin: '0 4rem' }} />
                    </>
                  )
                })}
              </List>
            </Collapse>
            {!loadingRoom ? (
              <>
                {rooms.map((room) => (
                  <ListItemButton
                    key={room.id}
                    sx={{ paddingLeft: { sm: '8rem', xs: '1rem' }, paddingRight: { sm: '5rem', xs: '1rem' } }}
                    disableTouchRipple
                  >
                    <ListItemIcon sx={{ color: 'var(--black-color)' }}>
                      <MeetingRoom />
                    </ListItemIcon>
                    <ListItemText
                      primary={room.name}
                      primaryTypographyProps={{ fontFamily: 'inherit', color: 'var(--black-color)' }}
                    />
                    <UpdateButton
                      text='Update'
                      id={room.id}
                      name={room.name}
                      // onSubmit={handleUpdate}
                      // handleClose={handleClose}
                    />
                    <DeleteButton text='Delete' id={room.id} />
                  </ListItemButton>
                ))}
                <ListItemButton
                  sx={{
                    paddingLeft: { sm: '8rem', xs: '1rem' },
                    paddingRight: { sm: '5rem', xs: '1rem' },
                    height: '53px'
                  }}
                  // onClick={handleModalOpen}
                >
                  <ListItemIcon sx={{ color: 'var(--black-color)' }}>
                    <AddRoundedIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={'New room'}
                    primaryTypographyProps={{ fontFamily: 'inherit', color: 'var(--black-color)' }}
                  />
                </ListItemButton>
              </>
            ) : (
              <Box
                sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                width={'100%'}
                height={'80%'}
              >
                <CircularProgress />
              </Box>
            )}
          </>
        ) : (
          <>
            <Box
              sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
              width={'100%'}
              height={'100%'}
            >
              <CircularProgress />
            </Box>
          </>
        )}
      </List>
    </>
  )
}

export default RoomAdvanced
