ALTER TABLE `support_chains` ADD `created_at` timestamp DEFAULT (now()) NOT NULL;
ALTER TABLE `transactions` ADD `created_at` timestamp DEFAULT (now()) NOT NULL;
ALTER TABLE `transactions` ADD `updated_at` timestamp DEFAULT (now()) NOT NULL;
ALTER TABLE `wallets_info` ADD `created_at` timestamp DEFAULT (now()) NOT NULL;