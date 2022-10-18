<?php

namespace Database\Seeders;

use App\Models\Inventory\Equipment;
use App\Models\Inventory\Livestock;
use App\Models\Inventory\Seed;
use App\Models\Location;
use App\Models\User;
use App\Models\Variety;
use Illuminate\Database\Seeder;

class ScaledTestDataSeeder extends Seeder
{
	/**
	 * Run the database seeds.
	 *
	 * @return void
	 */
	public function run()
	{
		for ($i = 0; $i < 100; $i++) {
			User::factory()
				->count(1)
				->create();

			Location::factory()
				->count(1)
				->create();

			Variety::factory()->count(100)->create();

			Seed::factory()
				->count(1000)
				->create();

			Equipment::factory()
				->hasImages(random_int(1, 2))
				->count(100)
				->create();

			Livestock::factory()
				->hasImages(random_int(1, 2))
				->count(20)
				->create();
		}
	}
}
