<?php

use App\Http\Controllers\Inventory\EquipmentController;
use App\Http\Controllers\Inventory\LivestockController;
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

Route::middleware(['auth:sanctum'])
	->prefix('/inventory')
	->group(function () {
		Route::resource('/equipment', EquipmentController::class);
		Route::get('/equipment-types', [EquipmentController::class, 'getTypes']);

		Route::resource('/livestock', LivestockController::class);
		Route::get('/livestock-types', [LivestockController::class, 'getTypes']);
	});

