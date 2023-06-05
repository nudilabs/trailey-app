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
  achievements: Achievement[];
  block_explorer_url: string;
  scores: any;
  symbol: string;
};

type Protocol = {
  addresses: string[];
  label: string;
  logo_url: string;
  protocol_url: string;
};

export type Achievement = {
  name: string;
  description: string;
  image_url: string;
  conditions: Condition[];
};

export type Condition = {
  type: string;
  value: number;
};
