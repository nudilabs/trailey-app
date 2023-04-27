import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Button, Flex, Image } from '@chakra-ui/react';
export const CustomConnectButton = () => {
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
                  <Button
                    colorScheme="secondary"
                    // variant="outline"
                    onClick={openConnectModal}
                    rounded="xl"
                  >
                    Connect Wallet
                  </Button>
                );
              }
              if (chain.unsupported) {
                return (
                  <Button onClick={openChainModal} colorScheme="red">
                    Wrong network
                  </Button>
                );
              }
              return (
                <Flex gap={3}>
                  <Button
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
                  </Button>
                  <Button onClick={openAccountModal} variant="outline">
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
