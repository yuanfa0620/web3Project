import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { Button, Avatar, Input, Typography, Modal, Divider, Switch, Tooltip, Spin, message } from 'antd'
import { SearchOutlined, DownOutlined, CloseOutlined, PlusOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { CHAIN_INFO, CHAIN_IDS, supportedChains } from '@/constants/chains'
import { getChainIconUrl } from '@/utils/chainIcons'
import { loadTokenConfig } from '@/config/tokenConfig'
import { createERC20Service } from '@/contracts/erc20'
import { isCustomToken } from '@/utils/customTokens'
import { addCustomToken } from '@/store/reducers/customTokensSlice'
import { useAppDispatch, useAppSelector } from '@/store'
import { isAddress } from 'viem'
import type { TokenConfig } from '@/types/swap'
import styles from './index.module.less'

const { Text } = Typography

// 创建链ID到链对象的映射
const chainMap = new Map(supportedChains.map(chain => [chain.id, chain]))

// 主网链ID列表
const MAINNET_CHAIN_IDS = [
  CHAIN_IDS.ETHEREUM,
  CHAIN_IDS.POLYGON,
  CHAIN_IDS.BSC,
  CHAIN_IDS.ARBITRUM,
  CHAIN_IDS.OPTIMISM,
  CHAIN_IDS.AVALANCHE,
  CHAIN_IDS.BASE,
]

// 测试网链ID列表
const TESTNET_CHAIN_IDS = [
  CHAIN_IDS.SEPOLIA,
  CHAIN_IDS.POLYGON_MUMBAI,
  CHAIN_IDS.BSC_TESTNET,
  CHAIN_IDS.ARBITRUM_SEPOLIA,
  CHAIN_IDS.OPTIMISM_SEPOLIA,
  CHAIN_IDS.AVALANCHE_FUJI,
  CHAIN_IDS.BASE_SEPOLIA,
] as const

// 判断是否为测试网
const isTestnetChain = (chainId: number): boolean => {
  return (TESTNET_CHAIN_IDS as readonly number[]).includes(chainId)
}

interface TokenSelectorProps {
  tokens?: TokenConfig[]
  selectedToken: TokenConfig | null
  onSelect: (token: TokenConfig, chainId?: number) => void
  disabled?: boolean
  placeholder?: string
  selectedChainId?: number | null
  onChainSelect?: (chainId: number) => void
  defaultChainId?: number | null
  onChainChange?: (chainId: number) => void
}

export const TokenSelector: React.FC<TokenSelectorProps> = ({
  tokens: externalTokens,
  selectedToken,
  onSelect,
  disabled = false,
  placeholder,
  selectedChainId,
  onChainSelect,
  defaultChainId,
  onChainChange,
}) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const rootState = useAppSelector((state) => state)
  const [searchText, setSearchText] = useState('')
  const [tokens, setTokens] = useState<TokenConfig[]>(externalTokens || [])
  const [filteredTokens, setFilteredTokens] = useState<TokenConfig[]>(tokens)
  const [isTestnet, setIsTestnet] = useState(false)
  const [currentChainId, setCurrentChainId] = useState<number | null>(
    selectedChainId || defaultChainId || null
  )
  const [modalVisible, setModalVisible] = useState(false)
  const [contractToken, setContractToken] = useState<TokenConfig | null>(null)
  const [loadingContract, setLoadingContract] = useState(false)

  // 根据主网/测试网切换显示对应的链列表
  const supportedChainIds = useMemo(() => {
    return isTestnet ? TESTNET_CHAIN_IDS : MAINNET_CHAIN_IDS
  }, [isTestnet])

  // 当defaultChainId变化时，更新currentChainId（如果没有已选择的链）
  useEffect(() => {
    if (defaultChainId && !selectedChainId) {
      // 如果当前没有选择链，或者当前链与默认链不同，则更新
      if (!currentChainId || currentChainId !== defaultChainId) {
        setCurrentChainId(defaultChainId)
        // 根据defaultChainId判断是主网还是测试网
        setIsTestnet((TESTNET_CHAIN_IDS as readonly number[]).includes(defaultChainId))
      }
    }
  }, [defaultChainId, selectedChainId, currentChainId])

  // 当打开弹窗时，如果有defaultChainId且当前没有选择链，则设置默认链
  useEffect(() => {
    if (modalVisible && defaultChainId && !currentChainId && !selectedChainId) {
      setCurrentChainId(defaultChainId)
      setIsTestnet((TESTNET_CHAIN_IDS as readonly number[]).includes(defaultChainId))
    }
  }, [modalVisible, defaultChainId, currentChainId, selectedChainId])

  // 如果外部传入了tokens，使用外部的
  useEffect(() => {
    if (externalTokens && externalTokens.length > 0) {
      setTokens(externalTokens)
      setFilteredTokens(externalTokens)
    }
  }, [externalTokens])

  // 从合约获取代币信息
  const fetchTokenFromContract = useCallback(async (address: string, chainId: number) => {
    setLoadingContract(true)
    setContractToken(null)
    
    try {
      const erc20Service = createERC20Service(address, chainId)
      
      // 获取代币基本信息（不需要userAddress，可以传空地址）
      const result = await erc20Service.getTokenInfo('0x0000000000000000000000000000000000000000')
      
      if (result.success && result.data) {
        const tokenInfo = result.data
        const newToken: TokenConfig = {
          name: tokenInfo.name,
          symbol: tokenInfo.symbol,
          address: address,
          decimals: tokenInfo.decimals,
          icon: '',
          isNative: false,
          chainId: chainId,
          isCustom: isCustomToken(rootState, chainId, address),
        }
        setContractToken(newToken)
        // 同时添加到过滤列表中显示
        setFilteredTokens([newToken])
      } else {
        message.error(result.error || '未找到代币信息')
        setFilteredTokens([])
      }
    } catch (error) {
      console.error('查询代币失败:', error)
      message.error('查询代币失败，请检查地址是否正确')
      setFilteredTokens([])
    } finally {
      setLoadingContract(false)
    }
  }, [])

  // 加载代币列表
  const loadTokens = useCallback(async () => {
    if (currentChainId) {
      try {
        const tokenList = await loadTokenConfig(currentChainId)
        setTokens(tokenList)
        // 如果没有搜索文本，直接显示所有代币
        if (!searchText) {
          setFilteredTokens(tokenList)
          setContractToken(null)
        }
      } catch (error) {
        console.error('加载token失败:', error)
        setTokens([])
        setFilteredTokens([])
      }
    } else {
      setTokens([])
      setFilteredTokens([])
    }
  }, [currentChainId, searchText])

  // 加载指定链的tokens
  useEffect(() => {
    if (currentChainId) {
      loadTokens()
    } else {
      setTokens([])
      setFilteredTokens([])
    }
  }, [currentChainId, loadTokens])

  // 监听自定义代币变化，重新加载代币列表（响应式更新）
  useEffect(() => {
    if (currentChainId && !externalTokens) {
      loadTokens()
    }
  }, [rootState.customTokens.tokens, currentChainId, loadTokens, externalTokens])

  // 搜索过滤和合约查询
  useEffect(() => {
    if (!searchText) {
      setFilteredTokens(tokens)
      setContractToken(null)
      return
    }

    const searchLower = searchText.toLowerCase().trim()
    
    // 检查是否是地址格式
    const isAddressFormat = isAddress(searchText)
    
    if (isAddressFormat && currentChainId) {
      // 先查找本地代币
      const localToken = tokens.find(
        (token) => token.address.toLowerCase() === searchLower
      )
      
      if (localToken) {
        // 本地已存在，直接过滤显示
        setFilteredTokens([localToken])
        setContractToken(null)
        return
      }
      
      // 本地不存在，查询合约
      fetchTokenFromContract(searchText, currentChainId)
      return
    }

    // 普通搜索
    const filtered = tokens.filter(
      (token) =>
        token.name.toLowerCase().includes(searchLower) ||
        token.symbol.toLowerCase().includes(searchLower) ||
        token.address.toLowerCase().includes(searchLower)
    )
    setFilteredTokens(filtered)
    setContractToken(null)
  }, [searchText, tokens, currentChainId, fetchTokenFromContract])

  // 处理链选择
  const handleChainSelect = (chainId: number) => {
    setCurrentChainId(chainId)
    setSearchText('')
    if (onChainSelect) {
      onChainSelect(chainId)
    }
    if (onChainChange) {
      onChainChange(chainId)
    }
  }

  // 处理主网/测试网切换
  const handleTestnetToggle = (checked: boolean) => {
    setIsTestnet(checked)
    setCurrentChainId(null)
    setSearchText('')
  }

  // 处理token选择
  const handleTokenSelect = (token: TokenConfig) => {
    const tokenWithChainId = { ...token, chainId: currentChainId || undefined }
    onSelect(tokenWithChainId, currentChainId || undefined)
    setModalVisible(false)
    setSearchText('')
    setContractToken(null)
  }

  // 添加自定义代币到本地
  const handleAddCustomToken = useCallback((e: React.MouseEvent, token: TokenConfig) => {
    e.stopPropagation() // 阻止触发token选择
    if (!currentChainId) return
    
    try {
      // 使用 Redux action 添加代币
      dispatch(addCustomToken({ chainId: currentChainId, token }))
      message.success(t('swap.tokenAdded'))
      
      // 重新加载代币列表
      loadTokens()
      
      // 标记为自定义代币
      setContractToken({ ...token, isCustom: true })
    } catch (error) {
      console.error('添加代币失败:', error)
      message.error('添加代币失败')
    }
  }, [currentChainId, t, loadTokens, dispatch])

  return (
    <>
      <Button
        type="default"
        className={styles.tokenSelectorButton}
        disabled={disabled}
        onClick={() => !disabled && setModalVisible(true)}
      >
        {selectedToken ? (
          <div className={styles.selectedToken}>
            <Avatar
              src={selectedToken.icon || undefined}
              size="small"
              className={styles.tokenIcon}
            >
              {selectedToken.symbol[0]?.toUpperCase() || '?'}
            </Avatar>
            <Text strong>{selectedToken.symbol}</Text>
          </div>
        ) : (
          <span>{placeholder || t('swap.selectToken')}</span>
        )}
        {!disabled && <DownOutlined className={styles.dropdownIcon} />}
      </Button>

      <Modal
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={420}
        className={styles.tokenModal}
        closeIcon={<CloseOutlined />}
      >
        <div className={styles.modalContent}>
          <div className={styles.modalHeader}>
            <Text strong className={styles.modalTitle}>
              {t('swap.selectToken')}
            </Text>
          </div>

          {/* 网络选择 */}
          {!externalTokens && (
            <>
              <div className={styles.chainSelector}>
                <div className={styles.chainSelectorHeader}>
                  <Text type="secondary" className={styles.chainSelectorTitle}>
                    {t('swap.selectNetwork')}
                  </Text>
                  <div className={styles.testnetToggle}>
                    <Text type="secondary" className={styles.testnetLabel}>
                      {t('swap.testnet')}
                    </Text>
                    <Switch
                      checked={isTestnet}
                      onChange={handleTestnetToggle}
                      size="small"
                    />
                  </div>
                </div>
                <div className={styles.chainList}>
                  {supportedChainIds.map((chainId) => {
                    // 优先使用 chainlist.org 的图标
                    const chainIcon = getChainIconUrl(chainId)
                    const chainInfo = CHAIN_INFO[chainId as keyof typeof CHAIN_INFO]
                    const wagmiChain = chainMap.get(chainId as any)
                    const chainName = wagmiChain?.name || chainInfo?.name || `Chain ${chainId}`
                    const isTestnet = isTestnetChain(chainId)
                    
                    return (
                      <Tooltip key={chainId} title={chainName} placement="top">
                        <div className={styles.chainIconWrapper}>
                          <Avatar
                            src={chainIcon || chainInfo?.logoURI}
                            size="default"
                            className={`${styles.chainIcon} ${currentChainId === chainId ? styles.chainIconActive : ''}`}
                            onClick={() => handleChainSelect(chainId)}
                          >
                            {chainName[0] || '?'}
                          </Avatar>
                          {isTestnet && (
                            <span className={styles.testnetBadge}>测试</span>
                          )}
                        </div>
                      </Tooltip>
                    )
                  })}
                </div>
              </div>
              <Divider style={{ margin: '16px 0' }} />
            </>
          )}

          {/* 代币搜索 */}
          {currentChainId && (
            <>
              <div className={styles.searchWrapper}>
                <Input
                  prefix={<SearchOutlined />}
                  placeholder={t('swap.searchToken')}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className={styles.searchInput}
                  size="large"
                />
              </div>
              {loadingContract ? (
                <div className={styles.emptyState}>
                  <Spin size="large" />
                  <Text type="secondary" style={{ marginTop: 16, display: 'block' }}>
                    {t('swap.loadingToken')}
                  </Text>
                </div>
              ) : filteredTokens.length === 0 ? (
                <div className={styles.emptyState}>
                  <Text type="secondary">
                    {!currentChainId ? t('swap.selectNetworkFirst') : t('swap.noTokenFound')}
                  </Text>
                </div>
              ) : (
                <div className={styles.tokenList}>
                  {filteredTokens.map((token) => {
                    const isCustom = token.isCustom || (currentChainId && isCustomToken(rootState, currentChainId, token.address))
                    const showAddButton = contractToken && 
                      contractToken.address.toLowerCase() === token.address.toLowerCase() && 
                      !isCustom &&
                      currentChainId
                    
                    // 检查是否为已选中的代币（比较地址和网络）
                    const isSelected = selectedToken && 
                      selectedToken.address.toLowerCase() === token.address.toLowerCase() &&
                      (selectedToken.chainId === currentChainId || 
                       selectedChainId === currentChainId ||
                       (selectedToken.chainId && token.chainId && selectedToken.chainId === token.chainId))
                    
                    return (
                      <div
                        key={`${token.address}-${token.symbol}`}
                        className={`${styles.tokenOption} ${isSelected ? styles.tokenOptionSelected : ''}`}
                        onClick={() => handleTokenSelect(token)}
                      >
                        <Avatar
                          src={token.icon || undefined}
                          size="default"
                          className={styles.tokenIcon}
                        >
                          {token.symbol[0]?.toUpperCase() || '?'}
                        </Avatar>
                        <div className={styles.tokenInfo}>
                          <div className={styles.tokenInfoHeader}>
                            <Text strong className={styles.tokenSymbol}>
                              {token.symbol}
                            </Text>
                            {showAddButton && (
                              <Button
                                type="primary"
                                size="small"
                                icon={<PlusOutlined />}
                                onClick={(e) => handleAddCustomToken(e, token)}
                                className={styles.addTokenButton}
                              >
                                {t('swap.addToken')}
                              </Button>
                            )}
                          </div>
                          <div className={styles.tokenInfoFooter}>
                            <Text type="secondary" className={styles.tokenName}>
                              {token.name}
                            </Text>
                            {isCustom && (
                              <Text type="secondary" className={styles.customTag}>
                                {t('swap.customToken')}
                              </Text>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </>
          )}

          {!currentChainId && !externalTokens && (
            <div className={styles.emptyState}>
              <Text type="secondary">{t('swap.selectNetworkFirst')}</Text>
            </div>
          )}
        </div>
      </Modal>
    </>
  )
}

