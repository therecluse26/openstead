<?php
use App\Http\Controllers\Inventory\SeedController;
use App\Services\RouteBuilderService;
use Illuminate\Support\Facades\Route;

RouteBuilderService::buildTypeFilterRoute(SeedController::class);
Route::get('/filters', [SeedController::class, 'getFilters']);
Route::get('/life-cycles', [SeedController::class, 'getLifeCycles']);
Route::get('/light-requirements', [SeedController::class, 'getLightRequirements']);
Route::get('/hardiness-zones', [SeedController::class, 'getHardinessZones']);
Route::get('/{id}/similar', [SeedController::class, 'getSimilar'])->middleware('user-can:inventory:list');

Route::prefix('')->name('seeds.')->group(static function () {
    Route::get('/', [SeedController::class, 'index'])->middleware('user-can:inventory:list');
    Route::post('/', [SeedController::class, 'store'])->middleware('user-can:inventory:create');
    Route::put('/{id}', [SeedController::class, 'update'])->middleware('user-can:inventory:update');
    Route::get('/{id}', [SeedController::class, 'show'])->middleware('user-can:inventory:read');
    Route::delete('/{id}', [SeedController::class, 'destroy'])->middleware('user-can:inventory:delete');
});