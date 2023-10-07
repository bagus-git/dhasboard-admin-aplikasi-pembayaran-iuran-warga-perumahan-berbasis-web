import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CToast,
  CToastBody,
  CToastClose,
  CToaster,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPen, cilPlus, cilTrash } from '@coreui/icons'
import { Modal } from 'src/components/Modal'
import { deleteData, readData, writeData } from 'src/firebase/FirebaseDB'

const initForm = {
  name: '',
  password: '',
  username: '',
}
const Admin = () => {
  const formElement = useRef(null)
  const [isEdit, setIsEdit] = useState(false)
  const [validated, setValidated] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [toast, setToast] = useState(0)
  const [form, setForm] = useState({ ...initForm })
  const [admins, setAdmins] = useState([])

  const fetchData = async () => {
    const results = await readData('admin')
    if (results) {
      const adminsData = Object.keys(results).map((username) => {
        return {
          username,
          password: results[username].password,
          name: results[username].name,
        }
      })
      setAdmins(adminsData)
      if (Object.keys(results).length) {
        writeData('dashboard/totalAdmin', null, Object.keys(results).length)
      }
    }
  }

  useEffect(() => {
    fetchData().catch((e) => {
      console.log(e)
    })
  }, [])

  const { name, password, username } = form

  const onEdit = (item) => {
    setModalVisible(true)
    setForm({ ...item })
    setIsEdit(true)
  }

  const onNew = (e) => {
    setModalVisible(true)
    setIsEdit(false)
  }

  const onCloseModal = (e) => {
    setModalVisible(false)
  }

  const onChangeForm = useCallback(
    (key, value) => {
      const newForm = { ...form }
      newForm[key] = value
      setForm(newForm)
    },
    [form],
  )

  const onSubmitModal = async () => {
    formElement.current.submit()
    const isValid = formElement.current.checkValidity()
    setValidated(true)
    if (isValid) {
      const payload = { ...form }
      delete payload.username
      const uniqueId = form.username
      try {
        const existingData = await readData('admin', uniqueId)
        if (!existingData || isEdit) {
          writeData('admin', uniqueId, payload)
          setToast(
            renderToast({
              success: true,
              message: 'Data di simpan',
            }),
          )
          fetchData()
          setValidated(false)
          setForm({ ...initForm })
          setModalVisible(false)
        } else {
          setToast(
            renderToast({
              success: false,
              message: 'Username sudah ada',
            }),
          )
        }
      } catch (e) {
        setToast(
          renderToast({
            success: false,
            message: 'Gagal simpan',
          }),
        )
      }
    }
  }

  const onDelete = async (uniqueId) => {
    try {
      const deleted = await deleteData('admin', uniqueId)
      if (deleted) {
        setToast(
          renderToast({
            success: true,
            message: 'Berhasil hapus',
          }),
        )
        fetchData()
      } else {
        setToast(
          renderToast({
            success: false,
            message: 'Gagal hapus',
          }),
        )
      }
    } catch (e) {
      setToast(
        renderToast({
          success: false,
          message: 'Gagal hapus',
        }),
      )
    }
  }

  const renderToast = ({ success, message }) => {
    return (
      <CToast color={success ? 'success' : 'danger'} className="text-white align-items-center mb-4">
        <div className="d-flex">
          <CToastBody>{message}</CToastBody>
          <CToastClose className="me-2 m-auto" white />
        </div>
      </CToast>
    )
  }

  const title = isEdit ? 'Edit Admin' : 'Tambah Admin'

  return (
    <>
      <CToaster push={toast} placement="top-end" />

      <CRow>
        <Modal
          title={title}
          isEdit={isEdit}
          visible={modalVisible}
          onClose={onCloseModal}
          onSubmit={onSubmitModal}
        >
          <CRow>
            <CCol xs={12}>
              <CForm noValidate validated={validated} ref={formElement}>
                <CRow className="mb-3">
                  <CFormLabel htmlFor="staticEmail" className="col-sm-3 col-form-label">
                    Nama
                  </CFormLabel>
                  <CCol sm={9}>
                    <CFormInput
                      type="text"
                      value={name}
                      onChange={(e) => {
                        onChangeForm('name', e.target.value)
                      }}
                    />
                  </CCol>
                </CRow>
                <CRow className="mb-3">
                  <CFormLabel htmlFor="staticEmail" className="col-sm-3 col-form-label">
                    Username
                  </CFormLabel>
                  <CCol sm={9}>
                    <CFormInput
                      feedbackInvalid="Username wajib diisi."
                      type="text"
                      value={username}
                      onChange={(e) => {
                        onChangeForm('username', e.target.value)
                      }}
                      required
                      readOnly={isEdit}
                    />
                  </CCol>
                </CRow>
                <CRow className="mb-3">
                  <CFormLabel htmlFor="staticEmail" className="col-sm-3 col-form-label">
                    Password
                  </CFormLabel>
                  <CCol sm={9}>
                    <CFormInput
                      feedbackInvalid="Password wajib diisi."
                      type="password"
                      value={password}
                      onChange={(e) => {
                        onChangeForm('password', e.target.value)
                      }}
                      required
                    />
                  </CCol>
                </CRow>
              </CForm>
            </CCol>
          </CRow>
        </Modal>
        <CCol xs>
          <CButton onClick={onNew} color="primary mb-4">
            <CIcon icon={cilPlus} /> Tambah Admin
          </CButton>
          <CCard className="mb-4">
            <CCardHeader>Tabel Admin</CCardHeader>
            <CCardBody>
              <CRow>
                <CCol xs={12}>
                  {admins.length > 0 && (
                    <CTable bordered>
                      <CTableHead>
                        <CTableRow>
                          <CTableHeaderCell scope="col">Nama</CTableHeaderCell>
                          <CTableHeaderCell scope="col">Username</CTableHeaderCell>
                          <CTableHeaderCell style={adminStyle.action} scope="col">
                            Action
                          </CTableHeaderCell>
                        </CTableRow>
                      </CTableHead>
                      <CTableBody>
                        {admins.map((item, indx) => (
                          <CTableRow key={indx}>
                            <CTableDataCell>{item.name}</CTableDataCell>
                            <CTableDataCell>{item.name}</CTableDataCell>
                            <CTableDataCell style={adminStyle.tableDataCell}>
                              <CButton
                                onClick={() => {
                                  onEdit(item)
                                }}
                                color="info"
                                shape="rounded-0"
                              >
                                <CIcon icon={cilPen} className="text-white"></CIcon>
                              </CButton>
                              <CButton
                                onClick={() => {
                                  onDelete(item.username)
                                }}
                                color="danger"
                                shape="rounded-0"
                              >
                                <CIcon icon={cilTrash} className="text-white" />
                              </CButton>
                            </CTableDataCell>
                          </CTableRow>
                        ))}
                      </CTableBody>
                    </CTable>
                  )}
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

const adminStyle = {
  action: {
    width: '180px',
  },
  tableDataCell: {
    display: 'flex',
    justifyContent: 'space-evenly',
  },
}

export default Admin
