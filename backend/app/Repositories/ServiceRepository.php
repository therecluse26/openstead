<?php

namespace App\Repositories;

use App\Models\Service;
use App\Models\ServiceLog;
use App\Repositories\Inventory\InventoryRepository;
use Illuminate\Http\Request;

class ServiceRepository extends InventoryRepository
{
	private Service $model;

	private array $fields = [
		'type',
		'title',
		'description'
	];

	public function __construct()
	{
		$this->model = new Service();
		parent::__construct($this->model);
	}


	public function create(Request $request): Service
	{
		return $this->model->create(
			$request->only($this->fields)
		);
	}

	public function update(ServiceLog $serviceLog, Request $request): Service
	{
		$serviceLog->update(
			$request->only($this->fields)
		);

		return $serviceLog;
	}

}