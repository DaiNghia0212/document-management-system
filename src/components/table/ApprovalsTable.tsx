/* eslint-disable react-hooks/exhaustive-deps */
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import ActionsCell from './ActionCell'
import PropTypes, { Validator } from 'prop-types'
import { useState, useEffect } from 'react'
import useDocumentApi from '~/hooks/api/useDocumentApi'
import { ConfirmButton } from '../button/Button'
import Scanner from '../modal/Scanner'
import { notifySuccess } from '~/global/toastify'
import dayjs from 'dayjs'
import { DocumentDetail } from '~/global/interface'
import { DocumentStatus } from '~/global/enum'
import Detail from '../modal/Detail'
import { Box, CircularProgress } from '@mui/material'

interface ApprovalsTableProps {
  view: 'dashboard' | 'full'
  searchData?: string
}

interface PaginationModel {
  page: number
  pageSize: number
}

const ApprovalsTable: React.FC<ApprovalsTableProps> = ({ view, searchData }) => {
  let columns: GridColDef[] = []
  const { getPendingDocuments, confirmDocument } = useDocumentApi()
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState([])
  const [documentId, setDocumentId] = useState('')
  const [rowCountState, setRowCountState] = useState<number>(0)
  const [paginationModel, setPaginationModel] = useState<PaginationModel>({
    page: 0,
    pageSize: view === 'full' ? 10 : 5
  })
  const [scanning, setScanning] = useState(true)

  const [detail, setDetail] = useState(false)
  const [loadingData, setLoadingData] = useState(false)

  const handleDetailOpen = async (id: string) => {
    setLoadingData(true)
    await fetchDetails(id)
    setDetail(true)
  }

  const handleDetailClose = () => {
    setDetail(false)
  }

  const { getDocument, getDocumentBarcode } = useDocumentApi()
  const [document, setDocument] = useState<DocumentDetail>()
  const [barcode, setBarcode] = useState<string>('')

  const fetchDetails = async (id: string) => {
    try {
      setBarcode('')
      setDocument(undefined)
      const document = await getDocument(id)
      setDocument(document.data)
      if ([DocumentStatus.PENDING, DocumentStatus.AVAILABLE, DocumentStatus.BORROWED].includes(document.data.status)) {
        const barcode = await getDocumentBarcode(id)
        if (barcode.data.barcode) {
          setBarcode(barcode.data.barcode)
        }
      }
      setLoadingData(false)
    } catch (error) {
      console.log(error)
    }
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleScan = async (scanData: string | null) => {
    if (scanData && scanData !== '') {
      try {
        const result = await confirmDocument({
          id: documentId,
          locationQRcode: scanData
        })
        if (result) {
          notifySuccess('Document confirmed successfully')
        }
        setIsLoading(true)
      } catch (error) {
        console.log(error)
      } finally {
        handleClose()
        setScanning(false)
      }
    }
  }

  const fetchData = async () => {
    setIsLoading(true)
    const result = await getPendingDocuments(paginationModel.pageSize, paginationModel.page, searchData)
    setData(result.data.data)
    setRowCountState((prevRowCountState) => (result.data.total !== undefined ? result.data.total : prevRowCountState))
    setIsLoading(false)
  }

  const handlePaginationModelChange = (newPaginationModel: PaginationModel) => {
    setIsLoading(true)
    setData([])
    setPaginationModel(newPaginationModel)
  }

  useEffect(() => {
    fetchData()
  }, [paginationModel, searchData])

  let rowHeight = 60
  if (view === 'dashboard') {
    columns = [
      {
        field: 'id',
        headerName: 'No.',
        width: 50,
        sortable: false,
        filterable: false,
        headerAlign: 'center',
        align: 'center',
        renderCell: (params) =>
          paginationModel.pageSize * paginationModel.page +
          params.api.getRowIndexRelativeToVisibleRows(params.row.id) +
          1
      },
      { field: 'name', headerName: 'Name', flex: 1 },
      {
        field: 'updatedAt',
        headerName: 'Created at',
        flex: 1,
        headerAlign: 'center',
        align: 'center',
        valueFormatter: ({ value }) => dayjs(value).format('MM/DD/YYYY')
      },
      {
        field: 'more-options',
        headerName: '',
        width: 20,
        sortable: false,
        filterable: false,
        align: 'left',
        renderCell: (params: GridRenderCellParams) => {
          const menuItems = [
            {
              text: 'Detail',
              onClick: () => {
                handleDetailOpen(params.row.id as string)
              }
            },
            {
              text: 'Confirm',
              onClick: () => {
                setOpen(true)
                setScanning(true)
                setDocumentId(params.row.id as string)
              }
            }
          ]
          return <ActionsCell id={params.row.id as number} menuItems={menuItems} />
        }
      }
    ]
    rowHeight = 40
  } else if (view === 'full') {
    columns = [
      {
        field: 'id',
        headerName: 'No.',
        width: 50,
        sortable: false,
        filterable: false,
        headerAlign: 'center',
        align: 'center',
        renderCell: (params) =>
          paginationModel.pageSize * paginationModel.page +
          params.api.getRowIndexRelativeToVisibleRows(params.row.id) +
          1
      },
      { field: 'name', headerName: 'Name', flex: 1, minWidth: 130 },
      {
        field: 'department',
        headerName: 'Department',
        flex: 1,
        filterable: false,
        minWidth: 85,
        maxWidth: 150,
        valueGetter: ({ row }) => {
          return row.folder.locker.room.department.name
        }
      },
      {
        field: 'room',
        headerName: 'Room',
        minWidth: 85,
        maxWidth: 120,
        flex: 1,
        headerAlign: 'center',
        align: 'center',
        valueGetter: ({ row }) => {
          return row.folder.locker.room.name
        }
      },
      {
        field: 'locker',
        headerName: 'Locker',
        minWidth: 85,
        maxWidth: 120,
        flex: 1,
        headerAlign: 'center',
        align: 'center',
        valueGetter: ({ row }) => {
          return row.folder.locker.name
        }
      },
      {
        field: 'folder',
        headerName: 'Folder',
        minWidth: 85,
        maxWidth: 120,
        flex: 1,
        headerAlign: 'center',
        align: 'center',
        valueFormatter: ({ value }) => value.name
      },
      {
        field: 'category',
        headerName: 'Category',
        minWidth: 100,
        maxWidth: 200,
        flex: 1,
        valueFormatter: ({ value }) => value.name
      },
      {
        field: 'updatedAt',
        headerName: 'Created at',
        flex: 1,
        minWidth: 120,
        headerAlign: 'center',
        align: 'center',
        valueFormatter: ({ value }) => dayjs(value).format('MM/DD/YYYY')
      },
      {
        field: 'action',
        headerName: 'Action',
        width: 120,
        sortable: false,
        filterable: false,
        headerAlign: 'center',
        align: 'center',
        renderCell: (param: GridRenderCellParams) => (
          <ConfirmButton
            text='Confirm'
            onClick={() => {
              setOpen(true)
              setScanning(true)
              setDocumentId(param.row.id as string)
            }}
          />
        )
      },
      {
        field: 'more-options',
        headerName: '',
        width: 20,
        sortable: false,
        filterable: false,
        align: 'left',
        renderCell: (params: GridRenderCellParams) => {
          const menuItems = [
            {
              text: 'Detail',
              onClick: () => {
                handleDetailOpen(params.row.id as string)
              }
            },
            { text: 'Delete', onClick: () => console.log('Delete clicked') }
          ]
          return <ActionsCell id={params.row.id as number} menuItems={menuItems} />
        }
      }
    ]
  }
  return (
    <div
      style={{
        width: '100%',
        height: view === 'dashboard' ? 'calc(100% - 30px)' : 'calc(100vh - 225px)',
        borderRadius: 5,
        margin: '10px 0'
      }}
    >
      <Scanner scanning={scanning} open={open} handleClose={handleClose} handleScan={handleScan} />
      {!loadingData ? (
        <Detail document={document} barcode={barcode} open={detail} onClose={handleDetailClose} />
      ) : (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100%',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'rgba(0, 0, 0, 0.5)',
            maxHeight: '100vh',
            zIndex: 9999
          }}
        >
          <CircularProgress />
        </Box>
      )}

      <DataGrid
        columnHeaderHeight={rowHeight + 10}
        disableColumnMenu
        hideFooterSelectedRowCount
        rowHeight={rowHeight}
        rows={data}
        columns={columns}
        rowCount={rowCountState}
        loading={isLoading}
        pageSizeOptions={[paginationModel.pageSize]}
        paginationModel={paginationModel}
        paginationMode='server'
        onPaginationModelChange={handlePaginationModelChange}
        initialState={{
          sorting: {
            sortModel: [{ field: 'updatedAt', sort: 'asc' }]
          }
        }}
        sx={{
          border: 'none',
          fontSize: '12px', // default: 14px
          '.MuiDataGrid-footerContainer': {
            borderTop: 'none',
            maxHeight: rowHeight,
            minHeight: rowHeight
          },
          '.MuiToolbar-root': {
            minHeight: rowHeight
          }
        }}
        style={{
          backgroundColor: view === 'dashboard' ? 'transparent' : 'white'
        }}
      />
    </div>
  )
}

ApprovalsTable.propTypes = {
  view: PropTypes.oneOf<'dashboard' | 'full'>(['dashboard', 'full']).isRequired as Validator<'dashboard' | 'full'>,
  searchData: PropTypes.string
}

export default ApprovalsTable
