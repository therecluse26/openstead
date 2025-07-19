<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
	/**
	 * Seed the application's database.
	 *
	 * @return void
	 */
	public function run()
	{
		$this->call([
			BaseDataSeeder::class,
		]);

		if (app()->environment('test', 'testing', 'local')) {
			if (config('seeding.test-data.scaled')) {
				$this->call([
					ScaledTestDataSeeder::class,
				]);
			} else if (config('seeding.test-data.normal')) {
				$this->call([
					TestDataSeeder::class,
				]);
			}
		}
	}
}
