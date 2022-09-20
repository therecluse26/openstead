<?php

namespace App\Http\Controllers\Inventory;

use App\Http\Controllers\Controller;
use App\Http\Requests\Inventory\StoreEquipmentRequest;
use App\Http\Requests\Inventory\UpdateEquipmentRequest;
use App\Models\Equipment;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use JsonException;

class EquipmentController extends Controller
{
	/**
	 * Display a listing of the resource.
	 *
	 * @return Response
	 * @throws JsonException
	 */
	public function index(Request $request)
	{
		$params = json_decode($request->get('lazyEvent'), false, 512, JSON_THROW_ON_ERROR);
		$rows = $params->rows ?? 15;
		$page = $params->page ?? 0;
		return Equipment::paginate($rows, ['*'], 'page', $page + 1);
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
