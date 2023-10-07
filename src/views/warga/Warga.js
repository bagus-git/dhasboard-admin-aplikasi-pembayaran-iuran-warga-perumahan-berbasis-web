import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CPagination,
  CPaginationItem,
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

const limitPage = 10

const initForm = {
  phoneNumber: '',
  email: '',
  password: '',
  name: '',
  houseNumber: '',
  roadBlock: '',
  idNumber: '',
}
const Warga = () => {
  const [toast, setToast] = useState(0)
  const [validated, setValidated] = useState(false)
  const formElement = useRef(null)
  const [isEdit, setIsEdit] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [page, setPage] = useState(1)
  const [form, setForm] = useState({ ...initForm })
  const [warga, setWarga] = useState([])

  const fetchData = async () => {
    const results = await readData('warga')
    if (results) {
      const wargaData = Object.keys(results).map((phoneNumber) => {
        return {
          phoneNumber,
          ...results[phoneNumber],
        }
      })
      setWarga(wargaData)
      if (Object.keys(results).length) {
        writeData('dashboard/totalWarga', null, Object.keys(results).length)
      }
    }
  }

  useEffect(() => {
    fetchData().catch((e) => {
      console.log(e)
    })
  }, [])

  const paginationClick = (newPage) => {
    setPage(newPage)
  }

  const goToPrevious = () => {
    setPage(page - 1)
  }

  const goToNext = () => {
    setPage(page + 1)
  }

  const onEdit = (item) => {
    setForm({ ...item })
    setModalVisible(true)
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
      delete payload.phoneNumber
      const uniqueId = form.phoneNumber
      try {
        const existingData = await readData('warga', uniqueId)
        if (!existingData || isEdit) {
          writeData('warga', uniqueId, payload)
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
              message: 'Phone number sudah ada',
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
      const deleted = await deleteData('warga', uniqueId)
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

  const pagination = useCallback(() => {
    const newWarga = [...warga]
    const startIndex = (page - 1) * limitPage
    const endIndex = startIndex + limitPage
    const result = newWarga.slice(startIndex, endIndex)
    return result
  }, [warga, page])

  const totalPagination = warga.length < limitPage ? 0 : Math.ceil(warga.length / limitPage)
  const title = isEdit ? 'Edit Warga' : 'Tambah Warga'
  const { phoneNumber, email, password, name, houseNumber, roadBlock, idNumber } = form

  return (
    <CRow>
      <CToaster push={toast} placement="top-end" />
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
                  No Telp
                </CFormLabel>
                <CCol sm={9}>
                  <CFormInput
                    feedbackInvalid="No Telp wajib diisi."
                    type="number"
                    step=".01"
                    value={phoneNumber}
                    onChange={(e) => {
                      onChangeForm('phoneNumber', e.target.value)
                    }}
                    required
                    readOnly={isEdit}
                  />
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CFormLabel htmlFor="staticEmail" className="col-sm-3 col-form-label">
                  Email
                </CFormLabel>
                <CCol sm={9}>
                  <CFormInput
                    type="email"
                    value={email}
                    onChange={(e) => {
                      onChangeForm('email', e.target.value)
                    }}
                    required
                    feedbackInvalid="Email wajib diisi."
                  />
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CFormLabel htmlFor="staticEmail" className="col-sm-3 col-form-label">
                  Password
                </CFormLabel>
                <CCol sm={9}>
                  <CFormInput
                    type="password"
                    value={password}
                    onChange={(e) => {
                      onChangeForm('password', e.target.value)
                    }}
                    required
                    feedbackInvalid="Password wajib diisi."
                  />
                </CCol>
              </CRow>
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
                    required
                    feedbackInvalid="Nama wajib diisi."
                  />
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CFormLabel htmlFor="staticEmail" className="col-sm-3 col-form-label">
                  No Rumah
                </CFormLabel>
                <CCol sm={9}>
                  <CFormInput
                    type="text"
                    value={houseNumber}
                    onChange={(e) => {
                      onChangeForm('houseNumber', e.target.value)
                    }}
                    required
                    feedbackInvalid="No Rumah wajib diisi."
                  />
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CFormLabel htmlFor="staticEmail" className="col-sm-3 col-form-label">
                  Blok Jalan
                </CFormLabel>
                <CCol sm={9}>
                  <CFormInput
                    type="text"
                    value={roadBlock}
                    onChange={(e) => {
                      onChangeForm('roadBlock', e.target.value)
                    }}
                    required
                    feedbackInvalid="Blok Jalan wajib diisi."
                  />
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CFormLabel htmlFor="staticEmail" className="col-sm-3 col-form-label">
                  No Pelanggan
                </CFormLabel>
                <CCol sm={9}>
                  <CFormInput
                    type="number"
                    value={idNumber}
                    onChange={(e) => {
                      onChangeForm('idNumber', e.target.value)
                    }}
                    required
                    feedbackInvalid="No Pelanggan wajib diisi."
                  />
                </CCol>
              </CRow>
            </CForm>
          </CCol>
        </CRow>
      </Modal>
      <CCol xs>
        <CButton onClick={onNew} color="primary mb-4">
          <CIcon icon={cilPlus} /> Tambah Warga
        </CButton>
        <CCard className="mb-4">
          <CCardHeader>Tabel Akun Warga</CCardHeader>
          <CCardBody>
            <CRow>
              <CCol xs={12}>
                {warga?.length > 0 && (
                  <CTable bordered responsive>
                    <CTableHead>
                      <CTableRow>
                        <CTableHeaderCell scope="col">No</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Nama</CTableHeaderCell>
                        <CTableHeaderCell scope="col">No Telp</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Email</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Password</CTableHeaderCell>
                        <CTableHeaderCell scope="col">No Rumah</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Blok Jalan</CTableHeaderCell>
                        <CTableHeaderCell scope="col">No Pelanggan</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Status Pembayaran</CTableHeaderCell>
                        <CTableHeaderCell style={wargaStyle.action} scope="col">
                          Action
                        </CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {pagination().map((item, indx) => (
                        <CTableRow key={indx}>
                          <CTableDataCell>{indx + 1}</CTableDataCell>
                          <CTableDataCell>{item.name}</CTableDataCell>
                          <CTableDataCell>{item.phoneNumber}</CTableDataCell>
                          <CTableDataCell>{item.email}</CTableDataCell>
                          <CTableDataCell>{item.password}</CTableDataCell>
                          <CTableDataCell>{item.houseNumber}</CTableDataCell>
                          <CTableDataCell>{item.roadBlock}</CTableDataCell>
                          <CTableDataCell>{item.idNumber}</CTableDataCell>
                          <CTableDataCell>
                            {item.status === true && <CBadge color="success">Lunas</CBadge>}
                            {item.status === false && <CBadge color="danger">Belum Lunas</CBadge>}
                          </CTableDataCell>
                          <CTableDataCell style={wargaStyle.tableDataCell}>
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
                                onDelete(item.phoneNumber)
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

                <CPagination aria-label="Page navigation example">
                  <CPaginationItem onClick={goToPrevious} disabled={page === 1}>
                    Previous
                  </CPaginationItem>
                  {[...Array(totalPagination)].map((item, index) => (
                    <CPaginationItem
                      active={index + 1 === page}
                      onClick={() => {
                        paginationClick(index + 1)
                      }}
                      key={index}
                    >
                      {index + 1}
                    </CPaginationItem>
                  ))}
                  <CPaginationItem
                    disabled={page === totalPagination || totalPagination === 0}
                    onClick={goToNext}
                  >
                    Next
                  </CPaginationItem>
                </CPagination>
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

const wargaStyle = {
  action: {
    width: '180px',
  },
  tableDataCell: {
    display: 'flex',
    justifyContent: 'space-evenly',
  },
}

export default Warga
