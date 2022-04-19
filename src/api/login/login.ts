import { request } from "../axios/request";

export async function login(data) {
  return request({
    url:'user/login',
    method: 'POST',
    data
  })
}