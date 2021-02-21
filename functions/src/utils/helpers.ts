const isEmpty = (string: string) => {
  if (string.trim() === '') return true
  else return false
}

const isEmail = (email: string) => {
  const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  if (email.match(emailRegEx)) return true
  else return false
}

export { isEmpty, isEmail }
