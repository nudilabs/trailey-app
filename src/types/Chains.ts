export type Chain = {
  name: string;
  chain_id: string;
  is_testnet: boolean;
  label: string;
  category_label: string;
  logo_url: string;
  black_logo_url: string;
  white_logo_url: string;
  is_appchain: boolean;
  appchain_of: string | null;
  protocols: Protocol[];
};

type Protocol = {
  address: string;
  label: string;
  logo_url: string;
};
