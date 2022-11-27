<?php

namespace App\Http\Controllers\Inventory;

use App\Http\Controllers\Controller;
use App\Http\Requests\Inventory\StoreInventoryRequest;
use App\Repositories\Inventory\InventoryRepository;
use App\Services\Inventory\InventoryService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use JsonException;

final class InventoryController extends Controller
{
	public function getTypes()
	{
		return InventoryService::getTypes();
	}

	public function getFilters()
	{
		return InventoryService::getFilters();
	}

	/**
	 * Display a listing of the resource.
	 *
	 * @return Response
	 * @throws JsonException
	 */
	public function index(Request $request, InventoryService $inventoryService)
	{
		return response($inventoryService::buildBaseInventoryTableData($request));
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