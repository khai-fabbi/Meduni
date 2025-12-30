/**
 * Referral Types
 */

export interface CommissionRates {
  level_1: number // Hoa hồng trực tiếp (Direct commission)
  level_2: number // Hoa hồng gián tiếp level 2
  level_3?: number // Hoa hồng gián tiếp level 3 (optional)
}

export interface ReferralInfo {
  referral_code: string
  referral_link: string
  total_direct_referrals: number
  total_indirect_referrals: number
  total_direct_earnings: number
  total_indirect_earnings: number
  total_earnings: number
  commission_rates: CommissionRates
}

export interface ReferralInfoResponse {
  request_id: string
  data: ReferralInfo
}

