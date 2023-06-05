import { IAccount } from '@/types/IAccount';
import { IBundle } from '@/types/IBundle';
import ENV from '@/utils/Env';
import { customPublicClient } from '@/utils/client';
import { formatPrettyNumber } from '@/utils/format';
import { Button } from '@chakra-ui/button';
import { useColorModeValue } from '@chakra-ui/react';
import { useToast } from '@chakra-ui/toast';
import { useState } from 'react';
import { FiPlusCircle } from 'react-icons/fi';

type AddToBundleBtnProps = {
  setBundlesData: (newProfilesData: IBundle[]) => void;
  bundlesData: IBundle[];
  currentBundle: number;
  account: IAccount;
  localChain: string;
};

export default function AddToBundleBtn({
  setBundlesData,
  bundlesData,
  currentBundle,
  account,
  localChain
}: AddToBundleBtnProps) {
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleAddToBundle = async () => {
    const nonce = await customPublicClient(localChain).getTransactionCount({
      address: account.address
    });
    if (nonce > Number(ENV.NEXT_PUBLIC_TX_LIMIT)) {
      toast({
        title: 'Error',
        description: `We do not support addresses with more than ${formatPrettyNumber(
          ENV.NEXT_PUBLIC_TX_LIMIT,
          0
        )} transactions during beta`,
        status: 'error',
        duration: 5000,
        isClosable: true
      });
      return;
    }
    setIsLoading(true);
    const profile = bundlesData[currentBundle];
    const newProfile = {
      ...profile,
      wallets: [...profile.wallets, { address: account.address, type: 'hot' }]
    };
    const newProfilesData = [...bundlesData];
    newProfilesData[currentBundle] = newProfile;
    setBundlesData(newProfilesData);
    localStorage.setItem('trailey.bundles', JSON.stringify(newProfilesData));
    toast({
      title: 'Wallet added to bundle',
      status: 'success',
      duration: 3000,
      isClosable: true,
      position: 'top-right'
    });
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  // Check if the address already exists in the profile's wallets
  const addressExists = bundlesData[currentBundle]?.wallets.some(
    wallet => wallet.address === account.address
  );
  const hasBundle = bundlesData.length > 0 && bundlesData[currentBundle];

  return (
    <Button
      w="100%"
      colorScheme={useColorModeValue('primary', 'secondary')}
      leftIcon={<FiPlusCircle />}
      rounded="3xl"
      onClick={handleAddToBundle}
      isLoading={isLoading}
      isDisabled={addressExists} // Disable the button if the address exists
      display={!hasBundle || addressExists ? 'none' : 'flex'}
    >
      Add to Bundle
    </Button>
  );
}
