<?php

namespace Database\Seeders;

use App\Models\Inventory\Equipment;
use App\Models\Inventory\Livestock;
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
			->hasImages(random_int(1, 3))
			->count(100)
			->create();

		Livestock::factory()
			->hasImages(random_int(1, 3))
			->count(200)
			->create();
	}
}
