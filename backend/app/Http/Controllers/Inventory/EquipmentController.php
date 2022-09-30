<?php

namespace App\Http\Controllers\Inventory;

use App\Http\Controllers\Controller;
use App\Http\Requests\Inventory\StoreEquipmentRequest;
use App\Http\Requests\Inventory\UpdateEquipmentRequest;
use App\Models\Equipment;
use App\Services\Inventory\EquipmentService;
use App\Services\Inventory\InventoryService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use JsonException;

class EquipmentController extends Controller
{
	public function getTypes()
	{
		return EquipmentService::getEquipmentTypes();
	}

	/**
	 * Display a listing of the resource.
	 *
	 * @return Response
	 * @throws JsonException
	 */
	public function index(Request $request, InventoryService $inventoryService)
	{
		return response($inventoryService::buildInventoryTableData(Equipment::class, $request));
	}

	/**
	 * Store a newly created resource in storage.
	 *
	 * @param StoreEquipmentRequest $request
	 * @return Response
	 */
	public function store(StoreEquipmentRequest $request)
	{
		return Equipment::create($request->only([
			'name',
			'type',
			'condition',
			'description'
		]));
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
