<?php

use App\Http\Controllers\Inventory\EquipmentController;
use App\Http\Controllers\Inventory\InventoryController;
use App\Http\Controllers\Inventory\LivestockController;
use App\Http\Controllers\Inventory\SeedController;
use App\Http\Controllers\Inventory\ServiceLogController;
use App\Http\Controllers\ServiceController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
	return $request->user();
});

Route::middleware(['auth:sanctum'])->group(function () {

	Route::prefix('/inventory')
		->group(function () {
			Route::get('/filters', [InventoryController::class, 'getFilters']);

			Route::get('/base/types', [InventoryController::class, 'getTypes']);

			Route::get('/equipment/types', [EquipmentController::class, 'getTypes']);
			Route::get('/equipment/{equipment}/similar', [EquipmentController::class, 'getSimilar']);
			Route::apiResource('/equipment', EquipmentController::class);

			Route::get('/livestock/types', [LivestockController::class, 'getTypes']);
			Route::get('/livestock/{livestock}/similar', [LivestockController::class, 'getSimilar']);
			Route::apiResource('/livestock', LivestockController::class);

			Route::get('/seeds/types', [SeedController::class, 'getTypes']);
			Route::apiResource('/seeds', SeedController::class);

		});

	Route::prefix('/services')
		->group(function () {
			Route::get('/', [ServiceLogController::class, 'getServices']);
			Route::post('/', [ServiceController::class, 'store']);
			Route::prefix('/types')
				->group(function () {
					Route::get('/', [ServiceLogController::class, 'getTypes']);
					Route::get('/{type}/services', [ServiceLogController::class, 'getTypeService']);
				});
			Route::prefix('/logs')
				->group(function () {
					Route::get('/{modelName}/{modelId}', [ServiceLogController::class, 'index']);
					Route::post('/', [ServiceLogController::class, 'store']);
				});

		});

});



