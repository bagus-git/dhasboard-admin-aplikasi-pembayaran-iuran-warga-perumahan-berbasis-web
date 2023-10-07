import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CToast,
  CToastBody,
  CToastClose,
  CToaster,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import { useDispatch } from 'react-redux'
import { readData } from 'src/firebase/FirebaseDB'

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [toast, setToast] = useState(0)
  const [validated, setValidated] = useState(false)

  const onLogin = async (event) => {
    try {
      const form = event.currentTarget
      const isValid = form.checkValidity()
      setValidated(true)
      if (isValid) {
        const admin = await readData('admin', username)
        if (admin) {
          const { password: aPassword } = admin
          if (aPassword === password) {
            dispatch({ type: 'set', token: 'abcdefghijklmnop' })
            navigate('/dashboard')
          } else {
            setToast(
              renderToast({
                success: false,
                message: 'Password salah',
              }),
            )
          }
        } else {
          setToast(
            renderToast({
              success: false,
              message: 'Username tidak ditemukan',
            }),
          )
        }
      }
    } catch (e) {
      setToast(
        renderToast({
          success: false,
          message: 'Gagal login',
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
  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CToaster push={toast} placement="top-end" />
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={4}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm noValidate validated={validated} onSubmit={onLogin}>
                    <h1>Masuk</h1>
                    <p className="text-medium-emphasis">Masuk ke akunmu</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        placeholder="Username"
                        autoComplete="username"
                        required
                        feedbackInvalid="Username wajib diisi."
                        onChange={({ target }) => {
                          setUsername(target.value)
                        }}
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        required
                        feedbackInvalid="Password wajib diisi."
                        onChange={({ target }) => {
                          setPassword(target.value)
                        }}
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol xs={6}>
                        <CButton type="submit" color="primary" className="px-4">
                          Login
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
