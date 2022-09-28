<?php

namespace App\Services;

use App\Repositories\Inventory\EquipmentRepository;
use App\Repositories\Inventory\LivestockRepository;

class DashboardService
{
	public function getDashboardReportData()
	{
		$equipment = new EquipmentRepository();
		$livestock = new LivestockRepository();

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
				]
			]
		];
	}
}