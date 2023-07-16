<?php

namespace App\Services;

use App\Repositories\Inventory\EquipmentRepository;
use App\Repositories\Inventory\LivestockRepository;
use App\Repositories\Inventory\SeedRepository;
use App\Repositories\Inventory\PantryRepository;

class DashboardService
{
	public function getDashboardReportData(): array
	{
		$equipment = new EquipmentRepository();
		$livestock = new LivestockRepository();
		$seeds = new SeedRepository();
		$pantry_items = new PantryRepository();

		return [
			'inventory' => [
				'equipment' => [
					'total' => $equipment->count(),
					'conditions' => $equipment->countAllEquipmentConditions(),
					'types' => $equipment->countAllTypes()
				],
				'livestock' => [
					'total' => $livestock->count(),
					'types' => $livestock->countAllTypes()
				],
				'seeds' => [
					'total' => $seeds->count(),
					'types' => $seeds->countAllTypes()
				], 
				'pantry_items' => [
					'total' => $pantry_items->count(),
					'types' => $pantry_items->countAllTypes()
				]
			]
		];
	}
}