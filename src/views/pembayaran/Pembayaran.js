import React, { useCallback, useEffect, useState } from 'react'
import DatePicker from 'react-datepicker'

import {
  CBadge,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormSelect,
  CPagination,
  CPaginationItem,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'

import { readData } from 'src/firebase/FirebaseDB'

const limitPage = 10

const Pembayaran = () => {
  const [page, setPage] = useState(1)
  const [pembayaran, setPembayaran] = useState([])
  const [startDate, setStartDate] = useState()
  const [endDate, setEndDate] = useState()
  const [phoneNumber, setPhoneNumber] = useState('')
  const [peopleOptions, setPeopleOptions] = useState([])

  const fetchData = useCallback(async () => {
    const results = await readData('pembayaran')
    if (results) {
      let pembayaranData = await Promise.all(
        Object.keys(results).map(async (transcationId) => {
          const warga = await readData('warga', results[transcationId].warga)
          return {
            transcationId,
            ...results[transcationId],
            name: warga.name,
          }
        }),
      )
      if (phoneNumber) {
        pembayaranData = pembayaranData.filter((item) => item.warga === phoneNumber)
      }
      if (startDate && endDate) {
        pembayaranData = pembayaranData.filter((item) => {
          console.log(new Date(item.transactionTime).getTime(), endDate.getTime())
          return (
            new Date(item.transactionTime).getTime() >= startDate.getTime() &&
            new Date(item.transactionTime).getTime() <= endDate.setHours(23, 59, 59, 59)
          )
        })
      }
      setPembayaran(pembayaranData)
    }
  }, [phoneNumber, startDate, endDate])

  const fetchPeople = async () => {
    const resPeople = await readData('warga')
    const newResPeople = Object.keys(resPeople).map((key) => ({
      value: key,
      label: resPeople[key].name,
    }))
    setPeopleOptions([{ value: 'all', label: 'Semua Warga' }, ...newResPeople])
  }

  useEffect(() => {
    fetchPeople().catch((e) => {
      console.log(e)
    })
    fetchData().catch((e) => {
      console.log(e)
    })
  }, [startDate, endDate, phoneNumber])

  const paginationClick = (newPage) => {
    setPage(newPage)
  }

  const goToPrevious = () => {
    setPage(page - 1)
  }

  const goToNext = () => {
    setPage(page + 1)
  }

  const pagination = useCallback(() => {
    const newPembayaran = [...pembayaran]
    const startIndex = (page - 1) * limitPage
    const endIndex = startIndex + limitPage
    const result = newPembayaran.slice(startIndex, endIndex)
    return result
  }, [pembayaran, page])

  const totalPagination =
    pembayaran.length < limitPage ? 0 : Math.ceil(pembayaran.length / limitPage)

  return (
    <CRow>
      <CCol xs>
        {/* filter tanggal */}
        <CCard className="mb-4">
          <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />
          <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} />
          <CFormSelect
            options={peopleOptions}
            value={phoneNumber}
            onChange={(e) => {
              setPhoneNumber(e.target.value === 'all' ? '' : e.target.value)
            }}
            size="sm"
            className="mb-3"
            aria-label="Small select example"
          />
          <CCardHeader>LAPORAN TRANSAKSI</CCardHeader>

          <CCardBody>
            <CRow>
              <CCol xs={12}>
                {pembayaran?.length > 0 && (
                  <CTable bordered responsive>
                    <CTableHead>
                      <CTableRow>
                        <CTableHeaderCell scope="col">No</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Nama</CTableHeaderCell>
                        <CTableHeaderCell scope="col">No Telp</CTableHeaderCell>
                        <CTableHeaderCell scope="col">TranscationId</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Bank</CTableHeaderCell>
                        <CTableHeaderCell scope="col">orderId</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Periode</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Status</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Jumlah Dibayarkan</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Waktu Pembayaran</CTableHeaderCell>
                        <CTableHeaderCell scope="col">vaNumber</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {pagination().map((item, indx) => (
                        <CTableRow key={indx}>
                          <CTableDataCell>{indx + 1}</CTableDataCell>
                          <CTableDataCell>{item.name}</CTableDataCell>
                          <CTableDataCell>{item.warga}</CTableDataCell>
                          <CTableDataCell>{item.transcationId}</CTableDataCell>
                          <CTableDataCell>{item.bank.toUpperCase()}</CTableDataCell>
                          <CTableDataCell>{item.orderId}</CTableDataCell>
                          <CTableDataCell>{item.periode}</CTableDataCell>
                          <CTableDataCell>
                            {item.status === 'settlement' && (
                              <CBadge color="success">Berhasil Dibayar</CBadge>
                            )}
                            {item.status === 'pending' && <CBadge color="warning">Tertunda</CBadge>}
                            {item.status === 'expired' && (
                              <CBadge color="danger">Kadaluarsa</CBadge>
                            )}
                          </CTableDataCell>
                          <CTableDataCell>Rp.{item.transactionAmount}</CTableDataCell>
                          <CTableDataCell>{item.transactionTime}</CTableDataCell>
                          <CTableDataCell>{item.vaNumber}</CTableDataCell>
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

export default Pembayaran
