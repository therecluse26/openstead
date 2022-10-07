<?php

namespace App\Http\Controllers\Inventory;

use App\Http\Controllers\Controller;
use App\Http\Requests\Inventory\StoreInventoryRequest;
use App\Repositories\Inventory\InventoryRepository;
use App\Services\Inventory\InventoryService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use JsonException;

class InventoryController extends Controller
{
	public function getTypes()
	{
		return InventoryService::getTypes();
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

//	/**
//	 * Display the specified resource.
//	 *
//	 * @param InventoryRepository $inventory
//	 * @return Response
//	 */
//	public function show( InventoryRepository $repository)
//	{
//		return response($repository->getById());
//	}
//
//	/**
//	 * Show the form for editing the specified resource.
//	 *
//	 * @param Inventory $inventory
//	 * @return Response
//	 */
//	public function edit(Inventory $inventory)
//	{
//		//
//	}
//
//	/**
//	 * Update the specified resource in storage.
//	 *
//	 * @param UpdateInventoryRequest $request
//	 * @param Inventory $inventory
//	 * @return Response
//	 */
//	public function update(UpdateInventoryRequest $request, Inventory $inventory)
//	{
//		//
//	}
//
//	/**
//	 * Remove the specified resource from storage.
//	 *
//	 * @param Inventory $inventory
//	 * @return Response
//	 */
//	public function destroy(Inventory $inventory)
//	{
//		$inventory->delete();
//	}
}
