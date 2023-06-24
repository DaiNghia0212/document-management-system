import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import ActionsCell from './ActionCell'
import PropTypes, { Validator } from 'prop-types'
import { Link } from 'react-router-dom'
import CheckRoundedIcon from '@mui/icons-material/CheckRounded'
import ModalLayout from '../modal/ModalLayout'
import CodeScanner from '../modal/scanner/CodeScanner'
import { useState, useEffect } from 'react'
import useDocumentApi from '~/hooks/api/useDocumentApi'
interface ApprovalsTableProps {
  view: 'dashboard' | 'full'
}

interface PaginationModel {
  page: number
  pageSize: number
}

const ApprovalsTable: React.FC<ApprovalsTableProps> = ({ view }) => {
  let columns: GridColDef[] = []
  const { getPendingDocuments } = useDocumentApi()
  const [_open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState([])
  const [rowCountState, setRowCountState] = useState<number>(0)
  const [paginationModel, setPaginationModel] = useState<PaginationModel>({
    page: 0,
    pageSize: 10
  })

  const fetchData = async () => {
    if (isLoading) {
      const result = await getPendingDocuments(paginationModel.pageSize, paginationModel.page)
      setData(result.data.data)
      setRowCountState((prevRowCountState) => (result.data.total !== undefined ? result.data.total : prevRowCountState))
      setIsLoading(false)
    }
  }

  const handlePaginationModelChange = (newPaginationModel: PaginationModel) => {
    setIsLoading(true)
    setData([])
    setPaginationModel(newPaginationModel)
    fetchData()
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleClose = () => {
    setOpen(false)
  }

  let rowHeight = 50
  if (view === 'dashboard') {
    columns = [
      {
        field: 'id',
        headerName: 'No.',
        width: 50,
        sortable: false,
        filterable: false,
        headerAlign: 'center',
        align: 'center'
      },
      { field: 'fileName', headerName: 'File Name', flex: 1 },
      { field: 'createAt', headerName: 'Create at', flex: 2 },
      {
        field: 'more-options',
        headerName: '',
        width: 20,
        sortable: false,
        filterable: false,

        align: 'left',
        renderCell: (params: GridRenderCellParams) => {
          const menuItems = [
            { text: 'Detail', onClick: () => console.log('Detail clicked') },
            { text: 'Confirm', onClick: () => console.log('Confirm clicked') }
          ]
          return <ActionsCell id={params.row.id as number} menuItems={menuItems} />
        }
      }
    ]
    rowHeight = 35
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
      { field: 'name', headerName: 'Name', flex: 1, minWidth: 100, maxWidth: 250 },
      {
        field: 'department',
        headerName: 'Department',
        flex: 1,
        minWidth: 80,
        maxWidth: 200,
        valueGetter: ({ row }) => {
          return row.folder.locker.room.department.name
        }
      },
      {
        field: 'room',
        headerName: 'Room',
        minWidth: 50,
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
        minWidth: 50,
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
        minWidth: 50,
        maxWidth: 120,
        flex: 1,
        headerAlign: 'center',
        align: 'center',
        valueFormatter: ({ value }) => value.name
      },
      {
        field: 'category',
        headerName: 'Category',
        minWidth: 75,
        maxWidth: 150,
        flex: 1,
        valueFormatter: ({ value }) => value.name
      },
      { field: 'createdAt', headerName: 'Created at', flex: 1, minWidth: 140 },
      {
        field: 'action',
        headerName: 'Action',
        width: 125,
        sortable: false,
        filterable: false,
        headerAlign: 'center',
        align: 'center',
        renderCell: () => (
          <Link to={''}>
            {/* <Button
              endIcon={<CheckRoundedIcon />}
              size='small'
              style={{ padding: '7px 10px', fontWeight: 600, fontSize: 12 }}
              variant='outlined'
              onClick={() => console.log('Action clicked')}
            >
              Confirm
            </Button> */}
            <ModalLayout
              size='small'
              style={{ padding: '7px 10px', fontWeight: 600, fontSize: 12 }}
              variant='outlined'
              button='confirm'
              endIcon={<CheckRoundedIcon />}
            >
              <CodeScanner handleClose={handleClose} />
            </ModalLayout>
          </Link>
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
            { text: 'Detail', onClick: () => console.log('Detail clicked') },
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
        height: view === 'dashboard' ? 'calc(100% - 30px)' : '100%',
        borderRadius: 5,
        margin: '10px 0'
      }}
    >
      <DataGrid
        columnHeaderHeight={rowHeight + 10}
        disableColumnMenu
        hideFooterSelectedRowCount
        rowHeight={rowHeight}
        rows={data}
        columns={columns}
        rowCount={rowCountState}
        loading={isLoading}
        pageSizeOptions={[10]}
        paginationModel={paginationModel}
        paginationMode='server'
        onPaginationModelChange={handlePaginationModelChange}
        initialState={{
          sorting: {
            sortModel: [{ field: 'createdAt', sort: 'asc' }]
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
  view: PropTypes.oneOf<'dashboard' | 'full'>(['dashboard', 'full']).isRequired as Validator<'dashboard' | 'full'>
}

export default ApprovalsTable
