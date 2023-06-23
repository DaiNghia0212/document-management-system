import { useState } from 'react'
import ModalLayout from '~/components/modal/ModalLayout'
import UpdateDocument from '~/components/modal/UpdateDocument'
import ModalTest from '~/components/test/ModalTest'

const Test = () => {
  //Muốn dùng close button thì làm theo component này

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_open, setOpen] = useState(false)

  const handleClose = () => {
    setOpen(false)
  }
  return (
    <>
      <ModalLayout button='Test'>
        <UpdateDocument handleClose={handleClose} />
      </ModalLayout>
      <ModalLayout button='Test2'>
        <ModalTest handleClose={handleClose} />
      </ModalLayout>
    </>
  )
}

export default Test