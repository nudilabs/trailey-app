CREATE TABLE `transactions` (
	`id` serial AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`block_signed_at` datetime,
	`block_height` int,
	`tx_hash` varchar(66),
	`tx_offset` int,
	`success` boolean,
	`from_address` varchar(42),
	`from_address_label` varchar(255),
	`to_address` varchar(42),
	`to_address_label` varchar(255),
	`value` varchar(255),
	`value_quote` decimal(20,10),
	`fees_paid` varchar(255),
	`is_interact` boolean
);

CREATE INDEX `from_addr_at_idx` ON `transactions` (`from_address`,`block_signed_at`);