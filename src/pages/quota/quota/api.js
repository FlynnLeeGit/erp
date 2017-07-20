import axios from '@/plugins/axios'

/**
 * 定额api
 */
// 获取定额列表
export const get = () => axios.get('/_api/quota/quota')
//  添加定额
export const add = data => axios.post('/_api/quota/quotas', data)
export const create = data => axios.post('/_api/quota/quotas', data)
// 更新定额
export const edit = data => axios.put(`/_api/quota/quotas/${data.id}`, data)
export const update = data => axios.put(`/_api/quota/quotas/${data.id}`, data)
// 删除一项定额
export const del = id => axios.delete(`/_api/quota/quotas/${id}`)

/**
 * 定额人工计量api
 */
// 添加人工计量
export const addArt = (qid, data) =>
  axios.post(`/_api/quota/quotas/${qid}/artficials`, data)
export const createArtficialCount = ({ qid, data }) =>
  axios.post(`/_api/quota/quotas/${qid}/artficials`, data)
// 修改人工计量
export const editArt = (qid, data) =>
  axios.put(`/_api/quota/quotas/${qid}/artficial`, data)
export const updateArtficialCount = ({ qid, data }) =>
  axios.put(`/_api/quota/quotas/${qid}/artficial`, data)
//  删除人工计量
export const delArt = (qid, aid) =>
  axios.delete(`/_api/quota/quotas/${qid}/artficials/${aid}`)
export const delArtficialCount = ({ qid, artId }) =>
  axios.delete(`/_api/quota/quotas/${qid}/artficials/${artId}`)

/**
* 定额辅材计量api
*/
// 添加辅材计量
export const addMat = (qid, data) =>
  axios.post(`/_api/quota/quotas/${qid}/auxiliaries`, data)
export const createAuxmaterialCount = ({ qid, data }) =>
  axios.post(`/_api/quota/quotas/${qid}/auxiliaries`, data)
// 修改辅材计量
export const editMat = (qid, data) =>
  axios.put(`/_api/quota/quotas/${qid}/auxiliary`, data)
export const updateAuxmaterialCount = ({ qid, data }) =>
  axios.put(`/_api/quota/quotas/${qid}/auxiliary`, data)
// 删除辅材计量
export const delMat = (qid, auxid) =>
  axios.delete(`/_api/quota/quotas/${qid}/auxiliaries/${auxid}`)
export const delAuxmaterialCount = ({ qid, auxId }) =>
  axios.delete(`/_api/quota/quotas/${qid}/auxiliaries/${auxId}`)

export const getBrandsByMat = mid =>
  axios.get(`/_api/quota/auxiliarymaterials/${mid}/brands`)

/**
 * 发布定额模版
 */
export const release = data => axios.post(`/_api/quota/releases`, data)
export const releaseQuota = data => axios.post(`/_api/quota/releases`, data)

export { getMap } from '../api'
export { get as getArtList } from '../artficial/api'
export { get as getMatList } from '../auxmaterial/api'
export { get as getMaterials } from '../../purchase/material/api'
