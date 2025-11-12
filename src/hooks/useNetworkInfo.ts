import { useBlockNumber, useFeeData } from 'wagmi'
import { useMemo, useEffect, useRef } from 'react'
import { formatUnits } from 'viem'

/**
 * 获取网络信息（区块高度和 Gas 价格）
 * @param chainId 链 ID
 * @returns 区块高度、Gas 价格和加载状态
 */
export const useNetworkInfo = (chainId: number | null | undefined) => {
  const prevChainIdRef = useRef<number | null | undefined>(chainId)

  // 获取区块高度
  const { data: blockNumber, isLoading: blockNumberLoading, refetch: refetchBlockNumber } = useBlockNumber({
    chainId: chainId || undefined,
    watch: true,
  })

  // 获取 gas 价格
  const { data: feeData, isLoading: gasPriceLoading, refetch: refetchFeeData } = useFeeData({
    chainId: chainId || undefined,
  })

  // 当 chainId 改变时，强制刷新数据
  useEffect(() => {
    if (chainId && chainId !== prevChainIdRef.current) {
      prevChainIdRef.current = chainId
      // 延迟一下确保网络切换完成
      const timer = setTimeout(() => {
        refetchBlockNumber()
        refetchFeeData()
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [chainId, refetchBlockNumber, refetchFeeData])

  // 格式化区块高度
  const formattedBlockNumber = useMemo(() => {
    if (!blockNumber || !chainId) return '-'
    return blockNumber.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }, [blockNumber, chainId])

  // 格式化 gas 价格（Gwei）
  const formattedGasPrice = useMemo(() => {
    if (!feeData?.gasPrice || !chainId) return '-'
    const gasPriceInGwei = formatUnits(feeData.gasPrice, 9) // 转换为 Gwei
    const num = parseFloat(gasPriceInGwei)
    return num.toFixed(2) + ' Gwei'
  }, [feeData, chainId])

  return {
    blockNumber: formattedBlockNumber,
    gasPrice: formattedGasPrice,
    blockNumberLoading,
    gasPriceLoading,
    isLoading: blockNumberLoading || gasPriceLoading,
  }
}

