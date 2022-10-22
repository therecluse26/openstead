<?php

namespace Database\Seeders;

use App\Models\Inventory\Equipment;
use App\Models\Inventory\Livestock;
use App\Models\Inventory\LivestockParent;
use App\Models\Inventory\Seed;
use App\Models\Location;
use App\Models\Service;
use App\Models\User;
use App\Models\Variety;
use Exception;
use Illuminate\Database\Seeder;

class TestDataSeeder extends Seeder
{
	/**
	 * Run the database seeds.
	 *
	 * @return void
	 * @throws Exception
	 */
	public function run()
	{
		Location::factory()
			->count(1)
			->create();

		Variety::factory()->count(100)->create();
		Service::factory()->count(200)->create();

		for ($i = 0; $i < 50; $i++) {

			User::factory()
				->count(1)
				->create();


			Seed::factory()
				->hasImages(random_int(1, 5))
				->count(4)
				->create();

			Equipment::factory()
				->hasImages(random_int(0, 4))
				->hasServiceLogs(random_int(0, 3))
				->count(2)
				->create();

			Livestock::factory()
				->hasImages(random_int(1, 5))
				->count(4)
				->create();
		}

		LivestockParent::factory()
			->count(100)
			->create();
	}
}
