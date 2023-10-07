import React, { useEffect, useState } from 'react'

import { CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react'
import { readData } from 'src/firebase/FirebaseDB'

const Dashboard = () => {
  const [dashboard, setDashboard] = useState({
    totalAdmin: 0,
    totalWarga: 0,
    saldoKas: 0,
  })
  const { totalAdmin, totalWarga, saldoKas } = dashboard

  const fetchData = async () => {
    const results = await readData('dashboard')
    if (results) {
      setDashboard({ ...results })
    }
  }

  useEffect(() => {
    fetchData().catch((e) => {
      console.log(e)
    })
  }, [])
  return (
    <>
      <CRow>
        <CCol xs>
          <CCard className="mb-4">
            <CCardHeader>Dashboard</CCardHeader>
            <CCardBody>
              <CRow>
                <CCol xs={12}>
                  <CRow>
                    <CCol sm={4}>
                      <div className="border-start border-start-4 border-start-info py-1 px-3">
                        <div className="text-medium-emphasis small">Total Admin</div>
                        <div className="fs-5 fw-semibold">{totalAdmin || 0}</div>
                      </div>
                    </CCol>
                    <CCol sm={4}>
                      <div className="border-start border-start-4 border-start-danger py-1 px-3 mb-3">
                        <div className="text-medium-emphasis small">Total Warga</div>
                        <div className="fs-5 fw-semibold">{totalWarga || 0}</div>
                      </div>
                    </CCol>
                    <CCol sm={4}>
                      <div className="border-start border-start-4 border-start-warning py-1 px-3 mb-3">
                        <div className="text-medium-emphasis small">Saldo Kas</div>
                        <div className="fs-5 fw-semibold">{saldoKas || 0}</div>
                      </div>
                    </CCol>
                  </CRow>

                  <hr className="mt-0" />
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default Dashboard
