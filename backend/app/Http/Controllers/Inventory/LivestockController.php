<?php

namespace App\Http\Controllers\Inventory;

use App\Contracts\HasAppendableSelect;
use App\Http\Controllers\Controller;
use App\Http\Requests\Inventory\StoreLivestockRequest;
use App\Http\Requests\Inventory\UpdateLivestockRequest;
use App\Models\Inventory\Livestock;
use App\Repositories\Inventory\LivestockRepository;
use App\Resources\Inventory\List\LivestockResource;
use App\Resources\Inventory\List\PaginatedInventoryResource;
use App\Services\Inventory\InventoryService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use JsonException;

class LivestockController extends Controller implements HasAppendableSelect
{
	public function getTypes(): iterable
	{
		return LivestockRepository::getFormattedTypes();
	}

	public function getTypeValues(string $type): iterable
	{
		return LivestockRepository::getTypeVarieties($type);
	}

	/**
	 * Display a listing of the resource.
	 *
	 * @return Response
	 * @throws JsonException
	 */
	public function index(Request $request, InventoryService $inventoryService)
	{
		return response(
			PaginatedInventoryResource::make(
				$inventoryService::buildInventoryTableData(Livestock::class, $request),
				LivestockResource::class
			)
		);
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
	public function show(Livestock $livestock): Response
	{
		return response($livestock->getDetailResource());
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

	public function getSimilar(Livestock $livestock)
	{
		return response(LivestockResource::collection(
			LivestockRepository::getSimilar($livestock)
		));
	}
}
