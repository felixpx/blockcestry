'use client'
import { Web3AuthModalPack,Web3AuthConfig } from '@safe-global/auth-kit'
import { MetaTransactionData, MetaTransactionOptions } from '@safe-global/safe-core-sdk-types'
import { ethers, utils } from 'ethers'
import { createContext, useCallback, useContext, useEffect, useState } from 'react'

import { CHAIN_NAMESPACES, WALLET_ADAPTERS } from '@web3auth/base'
import { Web3AuthOptions } from '@web3auth/modal'
import { OpenloginAdapter } from '@web3auth/openlogin-adapter'
import Chain from '../src/models/chains'
import chains from '../src/chains/chains'

type accountAbstractionContextValue = {
    ownerAddress?: string
    chainId: number
    safes: string[]
    chain?: Chain
    isAuthenticated: boolean
    editingEnabled:boolean
    web3Provider?: ethers.providers.Web3Provider
    setEditingEnabled:(isEditingEnabled:boolean) =>void
    loginWeb3Auth: () => void
    logoutWeb3Auth: () => void
    setChainId: (chainId: number) => void
    safeSelected?: string
    safeBalance?: string
    setSafeSelected: React.Dispatch<React.SetStateAction<string>>
    isRelayerLoading: boolean
    relayTransaction: () => Promise<void>
    gelatoTaskId?: string
    openStripeWidget: () => Promise<void>
    closeStripeWidget: () => Promise<void>
  }

  const initialState = {
    isAuthenticated: false,
    editingEnabled:false,
    setEditingEnabled:()=>{},

    loginWeb3Auth: () => {},
    logoutWeb3Auth: () => {},
    relayTransaction: async () => {},
    setChainId: () => {},
    setSafeSelected: () => {},
    onRampWithStripe: async () => {},
    safes: [],
    chainId: 3,
    isRelayerLoading: true,
    openStripeWidget: async () => {},
    closeStripeWidget: async () => {}
  }
  const accountAbstractionContext = createContext<accountAbstractionContextValue>(initialState)

  const useAccountAbstraction = () => {
    const context = useContext(accountAbstractionContext)
  
    if (!context) {
      throw new Error('useAccountAbstraction should be used within a AccountAbstraction Provider')
    }
  
    return context
  }

  const AccountAbstractionProvider = ({ children }: { children: JSX.Element }) => {
    // owner address from the email  (provided by web3Auth)
    const [ownerAddress, setOwnerAddress] = useState<string>('')
  
    // safes owned by the user
    const [safes, setSafes] = useState<string[]>([])
  
    // chain selected
    const [chainId, setChainId] = useState<number>(0)
    //
    const [isEditingEnabled,setEditingEnabled] = useState(false)
    // web3 provider to perform signatures
    const [web3Provider, setWeb3Provider] = useState<ethers.providers.Web3Provider>()
    
    const isAuthenticated = !!ownerAddress ///&& !!chainId
    const chain = chains[chainId]
  
    // reset React state when you switch the chain
    useEffect(() => {
       
      setOwnerAddress('')
      setSafes([])
      console.log(chain)
      console.log(chainId)
     
      setWeb3Provider(undefined)
      setSafeSelected('')
    }, [chain])
  
    // authClient
    const [web3AuthModalPack, setWeb3AuthModalPack] = useState<Web3AuthModalPack>()
  
  
    // auth-kit implementation
    const loginWeb3Auth = useCallback(async () => {
        console.log(chain)
        console.log("login")
        console.log(process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID )
     /* if(!chain) 
        return 
        console.log("We got a chain")*/
      try {
        const options: Web3AuthOptions = {
            clientId: process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID , // https://dashboard.web3auth.io/
            web3AuthNetwork: 'testnet',
            chainConfig: {
              chainNamespace: CHAIN_NAMESPACES.EIP155,
              chainId: chains[chainId].id,
              // https://chainlist.org/
              rpcTarget:chains[chainId].rpcUrl
            },
            uiConfig: {
              theme: 'dark',
              loginMethodsOrder: ['google', 'facebook']
            }
          }
          
  
    // https://web3auth.io/docs/sdk/pnp/web/modal/initialize#configuring-adapters
const modalConfig = {
    [WALLET_ADAPTERS.TORUS_EVM]: {
      label: 'torus',
      showOnModal: false
    },
    [WALLET_ADAPTERS.METAMASK]: {
      label: 'metamask',
      showOnDesktop: true,
      showOnMobile: false
    }
  }
  
  // https://web3auth.io/docs/sdk/pnp/web/modal/whitelabel#whitelabeling-while-modal-initialization
  const openloginAdapter = new OpenloginAdapter({
    loginSettings: {
      mfaLevel: 'mandatory'
    },
    adapterSettings: {
      uxMode: 'popup',
      whiteLabel: {
        name: 'Safe'
      }
    }
  })
  
  const web3AuthConfig: Web3AuthConfig = {
    txServiceUrl: chains[chainId].transactionServiceUrl
  }
  const web3AuthModalPack = new Web3AuthModalPack(web3AuthConfig)
        await web3AuthModalPack.init({
          options,
          adapters: [openloginAdapter],
          modalConfig
        })
  
        if (web3AuthModalPack && chain?.id)  {
          const { safes, eoa } = await web3AuthModalPack.signIn()
          const provider = web3AuthModalPack.getProvider() as ethers.providers.ExternalProvider
  
          // we set react state with the provided values: owner (eoa address), chain, safes owned & web3 provider
          console.log(chain)
          //setChainId(chains[1].id)
          setOwnerAddress(eoa)
          setSafes(safes || [])
          setWeb3Provider(new ethers.providers.Web3Provider(provider))
          setWeb3AuthModalPack(web3AuthModalPack)
        }
      } catch (error) {
        console.log('error: ', error)
      }
    }, [chain])
  
    const logoutWeb3Auth = () => {
      web3AuthModalPack?.signOut()
      setEditingEnabled(false)
      setOwnerAddress('')
      setSafes([])
      setChainId(1)
      setWeb3Provider(undefined)
      setSafeSelected('')
      setGelatoTaskId(undefined)
    }
  
    // TODO: add disconnect owner wallet logic ?
  
    // current safe selected by the user
    const [safeSelected, setSafeSelected] = useState<string>('')
  
   
    const [isRelayerLoading, setIsRelayerLoading] = useState<boolean>(false)
    const [gelatoTaskId, setGelatoTaskId] = useState<string>()
  
    // refresh the Gelato task id
    useEffect(() => {
      setIsRelayerLoading(false)
      setGelatoTaskId(undefined)
    }, [chainId])
  
  
   
    const state = {
      ownerAddress,
      chainId,
      chain,
      safes,
  
      isAuthenticated,
  
      web3Provider,
  
      loginWeb3Auth,
      logoutWeb3Auth,
      setEditingEnabled,
      isEditingEnabled,
      setChainId,
  
      
    }
  
    return (
      <accountAbstractionContext.Provider value={state}>
        {children}
      </accountAbstractionContext.Provider>
    )
  }
  export { useAccountAbstraction, AccountAbstractionProvider }