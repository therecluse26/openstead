<?php

namespace App\Http\Controllers\Inventory;

use App\Http\Controllers\Controller;
use App\Http\Requests\Inventory\StoreEquipmentRequest;
use App\Http\Requests\Inventory\UpdateEquipmentRequest;
use App\Models\Equipment;
use App\Models\Livestock;
use App\Services\Inventory\InventoryService;
use App\Services\Inventory\LivestockService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use JsonException;

class LivestockController extends Controller
{
	public function getTypes()
	{
		return LivestockService::getEquipmentTypes();
	}

	/**
	 * Display a listing of the resource.
	 *
	 * @return Response
	 * @throws JsonException
	 */
	public function index(Request $request, InventoryService $inventoryService)
	{
		return response($inventoryService::buildInventoryTableData(Livestock::class, $request));
	}

	/**
	 * Show the form for creating a new resource.
	 *
	 * @return Response
	 */
	public function create()
	{
		//
	}

	/**
	 * Store a newly created resource in storage.
	 *
	 * @param StoreEquipmentRequest $request
	 * @return Response
	 */
	public function store(StoreEquipmentRequest $request)
	{
		//
	}

	/**
	 * Display the specified resource.
	 *
	 * @param Equipment $equipment
	 * @return Response
	 */
	public function show(Equipment $equipment)
	{
		return response($equipment);
	}

	/**
	 * Show the form for editing the specified resource.
	 *
	 * @param Equipment $equipment
	 * @return Response
	 */
	public function edit(Equipment $equipment)
	{
		//
	}

	/**
	 * Update the specified resource in storage.
	 *
	 * @param UpdateEquipmentRequest $request
	 * @param Equipment $equipment
	 * @return Response
	 */
	public function update(UpdateEquipmentRequest $request, Equipment $equipment)
	{
		//
	}

	/**
	 * Remove the specified resource from storage.
	 *
	 * @param Equipment $equipment
	 * @return Response
	 */
	public function destroy(Equipment $equipment)
	{
		$equipment->delete();
	}
}
