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
  CToast,
  CToastBody,
  CToastClose,
  CToaster,
} from '@coreui/react'
import React, { useEffect, useState } from 'react'
import { readData, writeData } from 'src/firebase/FirebaseDB'

const Pengaturan = () => {
  const [bill, setBill] = useState(0)
  const [cost, setCost] = useState(0)
  const [toast, setToast] = useState(0)

  const fetchData = async () => {
    const results = await readData('pengaturan')
    if (results) {
      setBill(results.bill)
      setCost(results.cost)
    }
  }

  useEffect(() => {
    fetchData().catch((e) => {
      console.log(e)
    })
  }, [])

  const saveBill = async () => {
    await writeData('pengaturan/bill', null, bill)
    setToast(
      renderToast({
        success: true,
        message: 'Tagihan di simpan',
      }),
    )
  }

  const saveCost = () => {
    writeData('pengaturan/cost', null, cost)
    setToast(
      renderToast({
        success: true,
        message: 'Biaya admin di simpan',
      }),
    )
  }

  const generatePeriod = () => {
    const today = new Date()
    var year = today.getFullYear()
    var month = today.getMonth() + 1
    var date = today.getDate()
    var result = date + '-' + month + '-' + year
    return result
  }

  const calculatePayment = async (e) => {
    try {
      const allVillagers = await readData('warga')
      if (Object.keys(allVillagers).length) {
        Object.keys(allVillagers).forEach((phoneNumber) => {
          const existingBills = allVillagers[phoneNumber].tagihan
          const bills = existingBills || {}
          bills[generatePeriod()] = {
            bill,
            cost,
          }
          allVillagers[phoneNumber].tagihan = { ...bills }
          allVillagers[phoneNumber].status = false
        })
        await writeData('warga', null, allVillagers)
        setToast(
          renderToast({
            success: true,
            message: 'Taghihan seluruh warga berhasil dikirimkan',
          }),
        )
      } else {
        setToast(
          renderToast({
            success: false,
            message: 'Warga masih kosong',
          }),
        )
      }
    } catch (e) {
      console.log(e)
      setToast(
        renderToast({
          success: false,
          message: 'Gagal tahih warga',
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
    <CRow>
      <CToaster push={toast} placement="top-end" />
      <CCol xs>
        <CCard className="mb-4">
          <CCardHeader>Tagihan</CCardHeader>
          <CCardBody>
            <CRow>
              <CCol xs={4}>
                <CForm>
                  <CRow className="mb-3">
                    <CFormLabel htmlFor="staticEmail" className="col-sm-12 col-form-label">
                      Biaya Tagihan
                    </CFormLabel>
                    <CCol sm={12}>
                      <CFormInput
                        onBlur={saveBill}
                        onChange={({ target }) => {
                          setBill(target.value)
                        }}
                        type="number"
                        value={bill}
                      />
                    </CCol>
                  </CRow>
                  <CRow className="mb-3">
                    <CFormLabel htmlFor="staticEmail" className="col-sm-12 col-form-label">
                      Biaya Admin
                    </CFormLabel>
                    <CCol sm={12}>
                      <CFormInput
                        type="number"
                        value={cost}
                        onChange={({ target }) => {
                          setCost(target.value)
                        }}
                        onBlur={saveCost}
                      />
                    </CCol>
                  </CRow>
                  <CButton
                    onClick={calculatePayment}
                    color="success"
                    shape="rounded"
                    className="text-white"
                    style={settingStyle.button}
                  >
                    Tagih Warga
                  </CButton>
                </CForm>
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

const settingStyle = {
  button: {
    width: '140px',
  },
}

export default Pengaturan
