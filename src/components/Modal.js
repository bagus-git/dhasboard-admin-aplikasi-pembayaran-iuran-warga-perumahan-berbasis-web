import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react'
import React from 'react'
import PropTypes from 'prop-types'

export const Modal = ({ title, children, visible, isEdit, onClose, onSubmit }) => {
  return (
    <CModal backdrop keyboard={false} portal={false} visible={visible}>
      <CModalHeader>
        <CModalTitle>{title}</CModalTitle>
      </CModalHeader>
      <CModalBody className="p-4">{children}</CModalBody>
      <CModalFooter>
        <CButton onClick={onClose} color="secondary">
          Close
        </CButton>
        <CButton
          onClick={() => {
            onSubmit(isEdit ? 'edit' : 'new')
          }}
          color="primary"
        >
          {isEdit ? 'Update' : 'Create'}
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

Modal.propTypes = {
  title: PropTypes.string,
  children: PropTypes.element,
  visible: PropTypes.bool,
  isEdit: PropTypes.bool,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
}
