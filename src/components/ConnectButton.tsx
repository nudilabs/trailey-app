import { ConnectButton } from '@rainbow-me/rainbowkit';
import {
  Box,
  Button,
  Flex,
  IconButton,
  Image,
  useBreakpointValue,
  useColorModeValue
} from '@chakra-ui/react';
// import { FiLogIn } from 'react-icons/fi';
import { BiWallet } from 'react-icons/bi';
import { Avatar } from './Avatar';
export const CustomConnectButton = ({ text }: { text?: string }) => {
  const buttonColorScheme = useColorModeValue('primary', 'secondary');
  const defaultButtonText = useBreakpointValue(
    {
      base: 'Connect',
      md: 'Connect'
    },
    {
      // Breakpoint to use when mediaqueries cannot be used, such as in server-side rendering
      // (Defaults to 'base')
      fallback: 'md'
    }
  );
  const buttonText = text || defaultButtonText;
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted
      }) => {
        // Note: If your app doesn't use authentication, you
        // can remove all 'authenticationStatus' checks
        const ready = mounted && authenticationStatus !== 'loading';
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === 'authenticated');
        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              style: {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none'
              }
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <>
                    <Button
                      size="sm"
                      colorScheme={'primary-gradient'}
                      onClick={openConnectModal}
                      rounded="xl"
                      display={{ base: 'none', md: 'flex' }}
                    >
                      {buttonText}
                    </Button>
                    <IconButton
                      size="md"
                      colorScheme={buttonColorScheme}
                      onClick={openConnectModal}
                      rounded="xl"
                      aria-label="Connect"
                      display={{ base: 'flex', md: 'none' }}
                    >
                      <BiWallet />
                    </IconButton>
                  </>
                );
              }
              if (chain.unsupported) {
                return (
                  <Button size="sm" onClick={openChainModal} colorScheme="red">
                    Wrong network
                  </Button>
                );
              }
              return (
                <Flex gap={3}>
                  <Button
                    size="sm"
                    rounded="xl"
                    onClick={openAccountModal}
                    variant="connected"
                  >
                    {account.displayName}
                  </Button>
                </Flex>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};
