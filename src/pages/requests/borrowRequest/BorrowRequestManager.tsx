/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import RequestCard from '~/components/card/requestCard/RequestCard'
import {
  Avatar,
  Box,
  CardActions,
  CircularProgress,
  Pagination,
  SelectChangeEvent,
  Typography,
  styled
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import usePagination from '~/hooks/usePagination'
import InfoIcon from '@mui/icons-material/Info'
import DetailRequestModal from '~/components/modal/DetailRequestModal'
import { StatusDiv } from '../importRequest/ImportRequest.styled'
import { AcceptButton, RejectButton } from '~/components/button/Button'
import RejectRequestModal from '~/components/modal/RejectRequestModal'
import useBorrowRequestApi from '~/hooks/api/useBorrowRequestApi'
import dayjs from 'dayjs'
import FilterRequest from '~/components/filter/FilterRequest'
import { RequestStatus } from '~/global/enum'
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner'
import Scanner from '~/components/modal/Scanner'
import { notifySuccess } from '~/global/toastify'
import FilterByEmployee from '~/components/filter/FilterByEmployee'

const Text = styled(Typography)`
  color: var(--black-color);
  margin: 0.5rem 0;
  max-height: 50px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`
const StatusText = ({ status }: { status: string }) => {
  if (status === RequestStatus.REJECTED) {
    return <StatusDiv rejected>Rejected</StatusDiv>
  }
  if (status === RequestStatus.APPROVED) {
    return <StatusDiv accepted>Approved</StatusDiv>
  }
  if (status === RequestStatus.DONE) {
    return <StatusDiv done>Done</StatusDiv>
  }
  if (status === RequestStatus.CANCELED) {
    return <StatusDiv canceled>Canceled</StatusDiv>
  }
  if (status === RequestStatus.EXPIRED) {
    return <StatusDiv expired>Expired</StatusDiv>
  }
  return null
}
const BorrowRequestManager = () => {
  const PER_PAGE = 10
  const [page, setPage] = useState(1)
  const [borrowRequests, setBorrowRequests] = useState<any[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [selectedRequest, setSelectedRequest] = useState<any>(null)
  const [rejectID, setRejectID] = useState<number | null>(null)
  const [selectedStatus, setSelectedStatus] = useState<string>(RequestStatus.PENDING)
  const [selectedEmployee, setSelectedEmployee] = useState<string>('')

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [isScanModalOpen, setIsScanModalOpen] = useState(false)
  const [scanning, setScanning] = useState(false)
  const { getBorrowRequests, getBorrowRequestsAll, acceptBorrowRequest, rejectBorrowRequest, verifyBorrowRequest } =
    useBorrowRequestApi()

  const WrapperDiv = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',

    [theme.breakpoints.down('lg')]: {
      flexDirection: 'column',
      alignItems: 'flex-start',
      position: 'static'
    },

    [theme.breakpoints.up('lg')]: {
      position: 'absolute',
      right: '0px',
      top: '-65px'
    }
  }))

  const fetchBorrowRequests = async () => {
    try {
      const response = await getBorrowRequestsAll(
        selectedStatus || undefined,
        selectedEmployee || undefined,
        undefined,
        undefined,
        page
      )
      const responseData = response.data.data
      const totalPages = response.data.total

      if (responseData && Array.isArray(responseData)) {
        setBorrowRequests(responseData)
        setTotalPages(Math.ceil(totalPages / PER_PAGE))
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsFetching(false)
    }
  }

  useEffect(() => {
    fetchBorrowRequests()
  }, [page, selectedStatus, selectedEmployee])

  const count = totalPages
  const _DATA = usePagination(borrowRequests, PER_PAGE)
  const handleChange = (_e: React.ChangeEvent<unknown>, pageNumber: number) => {
    setPage(pageNumber)
    _DATA.jump(pageNumber)
  }
  const handleInfoIconClick = async (id: string) => {
    try {
      setIsDetailModalOpen(true)
      const response = await getBorrowRequests(id)
      const requestDetails = response.data
      setSelectedRequest(requestDetails)
    } catch (error) {
      console.log(error)
    }
  }

  const handleClosePopup = () => {
    setSelectedRequest(null)
    setIsDetailModalOpen(false)
  }
  const handleAccept = async (borrowRequestId: string) => {
    try {
      await acceptBorrowRequest(borrowRequestId)
      await fetchBorrowRequests()
    } catch (error) {
      console.log(error)
    }
  }
  const handleReject = (id: number) => {
    setRejectID(id)
    setIsModalOpen(true)
  }
  const handleRejectModalClose = () => {
    setIsModalOpen(false)
  }
  const handleRejectModalSubmit = async (reason: string) => {
    setIsModalOpen(false)
    if (rejectID) {
      try {
        await rejectBorrowRequest({ id: String(rejectID), rejectedReason: reason })
        await fetchBorrowRequests()
      } catch (error) {
        console.log(error)
      }
    }
  }

  const handleStatusChange = (event: SelectChangeEvent<string>) => {
    setSelectedStatus(event.target.value)
  }

  const handleEmployeeChange = (event: SelectChangeEvent<string>) => {
    setSelectedEmployee(event.target.value)
  }

  const handleClearFilter = () => {
    setSelectedStatus('')
  }

  const handleClearEmployeeFilter = () => {
    setSelectedEmployee('')
  }

  const handleScanModalClose = () => {
    setIsScanModalOpen(false)
  }

  const handleQrIconClick = () => {
    setIsScanModalOpen(true)
    setScanning(true)
  }

  const handleScan = async (scanData: string | null) => {
    if (scanData && scanData !== '') {
      try {
        const result = await verifyBorrowRequest({
          QRCode: scanData
        })
        if (result) {
          notifySuccess('Borrow request confirmed successfully')
        }
        setIsFetching(true)
      } catch (error) {
        console.log(error)
      } finally {
        handleScanModalClose()
        setScanning(false)
        await fetchBorrowRequests()
      }
    }
  }

  return (
    <>
      <Box
        display='flex'
        flexDirection='column'
        justifyContent='space-between'
        minHeight='81vh'
        marginTop='10px'
        position='relative'
      >
        <div>
          <WrapperDiv>
            <FilterByEmployee
              selectedEmployee={selectedEmployee}
              onChange={handleEmployeeChange}
              onClearFilter={handleClearEmployeeFilter}
            />
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <FilterRequest
                selectedStatus={selectedStatus}
                onChange={handleStatusChange}
                onClearFilter={handleClearFilter}
              />
              <QrCodeScannerIcon
                sx={{ marginLeft: '20px', color: 'var(--primary-dark-color)' }}
                fontSize='large'
                onClick={handleQrIconClick}
                cursor='pointer'
              />
            </div>
          </WrapperDiv>
          {isFetching ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} width='100%' height='60vh'>
              <CircularProgress />
            </Box>
          ) : borrowRequests.length === 0 ? (
            <Typography variant='body1'>There is no request.</Typography>
          ) : (
            <Box display='flex' flexWrap='wrap'>
              {_DATA.currentData().map((request) => (
                <RequestCard key={request.id}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      <Avatar sx={{ width: '45px', height: '45px' }} src={request.createdBy.photoURL} />
                      <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '0.75rem' }}>
                        <Typography
                          sx={{ fontSize: '16px', fontWeight: '600', marginRight: '10px' }}
                        >{`${request.createdBy.firstName} ${request.createdBy.lastName}`}</Typography>
                        <Typography sx={{ color: '#a5aab5', letterSpacing: '0', fontSize: '16px' }}>
                          {request.code}
                        </Typography>
                      </div>
                    </div>
                    <InfoIcon
                      sx={{ color: 'var(--black-light-color)', cursor: 'pointer' }}
                      onClick={() => handleInfoIconClick(request.id)}
                    />
                  </div>
                  <div style={{ height: '200px' }}>
                    <Text variant='body2'>
                      <strong> File name: </strong>
                      {request.document.name}
                    </Text>
                    <Text variant='body2'>
                      <strong> Description: </strong>
                      {request.description}
                    </Text>
                    <Text variant='body2'>
                      <strong> Time request: </strong>
                      {dayjs(request.createdAt).format('MM/DD/YYYY HH:mm:ss')}
                    </Text>
                    {request.rejectedReason && (
                      <Text variant='body2'>
                        <strong> Reason: </strong>
                        {request.rejectedReason}
                      </Text>
                    )}
                  </div>
                  <CardActions sx={{ justifyContent: 'space-evenly' }}>
                    {request.status === 'PENDING' ? (
                      <>
                        <AcceptButton text='Approve' onClick={() => handleAccept(request.id)} />
                        <RejectButton text='Reject' onClick={() => handleReject(request.id)} />
                      </>
                    ) : (
                      <StatusText status={request.status} />
                    )}
                  </CardActions>
                </RequestCard>
              ))}
            </Box>
          )}
        </div>
        <Pagination count={count} size='large' page={page} variant='outlined' shape='rounded' onChange={handleChange} />
        <DetailRequestModal
          open={isDetailModalOpen}
          handleClose={handleClosePopup}
          selectedRequest={selectedRequest}
          isLoading={selectedRequest === null}
        />
        <RejectRequestModal open={isModalOpen} onClose={handleRejectModalClose} onSubmit={handleRejectModalSubmit} />
        <Scanner
          open={isScanModalOpen}
          handleClose={handleScanModalClose}
          scanning={scanning}
          handleScan={handleScan}
        />
      </Box>
    </>
  )
}
export default BorrowRequestManager
