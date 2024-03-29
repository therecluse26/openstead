<?php

namespace App\Http\Controllers\Inventory;

use App\Http\Controllers\Controller;
use App\Http\Requests\Inventory\StoreInventoryRequest;
use App\Repositories\Inventory\InventoryRepository;
use App\Services\Inventory\InventoryService;
use Illuminate\Http\Response;

final class InventoryController extends Controller
{
	public function getTypes()
	{
		return InventoryService::getTypes();
	}

	public function getFilters(InventoryService $service)
	{
		return $service->getFilters();
	}

	/**
	 * Store a newly created resource in storage.
	 *
	 * @param StoreInventoryRequest $request
	 * @return Response
	 */
	public function store(StoreInventoryRequest $request, InventoryRepository $repository)
	{
		return response($repository->create($request), 200);
	}
}