import { ConnectButton } from '@rainbow-me/rainbowkit';
import {
  Button,
  Flex,
  IconButton,
  Image,
  useBreakpointValue
} from '@chakra-ui/react';
// import { FiLogIn } from 'react-icons/fi';
import { BiWallet } from 'react-icons/bi';
export const CustomConnectButton = ({ text }: { text?: string }) => {
  const defaultButtonText = useBreakpointValue(
    {
      base: 'Connect',
      md: 'Connect Wallet'
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
                      colorScheme="primary"
                      onClick={openConnectModal}
                      rounded="xl"
                      display={{ base: 'none', md: 'flex' }}
                    >
                      {buttonText}
                    </Button>
                    <IconButton
                      size="md"
                      colorScheme="primary"
                      onClick={openConnectModal}
                      rounded="xl"
                      aria-label="Connect Wallet"
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
                  {/* <Button
                    size="sm"
                    rounded="xl"
                    onClick={openChainModal}
                    display={{ base: 'none', lg: 'flex' }}
                    variant="outline"
                  >
                    {chain.hasIcon && (
                      <Flex
                        bg={chain.iconBackground}
                        w={4}
                        h={4}
                        rounded="full"
                      >
                        {chain.iconUrl && (
                          <Image
                            alt={chain.name ?? 'Chain icon'}
                            src={chain.iconUrl}
                            width={4}
                            height={4}
                          />
                        )}
                      </Flex>
                    )}
                  </Button> */}
                  <Button
                    size="sm"
                    rounded="xl"
                    onClick={openAccountModal}
                    variant="outline"
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
