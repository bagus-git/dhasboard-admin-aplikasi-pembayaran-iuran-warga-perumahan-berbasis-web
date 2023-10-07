import { initializeApp } from 'firebase/app'
import { child, get, getDatabase, ref, remove, set } from 'firebase/database'

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
const firebaseConfig = {
  // ...
  // The value of `databaseURL` depends on the location of the database
  databaseURL: 'https://iuran-gmj-default-rtdb.firebaseio.com/',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Realtime Database and get a reference to the service

export const writeData = async (table, uniqueId, data) => {
  let path = `${table}`
  if (uniqueId) {
    path = `${table}/${uniqueId}`
  }
  const db = getDatabase(app)
  await set(ref(db, `${path}`), data)
}

export const readData = async (table, uniqueId) => {
  const dbRef = ref(getDatabase(app))
  try {
    let path = `${table}`
    if (uniqueId) {
      path = `${table}/${uniqueId}`
    }
    const snapshot = await get(child(dbRef, path))
    if (snapshot.exists()) {
      return snapshot.val()
    } else {
      return null
    }
  } catch (e) {
    return null
  }
}

export const deleteData = async (table, uniqueId) => {
  const dbRef = ref(getDatabase(app))
  try {
    let path = `${table}`
    if (uniqueId) {
      path = `${table}/${uniqueId}`
    }
    await remove(child(dbRef, path))
    return true
  } catch (e) {
    return false
  }
}
