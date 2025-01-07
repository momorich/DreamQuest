// 梦境图片生成服务的类型定义

// 图片生成风格
export type DreamImageStyle = 'realistic_image' | 'digital_illustration'

// 图片生成参数
export interface GenerateImageParams {
  prompt: string
  style: DreamImageStyle
  width: number
  height: number
  use_sr?: boolean
  return_url?: boolean
}

// 火山引擎API响应
export interface VolcengineResponse {
  code: number
  message: string
  data: {
    image_urls?: string[]
    binary_data_base64?: string[]
  }
} 