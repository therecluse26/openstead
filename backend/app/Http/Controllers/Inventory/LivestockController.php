<?php

namespace App\Http\Controllers\Inventory;

use App\Http\Controllers\Controller;
use App\Http\Requests\Inventory\StoreLivestockRequest;
use App\Http\Requests\Inventory\UpdateLivestockRequest;
use App\Models\Inventory\Livestock;
use App\Repositories\Inventory\LivestockRepository;
use App\Services\Inventory\InventoryService;
use App\Services\Inventory\LivestockService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use JsonException;

class LivestockController extends Controller
{
	public function getTypes()
	{
		return LivestockService::getFormattedTypes();
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
	 * @param StoreLivestockRequest $request
	 * @return Response
	 */
	public function store(StoreLivestockRequest $request, LivestockRepository $livestockRepository)
	{
		return response($livestockRepository->create($request), 200);
	}

	/**
	 * Display the specified resource.
	 *
	 * @param Livestock $livestock
	 * @return Response
	 */
	public function show(Livestock $livestock)
	{
		return response($livestock);
	}

	/**
	 * Show the form for editing the specified resource.
	 *
	 * @param Livestock $livestock
	 * @return Response
	 */
	public function edit(Livestock $livestock)
	{
		//
	}

	/**
	 * Update the specified resource in storage.
	 *
	 * @param UpdateLivestockRequest $request
	 * @param Livestock $livestock
	 * @return Response
	 */
	public function update(UpdateLivestockRequest $request, Livestock $livestock)
	{
		//
	}

	/**
	 * Remove the specified resource from storage.
	 *
	 * @param Livestock $livestock
	 * @return Response
	 */
	public function destroy(Livestock $livestock)
	{
		$livestock->delete();
	}
}
