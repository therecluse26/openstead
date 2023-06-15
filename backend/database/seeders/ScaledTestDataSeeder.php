<?php

namespace Database\Seeders;

use App\Models\Inventory\Equipment;
use App\Models\Inventory\Livestock;
use App\Models\Inventory\Seed;
use App\Models\Location;
use App\Models\Service;
use App\Models\User;
use App\Models\Variety;
use Exception;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Artisan;

class ScaledTestDataSeeder extends Seeder
{
	/**
	 * Run the database seeds.
	 *
	 * @return void
	 * @throws Exception
	 */
	public function run()
	{
		Artisan::call('media-library:clear --force');

		Location::factory()
			->count(1)
			->create();

		Variety::factory()->count(2000)->create();

		Service::factory()->count(1000)->create();

		for ($i = 0; $i < 100; $i++) {
			User::factory()
				->count(1)
				->create();

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
