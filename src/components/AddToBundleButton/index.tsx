import { IAccount } from '@/types/IAccount';
import { IBundle } from '@/types/IBundle';
import { Button } from '@chakra-ui/button';
import { useColorModeValue } from '@chakra-ui/react';
import { useToast } from '@chakra-ui/toast';
import { useState } from 'react';
import { FiPlusCircle } from 'react-icons/fi';
import { useSession } from 'next-auth/react';

type AddToBundleBtnProps = {
  setBundlesData: (newProfilesData: IBundle[]) => void;
  bundlesData: IBundle[];
  currentBundle: number;
  account: IAccount;
};

export default function AddToBundleBtn({
  setBundlesData,
  bundlesData,
  currentBundle,
  account
}: AddToBundleBtnProps) {
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const { data: session } = useSession();

  const handleAddToBundle = () => {
    setIsLoading(true);
    const profile = bundlesData[currentBundle];
    const newProfile = {
      ...profile,
      wallets: [...profile.wallets, { address: account.address, type: 'hot' }]
    };
    const newProfilesData = [...bundlesData];
    newProfilesData[currentBundle] = newProfile;
    setBundlesData(newProfilesData);
    localStorage.setItem('abtrail.bundles', JSON.stringify(newProfilesData));
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
      display={!hasBundle || !session || addressExists ? 'none' : 'flex'}
    >
      Add to Bundle
    </Button>
  );
}
