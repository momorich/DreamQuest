import { HUNYUAN_CONFIG } from '../config/config';

// 腾讯云配置
const config = HUNYUAN_CONFIG;

interface ApiError extends Error {
  errMsg?: string;
  stack?: string;
}

interface SignParams {
  [key: string]: string | number;
  Action: string;
  Region: string;
  Timestamp: number;
  Nonce: number;
  SecretId: string;
  Version: string;
  Language: string;
  Prompt: string;
  RspImgType: string;
}

interface Headers {
  [key: string]: string;
  'Content-Type': string;
  'Host': string;
  'X-TC-Action': string;
  'X-TC-Version': string;
  'X-TC-Timestamp': string;
  'X-TC-Region': string;
  'X-TC-Language': string;
}

// 扩展微信类型定义
declare namespace WechatMiniprogram {
  interface Wx {
    arrayBufferToHex(buffer: ArrayBuffer): string;
    stringToArrayBuffer(str: string): ArrayBuffer;
    sha256(data: string): ArrayBuffer;
    hmac(algorithm: string, key: ArrayBuffer, data: string): ArrayBuffer;
  }
}

// 生成图片
export async function generateDreamImage(text: string): Promise<string> {
  try {
    wx.showToast({ title: '开始生成图片', icon: 'loading', duration: 2000 })
    console.warn('\n=== 开始生成图片 ===')
    console.warn('输入文本:', text)
    
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${config.baseUrl}/api/dreams/generateImage`,  // 使用配置中的baseUrl
        method: 'POST',
        header: {
          'Content-Type': 'application/json'
        },
        data: {
          prompt: `梦境场景：${text}`
        },
        success(res: any) {
          console.warn('API响应:', res)
          
          if (res.statusCode !== 200) {
            reject(new Error(`API请求失败: ${res.statusCode}`))
            return
          }

          const result = res.data
          if (result.error) {
            reject(new Error(result.error))
            return
          }

          if (!result.Response?.ResultImage) {
            reject(new Error('未获取到图片URL'))
            return
          }

          resolve(result.Response.ResultImage)
        },
        fail(error) {
          console.error('请求失败:', error)
          reject(error)
        }
      })
    })
  } catch (error) {
    console.error('生成图片失败:', error)
    throw error
  }
}

// 获取授权签名
async function getAuthorization(params: any, timestamp: number, date: string): Promise<string> {
  const service = 'hunyuan'
  const algorithm = 'TC3-HMAC-SHA256'
  const credentialScope = `${date}/${service}/tc3_request`
  
  // 1. 构建规范请求串
  const httpRequestMethod = 'POST'
  const canonicalUri = '/'
  const canonicalQueryString = ''
  const payload = JSON.stringify(params)
  
  // 注意：headers必须按字典序排列
  const headers: Record<string, string> = {
    'content-type': 'application/json',
    'host': config.endpoint
  }
  const canonicalHeaders = Object.keys(headers)
    .sort()
    .map(key => `${key.toLowerCase()}:${headers[key]}\n`)
    .join('')
  const signedHeaders = Object.keys(headers)
    .sort()
    .map(key => key.toLowerCase())
    .join(';')
  
  const canonicalRequest = [
    httpRequestMethod,
    canonicalUri,
    canonicalQueryString,
    canonicalHeaders,
    signedHeaders,
    payload
  ].join('\n')
  console.log('规范请求串:', canonicalRequest)

  // 2. 构建待签名字符串
  const stringToSign = [
    algorithm,
    timestamp,
    credentialScope,
    canonicalRequest
  ].join('\n')
  console.log('待签名字符串:', stringToSign)

  // 3. 构建授权信息
  return `${algorithm} Credential=${config.secretId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=test_signature`
} 