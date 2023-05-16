import { IAccount } from '@/types/Account';
import { IProfile } from '@/types/IProfile';
import { Button } from '@chakra-ui/button';
import { useToast } from '@chakra-ui/toast';
import { useState } from 'react';
import { FiPlusCircle } from 'react-icons/fi';

type AddToBundleBtnProps = {
  setProfilesData: (newProfilesData: IProfile[]) => void;
  profilesData: IProfile[];
  currentProfile: number;
  account: IAccount;
};

export default function AddToBundleBtn({
  setProfilesData,
  profilesData,
  currentProfile,
  account
}: AddToBundleBtnProps) {
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleAddToBundle = () => {
    setIsLoading(true);
    const profile = profilesData[currentProfile];
    const newProfile = {
      ...profile,
      wallets: [...profile.wallets, { address: account.address, type: 'hot' }]
    };
    const newProfilesData = [...profilesData];
    newProfilesData[currentProfile] = newProfile;
    setProfilesData(newProfilesData);
    localStorage.setItem('biway.profiles', JSON.stringify(newProfilesData));
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
  const addressExists = profilesData[currentProfile]?.wallets.some(
    wallet => wallet.address === account.address
  );

  return (
    <Button
      variant="solid"
      colorScheme="primary"
      leftIcon={<FiPlusCircle />}
      rounded="3xl"
      onClick={handleAddToBundle}
      isLoading={isLoading}
      isDisabled={addressExists} // Disable the button if the address exists
    >
      Add to Bundle
    </Button>
  );
}
