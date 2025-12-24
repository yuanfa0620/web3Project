import { useState, useCallback } from 'react'
import { useAccount } from 'wagmi'
import { useTranslation } from 'react-i18next'
import { createNFTMarketplaceService } from '../index'
import { getNFTMarketplaceAddress } from '@/config/constants'
import { getMessage } from '@/utils/message'
import { getErrorMessage } from '@/utils/error'

interface UseIsWhitelistedParams {
  onSuccess?: (isWhitelisted: boolean) => void
  onError?: (error: string) => void
}

export const useIsWhitelisted = ({ onSuccess, onError }: UseIsWhitelistedParams = {}) => {
  const { t } = useTranslation()
  const { chainId } = useAccount()
  const [loading, setLoading] = useState(false)
  const [isWhitelisted, setIsWhitelisted] = useState<boolean | null>(null)

  const checkWhitelisted = useCallback(
    async (nftContract: string) => {
      if (!chainId) {
        const errorMsg = t('profile.connectWalletFirst')
        onError?.(errorMsg)
        return
      }

      const marketplaceAddress = getNFTMarketplaceAddress(chainId)
      if (!marketplaceAddress) {
        const errorMsg = t('profile.nftMarketplace.marketplaceNotConfigured')
        onError?.(errorMsg)
        return
      }

      setLoading(true)

      try {
        const marketplaceService = createNFTMarketplaceService(marketplaceAddress, chainId)
        const result = await marketplaceService.isWhitelisted(nftContract)

        if (result.success && result.data !== undefined) {
          setIsWhitelisted(result.data)
          onSuccess?.(result.data)
        } else {
          const errorMsg = result.error || t('profile.nftMarketplace.checkWhitelistFailed')
          onError?.(errorMsg)
        }
      } catch (error) {
        const errorMsg = getErrorMessage(error) || t('profile.nftMarketplace.checkWhitelistFailed')
        onError?.(errorMsg)
      } finally {
        setLoading(false)
      }
    },
    [chainId, onSuccess, onError, t]
  )

  return {
    checkWhitelisted,
    loading,
    isWhitelisted,
  }
}

