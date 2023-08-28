<?php
use App\Services\RouteBuilderService;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Inventory\LivestockController;


RouteBuilderService::buildTypeFilterRoute(LivestockController::class);
Route::get('/filters', [LivestockController::class, 'getFilters']);
Route::get('/{id}/similar', [LivestockController::class, 'getSimilar'])->middleware('user-can:inventory:list');
Route::post('/{id}/deceased', [LivestockController::class, 'markDeceased'])->middleware('user-can:inventory:update');
Route::get('/types/{type}/members', [LivestockController::class, 'getTypeMembers'])->middleware('user-can:inventory:list');

Route::prefix('')->name('livestock.')->group(static function () {
    Route::apiResource('/', LivestockController::class);
    Route::get('/', [LivestockController::class, 'index'])->middleware('user-can:inventory:list');
    Route::post('/', [LivestockController::class, 'store'])->middleware('user-can:inventory:create');
    Route::put('/{id}', [LivestockController::class, 'update'])->middleware('user-can:inventory:update');
    Route::get('/{id}', [LivestockController::class, 'show'])->middleware('user-can:inventory:read');
    Route::delete('/{id}', [LivestockController::class, 'destroy'])->middleware('user-can:inventory:delete');
});