<?php

namespace App\Repositories\Inventory;

use App\Models\ServiceLog;
use Illuminate\Http\Request;

class ServiceLogRepository extends InventoryRepository
{
	private ServiceLog $model;

	private array $fields = [
		'type',
		'notes',
		'service_date'
	];

	public function __construct()
	{
		$this->model = new ServiceLog();
		parent::__construct($this->model);
	}


	public function create(Request $request): ServiceLog
	{
		return $this->model->create(
			$request->only($this->fields)
		);
	}

	public function update(ServiceLog $serviceLog, Request $request): ServiceLog
	{
		$serviceLog->update(
			$request->only($this->fields)
		);

		return $serviceLog;
	}

}