export interface Estimate {
  id: number
  width: number
  length: number
  height: number
  material: string
  features: string[]
  total_cost: number
  created_at: string
  updated_at: string
}

export interface CreateEstimateRequest {
  name: string
  email: string
  width: number
  length: number
  height: number
  material: string
  features: string[]
  message?: string
} 