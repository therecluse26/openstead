<?php

namespace Database\Seeders;

use App\Models\Equipment;
use App\Models\Livestock;
use App\Models\Location;
use App\Models\User;
use Illuminate\Database\Seeder;

class TestDataSeeder extends Seeder
{
	/**
	 * Run the database seeds.
	 *
	 * @return void
	 */
	public function run()
	{
		User::factory()
			->count(50)
			->create();

		Location::factory()
			->count(3)
			->create();

		Equipment::factory()
			->hasInventory(random_int(1, 2))
			->hasImages(random_int(1, 3))
			->count(100)
			->create();

		Livestock::factory()
			->hasInventory(random_int(1, 2))
			->hasImages(random_int(1, 3))
			->count(200)
			->create();
	}
}