CREATE TABLE
	`erc20_transactions` (
		`tx_hash` varchar(66),
		`contract_address` varchar(42),
		`contract_decimals` int,
		`contract_name` varchar(255),
		`contract_symbol` varchar(255),
		`from_address` varchar(42),
		`to_address` varchar(42),
		`value` varchar(255),
		`value_quote` decimal(20, 10),
		`transfer_type` varchar(255),
		`chain_id` int,
		`created_at` timestamp NOT NULL DEFAULT (now ()),
		`updated_at` timestamp NOT NULL DEFAULT (now ())
	);

--> statement-breakpoint
ALTER TABLE `erc20_transactions` ADD PRIMARY KEY (`tx_hash`, `from_address`, `to_address`);

CREATE INDEX `contract_addr_idx` ON `erc20_transactions` (`contract_address`);

CREATE INDEX `from_addr_idx` ON `erc20_transactions` (`from_address`);

CREATE INDEX `to_addr_idx` ON `erc20_transactions` (`to_address`);