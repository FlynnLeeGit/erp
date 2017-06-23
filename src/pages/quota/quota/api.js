import axios from '@/plugins/axios'
import * as artApi from '../artficial/api'
import * as matApi from '../auxmaterial/api'

// quotaTemplate
export const get = () => axios.get('/_api/quota/quota')
export const add = data => axios.post('/_api/quota/quotas', data)
export const edit = data => axios.put(`/_api/quota/quotas/${data.id}`, data)
export const del = id => axios.delete(`/_api/quota/quotas/${id}`)

// artficialcounter
export const addArt = data => axios.post('/_api/quota/artficialcounters', data)
export const editArt = data =>
  axios.put(`/_api/quota/artficialcounters/${data.id}`, data)
export const delArt = id => axios.delete(`/_api/quota/artficialcounters/${id}`)
// auxmaterialcounter
export const addMat = data =>
  axios.post('/_api/quota/auxmaterialcounters', data)
export const editMat = data =>
  axios.put(`/_api/quota/auxmaterialcounters/${data.id}`, data)
export const delMat = id =>
  axios.delete(`/_api/quota/auxmaterialcounters/${id}`)

export const getMap = () => axios.get('/_api/quota/quota/map')

export const getArtList = artApi.get
export const getMatList = matApi.get

