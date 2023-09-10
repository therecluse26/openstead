<?php

namespace Database\Seeders;

use App\Models\Inventory\Equipment;
use App\Models\Inventory\Livestock;
use App\Models\Inventory\LivestockParent;
use App\Models\Inventory\PantryItem;
use App\Models\Inventory\Seed;
use App\Models\Location;
use App\Models\Note;
use App\Models\Projects\Project;
use App\Models\Projects\ProjectItem;
use App\Models\Service;
use App\Models\Tenant;
use App\Models\User;
use App\Models\Variety;
use App\Services\Tenancy\TenantService;
use Exception;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Artisan;

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
		Artisan::call('media-library:clear --force');

		$tenantService = new TenantService();

		$users = User::factory()
			->count(10)
			->create();

		$userIds = $users->map(function($user){
			return $user->id;
		})->toArray();
		
		// dd($userIds);

		$tenantService->addUsersToTenant(Tenant::first(), $userIds);

		Location::factory()
			->count(1)
			->create();

		Variety::factory()->count(200)->create();

		Service::factory()->count(200)->create();

		for ($i = 0; $i < 50; $i++) {

			$user = User::factory()
				->count(1)
				->create();

			$tenantService->addUsersToTenant(Tenant::first(), [$user->first()->id]);

			Seed::factory()
				->hasNotes(random_int(0, 3))
				->count(4)
				->create();

			PantryItem::factory()
				->hasNotes(random_int(0, 3))
				->count(4)
				->create();

			Equipment::factory()
				->hasServiceLogs(random_int(0, 4))
				->hasNotes(random_int(0, 3))
				->count(2)
				->create();

			Livestock::factory()
				->hasNotes(random_int(0, 3))
				->count(4)
				->create();
		}

		LivestockParent::factory()
			->count(100)
			->create();

		Project::factory()
			->times(10)
			->make()
			->each(function($project) {
				(new Project)->create($project->toArray());
			});

		ProjectItem::factory()
			->times(80)
			->make()
			->each(function($item) {
				$item->project_id = Project::inRandomOrder()->first()?->id ?? 1;
				(new ProjectItem)->create($item->toArray());
				
				$item->notes()->saveMany(Note::factory()->count(random_int(0, 3))->make());
		});
		
	}
}
