<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreServiceRequest;
use App\Http\Requests\UpdateServiceRequest;
use App\Models\Service;
use App\Repositories\ServiceRepository;
use Illuminate\Http\Response;

final class ServiceController extends Controller
{

	/**
	 * Store a newly created resource in storage.
	 *
	 * @param StoreServiceRequest $request
	 * @param ServiceRepository $serviceLogRepository
	 * @return Response
	 */
	public function store(StoreServiceRequest $request, ServiceRepository $serviceLogRepository): Response
	{
		return response($serviceLogRepository->create($request), 200);
	}

	/**
	 * Display the specified resource.
	 *
	 * @param Service $service
	 * @return Response
	 */
	public function show(Service $service): Response
	{
		return response($service);
	}


	/**
	 * Update the specified resource in storage.
	 *
	 * @param UpdateServiceRequest $request
	 * @param Service $service
	 * @param ServiceRepository $serviceRepository
	 * @return Response
	 */
	public function update(UpdateServiceRequest $request, Service $service, ServiceRepository $serviceRepository): Response
	{
		return response($serviceRepository->update($service, $request), 200);
	}

	/**
	 * Remove the specified resource from storage.
	 *
	 * @param Service $service
	 * @return Response
	 */
	public function destroy(Service $service): Response
	{
		return response($service->delete());
	}
}
