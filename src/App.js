import React, { Component, Suspense } from 'react'
import { connect } from 'react-redux'
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import './scss/style.scss'
import PropTypes from 'prop-types'

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))
const Login = React.lazy(() => import('./views/login/Login'))

class App extends Component {
  render() {
    const { props } = this
    return (
      <HashRouter>
        <Suspense fallback={loading}>
          <Routes>
            <Route exact path="login" name="Login Page" element={<Login />} />
            {!props.token && <Route path="*" exact element={<Navigate to={'login'} replace />} />}
            {props.token && <Route path="*" name="Home" element={<DefaultLayout />} />}
          </Routes>
        </Suspense>
      </HashRouter>
    )
  }
}

const mapStateToProps = (state) => ({
  token: state.token,
})

export default connect(mapStateToProps)(App)

App.propTypes = {
  token: PropTypes.string,
}
