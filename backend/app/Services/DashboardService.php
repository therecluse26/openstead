<?php

namespace App\Services;

use App\Repositories\Inventory\EquipmentRepository;
use App\Repositories\Inventory\LivestockRepository;
use App\Repositories\Inventory\SeedRepository;

class DashboardService
{
	public function getDashboardReportData(): array
	{
		$equipment = new EquipmentRepository();
		$livestock = new LivestockRepository();
		$seeds = new SeedRepository();

		return [
			'inventory' => [
				'equipment' => [
					'total' => $equipment->count(),
					'conditions' => $equipment->countAllEquipmentConditions(),
					'types' => $equipment->countAllEquipmentTypes()
				],
				'livestock' => [
					'total' => $livestock->count(),
					'types' => $livestock->countAllLivestockTypes()
				],
				'seeds' => [
					'total' => $seeds->count(),
					'types' => $seeds->countAllSeedTypes()
				]
			]
		];
	}
}