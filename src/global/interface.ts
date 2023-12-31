import { DocumentStatus } from './enum'

export interface Department {
  id: string
  name: string
  roomMap?: Map<string, Room>
}

export interface Room {
  id: string
  name: string
  capacity: number
  lockerMap?: Map<string, Locker>
  department?: Department
}

export interface Locker {
  id: string
  name: string
  capacity: number
  folderMap?: Map<string, FolderTree>
  room?: Room
}

export interface Folder {
  id: string
  name: string
  capacity: number
  locker?: Locker
  current?: number
}

export interface File {
  id: string
  name: string
  description: string
  status: DocumentStatus
  numOfPages: number
  createdAt: Date
  updatedAt: Date
  folder?: Folder
}

export interface FolderTree extends Folder {
  documents: File[]
}

export interface LockerTree extends Locker {
  folders: FolderTree[]
}

export interface RoomTree extends Room {
  lockers: LockerTree[]
}

export interface DepartmentTree extends Department {
  rooms: RoomTree[]
}

export interface BorrowRequest {
  document: {
    id: string
  }
  description: string
  startDate: Date
  borrowDuration: number
}

export interface Categories {
  id: string
  name: string
  department: {
    id: string
  }
}

export interface CreateCategory {
  name: string
  department: {
    id: string
  }
  capacity?: number
}

export interface UpdateCategory {
  id: string
  name: string
  capacity?: number
}

export interface CreateDepartment {
  name: string
}

export interface UpdateDepartment extends CreateDepartment {
  id: string
}

export interface CreateDocument {
  name: string
  description: string
  numOfPages: number
  folder: {
    id: string
  }
  category: {
    id: string
  }
}

export interface UpdateDocument {
  id: string
  name: string
  description: string
  category: {
    id: string
  }
}

export interface MoveDocument {
  id: string
  folderId: string
}

export interface PossibleLocation {
  id: string
  name: string
  capacity: number
  lockers: {
    id: string
    name: string
    capacity: number
    folders: { id: string; name: string; capacity: number; current: number }[]
  }[]
}

export interface ConfirmDocument {
  id: string
  locationQRcode: string
}

export interface CreateFolder {
  name: string
  capacity: number
  locker: {
    id: string
  }
}

export interface UpdateFolder {
  id: string
  name: string
  capacity: number
}

export interface UpdateLocker {
  id: string
  name: string
  capacity: number
}

export interface CreateLocker {
  name: string
  capacity: number
  room: {
    id: string
  }
}

export interface CreateRoom {
  name: string
  capacity: number
  department: {
    id: string
  }
}

export interface UpdateRoom {
  id: string
  name: string
  capacity: number
}

export interface ImportRequest {
  document: {
    name: string
    description: string
    numOfPages: number
    folder: {
      id: string
    }
    category: {
      id: string
    }
  }
  description: string
}

export interface Reject {
  id: string
  rejectedReason: string
}

export interface DocumentDetail {
  id: string
  name: string
  description: string
  status: string
  numOfPages: number
  createdAt: Date
  updatedAt: Date
  folder: {
    id: string
    name: string
    locker: {
      id: string
      name: string
      room: {
        id: string
        name: string
        department: {
          id: string
          name: string
        }
      }
    }
  }
  category: {
    id: string
    name: string
  }
  borrowedBy: {
    firstName: string
    lastName: string
  }
}

export interface VerifiedRequset {
  QRCode: string
}

export interface User {
  id: string
  code: string
  firstName: string
  lastName: string
  email: string
  phone: string
}

export interface CreateUser {
  code: string
  firstName: string
  lastName: string
  email: string
  phone: string
  department: {
    id: string
  }
}

export interface UpdateUser {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
}

export interface ImportAnalysisData {
  name: string
  count: string
}

export interface BorrowAnalysisData {
  name: string
  count: string
}
