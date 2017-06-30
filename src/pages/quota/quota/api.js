import axios from '@/plugins/axios'
// import * as artApi from '../artficial/api'
// import * as matApi from '../auxmaterial/api'
// import * as commonApi from '../api'

// quotaTemplate
export const get = () => axios.get('/_api/quota/quota')
export const add = data => axios.post('/_api/quota/quotas', data)
export const edit = data => axios.put(`/_api/quota/quotas/${data.id}`, data)
export const del = id => axios.delete(`/_api/quota/quotas/${id}`)

// artficialcounter
export const addArt = (qid, data) =>
  axios.post(`/_api/quota/quotas/${qid}/artficials`, data)
export const editArt = (qid, data) =>
  axios.put(`/_api/quota/quotas/${qid}/artficial`, data)
export const delArt = (qid, aid) =>
  axios.delete(`/_api/quota/quotas/${qid}/artficials/${aid}`)
// auxmaterialcounter
export const addMat = (qid, data) =>
  axios.post(`/_api/quota/quotas/${qid}/auxiliaries`, data)
export const editMat = (qid, data) =>
  axios.put(`/_api/quota/quotas/${qid}/auxiliary`, data)
export const delMat = (qid, auxid) =>
  axios.delete(`/_api/quota/quotas/${qid}/auxiliaries/${auxid}`)

export const release = data => axios.post(`/_api/quota/releases`, data)
export { getMap } from '../api'
export { get as getArtList } from '../artficial/api'
export { get as getMatList } from '../auxmaterial/api'
